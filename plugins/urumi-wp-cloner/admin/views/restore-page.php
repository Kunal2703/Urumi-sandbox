<?php
/**
 * Restore page template
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

// Get restore result if available
$restore_result = get_option('urumi_cloner_restore_result', false);
if ($restore_result) {
    delete_option('urumi_cloner_restore_result'); // Clear after displaying
}
?>

<div class="wrap">
    <h1><?php echo esc_html__('Restore Backup', 'urumi-wp-cloner'); ?></h1>

    <div class="notice notice-warning">
        <p>
            <strong><?php echo esc_html__('Warning!', 'urumi-wp-cloner'); ?></strong><br>
            <?php echo esc_html__('Restoring a backup will overwrite your current database and files. This action cannot be undone.', 'urumi-wp-cloner'); ?><br>
            <?php echo esc_html__('Make sure you have a backup of your current site before proceeding.', 'urumi-wp-cloner'); ?>
        </p>
    </div>

    <?php if ($restore_result) : ?>
        <?php if ($restore_result['success']) : ?>
            <div class="notice notice-success">
                <p>
                    <strong><?php echo esc_html__('Restore completed successfully!', 'urumi-wp-cloner'); ?></strong><br>
                    <?php echo esc_html__('Your site has been restored. You may need to log in again.', 'urumi-wp-cloner'); ?>
                </p>
            </div>
        <?php else : ?>
            <div class="notice notice-error">
                <p>
                    <strong><?php echo esc_html__('Restore failed!', 'urumi-wp-cloner'); ?></strong><br>
                    <?php echo esc_html($restore_result['error']); ?>
                </p>
            </div>
        <?php endif; ?>
    <?php endif; ?>

    <div class="urumi-restore-container">
        <h2><?php echo esc_html__('Migration Key', 'urumi-wp-cloner'); ?></h2>

        <p><?php echo esc_html__('Paste the migration key from your backup site:', 'urumi-wp-cloner'); ?></p>

        <form id="restore_form">
            <textarea name="migration_key" id="migration_key" rows="4" class="large-text code" required placeholder="urumi_..."></textarea>

            <p>
                <button type="button" class="button" id="validate_key">
                    <?php echo esc_html__('Validate Key', 'urumi-wp-cloner'); ?>
                </button>
            </p>
        </form>

        <div id="key_info" style="display: none; margin-top: 20px;">
            <h3><?php echo esc_html__('Migration Information', 'urumi-wp-cloner'); ?></h3>
            <table class="widefat" id="key_info_table">
                <!-- Populated by JavaScript -->
            </table>

            <p>&nbsp;</p>

            <button type="button" class="button button-primary button-hero" id="start_restore">
                <?php echo esc_html__('Start Restore', 'urumi-wp-cloner'); ?>
            </button>
        </div>

        <div id="restore_progress" style="display: none; margin-top: 20px;">
            <h3><?php echo esc_html__('Restore Progress', 'urumi-wp-cloner'); ?></h3>
            <div class="urumi-progress-bar">
                <div class="urumi-progress-bar-fill" id="restore_progress_bar"></div>
            </div>
            <p id="restore_status_message"></p>
        </div>
    </div>
</div>

<style>
.urumi-restore-container {
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
    var restoreInProgress = false;
    var validatedKey = null;

    // Validate migration key
    $('#validate_key').on('click', function() {
        var migrationKey = $('#migration_key').val().trim();

        if (!migrationKey) {
            alert('<?php echo esc_js(__('Please enter a migration key.', 'urumi-wp-cloner')); ?>');
            return;
        }

        var $button = $(this);
        $button.prop('disabled', true).text('<?php echo esc_js(__('Validating...', 'urumi-wp-cloner')); ?>');

        $.ajax({
            url: ajaxurl,
            type: 'POST',
            data: {
                action: 'urumi_cloner_validate_key',
                nonce: urumiCloner.nonce,
                migration_key: migrationKey
            },
            success: function(response) {
                if (response.success) {
                    validatedKey = migrationKey;
                    displayKeyInfo(response.data);
                    $('#key_info').show();
                } else {
                    alert(response.data.message);
                }

                $button.prop('disabled', false).text('<?php echo esc_js(__('Validate Key', 'urumi-wp-cloner')); ?>');
            },
            error: function() {
                alert('<?php echo esc_js(__('Failed to validate migration key.', 'urumi-wp-cloner')); ?>');
                $button.prop('disabled', false).text('<?php echo esc_js(__('Validate Key', 'urumi-wp-cloner')); ?>');
            }
        });
    });

    // Display key info
    function displayKeyInfo(info) {
        var html = '';

        html += '<tr><th>' + '<?php echo esc_js(__('Source URL', 'urumi-wp-cloner')); ?>' + '</th><td>' + escapeHtml(info.source_url) + '</td></tr>';
        html += '<tr><th>' + '<?php echo esc_js(__('Created', 'urumi-wp-cloner')); ?>' + '</th><td>' + escapeHtml(info.created) + '</td></tr>';
        html += '<tr><th>' + '<?php echo esc_js(__('WordPress Version', 'urumi-wp-cloner')); ?>' + '</th><td>' + escapeHtml(info.manifest.wp_version) + '</td></tr>';
        html += '<tr><th>' + '<?php echo esc_js(__('PHP Version', 'urumi-wp-cloner')); ?>' + '</th><td>' + escapeHtml(info.manifest.php_version) + '</td></tr>';
        html += '<tr><th>' + '<?php echo esc_js(__('Total Size', 'urumi-wp-cloner')); ?>' + '</th><td>' + formatBytes(info.manifest.total_size) + '</td></tr>';
        html += '<tr><th>' + '<?php echo esc_js(__('Storage Provider', 'urumi-wp-cloner')); ?>' + '</th><td>' + escapeHtml(info.provider.toUpperCase()) + '</td></tr>';
        html += '<tr><th>' + '<?php echo esc_js(__('Files', 'urumi-wp-cloner')); ?>' + '</th><td>' + escapeHtml(info.files.join(', ')) + '</td></tr>';

        $('#key_info_table').html(html);
    }

    // Start restore
    $('#start_restore').on('click', function() {
        if (restoreInProgress) {
            return;
        }

        if (!validatedKey) {
            alert('<?php echo esc_js(__('Please validate the migration key first.', 'urumi-wp-cloner')); ?>');
            return;
        }

        if (!confirm('<?php echo esc_js(__('WARNING: This will overwrite your current database and files. This action cannot be undone. Are you sure you want to continue?', 'urumi-wp-cloner')); ?>')) {
            return;
        }

        restoreInProgress = true;
        $(this).prop('disabled', true).text('<?php echo esc_js(__('Restore in Progress...', 'urumi-wp-cloner')); ?>');

        $('#restore_progress').show();
        $('#restore_status_message').text('<?php echo esc_js(__('Starting restore...', 'urumi-wp-cloner')); ?>');
        $('#restore_progress_bar').css('width', '0%');

        // Start restore
        $.ajax({
            url: ajaxurl,
            type: 'POST',
            data: {
                action: 'urumi_cloner_start_restore',
                nonce: urumiCloner.nonce,
                migration_key: validatedKey
            },
            success: function(response) {
                if (response.success) {
                    // Poll for progress
                    var progressInterval = setInterval(function() {
                        $.ajax({
                            url: ajaxurl,
                            type: 'POST',
                            data: {
                                action: 'urumi_cloner_get_restore_progress',
                                nonce: urumiCloner.nonce
                            },
                            success: function(progressResponse) {
                                if (progressResponse.success) {
                                    var data = progressResponse.data;
                                    $('#restore_status_message').text(data.message);
                                    $('#restore_progress_bar').css('width', data.percent + '%');

                                    if (data.percent >= 100) {
                                        clearInterval(progressInterval);
                                        restoreInProgress = false;
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
                    restoreInProgress = false;
                    $('#start_restore').prop('disabled', false).text('<?php echo esc_js(__('Start Restore', 'urumi-wp-cloner')); ?>');
                }
            },
            error: function() {
                alert('<?php echo esc_js(__('Failed to start restore.', 'urumi-wp-cloner')); ?>');
                restoreInProgress = false;
                $('#start_restore').prop('disabled', false).text('<?php echo esc_js(__('Start Restore', 'urumi-wp-cloner')); ?>');
            }
        });
    });

    // Helper functions
    function escapeHtml(text) {
        var map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return String(text).replace(/[&<>"']/g, function(m) { return map[m]; });
    }

    function formatBytes(bytes) {
        if (bytes === 0) return '0 B';
        var k = 1024;
        var sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
        var i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
});
</script>
