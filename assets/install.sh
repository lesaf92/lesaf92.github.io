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

# ---------------------TAILSCALE------------------------
if command -v tailscale &> /dev/null; then
    echo "Tailscale is already installed. Skipping..."
else
    echo "Installing Tailscale..."
    # Can I use curl inside curl?
    curl -fsSL https://tailscale.com/install.sh | sh
fi