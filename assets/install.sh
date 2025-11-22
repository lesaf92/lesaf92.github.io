#!/bin/bash

# Check if the script is running as root
if [ "$EUID" -ne 0 ]; then
  echo "This script requires root privileges. Please run with sudo."
  exec sudo bash "$0" "$@"
  exit 1 # Should not be reached if sudo is successful
fi
echo "Running with root privileges."
# Basic sudo apt install stuff
apt update
apt install net-tools nmap iftop screen tree ncdu htop locate openssh-server

# Can I use curl inside curl?
curl -fsSL https://tailscale.com/install.sh | sh