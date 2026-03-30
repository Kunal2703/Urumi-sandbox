<?php
/**
 * Backup page template
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

// Check if storage is configured
$storage_config = Urumi_Cloner_Config::get_storage_config();
$is_configured = !empty($storage_config['bucket']) && !empty($storage_config['credentials']);

// Get backup result if available
$backup_result = get_option('urumi_cloner_backup_result', false);
if ($backup_result) {
    delete_option('urumi_cloner_backup_result'); // Clear after displaying
}
?>

<div class="wrap">
    <h1><?php echo esc_html__('Create Backup', 'urumi-wp-cloner'); ?></h1>

    <?php if (!$is_configured) : ?>
        <div class="notice notice-warning">
            <p>
                <strong><?php echo esc_html__('Storage not configured!', 'urumi-wp-cloner'); ?></strong><br>
                <?php echo esc_html__('Please configure your cloud storage settings before creating a backup.', 'urumi-wp-cloner'); ?>
                <a href="<?php echo esc_url(admin_url('admin.php?page=urumi-cloner-settings')); ?>"><?php echo esc_html__('Go to Settings', 'urumi-wp-cloner'); ?></a>
            </p>
        </div>
    <?php endif; ?>

    <?php if ($backup_result) : ?>
        <?php if ($backup_result['success']) : ?>
            <div class="notice notice-success">
                <p><strong><?php echo esc_html__('Backup completed successfully!', 'urumi-wp-cloner'); ?></strong></p>
            </div>

            <div class="urumi-migration-key-box">
                <h2><?php echo esc_html__('Migration Key', 'urumi-wp-cloner'); ?></h2>
                <p><?php echo esc_html__('Copy this migration key to restore your site on another WordPress installation:', 'urumi-wp-cloner'); ?></p>

                <textarea readonly class="large-text code" rows="4" id="migration_key_output"><?php echo esc_textarea(Urumi_Cloner_Migration_Key::format_for_display($backup_result['migration_key'])); ?></textarea>

                <p>
                    <button type="button" class="button button-primary" id="copy_migration_key">
                        <?php echo esc_html__('Copy to Clipboard', 'urumi-wp-cloner'); ?>
                    </button>
                </p>

                <h3><?php echo esc_html__('Backup Information', 'urumi-wp-cloner'); ?></h3>
                <table class="widefat">
                    <tr>
                        <th><?php echo esc_html__('Created', 'urumi-wp-cloner'); ?></th>
                        <td><?php echo esc_html($backup_result['manifest']['created']); ?></td>
                    </tr>
                    <tr>
                        <th><?php echo esc_html__('Source URL', 'urumi-wp-cloner'); ?></th>
                        <td><?php echo esc_html($backup_result['manifest']['site_url']); ?></td>
                    </tr>
                    <tr>
                        <th><?php echo esc_html__('WordPress Version', 'urumi-wp-cloner'); ?></th>
                        <td><?php echo esc_html($backup_result['manifest']['wp_version']); ?></td>
                    </tr>
                    <tr>
                        <th><?php echo esc_html__('Total Size', 'urumi-wp-cloner'); ?></th>
                        <td><?php echo esc_html(Urumi_Cloner_Filesystem::format_bytes($backup_result['manifest']['total_size'])); ?></td>
                    </tr>
                </table>
            </div>
        <?php else : ?>
            <div class="notice notice-error">
                <p>
                    <strong><?php echo esc_html__('Backup failed!', 'urumi-wp-cloner'); ?></strong><br>
                    <?php echo esc_html($backup_result['error']); ?>
                </p>
            </div>
        <?php endif; ?>
    <?php endif; ?>

    <div class="urumi-backup-container">
        <h2><?php echo esc_html__('Site Information', 'urumi-wp-cloner'); ?></h2>

        <table class="widefat">
            <tr>
                <th><?php echo esc_html__('Site URL', 'urumi-wp-cloner'); ?></th>
                <td><?php echo esc_html(home_url()); ?></td>
            </tr>
            <tr>
                <th><?php echo esc_html__('WordPress Version', 'urumi-wp-cloner'); ?></th>
                <td><?php echo esc_html(get_bloginfo('version')); ?></td>
            </tr>
            <tr>
                <th><?php echo esc_html__('PHP Version', 'urumi-wp-cloner'); ?></th>
                <td><?php echo esc_html(PHP_VERSION); ?></td>
            </tr>
            <tr>
                <th><?php echo esc_html__('Database Size', 'urumi-wp-cloner'); ?></th>
                <td><?php echo esc_html(Urumi_Cloner_Filesystem::format_bytes(Urumi_Cloner_Database::get_database_size())); ?></td>
            </tr>
            <tr>
                <th><?php echo esc_html__('Files Size', 'urumi-wp-cloner'); ?></th>
                <td><?php echo esc_html(Urumi_Cloner_Filesystem::format_bytes(Urumi_Cloner_Filesystem::get_dir_size(WP_CONTENT_DIR))); ?></td>
            </tr>
            <tr>
                <th><?php echo esc_html__('Storage Provider', 'urumi-wp-cloner'); ?></th>
                <td><?php echo esc_html(strtoupper($storage_config['provider'])); ?></td>
            </tr>
            <tr>
                <th><?php echo esc_html__('Bucket', 'urumi-wp-cloner'); ?></th>
                <td><?php echo esc_html($storage_config['bucket'] ?? __('Not configured', 'urumi-wp-cloner')); ?></td>
            </tr>
        </table>

        <p>&nbsp;</p>

        <button type="button" class="button button-primary button-hero" id="start_backup" <?php echo !$is_configured ? 'disabled' : ''; ?>>
            <?php echo esc_html__('Start Backup', 'urumi-wp-cloner'); ?>
        </button>

        <div id="backup_progress" style="display: none; margin-top: 20px;">
            <h3><?php echo esc_html__('Backup Progress', 'urumi-wp-cloner'); ?></h3>
            <div class="urumi-progress-bar">
                <div class="urumi-progress-bar-fill" id="backup_progress_bar"></div>
            </div>
            <p id="backup_status_message"></p>
        </div>
    </div>
</div>

<style>
.urumi-migration-key-box {
    background: #fff;
    border: 1px solid #ccd0d4;
    padding: 20px;
    margin: 20px 0;
}

.urumi-backup-container {
    background: #fff;
    border: 1px solid #ccd0d4;
    padding: 20px;
    margin: 20px 0;
}

.urumi-progress-bar {
    width: 100%;
    height: 30px;
    background: #f0f0f1;
    border-radius: 5px;
    overflow: hidden;
    margin: 10px 0;
}

.urumi-progress-bar-fill {
    height: 100%;
    background: #2271b1;
    transition: width 0.3s ease;
    width: 0%;
}
</style>

<script type="text/javascript">
jQuery(document).ready(function($) {
    var backupInProgress = false;

    // Start backup
    $('#start_backup').on('click', function() {
        if (backupInProgress) {
            return;
        }

        if (!confirm('<?php echo esc_js(__('Are you sure you want to start a backup? This may take several minutes.', 'urumi-wp-cloner')); ?>')) {
            return;
        }

        backupInProgress = true;
        $(this).prop('disabled', true).text('<?php echo esc_js(__('Backup in Progress...', 'urumi-wp-cloner')); ?>');

        $('#backup_progress').show();
        $('#backup_status_message').text('<?php echo esc_js(__('Initializing backup...', 'urumi-wp-cloner')); ?>');
        $('#backup_progress_bar').css('width', '0%');

        // Start backup
        $.ajax({
            url: ajaxurl,
            type: 'POST',
            data: {
                action: 'urumi_cloner_start_backup',
                nonce: urumiCloner.nonce
            },
            success: function(response) {
                if (response.success) {
                    // Poll for progress
                    var progressInterval = setInterval(function() {
                        $.ajax({
                            url: ajaxurl,
                            type: 'POST',
                            data: {
                                action: 'urumi_cloner_get_backup_progress',
                                nonce: urumiCloner.nonce
                            },
                            success: function(progressResponse) {
                                if (progressResponse.success) {
                                    var data = progressResponse.data;
                                    $('#backup_status_message').text(data.message);
                                    $('#backup_progress_bar').css('width', data.percent + '%');

                                    if (data.percent >= 100) {
                                        clearInterval(progressInterval);
                                        backupInProgress = false;
                                        setTimeout(function() {
                                            location.reload();
                                        }, 2000);
                                    }
                                }
                            }
                        });
                    }, 2000); // Poll every 2 seconds
                } else {
                    alert(response.data.message);
                    backupInProgress = false;
                    $('#start_backup').prop('disabled', false).text('<?php echo esc_js(__('Start Backup', 'urumi-wp-cloner')); ?>');
                }
            },
            error: function() {
                alert('<?php echo esc_js(__('Failed to start backup.', 'urumi-wp-cloner')); ?>');
                backupInProgress = false;
                $('#start_backup').prop('disabled', false).text('<?php echo esc_js(__('Start Backup', 'urumi-wp-cloner')); ?>');
            }
        });
    });

    // Copy migration key
    $('#copy_migration_key').on('click', function() {
        var $textarea = $('#migration_key_output');
        $textarea.select();
        document.execCommand('copy');

        var $button = $(this);
        var originalText = $button.text();
        $button.text('<?php echo esc_js(__('Copied!', 'urumi-wp-cloner')); ?>');

        setTimeout(function() {
            $button.text(originalText);
        }, 2000);
    });
});
</script>
