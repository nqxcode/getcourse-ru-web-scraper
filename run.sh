#!/bin/bash

date=$(date '+%Y-%m-%d_%H%M%S')
result="./logs/run-${date}.log"

node ./main.js > "$result" &

./download.sh "$result"
