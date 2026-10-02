#!/usr/bin/env bash

APPIMAGE="$1"

if [ -z "$APPIMAGE" ] || [ ! -f "$APPIMAGE" ]; then
    echo "Usage: integrate-appimage /path/to/application.AppImage"
    exit 1
fi

# Ensure AppImage is executable
chmod +x "$APPIMAGE"

# Get absolute path and app name details
APP_PATH=$(readlink -f "$APPIMAGE")
APP_FILENAME=$(basename "$APPIMAGE")
APP_NAME="${APP_FILENAME%.*}"
DIR_PATH=$(dirname "$APP_PATH")

# Create local directories for desktop files and icons
DESKTOP_DIR="$HOME/.local/share/applications"
ICON_DIR="$HOME/.local/share/icons/hicolor/256x256/apps"
mkdir -p "$DESKTOP_DIR" "$ICON_DIR"

# Extract icon and metadata temporarily
TEMP_DIR=$(mktemp -d)
cd "$TEMP_DIR" || exit 1
"$APP_PATH" --appimage-extract > /dev/null 2>&1

# Search for extracted icon and desktop entry name
EXTRACTED_ICON=$(find squashfs-root -maxdepth 3 -type f \( -name "*.png" -o -name "*.svg" \) | head -n 1)
ICON_TARGET="$APP_NAME"

if [ -n "$EXTRACTED_ICON" ]; then
    EXT="${EXTRACTED_ICON##*.}"
    cp "$EXTRACTED_ICON" "$ICON_DIR/${APP_NAME}.${EXT}"
    ICON_TARGET="${APP_NAME}.${EXT}"
fi

# Create desktop entry
CAT_FILE="$DESKTOP_DIR/appimage-${APP_NAME}.desktop"

cat <<EOF > "$CAT_FILE"
[Desktop Entry]
Name=${APP_NAME}
Exec="${APP_PATH}" %U
Icon=${ICON_TARGET}
Type=Application
Terminal=false
Categories=Utility;
Comment=AppImage integrated via script
EOF

# Clean up
cd - > /dev/null || exit
rm -rf "$TEMP_DIR"

# Force KDE Plasma to refresh menu cache
kbuildsycoca6 > /dev/null 2>&1 || kbuildsycoca5 > /dev/null 2>&1

echo "Successfully integrated '$APP_NAME' into Kubuntu menu!"
