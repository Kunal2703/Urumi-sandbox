<?php

if (!defined('ABSPATH')) {
    exit;
}

class Urumi_Cloner_Admin {

    private static $instance = null;

    public static function get_instance() {
        if (null === self::$instance) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    private function __construct() {
        add_action('admin_menu', array($this, 'add_admin_menu'));
        add_action('admin_init', array($this, 'register_settings'));

        add_action('wp_ajax_urumi_cloner_start_backup', array($this, 'ajax_start_backup'));
        add_action('wp_ajax_urumi_cloner_get_backup_progress', array($this, 'ajax_get_backup_progress'));
        add_action('wp_ajax_urumi_cloner_start_restore', array($this, 'ajax_start_restore'));
        add_action('wp_ajax_urumi_cloner_get_restore_progress', array($this, 'ajax_get_restore_progress'));
        add_action('wp_ajax_urumi_cloner_validate_key', array($this, 'ajax_validate_key'));
        add_action('wp_ajax_urumi_cloner_test_access', array($this, 'ajax_test_access'));
        add_action('wp_ajax_urumi_cloner_get_result', array($this, 'ajax_get_result'));
        add_action('wp_ajax_urumi_cloner_check_status', array($this, 'ajax_check_status'));

        add_action('urumi_cloner_background_backup', array($this, 'run_backup_process'));
        add_action('urumi_cloner_background_restore', array($this, 'run_restore_process'));
    }

    public function add_admin_menu() {
        add_menu_page(
            __('Urumi WP Cloner', 'urumi-wp-cloner'),
            __('WP Cloner', 'urumi-wp-cloner'),
            'manage_options',
            'urumi-cloner',
            array($this, 'render_wizard_page'),
            'dashicons-update',
            65
        );
    }

    public function register_settings() {
        // Settings are now saved on-the-fly, no need for settings registration
    }

    public function render_wizard_page() {
        include URUMI_CLONER_PLUGIN_DIR . 'admin/views/wizard-page.php';
    }

    public function ajax_start_backup() {
        check_ajax_referer('urumi_cloner_nonce', 'nonce');

        if (!current_user_can('manage_options')) {
            wp_send_json_error(array('message' => __('Permission denied.', 'urumi-wp-cloner')));
        }

        // Save credentials temporarily for this backup
        $bucket = isset($_POST['bucket']) ? sanitize_text_field($_POST['bucket']) : '';
        $region = isset($_POST['region']) ? sanitize_text_field($_POST['region']) : '';
        $endpoint = isset($_POST['endpoint']) ? sanitize_text_field($_POST['endpoint']) : '';
        $access_key = isset($_POST['access_key']) ? sanitize_text_field($_POST['access_key']) : '';
        $secret_key = isset($_POST['secret_key']) ? sanitize_text_field($_POST['secret_key']) : '';

        if (empty($bucket) || empty($endpoint) || empty($access_key) || empty($secret_key)) {
            wp_send_json_error(array('message' => __('All credentials fields are required.', 'urumi-wp-cloner')));
        }

        // Store credentials in transient for the backup process
        set_transient('urumi_cloner_backup_config', array(
            'bucket' => $bucket,
            'region' => $region,
            'endpoint' => $endpoint,
            'credentials' => array(
                'access_key' => $access_key,
                'secret_key' => $secret_key,
            ),
        ), 3600);

        $this->spawn_backup_process();

        wp_send_json_success(array(
            'message' => __('Backup started in background.', 'urumi-wp-cloner'),
        ));
    }

    public function ajax_get_backup_progress() {
        check_ajax_referer('urumi_cloner_nonce', 'nonce');

        if (!current_user_can('manage_options')) {
            wp_send_json_error(array('message' => __('Permission denied.', 'urumi-wp-cloner')));
        }

        $progress = get_option('urumi_cloner_backup_progress', false);

        if (!$progress) {
            wp_send_json_error(array('message' => __('No backup in progress.', 'urumi-wp-cloner')));
        }

        wp_send_json_success($progress);
    }

    public function ajax_start_restore() {
        check_ajax_referer('urumi_cloner_nonce', 'nonce');

        if (!current_user_can('manage_options')) {
            wp_send_json_error(array('message' => __('Permission denied.', 'urumi-wp-cloner')));
        }

        $migration_key = isset($_POST['migration_key']) ? sanitize_text_field($_POST['migration_key']) : '';

        if (empty($migration_key)) {
            wp_send_json_error(array('message' => __('Migration key is required.', 'urumi-wp-cloner')));
        }

        $migration_key = Urumi_Cloner_Migration_Key::sanitize($migration_key);

        if (!Urumi_Cloner_Migration_Key::is_valid_format($migration_key)) {
            wp_send_json_error(array('message' => __('Invalid migration key format.', 'urumi-wp-cloner')));
        }

        set_transient('urumi_cloner_restore_key', $migration_key, 3600);

        $this->spawn_restore_process();

        wp_send_json_success(array(
            'message' => __('Restore started in background.', 'urumi-wp-cloner'),
        ));
    }

    public function ajax_get_restore_progress() {
        check_ajax_referer('urumi_cloner_nonce', 'nonce');

        if (!current_user_can('manage_options')) {
            wp_send_json_error(array('message' => __('Permission denied.', 'urumi-wp-cloner')));
        }

        $progress = Urumi_Cloner_Restore::get_progress();

        if (!$progress) {
            wp_send_json_error(array('message' => __('No restore in progress.', 'urumi-wp-cloner')));
        }

        wp_send_json_success($progress);
    }

    public function ajax_validate_key() {
        check_ajax_referer('urumi_cloner_nonce', 'nonce');

        if (!current_user_can('manage_options')) {
            wp_send_json_error(array('message' => __('Permission denied.', 'urumi-wp-cloner')));
        }

        $migration_key = isset($_POST['migration_key']) ? sanitize_text_field($_POST['migration_key']) : '';

        if (empty($migration_key)) {
            wp_send_json_error(array('message' => __('Migration key is required.', 'urumi-wp-cloner')));
        }

        $migration_key = Urumi_Cloner_Migration_Key::sanitize($migration_key);

        $info = Urumi_Cloner_Migration_Key::get_info($migration_key);

        if (is_wp_error($info)) {
            wp_send_json_error(array('message' => $info->get_error_message()));
        }

        wp_send_json_success($info);
    }

    public function ajax_test_access() {
        check_ajax_referer('urumi_cloner_nonce', 'nonce');

        if (!current_user_can('manage_options')) {
            wp_send_json_error(array('message' => __('Permission denied.', 'urumi-wp-cloner')));
        }

        $bucket = isset($_POST['bucket']) ? sanitize_text_field($_POST['bucket']) : '';
        $endpoint = isset($_POST['endpoint']) ? sanitize_text_field($_POST['endpoint']) : '';
        $region = isset($_POST['region']) ? sanitize_text_field($_POST['region']) : '';
        $access_key = isset($_POST['access_key']) ? sanitize_text_field($_POST['access_key']) : '';
        $secret_key = isset($_POST['secret_key']) ? sanitize_text_field($_POST['secret_key']) : '';

        if (empty($bucket) || empty($endpoint) || empty($access_key) || empty($secret_key)) {
            wp_send_json_error(array('message' => __('All credentials fields are required.', 'urumi-wp-cloner')));
        }

        $config = array(
            'provider' => 's3_compatible',
            'bucket' => $bucket,
            'endpoint' => $endpoint,
            'region' => $region,
            'credentials' => array(
                'access_key' => $access_key,
                'secret_key' => $secret_key,
            ),
        );

        $test_result = Urumi_Cloner_Validator::test_bucket_access($config);

        if (is_wp_error($test_result)) {
            wp_send_json_error(array('message' => $test_result->get_error_message()));
        }

        wp_send_json_success(array('message' => __('Bucket access confirmed!', 'urumi-wp-cloner')));
    }

    public function ajax_check_status() {
        check_ajax_referer('urumi_cloner_nonce', 'nonce');

        if (!current_user_can('manage_options')) {
            wp_send_json_error(array('message' => __('Permission denied.', 'urumi-wp-cloner')));
        }

        $status = array(
            'running' => false,
            'action' => null,
        );

        if (Urumi_Cloner_Validator::is_backup_running()) {
            $status['running'] = true;
            $status['action'] = 'backup';
        } elseif (Urumi_Cloner_Validator::is_restore_running()) {
            $status['running'] = true;
            $status['action'] = 'restore';
        }

        wp_send_json_success($status);
    }

    private function spawn_backup_process() {
        wp_schedule_single_event(time(), 'urumi_cloner_background_backup');
        spawn_cron();
    }

    private function spawn_restore_process() {
        wp_schedule_single_event(time(), 'urumi_cloner_background_restore');
        spawn_cron();
    }

    public function run_backup_process() {
        // Get credentials from transient
        $config = get_transient('urumi_cloner_backup_config');

        if (!$config) {
            Urumi_Cloner_Validator::set_backup_running(false);
            update_option('urumi_cloner_backup_result', array(
                'success' => false,
                'error' => __('Backup configuration not found.', 'urumi-wp-cloner'),
            ), false);
            return;
        }

        // Temporarily set options for the backup
        update_option('urumi_cloner_bucket', $config['bucket'], false);
        update_option('urumi_cloner_region', $config['region'], false);
        update_option('urumi_cloner_s3_endpoint', $config['endpoint'], false);
        update_option('urumi_cloner_credentials', wp_json_encode($config['credentials']), false);

        $backup = new Urumi_Cloner_Backup();
        $result = $backup->execute();

        // Clean up temporary credentials
        delete_transient('urumi_cloner_backup_config');

        Urumi_Cloner_Validator::set_backup_running(false);

        if (is_wp_error($result)) {
            update_option('urumi_cloner_backup_result', array(
                'success' => false,
                'error' => $result->get_error_message(),
            ), false);
        } else {
            update_option('urumi_cloner_backup_result', array(
                'success' => true,
                'migration_key' => $result['migration_key'],
                'manifest' => $result['manifest'],
            ), false);
        }

        delete_option('urumi_cloner_backup_progress');
    }

    public function run_restore_process() {
        $migration_key = get_transient('urumi_cloner_restore_key');

        if (!$migration_key) {
            update_option('urumi_cloner_restore_result', array(
                'success' => false,
                'error' => __('Migration key not found.', 'urumi-wp-cloner'),
            ), false);
            Urumi_Cloner_Validator::set_restore_running(false);
            return;
        }

        $restore = new Urumi_Cloner_Restore($migration_key);
        $result = $restore->execute();

        Urumi_Cloner_Validator::set_restore_running(false);

        if (is_wp_error($result)) {
            update_option('urumi_cloner_restore_result', array(
                'success' => false,
                'error' => $result->get_error_message(),
            ), false);
        } else {
            update_option('urumi_cloner_restore_result', array(
                'success' => true,
            ), false);
        }

        delete_transient('urumi_cloner_restore_key');
        delete_option('urumi_cloner_restore_progress');
    }

    public function ajax_get_result() {
        check_ajax_referer('urumi_cloner_nonce', 'nonce');

        if (!current_user_can('manage_options')) {
            wp_send_json_error(array('message' => __('Permission denied.', 'urumi-wp-cloner')));
        }

        $type = isset($_POST['type']) ? sanitize_text_field($_POST['type']) : '';
        $option_name = $type === 'backup' ? 'urumi_cloner_backup_result' : 'urumi_cloner_restore_result';

        $result = get_option($option_name, false);

        if ($result) {
            wp_send_json_success($result);
        } else {
            wp_send_json_error(array('message' => __('Result not found.', 'urumi-wp-cloner')));
        }
    }
}
