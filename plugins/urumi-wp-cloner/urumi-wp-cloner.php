<?php
/**
 * Plugin Name: Urumi WP Cloner
 * Plugin URI: https://urumi.ai/wp-cloner
 * Description: Seamless WordPress site migration supporting cloud storage (GCS/S3). Clone sites between hosts or migrate to Urumi's managed hosting.
 * Version: 1.0.4
 * Author: Urumi
 * Author URI: https://urumi.ai
 * License: GPL v2 or later
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain: urumi-wp-cloner
 * Domain Path: /languages
 * Requires at least: 5.0
 * Requires PHP: 7.4
 *
 * @package Urumi_WP_Cloner
 */

// Exit if accessed directly
if (!defined('ABSPATH')) {
    exit;
}

// Define plugin constants
define('URUMI_CLONER_VERSION', '1.0.4');
define('URUMI_CLONER_PLUGIN_DIR', plugin_dir_path(__FILE__));
define('URUMI_CLONER_PLUGIN_URL', plugin_dir_url(__FILE__));
define('URUMI_CLONER_PLUGIN_FILE', __FILE__);

// Autoloader for plugin classes
spl_autoload_register(function ($class) {
    // Only autoload our classes
    if (strpos($class, 'Urumi_Cloner_') !== 0) {
        return;
    }

    // Convert class name to file path
    $class_file = strtolower(str_replace('_', '-', $class));
    $file = URUMI_CLONER_PLUGIN_DIR . 'includes/class-' . substr($class_file, 13) . '.php';

    if (file_exists($file)) {
        require_once $file;
    }
});

/**
 * Main plugin class
 */
class Urumi_WP_Cloner {

    /**
     * Single instance
     */
    private static $instance = null;

    /**
     * Get singleton instance
     */
    public static function get_instance() {
        if (null === self::$instance) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    /**
     * Constructor
     */
    private function __construct() {
        $this->init_hooks();
        $this->load_dependencies();
    }

    /**
     * Initialize WordPress hooks
     */
    private function init_hooks() {
        register_activation_hook(__FILE__, array($this, 'activate'));
        register_deactivation_hook(__FILE__, array($this, 'deactivate'));

        add_action('plugins_loaded', array($this, 'load_textdomain'));
        add_action('admin_enqueue_scripts', array($this, 'enqueue_admin_assets'));
    }

    /**
     * Load plugin dependencies
     */
    private function load_dependencies() {
        // Core classes
        require_once URUMI_CLONER_PLUGIN_DIR . 'includes/class-config.php';
        require_once URUMI_CLONER_PLUGIN_DIR . 'includes/class-filesystem.php';
        require_once URUMI_CLONER_PLUGIN_DIR . 'includes/class-validator.php';
        require_once URUMI_CLONER_PLUGIN_DIR . 'includes/class-database.php';
        require_once URUMI_CLONER_PLUGIN_DIR . 'includes/class-archiver.php';
        require_once URUMI_CLONER_PLUGIN_DIR . 'includes/class-uploader.php';
        require_once URUMI_CLONER_PLUGIN_DIR . 'includes/class-backup.php';
        require_once URUMI_CLONER_PLUGIN_DIR . 'includes/class-restore.php';
        require_once URUMI_CLONER_PLUGIN_DIR . 'includes/class-migration-key.php';

        // Admin interface (load in admin, AJAX, and cron contexts)
        if (is_admin() || wp_doing_ajax() || wp_doing_cron()) {
            require_once URUMI_CLONER_PLUGIN_DIR . 'admin/class-admin.php';
            Urumi_Cloner_Admin::get_instance();
        }
    }

    /**
     * Plugin activation
     */
    public function activate() {
        // Create temp directory for backups
        $temp_dir = WP_CONTENT_DIR . '/urumi-cloner-temp';
        if (!file_exists($temp_dir)) {
            wp_mkdir_p($temp_dir);

            // Add .htaccess to prevent direct access
            $htaccess = $temp_dir . '/.htaccess';
            if (!file_exists($htaccess)) {
                file_put_contents($htaccess, 'Deny from all');
            }
        }
    }

    /**
     * Plugin deactivation
     */
    public function deactivate() {
        // Cleanup temp files
        $temp_dir = WP_CONTENT_DIR . '/urumi-cloner-temp';
        if (file_exists($temp_dir)) {
            $this->recursive_delete($temp_dir);
        }
    }

    /**
     * Recursively delete directory
     */
    private function recursive_delete($dir) {
        if (!is_dir($dir)) {
            return;
        }

        $files = array_diff(scandir($dir), array('.', '..'));
        foreach ($files as $file) {
            $path = $dir . '/' . $file;
            is_dir($path) ? $this->recursive_delete($path) : unlink($path);
        }
        rmdir($dir);
    }

    /**
     * Load plugin text domain
     */
    public function load_textdomain() {
        load_plugin_textdomain(
            'urumi-wp-cloner',
            false,
            dirname(plugin_basename(__FILE__)) . '/languages'
        );
    }

    /**
     * Enqueue admin assets
     */
    public function enqueue_admin_assets($hook) {
        // Only load on our plugin pages
        if (strpos($hook, 'urumi-cloner') === false) {
            return;
        }

        // CSS
        wp_enqueue_style(
            'urumi-cloner-admin',
            URUMI_CLONER_PLUGIN_URL . 'assets/css/admin.css',
            array(),
            URUMI_CLONER_VERSION
        );

        // JavaScript
        wp_enqueue_script(
            'urumi-cloner-admin',
            URUMI_CLONER_PLUGIN_URL . 'assets/js/admin.js',
            array('jquery'),
            URUMI_CLONER_VERSION,
            true
        );

        // Localize script with AJAX URL and nonce
        wp_localize_script('urumi-cloner-admin', 'urumiCloner', array(
            'ajaxUrl' => admin_url('admin-ajax.php'),
            'nonce' => wp_create_nonce('urumi_cloner_nonce'),
            'strings' => array(
                'backupStarting' => __('Starting backup...', 'urumi-wp-cloner'),
                'backupProgress' => __('Backup in progress...', 'urumi-wp-cloner'),
                'backupComplete' => __('Backup complete!', 'urumi-wp-cloner'),
                'backupFailed' => __('Backup failed. Please check the error log.', 'urumi-wp-cloner'),
                'restoreStarting' => __('Starting restore...', 'urumi-wp-cloner'),
                'restoreProgress' => __('Restore in progress...', 'urumi-wp-cloner'),
                'restoreComplete' => __('Restore complete!', 'urumi-wp-cloner'),
                'restoreFailed' => __('Restore failed. Please check the error log.', 'urumi-wp-cloner'),
            )
        ));
    }
}

// Initialize plugin
Urumi_WP_Cloner::get_instance();
