#!/bin/bash

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
"$SCRIPT_DIR/refreshTools.sh"

# Check if SNAPSHOT_SAS_URL was passed, if so run hydrate.sh
if [ -n "$SNAPSHOT_SAS_URL" ]; then
    WORKSPACE_DIR="/workspaces/spark-customer-portal-with-ai"
    SAS_URI="$SNAPSHOT_SAS_URL" /usr/local/bin/hydrate.sh $WORKSPACE_DIR
fi

# Keep reflog commits "forever"
git config gc.reflogExpire 500.years.ago
git config gc.reflogExpireUnreachable 500.years.ago

# Create a workspace-specific supervisor config
sed 's|/workspaces/spark-template|/workspaces/spark-customer-portal-with-ai|g' .devcontainer/spark.conf > /tmp/spark.conf
sudo cp /tmp/spark.conf /etc/supervisor/conf.d/

# Set up permissions more safely
sudo mkdir -p /var/run /var/log
sudo chown node /var/run/ || echo "Warning: Could not change ownership of /var/run/"
sudo chown -R node /var/log/ || echo "Warning: Could not change ownership of /var/log/"

supervisord
supervisorctl reread
supervisorctl update

# Run the build script to perform a one-time build for static preview
if [ -f "/usr/local/bin/static-preview-build.sh" ]; then
    /usr/local/bin/static-preview-build.sh
fi
