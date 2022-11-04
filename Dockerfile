# syntax = docker/dockerfile:1.4.1
FROM ghcr.io/project-osrm/osrm-backend:v5.27.1 as build-stage

ARG REGION_VERSION
WORKDIR /osrm
RUN mkdir ./data

RUN <<EOF
    apt-get update
    apt-get -y install curl
    curl http://download.geofabrik.de/asia/japan/{$REGION_VERSION.osm.pbf} --output "data/#1"
EOF

RUN <<EOF
    osrm-extract -p /opt/car.lua data/$REGION_VERSION.osm.pbf
    # Multi-Level Dijkstra: Build is fast but API response is slowly than CH
    #osrm-partition data/$REGION_VERSION.osm.pbf
    #osrm-customize data/$REGION_VERSION.osm.pbf
    # Contraction Hierarchies: Longer build time but faster API response
    osrm-contract data/$REGION_VERSION.osm.pbf
EOF

# run node 18 on ubuntu
FROM node:18-slim as node
FROM ubuntu:jammy-20221101

RUN <<EOF
    add-apt-repository ppa:ubuntu-toolchain-r/test
    apt-get update -y
    apt-get install -y libstdc++-9-dev
EOF

COPY --from=node /usr/local/include/ /usr/local/include/
COPY --from=node /usr/local/lib/ /usr/local/lib/
COPY --from=node /usr/local/bin/ /usr/local/bin/

RUN corepack disable && corepack enable

WORKDIR /app
RUN mkdir /data

COPY --from=build-stage /osrm/data /data/
COPY app/package.json /app/

# Setup environments
ARG REGION_VERSION
ENV REGION_VERSION=$REGION_VERSION

RUN rm -rf node_modules
RUN yarn install

# Bundle app source (doesn't require of installing the node_modules again)
COPY app/src /app/src

EXPOSE 5050

CMD ["yarn", "start"]