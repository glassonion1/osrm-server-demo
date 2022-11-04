# OSRM server demo

## Run OSRM server
use docker compose.
```
$ docker compose up
```

## Use API
execute curl command
```
$ curl -X POST -H "Content-Type: application/json" -d 'sample.json' localhost:5050/api/match
```
