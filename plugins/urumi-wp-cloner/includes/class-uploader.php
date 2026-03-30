<?php
/**
 * Handles uploads/downloads to S3-compatible storage
 * Supports: GCS, AWS S3, DigitalOcean Spaces, Wasabi, Backblaze B2, MinIO, Cloudflare R2
 */

if (!defined('ABSPATH')) {
    exit;
}

class Urumi_Cloner_Uploader {

    private $config;

    public function __construct($config = null) {
        $this->config = $config ? $config : Urumi_Cloner_Config::get_storage_config();
    }

    /**
     * Test bucket access by creating and deleting a test file
     *
     * @return bool|WP_Error True if accessible, WP_Error on failure
     */
    public function test_bucket_access() {
        $test_content = 'urumi-cloner-test-' . time();
        $test_path = '.urumi-test-' . md5($test_content);

        // Create a temporary test file
        $temp_file = tempnam(sys_get_temp_dir(), 'urumi_test_');
        if (!$temp_file) {
            return new WP_Error('temp_file_failed', __('Failed to create temporary test file.', 'urumi-wp-cloner'));
        }

        file_put_contents($temp_file, $test_content);

        // Try to upload the test file
        $upload_result = $this->upload_simple($temp_file, $test_path);
        unlink($temp_file);

        if (is_wp_error($upload_result)) {
            return new WP_Error(
                'bucket_access_denied',
                sprintf(
                    __('Bucket access test failed: %s', 'urumi-wp-cloner'),
                    $upload_result->get_error_message()
                )
            );
        }

        // Try to delete the test file
        $delete_result = $this->delete_file($test_path);

        if (is_wp_error($delete_result)) {
            return new WP_Error(
                'bucket_delete_denied',
                sprintf(
                    __('Bucket delete test failed: %s', 'urumi-wp-cloner'),
                    $delete_result->get_error_message()
                )
            );
        }

        return true;
    }

    public function upload($local_file, $remote_path) {
        if (!file_exists($local_file)) {
            return new WP_Error('file_not_found', __('Local file not found.', 'urumi-wp-cloner'));
        }

        $file_size = filesize($local_file);
        $multipart_threshold = 5 * 1024 * 1024;

        if ($file_size < $multipart_threshold) {
            return $this->upload_simple($local_file, $remote_path);
        } else {
            return $this->upload_multipart($local_file, $remote_path);
        }
    }

    private function upload_simple($local_file, $remote_path) {
        $bucket = $this->config['bucket'];
        $endpoint = rtrim($this->config['endpoint'], '/');
        $file_size = filesize($local_file);

        $md5_ctx = hash_init('md5');
        $sha256_ctx = hash_init('sha256');
        $fp = fopen($local_file, 'rb');

        if (!$fp) {
            return new WP_Error('file_open_failed', __('Failed to open local file.', 'urumi-wp-cloner'));
        }

        while (!feof($fp)) {
            $chunk = fread($fp, 8192);
            hash_update($md5_ctx, $chunk);
            hash_update($sha256_ctx, $chunk);
        }
        fclose($fp);

        $content_md5 = base64_encode(hash_final($md5_ctx, true));
        $content_sha256 = hash_final($sha256_ctx, false);

        $url = $endpoint . '/' . $bucket . '/' . ltrim($remote_path, '/');

        $timestamp = gmdate('Ymd\THis\Z');
        $date_stamp = gmdate('Ymd');

        $headers = array(
            'Content-Type' => 'application/octet-stream',
            'Content-MD5' => $content_md5,
            'Content-Length' => $file_size,
            'x-amz-content-sha256' => $content_sha256,
            'x-amz-date' => $timestamp,
        );

        $auth_header = $this->generate_auth_header('PUT', $url, $headers, '', $date_stamp);
        $headers['Authorization'] = $auth_header;

        $ch = curl_init();
        $fp = fopen($local_file, 'rb');

        if (!$fp) {
            return new WP_Error('file_open_failed', __('Failed to open file for upload.', 'urumi-wp-cloner'));
        }

        $curl_headers = array();
        foreach ($headers as $key => $value) {
            $curl_headers[] = $key . ': ' . $value;
        }

        curl_setopt_array($ch, array(
            CURLOPT_URL => $url,
            CURLOPT_PUT => true,
            CURLOPT_INFILE => $fp,
            CURLOPT_INFILESIZE => $file_size,
            CURLOPT_HTTPHEADER => $curl_headers,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_TIMEOUT => 600,
            CURLOPT_SSL_VERIFYPEER => true,
        ));

        $response_body = curl_exec($ch);
        $http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        $curl_error = curl_error($ch);

        curl_close($ch);
        fclose($fp);

        if ($curl_error) {
            return new WP_Error('curl_error', sprintf(__('Upload failed: %s', 'urumi-wp-cloner'), $curl_error));
        }

        if ($http_code !== 200 && $http_code !== 201) {
            return new WP_Error('upload_failed', sprintf(__('Upload failed with status %d: %s', 'urumi-wp-cloner'), $http_code, $response_body));
        }

        return true;
    }

