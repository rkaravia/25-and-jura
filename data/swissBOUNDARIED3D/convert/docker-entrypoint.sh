#!/bin/bash
set -o errexit
set -o nounset

INPUT_FILE=$1
OUTPUT_FILE=$2

LV95_ARCHIVE=SHAPEFILE_LV95_LN02.zip
SHP_PATH=SHAPEFILE_LV95_LN02/swissBOUNDARIES3D_1_3_TLM_KANTONSGEBIET.shp
INPUT_PATH=/vsizip//vsizip/${INPUT_FILE}/${LV95_ARCHIVE}/${SHP_PATH}

ogr2ogr \
    -f "GeoJSON" \
    /vsistdout/ \
    "${INPUT_PATH}" \
    -s_srs EPSG:2056 \
    -t_srs EPSG:4326 \
    -select NAME \
    -dim 2 \
    -simplify 10 \
    -lco RFC7946=YES \
    | jq -c '.' \
    > "${OUTPUT_FILE}"

chown ${UID}:${GID} "${OUTPUT_FILE}"
