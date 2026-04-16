#!/bin/sh
set -e

echo "=== Urumi Post-Pull Script ==="
echo "Environment: ${URUMI_ENVIRONMENT}"
echo "Operation: ${URUMI_OPERATION}"
echo "Workspace Index: ${URUMI_WORKSPACE_INDEX:-N/A}"
echo "Working Directory: $(pwd)"
echo "Date: $(date)"

# Create a ws admin user (will fail silently if already exists)
wp user create ws-admin ws-admin@test.urumi.com \
  --role=administrator \
  --user_pass=TestAdmin123! \
  --display_name="ws Admin" \
  --allow-root 2>/dev/null || echo "ws-admin user already exists, skipping"

# Discourage search engines on non-production
wp option update blog_public 0 --allow-root

echo "=== Post-Pull Script Complete ==="