    private function upload_multipart($local_file, $remote_path) {
        $bucket = $this->config['bucket'];
        $endpoint = rtrim($this->config['endpoint'], '/');
        $file_size = filesize($local_file);
        $part_size = 5 * 1024 * 1024;

        $upload_id = $this->initiate_multipart_upload($bucket, $remote_path);
        if (is_wp_error($upload_id)) {
            return $upload_id;
        }

        $file_handle = fopen($local_file, 'rb');
        if (!$file_handle) {
            $this->abort_multipart_upload($bucket, $remote_path, $upload_id);
            return new WP_Error('file_open_failed', __('Failed to open local file for reading.', 'urumi-wp-cloner'));
        }

        $part_number = 1;
        $uploaded_parts = array();
        $bytes_uploaded = 0;

        while (!feof($file_handle)) {
            $part_data = fread($file_handle, $part_size);
            $part_data_size = strlen($part_data);

            if ($part_data_size === 0) {
                break;
            }

            $etag = $this->upload_part($bucket, $remote_path, $upload_id, $part_number, $part_data);

            if (is_wp_error($etag)) {
                fclose($file_handle);
                $this->abort_multipart_upload($bucket, $remote_path, $upload_id);
                return new WP_Error(
                    'part_upload_failed',
                    sprintf(__('Failed to upload part %d: %s', 'urumi-wp-cloner'), $part_number, $etag->get_error_message())
                );
            }

            $uploaded_parts[] = array(
                'PartNumber' => $part_number,
                'ETag' => $etag,
            );

            $bytes_uploaded += $part_data_size;
            $part_number++;
        }

        fclose($file_handle);

        $result = $this->complete_multipart_upload($bucket, $remote_path, $upload_id, $uploaded_parts);

        if (is_wp_error($result)) {
            $this->abort_multipart_upload($bucket, $remote_path, $upload_id);
            return $result;
        }

        return true;
    }

    private function initiate_multipart_upload($bucket, $object_key) {
        $endpoint = rtrim($this->config['endpoint'], '/');
        $url = $endpoint . '/' . $bucket . '/' . ltrim($object_key, '/') . '?uploads';

        $timestamp = gmdate('Ymd\THis\Z');
        $date_stamp = gmdate('Ymd');

        $headers = array(
            'Content-Type' => 'application/octet-stream',
            'x-amz-content-sha256' => hash('sha256', ''),
            'x-amz-date' => $timestamp,
        );

        $auth_header = $this->generate_auth_header('POST', $url, $headers, '', $date_stamp);
        $headers['Authorization'] = $auth_header;

        $response = wp_remote_post($url, array(
            'headers' => $headers,
            'timeout' => 60,
        ));

        if (is_wp_error($response)) {
            return $response;
        }

        $status_code = wp_remote_retrieve_response_code($response);
        $body = wp_remote_retrieve_body($response);

        if ($status_code !== 200) {
            return new WP_Error('init_failed', sprintf(__('Failed to initiate multipart upload (status %d): %s', 'urumi-wp-cloner'), $status_code, $body));
        }

        $body = wp_remote_retrieve_body($response);
        if (preg_match('/<UploadId>([^<]+)<\/UploadId>/', $body, $matches)) {
            return $matches[1];
        }

        return new WP_Error('parse_failed', __('Failed to parse upload ID from response.', 'urumi-wp-cloner'));
    }

    private function upload_part($bucket, $object_key, $upload_id, $part_number, $part_data) {
        $endpoint = rtrim($this->config['endpoint'], '/');
        $url = $endpoint . '/' . $bucket . '/' . ltrim($object_key, '/') . '?partNumber=' . $part_number . '&uploadId=' . urlencode($upload_id);

        $timestamp = gmdate('Ymd\THis\Z');
        $date_stamp = gmdate('Ymd');

        $headers = array(
            'Content-Type' => 'application/octet-stream',
            'Content-Length' => strlen($part_data),
            'x-amz-content-sha256' => hash('sha256', $part_data),
            'x-amz-date' => $timestamp,
        );

        $auth_header = $this->generate_auth_header('PUT', $url, $headers, $part_data, $date_stamp);
        $headers['Authorization'] = $auth_header;

        $response = wp_remote_request($url, array(
            'method' => 'PUT',
            'headers' => $headers,
            'body' => $part_data,
            'timeout' => 300,
        ));

        if (is_wp_error($response)) {
            return $response;
        }

        $status_code = wp_remote_retrieve_response_code($response);
        if ($status_code !== 200) {
            $body = wp_remote_retrieve_body($response);
            return new WP_Error('part_upload_failed', sprintf(__('Part upload failed: %s', 'urumi-wp-cloner'), $body));
        }

        $etag = wp_remote_retrieve_header($response, 'etag');
        if (empty($etag)) {
            return new WP_Error('no_etag', __('No ETag returned from part upload.', 'urumi-wp-cloner'));
        }

        return trim($etag, '"');
    }

