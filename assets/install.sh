#!/bin/bash

set -e

# Check if the script is running as root
if [ "$EUID" -ne 0 ]; then
  echo "Error: Please run this script as root."
  exit 1
fi

echo "Running with root privileges."
# ---------------------BASIC PACKAGES------------------------
# Basic sudo apt install stuff
sudo apt update
sudo apt install -y net-tools nmap iftop screen tree ncdu htop locate openssh-server
# ---------------------CHROME------------------------
if command -v google-chrome &> /dev/null; then
    echo "Google Chrome is already installed. Skipping..."
else
    echo "Installing Google Chrome..."
    # 1. Download the .deb file to the /tmp folder using curl
    curl -L -o /tmp/google-chrome-stable_current_amd64.deb \
        https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb

    # 2. Install it using apt (better than dpkg because it fetches dependencies)
    sudo apt install -y /tmp/google-chrome-stable_current_amd64.deb

    # 3. Clean up the downloaded file to save space
    rm /tmp/google-chrome-stable_current_amd64.deb
fi
# ---------------------TAILSCALE------------------------
if command -v tailscale &> /dev/null; then
    echo "Tailscale is already installed. Skipping..."
else
    echo "Installing Tailscale..."
    curl -fsSL https://tailscale.com/install.sh | sh
fi

# ---------------------SPOTIFY------------------------
if command -v spotify &> /dev/null; then
    echo "Spotify is already installed. Skipping..."
else
    echo "Installing Spotify..."
    curl -sS https://download.spotify.com/debian/pubkey_C85668DF69375001.gpg | sudo gpg --dearmor --yes -o /etc/apt/trusted.gpg.d/spotify.gpg
    echo "deb https://repository.spotify.com stable non-free" | sudo tee /etc/apt/sources.list.d/spotify.list

    sudo apt-get update
    sudo apt-get install -y spotify-client
fi

# ---------------------btop------------------------
if command -v btop &> /dev/null; then
    echo "btop is already installed. Skipping..."
else
    echo "Installing latest btop via curl..."
    # 1. Download the latest release for x86_64 (Standard PC/Server)
    curl -L -o /tmp/btop.tbz https://github.com/aristocratos/btop/releases/latest/download/btop-x86_64-linux-musl.tbz

    # 2. Extract it
    # -x extract, -j (bzip2), -f file
    tar -xjf /tmp/btop.tbz -C /tmp

    # 3. Run the installer script included in the download
    # (Using the script is better than just moving the binary because it installs themes too)
    cd /tmp/btop && ./install.sh

    # 4. Cleanup
    cd ~
    rm -rf /tmp/btop /tmp/btop.tbz
fi