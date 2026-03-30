<?php

if (!defined('ABSPATH')) {
    exit;
}

class Urumi_Cloner_Restore {

    private $progress_callback;
    private $key_data;
    private $temp_dir;

    public function __construct($migration_key, $progress_callback = null) {
        $this->progress_callback = $progress_callback;
        $this->key_data = Urumi_Cloner_Migration_Key::parse($migration_key);

        if (is_wp_error($this->key_data)) {
            $this->key_data = null;
        }
    }

    public function execute($options = array()) {
        if ($this->key_data === null) {
            return new WP_Error('invalid_key', __('Invalid migration key.', 'urumi-wp-cloner'));
        }

        $validation = Urumi_Cloner_Validator::validate_restore_requirements(
            Urumi_Cloner_Migration_Key::generate($this->key_data)
        );

        if (is_wp_error($validation)) {
            return $validation;
        }

        Urumi_Cloner_Validator::set_restore_running(true);

        try {
            $this->temp_dir = $this->create_temp_directory();
            if (is_wp_error($this->temp_dir)) {
                throw new Exception($this->temp_dir->get_error_message());
            }

            $this->update_progress('Starting restore...', 5);

            $this->update_progress('Downloading backup files...', 10);

            $downloaded_files = $this->download_files();
            if (is_wp_error($downloaded_files)) {
                throw new Exception($downloaded_files->get_error_message());
            }

            $this->update_progress('Download complete', 40);

            if (!isset($options['skip_files']) || !$options['skip_files']) {
                $this->update_progress('Extracting files...', 45);

                $extract_result = $this->extract_files($downloaded_files['wp-content.zip']);
                if (is_wp_error($extract_result)) {
                    throw new Exception($extract_result->get_error_message());
                }

                $this->update_progress('Files extracted', 65);
            }

            if (!isset($options['skip_database']) || !$options['skip_database']) {
                $this->update_progress('Decompressing database...', 70);

                $db_file = $this->decompress_file($downloaded_files['database.sql.gz']);
                if (is_wp_error($db_file)) {
                    throw new Exception($db_file->get_error_message());
                }

                $this->update_progress('Importing database...', 75);

                $import_result = Urumi_Cloner_Database::import($db_file, function($message, $percent) {
                    $overall_percent = 75 + ($percent * 0.1);
                    $this->update_progress($message, $overall_percent);
                });

                if (is_wp_error($import_result)) {
                    throw new Exception($import_result->get_error_message());
                }

                $this->update_progress('Database imported', 85);

                $manifest = $this->get_manifest();
                $old_url = $manifest['site_url'];
                $new_url = home_url();

                if ($old_url !== $new_url) {
                    $this->update_progress('Updating URLs...', 90);

                    $replace_result = Urumi_Cloner_Database::search_replace($old_url, $new_url);
                    if (is_wp_error($replace_result)) {
                        throw new Exception($replace_result->get_error_message());
                    }

                    $this->update_progress('URLs updated', 95);
                }
            }

            $this->update_progress('Finalizing...', 98);
            $this->post_restore_tasks();

            $this->update_progress('Restore complete!', 100);

            $this->cleanup();

            Urumi_Cloner_Validator::set_restore_running(false);

            return true;

        } catch (Exception $e) {
            $this->cleanup();
            Urumi_Cloner_Validator::set_restore_running(false);

            return new WP_Error('restore_failed', $e->getMessage());
        }
    }

    private function create_temp_directory() {
        $base_dir = Urumi_Cloner_Config::get_temp_dir();
        $temp_dir = $base_dir . '/restore_' . time();

        if (!wp_mkdir_p($temp_dir)) {
            return new WP_Error('mkdir_failed', __('Failed to create temporary directory.', 'urumi-wp-cloner'));
        }

        return $temp_dir;
    }

    private function download_files() {
        $storage_config = Urumi_Cloner_Migration_Key::get_storage_config($this->key_data);
        $files = Urumi_Cloner_Migration_Key::get_files($this->key_data);

        $uploader = new Urumi_Cloner_Uploader($storage_config);
        $downloaded = array();

        $total_files = count($files);
        $current_file = 0;

        foreach ($files as $file_name => $file_info) {
            $current_file++;
            $progress = 10 + (30 * ($current_file / $total_files));

            $this->update_progress(
                sprintf(__('Downloading %s...', 'urumi-wp-cloner'), $file_name),
                $progress
            );

            $local_path = $this->temp_dir . '/' . $file_name;
            $remote_path = $file_info['remote_path'];

            $result = $uploader->download($remote_path, $local_path);

            if (is_wp_error($result)) {
                return new WP_Error(
                    'download_failed',
                    sprintf(
                        __('Failed to download %s: %s', 'urumi-wp-cloner'),
                        $file_name,
                        $result->get_error_message()
                    )
                );
            }

            $downloaded[$file_name] = $local_path;
        }

        return $downloaded;
    }

    private function extract_files($archive_file) {
        $destination = WP_CONTENT_DIR;

        $result = Urumi_Cloner_Archiver::extract($archive_file, $destination);

        if (is_wp_error($result)) {
            return $result;
        }

        return true;
    }

    private function decompress_file($gz_file) {
        if (!file_exists($gz_file)) {
            return new WP_Error('file_not_found', __('Compressed file not found.', 'urumi-wp-cloner'));
        }

        $output_file = str_replace('.gz', '', $gz_file);

        $gz = gzopen($gz_file, 'rb');
        $fp = fopen($output_file, 'wb');

        if (!$gz || !$fp) {
            return new WP_Error('decompress_failed', __('Failed to decompress file.', 'urumi-wp-cloner'));
        }

        while (!gzeof($gz)) {
            fwrite($fp, gzread($gz, 1024 * 512));
        }

        gzclose($gz);
        fclose($fp);

        return $output_file;
    }

    private function get_manifest() {
        return Urumi_Cloner_Migration_Key::get_manifest($this->key_data);
    }

    private function post_restore_tasks() {
        flush_rewrite_rules();
        wp_cache_flush();

        global $wp_rewrite;
        $wp_rewrite->flush_rules();

        if (function_exists('save_mod_rewrite_rules')) {
            save_mod_rewrite_rules();
        }
    }

    private function update_progress($message, $percent) {
        if (is_callable($this->progress_callback)) {
            call_user_func($this->progress_callback, $message, $percent);
        }

        update_option('urumi_cloner_restore_progress', array(
            'message' => $message,
            'percent' => $percent,
            'timestamp' => time(),
        ), false);
    }

    private function cleanup() {
        if (!empty($this->temp_dir) && is_dir($this->temp_dir)) {
            Urumi_Cloner_Filesystem::delete_dir($this->temp_dir);
        }
    }

    public static function get_progress() {
        return get_option('urumi_cloner_restore_progress', false);
    }
}
