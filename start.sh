#!/bin/bash

DIR=`dirname "$0"`

rm -f "${DIR}/scraper.log"
rm -f "${DIR}/download.log"

nohup bash -c cmd/run.sh &
