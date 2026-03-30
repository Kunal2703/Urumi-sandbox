<?php
/**
 * Configuration class
 *
 * @package Urumi_WP_Cloner
 */

// Exit if accessed directly
if (!defined('ABSPATH')) {
    exit;
}

/**
 * Manages plugin configuration and settings
 */
class Urumi_Cloner_Config {

    /**
     * Get storage configuration
     *
     * @return array Storage configuration
     */
    public static function get_storage_config() {
        return array(
            'provider' => 's3_compatible',
            'bucket' => get_option('urumi_cloner_bucket', ''),
            'region' => get_option('urumi_cloner_region', 'us-central1'),
            'credentials' => self::get_credentials(),
            'endpoint' => get_option('urumi_cloner_s3_endpoint', ''),
        );
    }

    /**
     * Get storage credentials
     *
     * @return array|null Credentials array or null
     */
    private static function get_credentials() {
        $credentials = get_option('urumi_cloner_credentials', '');

        if (empty($credentials)) {
            return null;
        }

        // Handle both array (from WP-CLI --format=json) and JSON string formats
        if (is_array($credentials)) {
            return $credentials;
        }

        // Decode JSON string
        $decoded = json_decode($credentials, true);

        if (json_last_error() !== JSON_ERROR_NONE) {
            return null;
        }

        return $decoded;
    }

    /**
     * Validate storage configuration
     *
     * @return bool|WP_Error True if valid, WP_Error on failure
     */
    public static function validate_storage_config() {
        $config = self::get_storage_config();

        if (empty($config['bucket'])) {
            return new WP_Error('invalid_config', __('Bucket name is required.', 'urumi-wp-cloner'));
        }

        if (empty($config['credentials'])) {
            return new WP_Error('invalid_config', __('Storage credentials are required.', 'urumi-wp-cloner'));
        }

        // Validate S3-compatible credentials (access_key + secret_key)
        if (!isset($config['credentials']['access_key']) || !isset($config['credentials']['secret_key'])) {
            return new WP_Error(
                'invalid_credentials',
                __('Storage credentials require access_key and secret_key.', 'urumi-wp-cloner')
            );
        }

        // Endpoint is required for S3-compatible storage
        if (empty($config['endpoint'])) {
            return new WP_Error(
                'invalid_config',
                __('Endpoint URL is required (e.g., https://storage.googleapis.com for GCS, https://s3.amazonaws.com for S3).', 'urumi-wp-cloner')
            );
        }

        return true;
    }

    /**
     * Get temp directory for backups
     *
     * @return string Temp directory path
     */
    public static function get_temp_dir() {
        $temp_dir = WP_CONTENT_DIR . '/urumi-cloner-temp';

        if (!file_exists($temp_dir)) {
            wp_mkdir_p($temp_dir);
        }

        return $temp_dir;
    }

    /**
     * Get maximum execution time for operations
     *
     * @return int Maximum execution time in seconds
     */
    public static function get_max_execution_time() {
        $max_time = ini_get('max_execution_time');

        // If unlimited or very high, cap at 10 minutes
        if ($max_time == 0 || $max_time > 600) {
            return 600;
        }

        return max(60, intval($max_time));
    }

    /**
     * Get memory limit in bytes
     *
     * @return int Memory limit in bytes
     */
    public static function get_memory_limit() {
        $memory_limit = ini_get('memory_limit');

        if ($memory_limit == -1) {
            return PHP_INT_MAX;
        }

        return wp_convert_hr_to_bytes($memory_limit);
    }

    /**
     * Get chunk size for multipart uploads (in bytes)
     *
     * @return int Chunk size (default 5MB)
     */
    public static function get_upload_chunk_size() {
        return apply_filters('urumi_cloner_upload_chunk_size', 5 * 1024 * 1024); // 5MB
    }

    /**
     * Check if system requirements are met
     *
     * @return bool|WP_Error True if met, WP_Error on failure
     */
    public static function check_requirements() {
        $errors = array();

        // Check PHP version
        if (version_compare(PHP_VERSION, '7.4', '<')) {
            $errors[] = __('PHP 7.4 or higher is required.', 'urumi-wp-cloner');
        }

        // Check for required PHP extensions
        $required_extensions = array('json');
        foreach ($required_extensions as $ext) {
            if (!extension_loaded($ext)) {
                $errors[] = sprintf(
                    __('Required PHP extension missing: %s', 'urumi-wp-cloner'),
                    $ext
                );
            }
        }

        // Check for ZIP extension (required for compression)
        if (!extension_loaded('zip')) {
            $errors[] = __('ZIP extension is required for file compression.', 'urumi-wp-cloner');
        }

        // Check if we can write to temp directory
        $temp_dir = self::get_temp_dir();
        if (!is_writable($temp_dir)) {
            $errors[] = sprintf(
                __('Temp directory is not writable: %s', 'urumi-wp-cloner'),
                $temp_dir
            );
        }

        if (!empty($errors)) {
            return new WP_Error('requirements_not_met', implode('<br>', $errors));
        }

        return true;
    }
}