    private function complete_multipart_upload($bucket, $object_key, $upload_id, $uploaded_parts) {
        $endpoint = rtrim($this->config['endpoint'], '/');
        $url = $endpoint . '/' . $bucket . '/' . ltrim($object_key, '/') . '?uploadId=' . urlencode($upload_id);

        $xml = '<CompleteMultipartUpload>';
        foreach ($uploaded_parts as $part) {
            $xml .= sprintf(
                '<Part><PartNumber>%d</PartNumber><ETag>"%s"</ETag></Part>',
                $part['PartNumber'],
                $part['ETag']
            );
        }
        $xml .= '</CompleteMultipartUpload>';

        $timestamp = gmdate('Ymd\THis\Z');
        $date_stamp = gmdate('Ymd');

        $headers = array(
            'Content-Type' => 'application/xml',
            'Content-Length' => strlen($xml),
            'x-amz-content-sha256' => hash('sha256', $xml),
            'x-amz-date' => $timestamp,
        );

        $auth_header = $this->generate_auth_header('POST', $url, $headers, $xml, $date_stamp);
        $headers['Authorization'] = $auth_header;

        $response = wp_remote_post($url, array(
            'headers' => $headers,
            'body' => $xml,
            'timeout' => 300,
        ));

        if (is_wp_error($response)) {
            return $response;
        }

        $status_code = wp_remote_retrieve_response_code($response);
        if ($status_code !== 200) {
            $body = wp_remote_retrieve_body($response);
            return new WP_Error('complete_failed', sprintf(__('Failed to complete multipart upload: %s', 'urumi-wp-cloner'), $body));
        }

        return true;
    }

    private function abort_multipart_upload($bucket, $object_key, $upload_id) {
        $endpoint = rtrim($this->config['endpoint'], '/');
        $url = $endpoint . '/' . $bucket . '/' . ltrim($object_key, '/') . '?uploadId=' . urlencode($upload_id);

        $timestamp = gmdate('Ymd\THis\Z');
        $date_stamp = gmdate('Ymd');

        $headers = array(
            'x-amz-content-sha256' => hash('sha256', ''),
            'x-amz-date' => $timestamp,
        );

        $auth_header = $this->generate_auth_header('DELETE', $url, $headers, '', $date_stamp);
        $headers['Authorization'] = $auth_header;

        wp_remote_request($url, array(
            'method' => 'DELETE',
            'headers' => $headers,
            'timeout' => 60,
        ));
    }

    public function download($remote_path, $local_file) {
        $bucket = $this->config['bucket'];
        $endpoint = rtrim($this->config['endpoint'], '/');

        $url = $endpoint . '/' . $bucket . '/' . ltrim($remote_path, '/');

        $timestamp = gmdate('Ymd\THis\Z');
        $date_stamp = gmdate('Ymd');

        $headers = array(
            'x-amz-content-sha256' => hash('sha256', ''),
            'x-amz-date' => $timestamp,
        );

        $auth_header = $this->generate_auth_header('GET', $url, $headers, '', $date_stamp);
        $headers['Authorization'] = $auth_header;

        $response = wp_remote_get($url, array(
            'headers' => $headers,
            'timeout' => 300,
            'stream' => true,
            'filename' => $local_file,
        ));

        if (is_wp_error($response)) {
            return $response;
        }

        $status_code = wp_remote_retrieve_response_code($response);
        if ($status_code !== 200) {
            @unlink($local_file);
            return new WP_Error('download_failed', sprintf(__('Download failed with status %d', 'urumi-wp-cloner'), $status_code));
        }

        if (!file_exists($local_file)) {
            return new WP_Error('file_not_created', __('Downloaded file was not created.', 'urumi-wp-cloner'));
        }

        return true;
    }

