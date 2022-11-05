import requests
import json
import folium

# Open data of aizu public car trips.
# https://map.bumprecorder.com/open_data/aizuwakamatsu
POINTS = [
    [139.892358, 37.500563],
    [139.892368, 37.500592],
    [139.892378, 37.500622],
    [139.892383, 37.500639],
    [139.892389, 37.500653],
    [139.892405, 37.500689],
    [139.892417, 37.500718],
    [139.892431, 37.500749],
    [139.892450, 37.500782],
    [139.892486, 37.500818],
    [139.892549, 37.500838],
    [139.892622, 37.500845],
    [139.892677, 37.500844],
    [139.892748, 37.500837],
    [139.892834, 37.500819],
    [139.893039, 37.500769],
    [139.893416, 37.500661],
    [139.893637, 37.500593],
    [139.894123, 37.500443],
    [139.894614, 37.500299],
    [139.895269, 37.500099],
    [139.896175, 37.499602],
    [139.896646, 37.499209],
]
TIMESTAMPS = [
    1617085222,
    1617085223,
    1617085224,
    1617085225,
    1617085226,
    1617085227,
    1617085228,
    1617085229,
    1617085230,
    1617085231,
    1617085232,
    1617085233,
    1617085234,
    1617085235,
    1617085236,
    1617085237,
    1617085238,
    1617085239,
    1617085240,
    1617085241,
    1617085242,
    1617085243,
    1617085244,
]


def post_api(points, timestamps):
    data = {
        "coordinates": points,
        "timestamps": timestamps,
        "overview": "full",
        "annotations": ["nodes"],
    }
    headers = {"Content-Type": "application/json"}

    res = requests.post(
        "http://localhost:5050/api/match", data=json.dumps(data), headers=headers
    ).json()
    return res


def main():

    res = post_api(POINTS, TIMESTAMPS)
    matchings = res["matchings"]
    tracepoints = res["tracepoints"]

    map = folium.Map(location=[37.500795, 139.892464], zoom_start=16)
    points = []

    for i, t in enumerate(tracepoints):
        if t == None:
            continue
        # index of matchings
        m_index = t["matchings_index"]
        # index of waypoint
        w_index = t["waypoint_index"]
        m = matchings[m_index]
        # Get a leg object. Leg is the route between two waypoints.
        leg_index = 0 if w_index == 0 else w_index - 1
        leg = m["legs"][leg_index]
        nodes = leg["annotation"]["nodes"]
        # Print OSM nodes. see: https://www.openstreetmap.org/node/{node_id}
        print(nodes)

        points.append([t["location"][1], t["location"][0]])

    print(points)
    folium.PolyLine(points, color="blue", weight=3, opacity=1).add_to(map)
    map.save("./map.html")


main()
