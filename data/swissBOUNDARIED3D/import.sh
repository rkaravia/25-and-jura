#!/bin/bash
set -o errexit
set -o nounset

mkdir -p download

if [ ! -f download/swissBOUNDARIES3D.zip ]; then
    curl -o download/swissBOUNDARIES3D.zip https://data.geo.admin.ch/ch.swisstopo.swissboundaries3d-kanton-flaeche.fill/data.zip
fi

docker build -t cantons_convert convert
docker run \
    -ti \
    --rm \
    -v $(pwd)/download:/data \
    -e UID=`id -u $USER` \
    -e GID=`id -g $USER` \
    cantons_convert \
    /data/swissBOUNDARIES3D.zip /data/cantons.geojson
