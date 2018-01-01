#!/usr/bin/env bash

set -o errexit
set -o pipefail
set -o nounset
# set -o xtrace

rm assets/data/*.json
rm assets/lunar-index/*.json

cp ../metajob/data-export/*.json assets/data/
cp ../metajob/data-export/index/*.json assets/lunar-index/

# rm assets/data/*not.json
# rm assets/lunar-index/*not.json

