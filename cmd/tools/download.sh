#!/bin/bash

DIR=`dirname "$0"`

file=$1
download_log=$2

if [[ -z "$file" ]]; then
    echo "Please, specify file with commands..."
    exit 1
fi

if [[ -z "$download_log" ]]; then
    echo "Please, specify log file..."
    exit 1
fi

tail -f "$file" | while read line ; do
    cmd=`echo "$line" | grep yt-dlp`
    if [[ ! -z "$cmd" ]]; then
      echo "$cmd" >> "$download_log"
      eval "$cmd"
    fi
done

