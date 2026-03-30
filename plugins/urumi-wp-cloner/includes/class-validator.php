<?php
/**
 * Validation class
 *
 * @package Urumi_WP_Cloner
 */

// Exit if accessed directly
if (!defined('ABSPATH')) {
    exit;
}

/**
 * Pre-flight validation checks
 */
class Urumi_Cloner_Validator {

    /**
     * Validate backup requirements
     *
     * @return bool|WP_Error True if valid, WP_Error on failure
     */
    public static function validate_backup_requirements() {
        $errors = array();

        // Check system requirements
        $requirements_check = Urumi_Cloner_Config::check_requirements();
        if (is_wp_error($requirements_check)) {
            $errors[] = $requirements_check->get_error_message();
        }

        // Check storage configuration
        $storage_check = Urumi_Cloner_Config::validate_storage_config();
        if (is_wp_error($storage_check)) {
            $errors[] = $storage_check->get_error_message();
        }

        // Check disk space
        $wp_content_size = Urumi_Cloner_Filesystem::get_dir_size(WP_CONTENT_DIR);
        $db_size = Urumi_Cloner_Database::get_database_size();
        $total_size = $wp_content_size + $db_size;

        // Estimate compressed size (assume 50% compression)
        $estimated_backup_size = $total_size * 0.5;

        $space_check = Urumi_Cloner_Filesystem::check_disk_space($estimated_backup_size);
        if (is_wp_error($space_check)) {
            $errors[] = $space_check->get_error_message();
        }

        // Check for active processes
        if (self::is_backup_running()) {
            $errors[] = __('A backup is already in progress.', 'urumi-wp-cloner');
        }

        if (!empty($errors)) {
            return new WP_Error('validation_failed', implode('<br>', $errors));
        }

        return true;
    }

    /**
     * Validate restore requirements
     *
     * @param string $migration_key Migration key
     * @return bool|WP_Error True if valid, WP_Error on failure
     */
    public static function validate_restore_requirements($migration_key) {
        $errors = array();

        // Check system requirements
        $requirements_check = Urumi_Cloner_Config::check_requirements();
        if (is_wp_error($requirements_check)) {
            $errors[] = $requirements_check->get_error_message();
        }

        // Validate migration key
        $key_data = Urumi_Cloner_Migration_Key::parse($migration_key);
        if (is_wp_error($key_data)) {
            $errors[] = $key_data->get_error_message();
        } else {
            // Check disk space for restore
            $manifest = Urumi_Cloner_Migration_Key::get_manifest($key_data);
            $total_size = $manifest['total_size'] ?? 0;

            if ($total_size > 0) {
                $space_check = Urumi_Cloner_Filesystem::check_disk_space($total_size);
                if (is_wp_error($space_check)) {
                    $errors[] = $space_check->get_error_message();
                }
            }

            // Check WordPress version compatibility
            if (isset($manifest['wp_version'])) {
                $current_wp_version = get_bloginfo('version');
                if (version_compare($manifest['wp_version'], $current_wp_version, '>')) {
                    $errors[] = sprintf(
                        __('Warning: Backup was created with WordPress %s but current version is %s. Restore may fail.', 'urumi-wp-cloner'),
                        $manifest['wp_version'],
                        $current_wp_version
                    );
                }
            }

            // Check PHP version compatibility
            if (isset($manifest['php_version'])) {
                if (version_compare($manifest['php_version'], PHP_VERSION, '>')) {
                    $errors[] = sprintf(
                        __('Warning: Backup was created with PHP %s but current version is %s. Some features may not work.', 'urumi-wp-cloner'),
                        $manifest['php_version'],
                        PHP_VERSION
                    );
                }
            }
        }

        // Check for active processes
        if (self::is_restore_running()) {
            $errors[] = __('A restore is already in progress.', 'urumi-wp-cloner');
        }

        if (!empty($errors)) {
            return new WP_Error('validation_failed', implode('<br>', $errors));
        }

        return true;
    }

    /**
     * Test bucket access with given configuration
     *
     * @param array $config Storage configuration
     * @return bool|WP_Error True if accessible, WP_Error on failure
     */
    public static function test_bucket_access($config = null) {
        if (!$config) {
            $config = Urumi_Cloner_Config::get_storage_config();
        }

        // Validate configuration first
        if (empty($config['bucket']) || empty($config['endpoint']) || empty($config['credentials'])) {
            return new WP_Error(
                'invalid_config',
                __('Invalid storage configuration. Missing bucket, endpoint, or credentials.', 'urumi-wp-cloner')
            );
        }

        $uploader = new Urumi_Cloner_Uploader($config);
        return $uploader->test_bucket_access();
    }

    /**
     * Check if backup is currently running
     *
     * @return bool True if backup is running
     */
    public static function is_backup_running() {
        $running = get_transient('urumi_cloner_backup_running');
        return !empty($running);
    }

    /**
     * Check if restore is currently running
     *
     * @return bool True if restore is running
     */
    public static function is_restore_running() {
        $running = get_transient('urumi_cloner_restore_running');
        return !empty($running);
    }

    /**
     * Set backup running status
     *
     * @param bool $running Running status
     */
    public static function set_backup_running($running = true) {
        if ($running) {
            set_transient('urumi_cloner_backup_running', true, 3600); // 1 hour max
        } else {
            delete_transient('urumi_cloner_backup_running');
        }
    }

    /**
     * Set restore running status
     *
     * @param bool $running Running status
     */
    public static function set_restore_running($running = true) {
        if ($running) {
            set_transient('urumi_cloner_restore_running', true, 3600); // 1 hour max
        } else {
            delete_transient('urumi_cloner_restore_running');
        }
    }

    /**
     * Get system info for diagnostics
     *
     * @return array System information
     */
    public static function get_system_info() {
        global $wpdb;

        $wp_content_size = Urumi_Cloner_Filesystem::get_dir_size(WP_CONTENT_DIR);
        $db_size = Urumi_Cloner_Database::get_database_size();
        $free_space = Urumi_Cloner_Filesystem::get_free_space();

        return array(
            'wordpress' => array(
                'version' => get_bloginfo('version'),
                'multisite' => is_multisite() ? 'Yes' : 'No',
                'url' => home_url(),
            ),
            'server' => array(
                'php_version' => PHP_VERSION,
                'mysql_version' => $wpdb->db_version(),
                'server_software' => $_SERVER['SERVER_SOFTWARE'] ?? '',
                'max_execution_time' => ini_get('max_execution_time'),
                'memory_limit' => ini_get('memory_limit'),
            ),
            'extensions' => array(
                'zip' => extension_loaded('zip') ? 'Yes' : 'No',
                'curl' => extension_loaded('curl') ? 'Yes' : 'No',
                'openssl' => extension_loaded('openssl') ? 'Yes' : 'No',
            ),
            'storage' => array(
                'wp_content_size' => Urumi_Cloner_Filesystem::format_bytes($wp_content_size),
                'db_size' => Urumi_Cloner_Filesystem::format_bytes($db_size),
                'free_space' => Urumi_Cloner_Filesystem::format_bytes($free_space),
            ),
        );
    }
}
