<?php

if (!defined('ABSPATH')) {
    exit;
}

class Urumi_Cloner_Migration_Key {

    public static function generate($data) {
        if ($data['provider'] !== 's3_compatible') {
            return false;
        }

        if (!isset($data['credentials']['access_key']) || !isset($data['credentials']['secret_key'])) {
            return false;
        }

        if (empty($data['endpoint'])) {
            return false;
        }

        $payload = array(
            'version' => '1.0',
            'timestamp' => time(),
            'source_url' => home_url(),
            'provider' => $data['provider'],
            'bucket' => $data['bucket'],
            'region' => $data['region'],
            'endpoint' => $data['endpoint'],
            'credentials' => $data['credentials'],
            'files' => $data['files'],
            'manifest' => $data['manifest'],
        );

        $json = wp_json_encode($payload);

        if ($json === false) {
            return false;
        }

        $encoded = rtrim(strtr(base64_encode($json), '+/', '-_'), '=');

        return 'urumi_' . $encoded;
    }

    public static function parse($key) {
        if (strpos($key, 'urumi_') !== 0) {
            return new WP_Error('invalid_key', __('Invalid migration key format.', 'urumi-wp-cloner'));
        }

        $encoded = substr($key, 6);

        $encoded = strtr($encoded, '-_', '+/');
        $padding = strlen($encoded) % 4;
        if ($padding) {
            $encoded .= str_repeat('=', 4 - $padding);
        }

        $json = base64_decode($encoded);

        if ($json === false) {
            return new WP_Error('decode_failed', __('Failed to decode migration key.', 'urumi-wp-cloner'));
        }

        $data = json_decode($json, true);

        if ($data === null) {
            return new WP_Error('invalid_json', __('Invalid migration key data.', 'urumi-wp-cloner'));
        }

        $required = array('version', 'provider', 'bucket', 'credentials', 'files', 'manifest');
        foreach ($required as $field) {
            if (!isset($data[$field])) {
                return new WP_Error(
                    'missing_field',
                    sprintf(__('Migration key missing required field: %s', 'urumi-wp-cloner'), $field)
                );
            }
        }

        if ($data['provider'] !== 's3_compatible') {
            return new WP_Error(
                'unsupported_provider',
                sprintf(
                    __('Unsupported storage provider: %s. Only s3_compatible is supported.', 'urumi-wp-cloner'),
                    $data['provider']
                )
            );
        }

        if (!isset($data['credentials']['access_key']) || !isset($data['credentials']['secret_key'])) {
            return new WP_Error(
                'invalid_credentials',
                __('Invalid credentials format. S3-compatible credentials require access_key and secret_key.', 'urumi-wp-cloner')
            );
        }

        if (!isset($data['endpoint']) || empty($data['endpoint'])) {
            return new WP_Error(
                'missing_endpoint',
                __('Migration key missing endpoint URL for S3-compatible storage.', 'urumi-wp-cloner')
            );
        }

        if (isset($data['timestamp'])) {
            $age_days = (time() - $data['timestamp']) / (60 * 60 * 24);
            if ($age_days > 30) {
                return new WP_Error(
                    'key_expired',
                    sprintf(
                        __('Migration key expired (created %d days ago). Keys are valid for 30 days.', 'urumi-wp-cloner'),
                        floor($age_days)
                    )
                );
            }
        }

        return $data;
    }

    public static function get_storage_config($key_data) {
        $config = array(
            'provider' => $key_data['provider'],
            'bucket' => $key_data['bucket'],
            'region' => $key_data['region'] ?? 'us-central1',
            'credentials' => $key_data['credentials'],
        );

        if (isset($key_data['endpoint'])) {
            $config['endpoint'] = $key_data['endpoint'];
        }

        return $config;
    }

    public static function get_files($key_data) {
        return $key_data['files'] ?? array();
    }

    public static function get_manifest($key_data) {
        return $key_data['manifest'] ?? array();
    }

    public static function format_for_display($key) {
        return chunk_split($key, 64, "\n");
    }

    public static function sanitize($key) {
        $key = preg_replace('/\s+/', '', $key);
        $key = trim($key);
        return $key;
    }

    public static function is_valid_format($key) {
        if (strpos($key, 'urumi_') !== 0) {
            return false;
        }

        $encoded = substr($key, 6);
        $decoded = base64_decode(strtr($encoded, '-_', '+/'), true);

        if ($decoded === false) {
            return false;
        }

        $data = json_decode($decoded, true);

        return $data !== null;
    }

    public static function get_info($key) {
        $data = self::parse($key);

        if (is_wp_error($data)) {
            return $data;
        }

        return array(
            'version' => $data['version'],
            'source_url' => $data['source_url'] ?? '',
            'timestamp' => $data['timestamp'] ?? 0,
            'created' => isset($data['timestamp']) ? date('Y-m-d H:i:s', $data['timestamp']) : '',
            'provider' => $data['provider'],
            'bucket' => $data['bucket'],
            'files' => array_keys($data['files']),
            'manifest' => array(
                'wp_version' => $data['manifest']['wp_version'] ?? '',
                'php_version' => $data['manifest']['php_version'] ?? '',
                'plugin_count' => count($data['manifest']['plugins'] ?? array()),
                'theme' => $data['manifest']['theme'] ?? '',
                'total_size' => $data['manifest']['total_size'] ?? 0,
            ),
        );
    }
}
