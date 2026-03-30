# Urumi WP Cloner

Seamless WordPress site migration plugin supporting cloud storage (Google Cloud Storage and Amazon S3). Clone sites between hosts with a simple migration key.

## Features

- **Cloud Storage Support**: Google Cloud Storage (GCS), Amazon S3, and S3-compatible storage
- **Complete Site Backup**: Database + wp-content files
- **Migration Key System**: Single key contains all migration data and credentials
- **Automatic URL Replacement**: Updates URLs during restore
- **Progress Tracking**: Real-time backup and restore progress
- **Secure**: Credentials embedded in encrypted migration key
- **Large Site Support**: Handles sites of any size with efficient compression
- **No Server-to-Server**: Direct upload/download from cloud storage

## Installation

1. Download the plugin ZIP or clone this repository
2. Upload to your WordPress site's `/wp-content/plugins/` directory
3. Activate the plugin through the 'Plugins' menu in WordPress
4. Configure your cloud storage settings

## Configuration

### Google Cloud Storage (GCS)

1. Go to **WP Cloner > Settings**
2. Select **Google Cloud Storage (GCS)** as provider
3. Enter your bucket name
4. Enter the region (e.g., `us-central1`)
5. Paste your service account JSON credentials

**GCS Credentials Format:**
```json
{
  "type": "service_account",
  "project_id": "your-project-id",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
  "client_email": "your-service-account@your-project.iam.gserviceaccount.com",
  "client_id": "...",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token"
}
```

### Amazon S3

1. Go to **WP Cloner > Settings**
2. Select **Amazon S3** as provider
3. Enter your bucket name
4. Enter the region (e.g., `us-east-1`)
5. Paste your AWS credentials in JSON format

**S3 Credentials Format:**
```json
{
  "access_key": "YOUR_ACCESS_KEY_ID",
  "secret_key": "YOUR_SECRET_ACCESS_KEY"
}
```

### S3-Compatible Storage (Wasabi, DigitalOcean Spaces, etc.)

1. Go to **WP Cloner > Settings**
2. Select **S3-Compatible** as provider
3. Enter your bucket name
4. Enter the region
5. Enter the S3 endpoint URL (e.g., `https://s3.wasabisys.com`)
6. Paste your credentials in JSON format

## Usage

### Creating a Backup

1. Go to **WP Cloner > Create Backup**
2. Review your site information
3. Click **Start Backup**
4. Wait for the backup to complete (progress shown in real-time)
5. Copy the **Migration Key** - this contains everything needed to restore your site

**Migration Key Format:**
```
urumi_eyJ2ZXJzaW9uIjoiMS4wIiwidGltZXN0YW1wIjoxNzM1MjI2NDAwLCJz
b3VyY2VfdXJsIjoiaHR0cHM6Ly95b3VyLXNpdGUuY29tIiwicHJvdmlkZXIiO
iJnY3MiLCJidWNrZXQiOiJ5b3VyLWJ1Y2tldCIsInJlZ2lvbiI6InVzLWNlb...
```

### Restoring a Backup

1. Install the plugin on your destination site
2. Go to **WP Cloner > Restore Backup**
3. Paste the **Migration Key**
4. Click **Validate Key** to verify and preview the backup
5. Review the backup information
6. Click **Start Restore**
7. Confirm the warning (this will overwrite your current site!)
8. Wait for the restore to complete

**Important:** Restoring will overwrite your database and files. Make sure you have a backup of your current site!

## Migration Key

The migration key is a base64-encoded JSON object that contains:

- Storage provider configuration (GCS/S3)
- Bucket name and region
- Storage credentials
- File locations in the bucket
- Site metadata (WordPress version, PHP version, size, etc.)
- Timestamp and expiration (keys expire after 30 days)

The key can be safely shared via email, text, or other means - it's the only thing needed to restore a site.

## System Requirements

- **PHP**: 7.4 or higher
- **WordPress**: 5.0 or higher
- **PHP Extensions**:
  - JSON (required)
  - ZIP (recommended)
  - OpenSSL (required for GCS)
  - cURL (recommended)
  - zlib (recommended for compression)
