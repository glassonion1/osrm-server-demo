# OSRM server demo
A brief example to combine OSRM with Express (NodeJs) to build your own
production-ready instance.

It is based on [Open Source Routing Machine (OSRM)](https://project-osrm.org)
and [Express](http://expressjs.com/).

## Run osrm server
Use docker compose.
```
$ docker compose up
```

## API Endpoints

This example application has 3 different endpoints

* `GET /health`: A simple ping endpoint to check that the server is running.

* `POST /route`: Implements calls to `osrm.route` to calculate the way from A to B.

  _Example body_:
  ```
    { coordinates: [[13.3905, 52.5205], [13.3906, 52.5206]] }
  ```

* `POST /match`: Implements calls to `osrm.match` to calculate the most plausible way.

  _Example body_:
  ```
    { coordinates: [[139.892358, 37.500563], [139.892359, 37.500564], [139.89236, 37.500566],] }
  ```

## Use API
Execute curl command
```
$ curl -X POST -H "Content-Type: application/json" -d 'sample.json' localhost:5050/api/match
```

## Build the docker image
Build the docker image.
```
$ docker build ./ --build-arg REGION_VERSION=tohoku-221024 -t asia-northeast1-docker.pkg.dev/osrm-server-demo/osrm-server
```
