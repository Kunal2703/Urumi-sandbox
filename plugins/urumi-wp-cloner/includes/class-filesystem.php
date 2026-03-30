<?php
/**
 * Filesystem operations class
 *
 * @package Urumi_WP_Cloner
 */

// Exit if accessed directly
if (!defined('ABSPATH')) {
    exit;
}

/**
 * Secure filesystem operations
 */
class Urumi_Cloner_Filesystem {

    /**
     * Get WordPress filesystem
     *
     * @return WP_Filesystem_Base|WP_Error Filesystem object or error
     */
    public static function get_wp_filesystem() {
        global $wp_filesystem;

        if (!function_exists('WP_Filesystem')) {
            require_once ABSPATH . 'wp-admin/includes/file.php';
        }

        WP_Filesystem();

        if (!$wp_filesystem) {
            return new WP_Error('filesystem_error', __('Could not initialize WordPress filesystem.', 'urumi-wp-cloner'));
        }

        return $wp_filesystem;
    }

    /**
     * Securely copy directory recursively
     *
     * @param string $source      Source directory
     * @param string $destination Destination directory
     * @param array  $exclude     Paths to exclude (relative to source)
     * @return bool|WP_Error True on success, WP_Error on failure
     */
    public static function copy_dir($source, $destination, $exclude = array()) {
        if (!is_dir($source)) {
            return new WP_Error('invalid_source', __('Source directory does not exist.', 'urumi-wp-cloner'));
        }

        // Create destination if it doesn't exist
        if (!file_exists($destination)) {
            wp_mkdir_p($destination);
        }

        $iterator = new RecursiveIteratorIterator(
            new RecursiveDirectoryIterator($source, RecursiveDirectoryIterator::SKIP_DOTS),
            RecursiveIteratorIterator::SELF_FIRST
        );

        foreach ($iterator as $item) {
            $relative_path = str_replace($source . DIRECTORY_SEPARATOR, '', $item->getPathname());

            // Check if this path should be excluded
            if (self::should_exclude($relative_path, $exclude)) {
                continue;
            }

            $dest_path = $destination . DIRECTORY_SEPARATOR . $relative_path;

            if ($item->isDir()) {
                if (!file_exists($dest_path)) {
                    wp_mkdir_p($dest_path);
                }
            } else {
                if (!copy($item->getPathname(), $dest_path)) {
                    return new WP_Error(
                        'copy_failed',
                        sprintf(__('Failed to copy file: %s', 'urumi-wp-cloner'), $relative_path)
                    );
                }
            }
        }

        return true;
    }

    /**
     * Check if path should be excluded
     *
     * @param string $path    Relative path to check
     * @param array  $exclude Exclusion patterns
     * @return bool True if should be excluded
     */
    private static function should_exclude($path, $exclude) {
        foreach ($exclude as $pattern) {
            if (fnmatch($pattern, $path)) {
                return true;
            }
        }
        return false;
    }

    /**
     * Get directory size in bytes
     *
     * @param string $directory Directory path
     * @return int Size in bytes
     */
    public static function get_dir_size($directory) {
        $size = 0;

        if (!is_dir($directory)) {
            return 0;
        }

        foreach (new RecursiveIteratorIterator(new RecursiveDirectoryIterator($directory, RecursiveDirectoryIterator::SKIP_DOTS)) as $file) {
            $size += $file->getSize();
        }

        return $size;
    }

    /**
     * Format bytes to human-readable size
     *
     * @param int $bytes     Size in bytes
     * @param int $precision Decimal precision
     * @return string Formatted size
     */
    public static function format_bytes($bytes, $precision = 2) {
        $units = array('B', 'KB', 'MB', 'GB', 'TB');

        $bytes = max($bytes, 0);
        $pow = floor(($bytes ? log($bytes) : 0) / log(1024));
        $pow = min($pow, count($units) - 1);

        $bytes /= pow(1024, $pow);

        return round($bytes, $precision) . ' ' . $units[$pow];
    }

    /**
     * Sanitize filename
     *
     * @param string $filename Filename to sanitize
     * @return string Sanitized filename
     */
    public static function sanitize_filename($filename) {
        // Remove any path info
        $filename = basename($filename);

        // Sanitize using WordPress function
        $filename = sanitize_file_name($filename);

        // Additional security: remove any remaining special characters
        $filename = preg_replace('/[^a-zA-Z0-9._-]/', '', $filename);

        return $filename;
    }

    /**
     * Delete directory recursively
     *
     * @param string $directory Directory to delete
     * @return bool True on success, false on failure
     */
    public static function delete_dir($directory) {
        if (!is_dir($directory)) {
            return false;
        }

        $files = array_diff(scandir($directory), array('.', '..'));

        foreach ($files as $file) {
            $path = $directory . DIRECTORY_SEPARATOR . $file;

            if (is_dir($path)) {
                self::delete_dir($path);
            } else {
                unlink($path);
            }
        }

        return rmdir($directory);
    }

    /**
     * Validate file path is within allowed directory
     *
     * @param string $file_path      File path to validate
     * @param string $allowed_dir    Allowed base directory
     * @return bool|WP_Error True if valid, WP_Error on failure
     */
    public static function validate_path($file_path, $allowed_dir) {
        $real_file_path = realpath($file_path);
        $real_allowed_dir = realpath($allowed_dir);

        if ($real_file_path === false || $real_allowed_dir === false) {
            return new WP_Error('invalid_path', __('Invalid file path.', 'urumi-wp-cloner'));
        }

        // Check if file is within allowed directory
        if (strpos($real_file_path, $real_allowed_dir) !== 0) {
            return new WP_Error('path_traversal', __('File path is outside allowed directory.', 'urumi-wp-cloner'));
        }

        return true;
    }

    /**
     * Get free disk space
     *
     * @param string $directory Directory to check
     * @return int Free space in bytes
     */
    public static function get_free_space($directory = null) {
        if ($directory === null) {
            $directory = WP_CONTENT_DIR;
        }

        $free_space = @disk_free_space($directory);

        if ($free_space === false) {
            return 0;
        }

        return $free_space;
    }

    /**
     * Check if there's enough disk space
     *
     * @param int $required_bytes Required bytes
     * @return bool|WP_Error True if enough space, WP_Error on failure
     */
    public static function check_disk_space($required_bytes) {
        $free_space = self::get_free_space();

        // Add 100MB buffer
        $buffer = 100 * 1024 * 1024;

        if ($free_space < ($required_bytes + $buffer)) {
            return new WP_Error(
                'insufficient_space',
                sprintf(
                    __('Insufficient disk space. Required: %s, Available: %s', 'urumi-wp-cloner'),
                    self::format_bytes($required_bytes + $buffer),
                    self::format_bytes($free_space)
                )
            );
        }

        return true;
    }
}