- **Disk Space**: At least 2x your site size for temporary storage
- **Memory**: Recommended 256MB or higher

## Troubleshooting

### Backup Fails to Start

- Check that cloud storage is configured correctly in Settings
- Verify your credentials are valid
- Ensure you have sufficient disk space for temporary files
- Check PHP error logs for detailed error messages

### Restore Fails

- Verify the migration key is complete (no missing characters)
- Check that the backup files still exist in cloud storage (keys expire after 30 days)
- Ensure your server meets the minimum requirements
- Verify you have sufficient disk space

### Upload/Download Errors

- Check your cloud storage credentials
- Verify bucket permissions (read/write access required)
- Check firewall rules (ensure WordPress can connect to cloud storage)
- Try a different storage provider if issues persist

### System Information

Go to **WP Cloner > Settings** and scroll to **System Information** to view:
- WordPress version
- PHP version and extensions
- MySQL version
- Server configuration
- Disk space and site size

## Security

- All credentials are embedded in the migration key and transmitted securely
- Temporary files are stored in a protected directory with .htaccess deny rules
- Files are automatically cleaned up after backup/restore
- Cloud storage uses private buckets (not publicly accessible)
- Migration keys expire after 30 days

## Support

For issues, questions, or feature requests, please visit:
- GitHub: https://github.com/UrumiAI/urumi-wp-cloner
- Website: https://urumi.ai

## License

GPL v2 or later

## Credits

Developed by Urumi - https://urumi.ai

---

## Development

### File Structure

```
urumi-wp-cloner/
├── urumi-wp-cloner.php          # Main plugin file
├── includes/
│   ├── class-config.php          # Configuration management
│   ├── class-filesystem.php      # File operations
│   ├── class-database.php        # Database export/import
│   ├── class-archiver.php        # File compression
│   ├── class-uploader.php        # Cloud storage upload/download
│   ├── class-migration-key.php   # Migration key handling
│   ├── class-validator.php       # Pre-flight checks
│   ├── class-backup.php          # Backup orchestrator
│   └── class-restore.php         # Restore orchestrator
├── admin/
│   ├── class-admin.php           # Admin controller
│   └── views/
│       ├── settings-page.php     # Settings UI
│       ├── backup-page.php       # Backup UI
│       └── restore-page.php      # Restore UI
└── assets/
    ├── css/
    │   └── admin.css             # Admin styles
    └── js/
        └── admin.js              # Admin scripts
```

### Key Classes

- **Urumi_Cloner_Config**: Storage configuration and system settings
- **Urumi_Cloner_Filesystem**: Secure file operations
- **Urumi_Cloner_Database**: Database export/import with mysqldump fallback
- **Urumi_Cloner_Archiver**: File compression (tar.gz/zip)
- **Urumi_Cloner_Uploader**: GCS/S3 upload/download
- **Urumi_Cloner_Migration_Key**: Key generation and parsing
- **Urumi_Cloner_Validator**: Pre-flight validation
- **Urumi_Cloner_Backup**: Complete backup orchestration
- **Urumi_Cloner_Restore**: Complete restore orchestration
- **Urumi_Cloner_Admin**: Admin interface and AJAX handlers

### Extending the Plugin

#### Adding a New Storage Provider

1. Update `Urumi_Cloner_Config` to add new provider constant
2. Add upload/download methods in `Urumi_Cloner_Uploader`
3. Update settings page to include new provider option
4. Update documentation

#### Adding Hooks

The plugin supports WordPress action hooks:

```php
// Before backup
do_action('urumi_cloner_before_backup');

// After backup
do_action('urumi_cloner_after_backup', $result);

// Before restore
do_action('urumi_cloner_before_restore', $migration_key);

// After restore
do_action('urumi_cloner_after_restore', $success);
```

## Changelog

### 1.0.0 - 2025-12-26
- Initial release
- Support for GCS and S3
- Migration key system
- Complete backup and restore functionality
- Real-time progress tracking
- URL search-replace
- WordPress.org ready