    private function generate_auth_header($method, $url, $headers, $payload, $date_stamp) {
        $access_key = $this->config['credentials']['access_key'];
        $secret_key = $this->config['credentials']['secret_key'];
        $region = $this->config['region'];

        $parsed = parse_url($url);
        $host = $parsed['host'];
        $path = isset($parsed['path']) ? $parsed['path'] : '/';

        $query = '';
        if (isset($parsed['query'])) {
            $query_parts = explode('&', $parsed['query']);
            $query_params = array();

            foreach ($query_parts as $part) {
                if (strpos($part, '=') !== false) {
                    list($key, $value) = explode('=', $part, 2);
                    $query_params[urldecode($key)] = urldecode($value);
                } else {
                    $query_params[urldecode($part)] = '';
                }
            }

            ksort($query_params);

            // AWS Signature v4: params without values must include '=' (e.g., "uploads=")
            $canonical_query_parts = array();
            foreach ($query_params as $key => $value) {
                if ($value === '') {
                    $canonical_query_parts[] = rawurlencode($key) . '=';
                } else {
                    $canonical_query_parts[] = rawurlencode($key) . '=' . rawurlencode($value);
                }
            }
            $query = implode('&', $canonical_query_parts);
        }

        $service = 's3';

        $canonical_headers_arr = array();
        $signed_headers_arr = array();

        foreach ($headers as $key => $value) {
            $lowercase_key = strtolower($key);
            $canonical_headers_arr[$lowercase_key] = trim($value);
            $signed_headers_arr[] = $lowercase_key;
        }

        $canonical_headers_arr['host'] = $host;
        $signed_headers_arr[] = 'host';

        ksort($canonical_headers_arr);
        sort($signed_headers_arr);

        $canonical_headers = '';
        foreach ($canonical_headers_arr as $key => $value) {
            $canonical_headers .= $key . ':' . $value . "\n";
        }

        $signed_headers = implode(';', $signed_headers_arr);

        // Use pre-calculated hash from header if available (for streaming uploads)
        $payload_hash = isset($headers['x-amz-content-sha256'])
            ? $headers['x-amz-content-sha256']
            : hash('sha256', $payload);
        $canonical_request = implode("\n", array(
            $method,
            $path,
            $query,
            $canonical_headers,
            $signed_headers,
            $payload_hash,
        ));

        $algorithm = 'AWS4-HMAC-SHA256';
        $credential_scope = $date_stamp . '/' . $region . '/' . $service . '/aws4_request';
        $string_to_sign = implode("\n", array(
            $algorithm,
            $headers['x-amz-date'],
            $credential_scope,
            hash('sha256', $canonical_request),
        ));

        $k_date = hash_hmac('sha256', $date_stamp, 'AWS4' . $secret_key, true);
        $k_region = hash_hmac('sha256', $region, $k_date, true);
        $k_service = hash_hmac('sha256', $service, $k_region, true);
        $k_signing = hash_hmac('sha256', 'aws4_request', $k_service, true);

        $signature = hash_hmac('sha256', $string_to_sign, $k_signing);

        $authorization = sprintf(
            '%s Credential=%s/%s, SignedHeaders=%s, Signature=%s',
            $algorithm,
            $access_key,
            $credential_scope,
            $signed_headers,
            $signature
        );

        return $authorization;
    }

    /**
     * Delete a file from bucket
     *
     * @param string $remote_path Path to file in bucket
     * @return bool|WP_Error True on success, WP_Error on failure
     */
    public function delete_file($remote_path) {
        $bucket = $this->config['bucket'];
        $endpoint = rtrim($this->config['endpoint'], '/');
        $region = $this->config['region'];
        $access_key = $this->config['credentials']['access_key'];
        $secret_key = $this->config['credentials']['secret_key'];

        $url = $endpoint . '/' . $bucket . '/' . ltrim($remote_path, '/');
        $method = 'DELETE';
        $headers = array(
            'Host' => parse_url($endpoint, PHP_URL_HOST),
            'x-amz-date' => gmdate('Ymd\THis\Z'),
            'x-amz-content-sha256' => hash('sha256', ''),
        );

        $date_stamp = gmdate('Ymd');
        $authorization = $this->generate_auth_header($method, $url, $headers, '', $date_stamp);
        $headers['Authorization'] = $authorization;

        $formatted_headers = array();
        foreach ($headers as $key => $value) {
            $formatted_headers[] = $key . ': ' . $value;
        }

        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'DELETE');
        curl_setopt($ch, CURLOPT_HTTPHEADER, $formatted_headers);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_HEADER, true);
        curl_setopt($ch, CURLOPT_TIMEOUT, 30);

        $response = curl_exec($ch);
        $status_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        if ($status_code >= 200 && $status_code < 300) {
            return true;
        }

        return new WP_Error(
            'delete_failed',
            sprintf(__('Delete failed with status %d: %s', 'urumi-wp-cloner'), $status_code, $response)
        );
    }

}
