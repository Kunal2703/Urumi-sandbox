<?php
/**
 * Settings page template
 *
 * @package Urumi_WP_Cloner
 */

// Exit if accessed directly
if (!defined('ABSPATH')) {
    exit;
}

// Check user permissions
if (!current_user_can('manage_options')) {
    wp_die(__('You do not have permission to access this page.', 'urumi-wp-cloner'));
}

// Handle settings save
if (isset($_POST['urumi_cloner_save_settings'])) {
    check_admin_referer('urumi_cloner_settings_nonce');

    update_option('urumi_cloner_bucket', sanitize_text_field($_POST['bucket']));
    update_option('urumi_cloner_region', sanitize_text_field($_POST['region']));

    // Sanitize and validate credentials JSON
    $credentials_raw = wp_unslash($_POST['credentials']);
    $credentials_decoded = json_decode($credentials_raw, true);
    $validation_errors = array();

    if (json_last_error() !== JSON_ERROR_NONE) {
        $validation_errors[] = __('Invalid JSON format: ', 'urumi-wp-cloner') . json_last_error_msg();
    } elseif ($credentials_decoded) {
        // Validate S3-compatible credentials
        if (!isset($credentials_decoded['access_key']) || empty($credentials_decoded['access_key'])) {
            $validation_errors[] = __('Credentials missing required field: access_key', 'urumi-wp-cloner');
        }
        if (!isset($credentials_decoded['secret_key']) || empty($credentials_decoded['secret_key'])) {
            $validation_errors[] = __('Credentials missing required field: secret_key', 'urumi-wp-cloner');
        }

        if (empty($validation_errors)) {
            // Re-encode to ensure clean JSON
            update_option('urumi_cloner_credentials', wp_json_encode($credentials_decoded));
        }
    } else {
        $validation_errors[] = __('Credentials JSON cannot be empty.', 'urumi-wp-cloner');
    }

    // Validate endpoint
    $s3_endpoint = sanitize_text_field($_POST['s3_endpoint']);
    if (empty($s3_endpoint)) {
        $validation_errors[] = __('Endpoint URL is required.', 'urumi-wp-cloner');
    }
    update_option('urumi_cloner_s3_endpoint', $s3_endpoint);

    if (empty($validation_errors)) {
        echo '<div class="notice notice-success"><p>' . __('Settings saved successfully and credentials validated!', 'urumi-wp-cloner') . '</p></div>';
    } else {
        echo '<div class="notice notice-error"><p><strong>' . __('Settings saved but credentials have errors:', 'urumi-wp-cloner') . '</strong><br>';
        foreach ($validation_errors as $error) {
            echo '- ' . esc_html($error) . '<br>';
        }
        echo '</p></div>';
    }
}

// Get current settings
$bucket = get_option('urumi_cloner_bucket', '');
$region = get_option('urumi_cloner_region', 'us-central1');
$credentials = get_option('urumi_cloner_credentials', '');
// Handle both array (from v1) and JSON string formats
if (is_array($credentials)) {
    $credentials = wp_json_encode($credentials, JSON_PRETTY_PRINT);
}
$s3_endpoint = get_option('urumi_cloner_s3_endpoint', '');
?>

