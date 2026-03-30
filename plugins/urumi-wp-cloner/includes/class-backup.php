<?php

if (!defined('ABSPATH')) {
    exit;
}

class Urumi_Cloner_Backup {

    private $progress_callback;
    private $storage_config;
    private $temp_dir;
    private $migration_prefix;

    public function __construct($progress_callback = null) {
        $this->progress_callback = $progress_callback;
        $this->storage_config = Urumi_Cloner_Config::get_storage_config();
        $this->migration_prefix = 'mig_' . time() . '_' . substr(md5(uniqid()), 0, 8);
    }

    public function execute() {
        $validation = Urumi_Cloner_Validator::validate_backup_requirements();
        if (is_wp_error($validation)) {
            return $validation;
        }

        Urumi_Cloner_Validator::set_backup_running(true);

        try {
            // Test bucket access before starting
            $this->update_progress('Testing bucket access...', 2);
            $uploader = new Urumi_Cloner_Uploader($this->storage_config);
            $access_test = $uploader->test_bucket_access();

            if (is_wp_error($access_test)) {
                throw new Exception($access_test->get_error_message());
            }

            $this->temp_dir = $this->create_temp_directory();
            if (is_wp_error($this->temp_dir)) {
                throw new Exception($this->temp_dir->get_error_message());
            }

            $this->update_progress('Starting backup...', 5);

            $manifest = $this->create_manifest();
            if (is_wp_error($manifest)) {
                throw new Exception($manifest->get_error_message());
            }

            $manifest_file = $this->temp_dir . '/manifest.json';
            file_put_contents($manifest_file, wp_json_encode($manifest, JSON_PRETTY_PRINT));

            $this->update_progress('Created manifest', 10);

            $this->update_progress('Exporting database...', 15);

            $db_file = $this->temp_dir . '/database.sql';
            $db_export = Urumi_Cloner_Database::export($db_file);
            if (is_wp_error($db_export)) {
                throw new Exception($db_export->get_error_message());
            }

            $this->update_progress('Compressing database...', 30);
            $db_file_gz = $this->compress_file($db_file);
            if (is_wp_error($db_file_gz)) {
                throw new Exception($db_file_gz->get_error_message());
            }

            unlink($db_file);

            $this->update_progress('Database export complete', 40);

            $this->update_progress('Archiving files...', 45);

            $files_archive = $this->temp_dir . '/wp-content.zip';
            $archive_result = Urumi_Cloner_Archiver::create(
                WP_CONTENT_DIR,
                $files_archive,
                array('*/backups/*', '*/cache/*', '*/urumi-cloner-temp/*')
            );

            if (is_wp_error($archive_result)) {
                throw new Exception($archive_result->get_error_message());
            }

            $this->update_progress('File archive complete', 60);

            $this->update_progress('Uploading to cloud storage...', 65);

            $uploaded_files = $this->upload_files(array(
                'manifest.json' => $manifest_file,
                'database.sql.gz' => $db_file_gz,
                'wp-content.zip' => $files_archive,
            ));

            if (is_wp_error($uploaded_files)) {
                throw new Exception($uploaded_files->get_error_message());
            }

            $this->update_progress('Upload complete', 90);

            $migration_key = $this->generate_migration_key($uploaded_files, $manifest);

            $this->update_progress('Backup complete!', 100);

            $this->cleanup();

            Urumi_Cloner_Validator::set_backup_running(false);

            return array(
                'success' => true,
                'migration_key' => $migration_key,
                'manifest' => $manifest,
                'files' => $uploaded_files,
                'message' => __('Backup completed successfully!', 'urumi-wp-cloner'),
            );

        } catch (Exception $e) {
            $this->cleanup();
            Urumi_Cloner_Validator::set_backup_running(false);

            return new WP_Error('backup_failed', $e->getMessage());
        }
    }

    private function create_temp_directory() {
        $base_dir = Urumi_Cloner_Config::get_temp_dir();
        $temp_dir = $base_dir . '/' . $this->migration_prefix;

        if (!wp_mkdir_p($temp_dir)) {
            return new WP_Error('mkdir_failed', __('Failed to create temporary directory.', 'urumi-wp-cloner'));
        }

        return $temp_dir;
    }

