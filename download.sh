#!/bin/bash

file=$1

if [[ -z "$file" ]]; then
    echo "Please, specify file..."
    exit 1
fi

tail -f "$file" | grep youtube-dl | while read CMD ; do
    echo $CMD
    eval $CMD
done

