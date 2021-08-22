#!/bin/bash
DIR=`dirname "$0"`

function stop() {
    kill $scraper_pid > /dev/null 2>&1
    exit 1
}

trap stop SIGINT

date=$(date '+%Y-%m-%d_%H%M%S')
scraper_log="${DIR}/../../logs/scraper-${date}.log"
touch "$scraper_log"

node "${DIR}/../../main.js" > "$scraper_log" &
scraper_pid=$!

bash "${DIR}/download.sh" "$scraper_log"

wait < <(jobs -p)
