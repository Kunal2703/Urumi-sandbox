<?php
/**
 * Wizard page template
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
?>

<div class="wrap urumi-cloner-wizard">
    <h1><?php echo esc_html__('Urumi WP Cloner', 'urumi-wp-cloner'); ?></h1>

    <!-- Step Indicator -->
    <div class="urumi-steps">
        <div class="urumi-step active" data-step="1">
            <span class="step-number">1</span>
            <span class="step-label"><?php echo esc_html__('Choose Action', 'urumi-wp-cloner'); ?></span>
        </div>
        <div class="urumi-step" data-step="2">
            <span class="step-number">2</span>
            <span class="step-label"><?php echo esc_html__('Configuration', 'urumi-wp-cloner'); ?></span>
        </div>
        <div class="urumi-step" data-step="3">
            <span class="step-number">3</span>
            <span class="step-label"><?php echo esc_html__('Process', 'urumi-wp-cloner'); ?></span>
        </div>
    </div>

    <!-- Step 1: Choose Action -->
    <div class="urumi-step-content" data-step="1">
        <div class="urumi-card">
            <h2><?php echo esc_html__('What would you like to do?', 'urumi-wp-cloner'); ?></h2>
            <p class="description">
                <?php echo esc_html__('Choose whether you want to create a backup of this site or restore from an existing backup.', 'urumi-wp-cloner'); ?>
            </p>

            <div class="urumi-action-cards">
                <div class="urumi-action-card" data-action="backup">
                    <div class="action-icon">
                        <span class="dashicons dashicons-cloud-upload"></span>
                    </div>
                    <h3><?php echo esc_html__('Create Backup', 'urumi-wp-cloner'); ?></h3>
                    <p><?php echo esc_html__('Backup your WordPress site to cloud storage and generate a migration key.', 'urumi-wp-cloner'); ?></p>
                    <button type="button" class="button button-primary button-hero" data-action="backup">
                        <?php echo esc_html__('Create Backup', 'urumi-wp-cloner'); ?>
                    </button>
                </div>

                <div class="urumi-action-card" data-action="restore">
                    <div class="action-icon">
                        <span class="dashicons dashicons-cloud-download"></span>
                    </div>
                    <h3><?php echo esc_html__('Restore Backup', 'urumi-wp-cloner'); ?></h3>
                    <p><?php echo esc_html__('Restore your site from a backup using a migration key.', 'urumi-wp-cloner'); ?></p>
                    <button type="button" class="button button-primary button-hero" data-action="restore">
                        <?php echo esc_html__('Restore Backup', 'urumi-wp-cloner'); ?>
                    </button>
                </div>
            </div>
        </div>
    </div>

    <!-- Step 2: Configuration (Backup) -->
    <div class="urumi-step-content" data-step="2" data-action="backup" style="display: none;">
        <div class="urumi-card">
            <h2><?php echo esc_html__('Cloud Storage Configuration', 'urumi-wp-cloner'); ?></h2>
            <p class="description">
                <?php echo esc_html__('Enter your S3-compatible cloud storage credentials. Your credentials will be used for this backup only.', 'urumi-wp-cloner'); ?>
            </p>

            <form id="urumi-backup-form">
                <table class="form-table">
                    <tr>
                        <th scope="row">
                            <label for="backup_bucket"><?php echo esc_html__('Bucket Name', 'urumi-wp-cloner'); ?> <span class="required">*</span></label>
                        </th>
                        <td>
                            <input type="text" name="bucket" id="backup_bucket" class="regular-text" required>
                            <p class="description"><?php echo esc_html__('Your cloud storage bucket name.', 'urumi-wp-cloner'); ?></p>
                        </td>
                    </tr>

                    <tr>
                        <th scope="row">
                            <label for="backup_endpoint"><?php echo esc_html__('Endpoint URL', 'urumi-wp-cloner'); ?> <span class="required">*</span></label>
                        </th>
                        <td>
                            <input type="text" name="endpoint" id="backup_endpoint" class="regular-text" required placeholder="https://storage.googleapis.com">
                            <p class="description">
                                <?php echo esc_html__('Examples:', 'urumi-wp-cloner'); ?>
                                <br>&bull; <strong>GCS:</strong> https://storage.googleapis.com
                                <br>&bull; <strong>AWS S3:</strong> https://s3.amazonaws.com
                                <br>&bull; <strong>Wasabi:</strong> https://s3.wasabisys.com
                            </p>
                        </td>
                    </tr>

                    <tr>
                        <th scope="row">
                            <label for="backup_region"><?php echo esc_html__('Region', 'urumi-wp-cloner'); ?></label>
                        </th>
                        <td>
                            <input type="text" name="region" id="backup_region" class="regular-text" value="us-central1">
                            <p class="description"><?php echo esc_html__('e.g., us-central1 for GCS, us-east-1 for S3', 'urumi-wp-cloner'); ?></p>
                        </td>
                    </tr>

                    <tr>
                        <th scope="row">
                            <label for="backup_access_key"><?php echo esc_html__('Access Key', 'urumi-wp-cloner'); ?> <span class="required">*</span></label>
                        </th>
                        <td>
                            <input type="text" name="access_key" id="backup_access_key" class="regular-text" required>
                            <p class="description"><?php echo esc_html__('Your S3-compatible access key ID.', 'urumi-wp-cloner'); ?></p>
                        </td>
                    </tr>

                    <tr>
                        <th scope="row">
                            <label for="backup_secret_key"><?php echo esc_html__('Secret Key', 'urumi-wp-cloner'); ?> <span class="required">*</span></label>
                        </th>
                        <td>
                            <input type="password" name="secret_key" id="backup_secret_key" class="regular-text" required>
                            <p class="description"><?php echo esc_html__('Your S3-compatible secret access key.', 'urumi-wp-cloner'); ?></p>
                        </td>
                    </tr>
                </table>

                <div id="backup-test-result" style="display: none; margin: 20px 0;"></div>

                <div class="urumi-actions">
                    <button type="button" class="button button-secondary urumi-back-btn">
                        <?php echo esc_html__('← Back', 'urumi-wp-cloner'); ?>
                    </button>
                    <button type="button" id="test-access-btn" class="button button-secondary">
                        <?php echo esc_html__('Test Access', 'urumi-wp-cloner'); ?>
                    </button>
                    <button type="submit" class="button button-primary button-large">
                        <?php echo esc_html__('Start Backup →', 'urumi-wp-cloner'); ?>
                    </button>
                </div>
            </form>
        </div>
    </div>

    <!-- Step 2: Configuration (Restore) -->
    <div class="urumi-step-content" data-step="2" data-action="restore" style="display: none;">
        <div class="urumi-card">
            <h2><?php echo esc_html__('Enter Migration Key', 'urumi-wp-cloner'); ?></h2>
            <p class="description">
                <?php echo esc_html__('Paste the migration key you received when creating the backup.', 'urumi-wp-cloner'); ?>
            </p>

            <form id="urumi-restore-form">
                <table class="form-table">
                    <tr>
                        <th scope="row">
                            <label for="migration_key"><?php echo esc_html__('Migration Key', 'urumi-wp-cloner'); ?> <span class="required">*</span></label>
                        </th>
                        <td>
                            <textarea name="migration_key" id="migration_key" rows="6" class="large-text code" required placeholder="urumi_eyJ2ZXJzaW9uIjoiMS4wIi..."></textarea>
                            <p class="description"><?php echo esc_html__('The migration key contains all the information needed to restore your site.', 'urumi-wp-cloner'); ?></p>
                        </td>
                    </tr>
                </table>

                <div id="restore-preview" style="display: none; margin-top: 20px;">
                    <h3><?php echo esc_html__('Backup Information', 'urumi-wp-cloner'); ?></h3>
                    <table class="widefat">
                        <tbody id="restore-preview-content"></tbody>
                    </table>
                </div>

                <div class="urumi-actions">
                    <button type="button" class="button button-secondary urumi-back-btn">
                        <?php echo esc_html__('← Back', 'urumi-wp-cloner'); ?>
                    </button>
                    <button type="button" id="validate-key-btn" class="button button-secondary">
                        <?php echo esc_html__('Validate Key', 'urumi-wp-cloner'); ?>
                    </button>
                    <button type="submit" class="button button-primary button-large" disabled>
                        <?php echo esc_html__('Start Restore →', 'urumi-wp-cloner'); ?>
                    </button>
                </div>
            </form>
        </div>
    </div>

    <!-- Step 3: Process -->
    <div class="urumi-step-content" data-step="3" style="display: none;">
        <div class="urumi-card">
            <h2 id="process-title"><?php echo esc_html__('Processing...', 'urumi-wp-cloner'); ?></h2>

            <div id="process-progress" class="urumi-progress-container">
                <div class="urumi-progress-bar">
                    <div class="urumi-progress-fill" style="width: 0%"></div>
                </div>
                <p class="urumi-progress-text">0%</p>
                <p class="urumi-progress-message"><?php echo esc_html__('Initializing...', 'urumi-wp-cloner'); ?></p>
            </div>

            <div id="process-result" style="display: none;">
                <div id="result-content"></div>
                <div class="urumi-actions">
                    <button type="button" class="button button-primary" onclick="location.reload()">
                        <?php echo esc_html__('Start Over', 'urumi-wp-cloner'); ?>
                    </button>
                </div>
            </div>
        </div>
    </div>
</div>
