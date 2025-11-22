#!/bin/bash

set -e

# Check if the script is running as root
if [ "$EUID" -ne 0 ]; then
  echo "Error: Please run this script as root."
  echo "Usage: sudo ./install.sh"
  exit 1
fi

echo "Running with root privileges."
# Basic sudo apt install stuff
apt update
apt install -y net-tools nmap iftop screen tree ncdu htop locate openssh-server

# Can I use curl inside curl?
curl -fsSL https://tailscale.com/install.sh | sh