<div class="wrap">
    <h1><?php echo esc_html__('Urumi WP Cloner - Settings', 'urumi-wp-cloner'); ?></h1>

    <p class="description">
        <?php echo esc_html__('Configure your S3-compatible cloud storage to enable site backups and migrations.', 'urumi-wp-cloner'); ?>
        <br>
        <?php echo esc_html__('Supports: Google Cloud Storage (GCS), Amazon S3, DigitalOcean Spaces, Wasabi, Backblaze B2, MinIO, Cloudflare R2, and other S3-compatible platforms.', 'urumi-wp-cloner'); ?>
    </p>

    <form method="post" action="">
        <?php wp_nonce_field('urumi_cloner_settings_nonce'); ?>

        <table class="form-table">

            <!-- Bucket Name -->
            <tr>
                <th scope="row">
                    <label for="bucket"><?php echo esc_html__('Bucket Name', 'urumi-wp-cloner'); ?></label>
                </th>
                <td>
                    <input type="text" name="bucket" id="bucket" value="<?php echo esc_attr($bucket); ?>" class="regular-text" required>
                    <p class="description"><?php echo esc_html__('Your cloud storage bucket name.', 'urumi-wp-cloner'); ?></p>
                </td>
            </tr>

            <!-- Region -->
            <tr>
                <th scope="row">
                    <label for="region"><?php echo esc_html__('Region', 'urumi-wp-cloner'); ?></label>
                </th>
                <td>
                    <input type="text" name="region" id="region" value="<?php echo esc_attr($region); ?>" class="regular-text">
                    <p class="description"><?php echo esc_html__('Bucket region (e.g., us-central1 for GCS, us-east-1 for S3).', 'urumi-wp-cloner'); ?></p>
                </td>
            </tr>

            <!-- S3 Endpoint -->
            <tr>
                <th scope="row">
                    <label for="s3_endpoint"><?php echo esc_html__('S3 Endpoint URL', 'urumi-wp-cloner'); ?></label>
                </th>
                <td>
                    <input type="text" name="s3_endpoint" id="s3_endpoint" value="<?php echo esc_attr($s3_endpoint); ?>" class="regular-text" required placeholder="https://storage.googleapis.com">
                    <p class="description">
                        <?php echo esc_html__('Examples:', 'urumi-wp-cloner'); ?>
                        <br>&bull; <strong>GCS:</strong> https://storage.googleapis.com
                        <br>&bull; <strong>AWS S3:</strong> https://s3.amazonaws.com
                        <br>&bull; <strong>Wasabi:</strong> https://s3.wasabisys.com
                        <br>&bull; <strong>DigitalOcean:</strong> https://nyc3.digitaloceanspaces.com
                        <br>&bull; <strong>Backblaze B2:</strong> https://s3.us-west-002.backblazeb2.com
                    </p>
                </td>
            </tr>

            <!-- Credentials -->
            <tr>
                <th scope="row">
                    <label for="credentials"><?php echo esc_html__('Credentials (JSON)', 'urumi-wp-cloner'); ?></label>
                </th>
                <td>
                    <textarea name="credentials" id="credentials" rows="6" class="large-text code" required placeholder='{"access_key":"YOUR_ACCESS_KEY","secret_key":"YOUR_SECRET_KEY"}'><?php echo esc_textarea($credentials); ?></textarea>

                    <p class="description"><strong><?php echo esc_html__('Enter your S3-compatible credentials in JSON format:', 'urumi-wp-cloner'); ?></strong></p>
                    <pre class="description" style="background: #f5f5f5; padding: 10px; border: 1px solid #ddd;">{
    "access_key": "YOUR_ACCESS_KEY",
    "secret_key": "YOUR_SECRET_KEY"
}</pre>
                    <p class="description">
                        <strong><?php echo esc_html__('How to get credentials:', 'urumi-wp-cloner'); ?></strong>
                        <br>&bull; <strong>GCS:</strong> Create HMAC keys in Cloud Console → Storage → Settings → Interoperability
                        <br>&bull; <strong>AWS S3:</strong> Create access keys in IAM Console → Users → Security Credentials
                        <br>&bull; <strong>Other platforms:</strong> Check your provider's documentation for S3-compatible access keys
                    </p>
                </td>
            </tr>
        </table>

        <p class="submit">
            <input type="submit" name="urumi_cloner_save_settings" class="button button-primary" value="<?php echo esc_attr__('Save Settings', 'urumi-wp-cloner'); ?>">
        </p>
    </form>

    <hr>

    <h2><?php echo esc_html__('System Information', 'urumi-wp-cloner'); ?></h2>
    <p class="description"><?php echo esc_html__('Use this information for troubleshooting.', 'urumi-wp-cloner'); ?></p>

    <textarea readonly class="large-text code" rows="15"><?php echo esc_textarea(wp_json_encode(Urumi_Cloner_Validator::get_system_info(), JSON_PRETTY_PRINT)); ?></textarea>
</div>
