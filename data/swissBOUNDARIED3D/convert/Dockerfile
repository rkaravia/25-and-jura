FROM debian:buster

RUN apt-get -qq update && apt-get -y install \
    gdal-bin \
    jq \
 && rm -rf /var/lib/apt/lists/*

COPY *.sh /usr/local/bin/
ENTRYPOINT ["docker-entrypoint.sh"]
