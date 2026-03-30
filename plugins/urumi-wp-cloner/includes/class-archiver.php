<?php
/**
 * File archiver class
 *
 * @package Urumi_WP_Cloner
 */

// Exit if accessed directly
if (!defined('ABSPATH')) {
    exit;
}

/**
 * Handles file compression and extraction
 */
class Urumi_Cloner_Archiver {

    /**
     * Create archive from directory
     *
     * @param string $source_dir  Source directory to archive
     * @param string $output_file Output archive file path
     * @param array  $exclude     Patterns to exclude
     * @return bool|WP_Error True on success, WP_Error on failure
     */
    public static function create($source_dir, $output_file, $exclude = array()) {
        if (!is_dir($source_dir)) {
            return new WP_Error('invalid_source', __('Source directory does not exist.', 'urumi-wp-cloner'));
        }

        // Default exclusions
        $default_exclude = array(
            '*/cache/*',
            '*/backups/*',
            '*/upgrade/*',
            '*/urumi-cloner-temp/*',
            '*/.git/*',
            '*/.svn/*',
            '*/node_modules/*',
        );

        $exclude = array_merge($default_exclude, $exclude);

        // Use ZIP for all archives
        return self::create_zip($source_dir, $output_file, $exclude);
    }


    /**
     * Create ZIP archive
     *
     * @param string $source_dir  Source directory
     * @param string $output_file Output file
     * @param array  $exclude     Exclusion patterns
     * @return bool|WP_Error True on success, WP_Error on failure
     */
    private static function create_zip($source_dir, $output_file, $exclude = array()) {
        if (!class_exists('ZipArchive')) {
            return new WP_Error('zip_unavailable', __('ZIP extension is not available.', 'urumi-wp-cloner'));
        }

        $zip = new ZipArchive();

        if ($zip->open($output_file, ZipArchive::CREATE | ZipArchive::OVERWRITE) !== true) {
            return new WP_Error('zip_open_failed', __('Failed to create ZIP archive.', 'urumi-wp-cloner'));
        }

        $source_dir = rtrim($source_dir, '/\\');

        $files = new RecursiveIteratorIterator(
            new RecursiveDirectoryIterator($source_dir, RecursiveDirectoryIterator::SKIP_DOTS),
            RecursiveIteratorIterator::LEAVES_ONLY
        );

        foreach ($files as $file) {
            if (!$file->isFile()) {
                continue;
            }

            $file_path = $file->getRealPath();
            $relative_path = substr($file_path, strlen($source_dir) + 1);

            // Check exclusions
            if (self::should_exclude($relative_path, $exclude)) {
                continue;
            }

            $zip->addFile($file_path, $relative_path);
        }

        $zip->close();

        return true;
    }

    /**
     * Extract archive
     *
     * @param string $archive_file Archive file path
     * @param string $destination  Destination directory
     * @return bool|WP_Error True on success, WP_Error on failure
     */
    public static function extract($archive_file, $destination) {
        if (!file_exists($archive_file)) {
            return new WP_Error('file_not_found', __('Archive file not found.', 'urumi-wp-cloner'));
        }

        // Create destination directory
        if (!file_exists($destination)) {
            wp_mkdir_p($destination);
        }

        // Use ZIP for all archives
        return self::extract_zip($archive_file, $destination);
    }


    /**
     * Extract ZIP archive
     *
     * @param string $archive_file Archive file
     * @param string $destination  Destination directory
     * @return bool|WP_Error True on success, WP_Error on failure
     */
    private static function extract_zip($archive_file, $destination) {
        if (!class_exists('ZipArchive')) {
            return new WP_Error('zip_unavailable', __('ZIP extension is not available.', 'urumi-wp-cloner'));
        }

        $zip = new ZipArchive();

        if ($zip->open($archive_file) !== true) {
            return new WP_Error('zip_open_failed', __('Failed to open ZIP archive.', 'urumi-wp-cloner'));
        }

        if (!$zip->extractTo($destination)) {
            $zip->close();
            return new WP_Error('zip_extract_failed', __('Failed to extract ZIP archive.', 'urumi-wp-cloner'));
        }

        $zip->close();

        return true;
    }


    /**
     * Check if path should be excluded
     *
     * @param string $path    Path to check
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
     * Get archive file size
     *
     * @param string $archive_file Archive file path
     * @return int|bool File size in bytes or false on failure
     */
    public static function get_archive_size($archive_file) {
        if (!file_exists($archive_file)) {
            return false;
        }

        return filesize($archive_file);
    }
}
