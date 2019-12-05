<template>
  <div id="map"></div>
</template>

<script>
let mapboxgl = require("mapbox-gl/dist/mapbox-gl.js");
const turf = require("@turf/turf");
export default {
  name: "Map5",
  components: {},
  data() {
    return {
      map: undefined,
      previousLeftGpsMarker: undefined,
      previousRightGpsMarker: undefined,
      previousCurrentLocationMarker: undefined,
      previousPointAMarker: undefined,
      previousPointBMarker: undefined,
      previousTargetPointMarker: undefined,
      previousWheelPositionMarker: undefined,
      accessToken:
        "REPLACE_WITH_MAPBOX_ACCESSTOKEN",
      mapStyle: `mapbox://styles/mapbox/satellite-v9`,
      gpsLeftPosition: [],
      gpsRightPosition: []
    };
  },
  mounted() {
    mapboxgl.accessToken = this.accessToken;
    let zoomlevel = 18;
    let zoomlevelCookie = this.$cookie.get("mapZoomLevel");
    if (zoomlevelCookie) {
      zoomlevel = zoomlevelCookie;
    }
    this.map = new mapboxgl.Map({
      container: "map",
      style: this.mapStyle,
      zoom: zoomlevel,
      center: [4.341533, 50.894923],
      bearingSnap: 0,
      pitchWithRotate: false,
      logoPosition: "top-left",
      dragRotate: false,
      dragPan: false,
      touchZoomRotate: true,
      doubleClickZoom: false
    });
    this.map.touchZoomRotate.disableRotation();
    this.map.on("load", () => {
      this.$socket.client.emit("mapIsReady");
    });
    this.map.on("zoom", () => {
      this.$cookie.set("mapZoomLevel", this.map.getZoom(), { expires: "1Y" });
    });
  },
  methods: {
    getGeoJsonLine(lineName, line) {
      return {
        type: "geojson",
        data: {
          id: lineName,
          type: "Feature",
          properties: {},
          geometry: {
            type: "LineString",
            coordinates: line
          }
        }
      };
    },
    prepareLineFromServer(line) {
      return (
        [line.A.longitude, line.A.latitude], [line.B.longitude, line.B.latitude]
      );
    },
    setLeftGpsMarker(location) {
      if (this.previousLeftGpsMarker) {
        this.previousLeftGpsMarker.remove();
      }
      let el = document.createElement("div");
      el.className = "leftGpsMarker";
      this.previousLeftGpsMarker = new mapboxgl.Marker(el)
        .setLngLat(location)
        .addTo(this.map);
    },
    setRightGpsMarker(location) {
      if (this.previousRightGpsMarker) {
        this.previousRightGpsMarker.remove();
      }
      let el = document.createElement("div");
      el.className = "rightGpsMarker";
      this.previousRightGpsMarker = new mapboxgl.Marker(el)
        .setLngLat(location)
        .addTo(this.map);
    },
    setTargetPointMarker(location) {
      this.removeTargetPointMarkerIfExist();
      let el = document.createElement("div");
      el.className = "mdi mdi-target targetPointMarker";

      this.previousTargetPointMarker = new mapboxgl.Marker(el)
        .setLngLat(location)
        .addTo(this.map);
    },
    setWheelPositionMarker(location) {
      if (this.previousWheelPositionMarker) {
        this.previousWheelPositionMarker.remove();
      }
      let el = document.createElement("div");
      //el.className = "mdi mdi-circle-double wheelPositionMarker";
      el.className = "wheelPositionMarker";
      el.innerHTML = "<span>&#8593;</span>";
      this.previousWheelPositionMarker = new mapboxgl.Marker(el)
        .setLngLat(location)
        .addTo(this.map);
    },
    setCurrentLocationMaker(location) {
      if (this.previousCurrentLocationMarker) {
        this.previousCurrentLocationMarker.remove();
      }
      let el = document.createElement("div");
      el.className = "currentLocationMarker";
      this.previousCurrentLocationMarker = new mapboxgl.Marker(el)
        .setLngLat(location)
        .addTo(this.map);
    },
    setPointAMarker(location) {
      this.removePointAMarkerIfExist();
      this.previousPointAMarker = new mapboxgl.Marker({
        color: "#FFA500"
      })
        .setLngLat(location)
        .setPopup(
          new mapboxgl.Popup({
            closeButton: false
          })
        )
        .addTo(this.map);
    },
    setPointBMarker(location) {
      this.removePointBMarkerIfExist();
      this.previousPointBMarker = new mapboxgl.Marker({
        color: "#005AFF"
      })
        .setLngLat(location)
        .addTo(this.map);
    },
    removeLineIfExist(id) {
      if (this.map.getLayer(id)) {
        this.map.removeLayer(id);
        this.map.removeSource(id);
      }
    },
    drawLine(id, line, size) {
      this.removeLineIfExist(id);
      this.map.addLayer({
        id: id,
        type: "line",
        source: {
          type: "geojson",
          data: {
            type: "Feature",
            properties: {},
            geometry: {
              type: "LineString",
              coordinates: line
            }
          }
        },
        paint: {
          "line-color": "#f00",
          "line-width": size
        }
      });
      let turfBearing = turf.rhumbBearing(line[0], line[1]);
      let extendedA = this.extend(line[0], turfBearing + 180);
      let extendedB = this.extend(line[1], turfBearing);
      this.drawExtension(id + "extA", [line[0], extendedA], size);
      this.drawExtension(id + "extB", [line[1], extendedB], size);
    },
    drawExtension(id, line, size) {
      this.removeLineIfExist(id);
      this.map.addLayer({
        id: id,
        type: "line",
        source: {
          type: "geojson",
          data: {
            type: "Feature",
            properties: {},
            geometry: {
              type: "LineString",
              coordinates: line
            }
          }
        },
        paint: {
          "line-color": "#f00",
          "line-width": size,
          "line-dasharray": [2, 2]
        }
      });
    },
    drawCurvedLine(id, line) {
      this.removeLineIfExist(id);
      this.map.addLayer({
        id: id,
        type: "line",
        source: {
          type: "geojson",
          data: {
            type: "Feature",
            properties: {},
            geometry: {
              type: "LineString",
              coordinates: line
            }
          }
        },
        paint: {
          "line-color": "#f00",
          "line-width": 2
        }
      });
    },
    extend(point, bearing) {
      let p = turf.point(point);
      let options = { units: "kilometers" };
      let extended = turf.rhumbDestination(p, 1, bearing, options);
      return extended.geometry.coordinates;
    },
    removePointAMarkerIfExist() {
      if (this.previousPointAMarker) {
        this.previousPointAMarker.remove();
      }
    },
    removePointBMarkerIfExist() {
      if (this.previousPointBMarker) {
        this.previousPointBMarker.remove();
      }
    },
    removeTargetPointMarkerIfExist() {
      if (this.previousTargetPointMarker) {
        this.previousTargetPointMarker.remove();
      }
    }
  },
  sockets: {
    map_lines(lines) {
      this.drawLine("closestLine", lines.closestLine, 2);
      lines.others.forEach((line, index) => {
        this.drawLine(`straightLine${index}`, line, 1);
      });
    },
    map_ABpoints({ pointA, pointB }) {
      this.setPointAMarker(pointA);
      this.setPointBMarker(pointB);
    },
    current_location({
      currentLocation,
      leftLocation,
      rightLocation,
      driveBearing
    }) {
      let currentLocationLonLat = [
        currentLocation.longitude,
        currentLocation.latitude
      ];
      this.map.setCenter(currentLocationLonLat);

      this.setCurrentLocationMaker(currentLocationLonLat);
      this.setLeftGpsMarker([leftLocation.longitude, leftLocation.latitude]);
      this.setRightGpsMarker([rightLocation.longitude, rightLocation.latitude]);

      this.map.setBearing(driveBearing);
    },
    targetPointLocation({ targetPointLocation, wheelPosition }) {
      this.setTargetPointMarker(targetPointLocation);
      this.setWheelPositionMarker(wheelPosition);
    },
    curvedAbLine(curvedAbLine) {
      this.drawCurvedLine("curvedLine", curvedAbLine);
    },
    clearMap() {
      this.removeLineIfExist("straightLine0");
      this.removeLineIfExist("straightLine1");
      this.removeLineIfExist("closestLine");
      this.removeLineIfExist("straightLine0extA");
      this.removeLineIfExist("straightLine1extA");
      this.removeLineIfExist("closestLineextA");
      this.removeLineIfExist("straightLine0extB");
      this.removeLineIfExist("straightLine1extB");
      this.removeLineIfExist("closestLineextB");
      this.removeLineIfExist("curvedLine");
      this.removeTargetPointMarkerIfExist();
      this.removePointAMarkerIfExist();
      this.removePointBMarkerIfExist();
    }
  }
};
</script>

<style lang="scss">
#map {
  height: 400px;

  .leftGpsMarker::before {
    content: " \25d0";
  }
  .rightGpsMarker::before {
    content: " \25d1";
  }
  .targetPointMarker {
    font-size: 10px;
    color: white;
    vertical-align: middle;
    text-shadow: 0px 0px 3px #000000;
  }
  .wheelPositionMarker {
    font-size: 10px;
    color: white;
    vertical-align: middle;
    text-shadow: 0px 0px 3px #000000;
  }
  .rightGpsMarker,
  .leftGpsMarker {
    font-size: 10px;
    color: white;
    text-shadow: 0px 0px 3px #000000;
  }
  .currentLocationMarker::before {
    content: " \25B4";
    font-size: 90px;
    color: white;
    text-shadow: 0px 0px 6px #000000;
    opacity: 0.9;
  }
}
</style>


