#!/bin/bash

# Ensure the script is run with root privileges
if [[ $EUID -ne 0 ]]; then
   echo "Please run as root (sudo)"
   exit 1
fi

# Define colors for better readability
BOLD='\033[1m'
NC='\033[0m' # No Color

printf "${BOLD}%-18s %-12s %-12s %-45s${NC}\n" "INTERFACE" "TYPE" "DRIVER" "ORIGIN/PROCESS INFO"
echo "----------------------------------------------------------------------------------------------------------"

for interface in /sys/class/net/*; do
    ifname=$(basename "$interface")

    # Skip loopback
    if [ "$ifname" == "lo" ]; then continue; fi

    # 1. Driver detection
    driver=$(ethtool -i "$ifname" 2>/dev/null | grep driver | awk '{print $2}')
    [ -z "$driver" ] && driver="---"

    # 2. Defaults
    origin_type="Virtual"
    details="Logical Interface"

    # --- PHYSICAL INTERFACE LOGIC ---
    if [ -d "$interface/device" ]; then
        origin_type="Physical"
        # Extract the PCI slot ID specifically for THIS interface
        pci_addr=$(basename $(readlink "$interface/device"))
        # Get only the specific hardware name for that slot
        details=$(lspci -s "$pci_addr" | cut -d' ' -f4-)

    # --- BRIDGE LOGIC ---
    elif [ -d "$interface/bridge" ]; then
        origin_type="Bridge"
        if [[ "$ifname" == docker* ]]; then
            details="Docker Default Bridge"
        elif [[ "$ifname" == br-* ]]; then
            details="Docker User-defined Network"
        else
            details="System Bridge (virbr/nm-br)"
        fi

    # --- TUNNEL / PROCESS LOGIC (Tailscale, VPNs, etc) ---
    elif [ -e "/sys/class/net/$ifname/tun_flags" ] || [[ "$driver" == "tun" ]]; then
        origin_type="Tunnel"
        # Find the PID using the interface
        pid=$(fuser /dev/net/tun 2>/dev/null | awk '{print $1}')
        if [ ! -z "$pid" ]; then
            # Extract path and command
            proc_path=$(readlink -f /proc/"$pid"/exe)
            proc_name=$(basename "$proc_path")
            details="Process: $proc_name | Path: $proc_path"
        else
            details="Idle Tunnel Device"
        fi

    # --- VETH / CONTAINER LOGIC ---
    elif [[ "$ifname" == veth* ]]; then
        origin_type="Veth Pair"
        details="Container Pipe (check 'docker ps')"

    # --- WIREGUARD LOGIC ---
    elif [[ "$driver" == "wireguard" ]]; then
        origin_type="WireGuard"
        details="Encrypted UDP Tunnel"
    fi

    printf "%-18s %-12s %-12s %-45s\n" "$ifname" "$origin_type" "$driver" "$details"
done
