#!/bin/sh

# --- User parameters ---
T=3600          # total duration in seconds
DELTA_T=1       # sampling interval in seconds
LOGFILE="power_log.csv"

# --- Prepare logfile header ---
echo "Config: T = ${T} s, delta_t ${DELTA_T} s." > "${LOGFILE}"
echo "Timestamp, P" >> "${LOGFILE}"

# --- Temporary files ---
TMP=$(mktemp)
CUR=$(mktemp)
VOLT=$(mktemp)

# --- Main loop ---
N=$((T / DELTA_T))
for i in $(seq 1 ${N}); do
    sleep "${DELTA_T}"

    # Read ADC values once
    vcgencmd pmic_read_adc > "${TMP}"

    # Extract current (A)
    grep current "${TMP}" \
        | awk '{print substr($2,1,length($2)-1)}' \
        | sed 's/.*=//g' > "${CUR}"

    # Extract voltage (V)
    grep volt "${TMP}" \
        | awk '{print substr($2,1,length($2)-1)}' \
        | sed 's/.*=//g' \
        | head -12 > "${VOLT}"

    # Compute instantaneous real power using your formula
    P=$(paste "${CUR}" "${VOLT}" \
        | awk '{sum+=$1*$2} END{printf "%.5f", sum*1.1451 + 0.5879}')

    TS=$(date +"%Y-%m-%d %H:%M:%S")

    # Print live output
    printf "%s, %s\n" "$TS" "$P"

    # Append to file
    printf "%s, %s\n" "$TS" "$P" >> "${LOGFILE}"
done

# Cleanup
rm "${TMP}" "${CUR}" "${VOLT}"
