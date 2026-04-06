#!/bin/bash

# Check if script is run as root
if [[ $EUID -ne 0 ]]; then
   echo "This script must be run as root (use sudo)"
   exit 1
fi

# Check if a file path was provided
if [ -z "$1" ]; then
    echo "Usage: $0 /path/to/your/executable"
    exit 1
fi

FILE_PATH=$(realpath "$1")
FILE_NAME=$(basename "$FILE_PATH")
SERVICE_NAME="${FILE_NAME%.*}" # Removes extension for service name
SERVICE_FILE="/etc/systemd/system/$SERVICE_NAME.service"

# 1. Create the .service file
echo "Creating service file at $SERVICE_FILE..."

cat <<EOF > "$SERVICE_FILE"
[Unit]
Description=Managed service for $FILE_NAME
After=network.target

[Service]
ExecStart=$FILE_PATH
WorkingDirectory=$(dirname "$FILE_PATH")
StandardOutput=inherit
StandardError=inherit
Restart=always
User=$(logname)

[Install]
WantedBy=multi-user.target
EOF

# 2. Reload daemon to recognize the new file
echo "Reloading systemd manager configuration..."
systemctl daemon-reload

# 3. Enable and Start the service
echo "Enabling and starting $SERVICE_NAME..."
systemctl enable "$SERVICE_NAME"
systemctl start "$SERVICE_NAME"

# 4. Check status
echo "--- Service Status ---"
systemctl is-active --quiet "$SERVICE_NAME" && echo "Status: Running" || echo "Status: Failed"
