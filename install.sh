#!/bin/sh

# Basic sudo apt install stuff
sudo apt update
sudo apt install net-tools nmap iftop screen tree ncdu htop locate

# Can I use curl inside curl?
curl -fsSL https://tailscale.com/install.sh | sh