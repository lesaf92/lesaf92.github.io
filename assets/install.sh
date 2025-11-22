#!/bin/sh

# Check if the script is running as root
if [ "$EUID" -ne 0 ]; then
  echo "This script requires root privileges. Please run with sudo."
  exec sudo bash "$0" "$@"
  exit 1 # Should not be reached if sudo is successful
fi

# Basic sudo apt install stuff
sudo apt update
sudo apt install net-tools nmap iftop screen tree ncdu htop locate

# Can I use curl inside curl?
curl -fsSL https://tailscale.com/install.sh | sh