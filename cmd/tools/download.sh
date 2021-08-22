#!/bin/bash

DIR=`dirname "$0"`

date=$(date '+%Y-%m-%d_%H%M%S')
download_log="${DIR}/../../logs/download-${date}.log"
touch "$download_log"

file=$1

if [[ -z "$file" ]]; then
    echo "Please, specify file..."
    exit 1
fi

tail -f "$file" | while read line ; do
    cmd=`echo "$line" | grep youtube-dl`
    if [[ ! -z "$cmd" ]]; then
      echo "$cmd" >> "$download_log"
      eval "$cmd"
    fi
done