    private function create_manifest() {
        global $wpdb;

        $manifest = array(
            'version' => '1.0',
            'created' => current_time('mysql'),
            'created_timestamp' => time(),
            'site_url' => home_url(),
            'site_name' => get_bloginfo('name'),
            'wp_version' => get_bloginfo('version'),
            'php_version' => PHP_VERSION,
            'mysql_version' => $wpdb->db_version(),
            'multisite' => is_multisite(),
            'active_theme' => get_stylesheet(),
            'active_plugins' => get_option('active_plugins', array()),
            'db_prefix' => $wpdb->prefix,
            'db_charset' => DB_CHARSET,
            'db_collate' => DB_COLLATE,
            'wp_content_size' => Urumi_Cloner_Filesystem::get_dir_size(WP_CONTENT_DIR),
            'db_size' => Urumi_Cloner_Database::get_database_size(),
        );

        $manifest['total_size'] = $manifest['wp_content_size'] + $manifest['db_size'];

        return $manifest;
    }

    private function compress_file($file) {
        if (!file_exists($file)) {
            return new WP_Error('file_not_found', __('File to compress not found.', 'urumi-wp-cloner'));
        }

        $file_size = filesize($file);
        $gz_file = $file . '.gz';

        error_log(sprintf('[BACKUP] Starting compression: %s (%d bytes)', basename($file), $file_size));

        $current_limit = ini_get('memory_limit');
        ini_set('memory_limit', '512M');

        $fp = fopen($file, 'rb');
        $gz = gzopen($gz_file, 'wb9');

        if (!$fp || !$gz) {
            ini_set('memory_limit', $current_limit);
            return new WP_Error('compress_failed', __('Failed to open files for compression.', 'urumi-wp-cloner'));
        }

        $bytes_read = 0;
        $chunk_size = 1024 * 512;
        $chunks_processed = 0;

        while (!feof($fp)) {
            $data = fread($fp, $chunk_size);
            $data_len = strlen($data);

            if ($data_len > 0) {
                $written = gzwrite($gz, $data);
                if ($written === false) {
                    fclose($fp);
                    gzclose($gz);
                    ini_set('memory_limit', $current_limit);
                    error_log('[BACKUP ERROR] gzwrite failed');
                    return new WP_Error('compress_write_failed', __('Failed to write compressed data.', 'urumi-wp-cloner'));
                }

                $bytes_read += $data_len;
                $chunks_processed++;

                if ($chunks_processed % 50 === 0) {
                    $progress = ($bytes_read / $file_size) * 100;
                    error_log(sprintf('[BACKUP] Compression progress: %.1f%% (%d/%d bytes)', $progress, $bytes_read, $file_size));
                }
            }
        }

        fclose($fp);
        gzclose($gz);
        ini_set('memory_limit', $current_limit);

        $gz_size = filesize($gz_file);
        $ratio = ($gz_size / $file_size) * 100;
        error_log(sprintf('[BACKUP] Compression complete: %d bytes → %d bytes (%.1f%%)', $file_size, $gz_size, $ratio));

        return $gz_file;
    }

    private function upload_files($files) {
        $uploader = new Urumi_Cloner_Uploader($this->storage_config);
        $uploaded = array();

        $total_files = count($files);
        $current_file = 0;

        foreach ($files as $remote_name => $local_path) {
            $current_file++;
            $progress = 65 + (25 * ($current_file / $total_files));

            $this->update_progress(
                sprintf(__('Uploading %s...', 'urumi-wp-cloner'), $remote_name),
                $progress
            );

            $remote_path = $this->migration_prefix . '/' . $remote_name;
            $result = $uploader->upload($local_path, $remote_path);

            if (is_wp_error($result)) {
                return new WP_Error(
                    'upload_failed',
                    sprintf(
                        __('Failed to upload %s: %s', 'urumi-wp-cloner'),
                        $remote_name,
                        $result->get_error_message()
                    )
                );
            }

            $uploaded[$remote_name] = array(
                'remote_path' => $remote_path,
                'size' => filesize($local_path),
            );
        }

        return $uploaded;
    }

    private function generate_migration_key($files, $manifest) {
        $key_data = array(
            'provider' => $this->storage_config['provider'],
            'bucket' => $this->storage_config['bucket'],
            'region' => $this->storage_config['region'],
            'credentials' => $this->storage_config['credentials'],
            'files' => $files,
            'manifest' => $manifest,
        );

        if (!empty($this->storage_config['endpoint'])) {
            $key_data['endpoint'] = $this->storage_config['endpoint'];
        }

        return Urumi_Cloner_Migration_Key::generate($key_data);
    }

    private function update_progress($message, $percent) {
        if (is_callable($this->progress_callback)) {
            call_user_func($this->progress_callback, $message, $percent);
        }

        update_option('urumi_cloner_backup_progress', array(
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
}
