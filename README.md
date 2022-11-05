# OSRM server demo
A brief example to combine OSRM with Express (NodeJs) to build your own
production-ready instance.

It is based on [Open Source Routing Machine (OSRM)](https://project-osrm.org)
and [Express](http://expressjs.com/).

![route image](img/route.png "sample")

## Starting the server
Launch the application with the specified dataset.
```
$ docker compose up
```

## API Endpoints

This example application has 3 different endpoints

* `GET /health`: A simple ping endpoint to check that the server is running.

* `POST /api/route`: Implements calls to `osrm.route` to calculate the way from A to B.

  _Example body_:
  ```
    { coordinates: [[140.1781984, 37.9174683], [140.054293, 37.881392]] }
  ```

* `POST /api/match`: Implements calls to `osrm.match` to calculate the most plausible way.

  _Example body_:
  ```
    { coordinates: [[139.892358, 37.500563], [139.892359, 37.500564], [139.89236, 37.500566],] }
  ```

### Curl command example
```
$ curl -X POST -H "Content-Type: application/json" -d '@json/route.json' localhost:5050/api/route
$ curl -X POST -H "Content-Type: application/json" -d '@json/match.json' localhost:5050/api/match
```

### Python example
```
$ cd client
$ python sample.py
```

## Build the docker image
Build the docker image.
```
$ DOCKER_BUILDKIT=1 docker build ./ --build-arg REGION_VERSION=tohoku-221104 -t osrm-server-demo
```
