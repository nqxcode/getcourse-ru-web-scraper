#!/bin/bash
DIR=`dirname "$0"`

function stop() {
    kill $scraper_pid > /dev/null 2>&1
    exit 1
}

trap stop SIGINT

date=$(date '+%Y-%m-%d %H:%M:%S')

log_dir="${DIR}/../../logs/${date}"
mkdir -p "$log_dir"

scraper_log="${log_dir}/scraper.log"
touch "$scraper_log"

download_log="${log_dir}/download.log"
touch "$download_log"

node "${DIR}/../../main.js" > "$scraper_log" &
scraper_pid=$!

bash "${DIR}/download.sh" "$scraper_log" "$download_log"

wait < <(jobs -p)
