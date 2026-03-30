/**
 * Admin JavaScript for Urumi WP Cloner
 */

(function($) {
    'use strict';

    var wizard = {
        currentStep: 1,
        currentAction: null,
        progressInterval: null,

        init: function() {
            this.bindEvents();
            this.checkRunningStatus();
        },

        checkRunningStatus: function() {
            var self = this;

            $.post(urumiCloner.ajaxUrl, {
                action: 'urumi_cloner_check_status',
                nonce: urumiCloner.nonce
            }, function(response) {
                if (response.success && response.data.running) {
                    // Resume the operation
                    self.currentAction = response.data.action;
                    self.goToStep(3);

                    // Show progress section for the appropriate action
                    if (response.data.action === 'backup') {
                        $('#backup-progress').show();
                        self.startProgressPolling('backup');
                    } else if (response.data.action === 'restore') {
                        $('#restore-progress').show();
                        self.startProgressPolling('restore');
                    }
                }
            });
        },

        bindEvents: function() {
            var self = this;

            // Action selection
            $('.urumi-action-card button').on('click', function() {
                var action = $(this).data('action');
                self.selectAction(action);
            });

            // Back buttons
            $('.urumi-back-btn').on('click', function() {
                self.goToStep(self.currentStep - 1);
            });

            // Backup form submission
            $('#urumi-backup-form').on('submit', function(e) {
                e.preventDefault();
                self.startBackup();
            });

            // Restore form submission
            $('#urumi-restore-form').on('submit', function(e) {
                e.preventDefault();
                self.startRestore();
            });

            // Validate key button
            $('#validate-key-btn').on('click', function() {
                self.validateKey();
            });

            // Test access button
            $('#test-access-btn').on('click', function() {
                self.testBucketAccess();
            });
        },

        selectAction: function(action) {
            this.currentAction = action;
            this.goToStep(2);
        },

        goToStep: function(step) {
            this.currentStep = step;

            // Update step indicators
            $('.urumi-step').removeClass('active completed');
            $('.urumi-step').each(function() {
                var stepNum = parseInt($(this).data('step'));
                if (stepNum < step) {
                    $(this).addClass('completed');
                } else if (stepNum === step) {
                    $(this).addClass('active');
                }
            });

            // Show/hide step content
            $('.urumi-step-content').hide();
            if (step === 2 && this.currentAction) {
                $('.urumi-step-content[data-step="2"][data-action="' + this.currentAction + '"]').show();
            } else {
                $('.urumi-step-content[data-step="' + step + '"]').first().show();
            }

            // Scroll to top
            $('html, body').animate({ scrollTop: 0 }, 300);
        },

        startBackup: function() {
            var self = this;
            var formData = {
                action: 'urumi_cloner_start_backup',
                nonce: urumiCloner.nonce,
                bucket: $('#backup_bucket').val(),
                region: $('#backup_region').val(),
                endpoint: $('#backup_endpoint').val(),
                access_key: $('#backup_access_key').val(),
                secret_key: $('#backup_secret_key').val()
            };

            $.post(urumiCloner.ajaxUrl, formData, function(response) {
                if (response.success) {
                    self.goToStep(3);
                    $('#process-title').text('Creating Backup...');
                    self.startProgressPolling('backup');
                } else {
                    alert(response.data.message || 'Failed to start backup');
                }
            }).fail(function() {
                alert('Network error. Please try again.');
            });
        },

        startRestore: function() {
            var self = this;
            var migrationKey = $('#migration_key').val().trim().replace(/\s+/g, '');

            if (!migrationKey) {
                alert('Please enter a migration key');
                return;
            }

            if (!confirm('WARNING: This will overwrite your current database and files. Make sure you have a backup! Continue?')) {
                return;
            }

            var formData = {
                action: 'urumi_cloner_start_restore',
                nonce: urumiCloner.nonce,
                migration_key: migrationKey
            };

            $.post(urumiCloner.ajaxUrl, formData, function(response) {
                if (response.success) {
                    self.goToStep(3);
                    $('#process-title').text('Restoring Backup...');
                    self.startProgressPolling('restore');
                } else {
                    alert(response.data.message || 'Failed to start restore');
                }
            }).fail(function() {
                alert('Network error. Please try again.');
            });
        },

        validateKey: function() {
            var migrationKey = $('#migration_key').val().trim().replace(/\s+/g, '');

            if (!migrationKey) {
                alert('Please enter a migration key');
                return;
            }

            var formData = {
                action: 'urumi_cloner_validate_key',
                nonce: urumiCloner.nonce,
                migration_key: migrationKey
            };

            $('#validate-key-btn').prop('disabled', true).text('Validating...');

            $.post(urumiCloner.ajaxUrl, formData, function(response) {
                $('#validate-key-btn').prop('disabled', false).text('Validate Key');

                if (response.success) {
                    wizard.showRestorePreview(response.data);
                    $('#urumi-restore-form button[type="submit"]').prop('disabled', false);
                } else {
                    alert(response.data.message || 'Invalid migration key');
                    $('#restore-preview').hide();
                    $('#urumi-restore-form button[type="submit"]').prop('disabled', true);
                }
            }).fail(function() {
                $('#validate-key-btn').prop('disabled', false).text('Validate Key');
                alert('Network error. Please try again.');
            });
        },

        testBucketAccess: function() {
            var self = this;
            var bucket = $('#backup_bucket').val();
            var endpoint = $('#backup_endpoint').val();
            var region = $('#backup_region').val();
            var access_key = $('#backup_access_key').val();
            var secret_key = $('#backup_secret_key').val();

            if (!bucket || !endpoint || !access_key || !secret_key) {
                alert('Please fill in all required fields before testing access.');
                return;
            }

            var formData = {
                action: 'urumi_cloner_test_access',
                nonce: urumiCloner.nonce,
                bucket: bucket,
                endpoint: endpoint,
                region: region,
                access_key: access_key,
                secret_key: secret_key
            };

            $('#test-access-btn').prop('disabled', true).text('Testing...');
            $('#backup-test-result').hide();

            $.post(urumiCloner.ajaxUrl, formData, function(response) {
                $('#test-access-btn').prop('disabled', false).text('Test Access');

                if (response.success) {
                    $('#backup-test-result')
                        .removeClass('notice-error')
                        .addClass('notice notice-success')
                        .html('<p><strong>Success!</strong> Bucket access confirmed. You can proceed with the backup.</p>')
                        .slideDown();
                } else {
                    $('#backup-test-result')
                        .removeClass('notice-success')
                        .addClass('notice notice-error')
                        .html('<p><strong>Access Test Failed:</strong> ' + self.escapeHtml(response.data.message) + '</p>')
                        .slideDown();
                }
            }).fail(function() {
                $('#test-access-btn').prop('disabled', false).text('Test Access');
                $('#backup-test-result')
                    .removeClass('notice-success')
                    .addClass('notice notice-error')
                    .html('<p><strong>Error:</strong> Network error. Please try again.</p>')
                    .slideDown();
            });
        },

        showRestorePreview: function(info) {
            var html = '';
            html += '<tr><th>Source URL:</th><td>' + this.escapeHtml(info.source_url) + '</td></tr>';
            html += '<tr><th>Created:</th><td>' + this.escapeHtml(info.created) + '</td></tr>';
            html += '<tr><th>WordPress Version:</th><td>' + this.escapeHtml(info.manifest.wp_version) + '</td></tr>';
            html += '<tr><th>PHP Version:</th><td>' + this.escapeHtml(info.manifest.php_version) + '</td></tr>';
            html += '<tr><th>Plugins:</th><td>' + info.manifest.plugin_count + '</td></tr>';
            html += '<tr><th>Theme:</th><td>' + this.escapeHtml(info.manifest.theme) + '</td></tr>';
            html += '<tr><th>Total Size:</th><td>' + this.formatBytes(info.manifest.total_size) + '</td></tr>';

            $('#restore-preview-content').html(html);
            $('#restore-preview').slideDown();
        },

        startProgressPolling: function(type) {
            var self = this;
            var action = type === 'backup' ? 'urumi_cloner_get_backup_progress' : 'urumi_cloner_get_restore_progress';
            var attempts = 0;
            var maxAttempts = 600; // 10 minutes max
            var noProgressCount = 0;

            self.progressInterval = setInterval(function() {
                attempts++;

                if (attempts > maxAttempts) {
                    clearInterval(self.progressInterval);
                    self.checkResult(type); // Check for result anyway
                    return;
                }

                $.post(urumiCloner.ajaxUrl, {
                    action: action,
                    nonce: urumiCloner.nonce
                }, function(response) {
                    if (response.success) {
                        var percent = response.data.percent || 0;
                        var message = response.data.message || '';

                        $('.urumi-progress-fill').css('width', percent + '%');
                        $('.urumi-progress-text').text(Math.round(percent) + '%');
                        $('.urumi-progress-message').text(message);

                        if (percent >= 100) {
                            clearInterval(self.progressInterval);
                            setTimeout(function() {
                                self.checkResult(type);
                            }, 1000);
                        }
                        noProgressCount = 0;
                    } else {
                        // No progress available - check if process has failed
                        noProgressCount++;
                        if (noProgressCount >= 3) {
                            clearInterval(self.progressInterval);
                            self.checkResult(type);
                        }
                    }
                }).fail(function() {
                    noProgressCount++;
                    if (noProgressCount >= 3) {
                        clearInterval(self.progressInterval);
                        self.checkResult(type);
                    }
                });
            }, 1000);
        },

        checkResult: function(type) {
            var self = this;
            var option = type === 'backup' ? 'urumi_cloner_backup_result' : 'urumi_cloner_restore_result';

            $.post(urumiCloner.ajaxUrl, {
                action: 'urumi_cloner_get_result',
                nonce: urumiCloner.nonce,
                type: type
            }, function(response) {
                $('#process-progress').hide();
                $('#process-result').show();

                if (response.success && response.data.success) {
                    if (type === 'backup') {
                        self.showBackupResult(response.data);
                    } else {
                        self.showRestoreResult();
                    }
                } else {
                    self.showError(response.data.error || 'Operation failed');
                }
            });
        },

        showBackupResult: function(data) {
            var migrationKey = data.migration_key;
            var html = '<div class="notice notice-success inline"><p><strong>Backup completed successfully!</strong></p></div>';
            html += '<h3>Migration Key</h3>';
            html += '<p>Copy this key and save it securely. You\'ll need it to restore your site.</p>';
            html += '<textarea readonly class="large-text code" rows="8" id="migration-key-output">' + migrationKey + '</textarea>';
            html += '<p><button type="button" class="button button-secondary" onclick="document.getElementById(\'migration-key-output\').select();document.execCommand(\'copy\');alert(\'Migration key copied to clipboard!\');">Copy to Clipboard</button></p>';

            $('#result-content').html(html);
        },

        showRestoreResult: function() {
            var html = '<div class="notice notice-success inline"><p><strong>Restore completed successfully!</strong></p></div>';
            html += '<p>Your site has been restored from the backup. You may need to log in again.</p>';

            $('#result-content').html(html);
        },

        showError: function(message) {
            var html = '<div class="notice notice-error inline"><p><strong>Error:</strong> ' + this.escapeHtml(message) + '</p></div>';
            $('#result-content').html(html);
        },

        escapeHtml: function(text) {
            var map = {
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;',
                "'": '&#039;'
            };
            return String(text).replace(/[&<>"']/g, function(m) { return map[m]; });
        },

        formatBytes: function(bytes, decimals) {
            if (bytes === 0) return '0 B';
            var k = 1024;
            var dm = decimals || 2;
            var sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
            var i = Math.floor(Math.log(bytes) / Math.log(k));
            return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
        }
    };

    // Initialize on document ready
    $(document).ready(function() {
        if ($('.urumi-cloner-wizard').length) {
            wizard.init();
        }
    });

})(jQuery);
