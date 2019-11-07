<template>
    <div id="map"></div>
</template>

<script>
let mapboxgl = require("mapbox-gl/dist/mapbox-gl.js");
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
      accessToken:
        "REPLACE_WITH_MAPBOX_ACCESSTOKEN",
      mapStyle: `mapbox://styles/mapbox/satellite-v9`,
      gpsLeftPosition: [],
      gpsRightPosition: [],
    };
  },
  mounted() {
    mapboxgl.accessToken = this.accessToken;
    let zoomlevel = 18;
    let zoomlevelCookie = this.$cookie.get('mapZoomLevel');
    if(zoomlevelCookie){
      zoomlevel = zoomlevelCookie;
    }
    this.map = new mapboxgl.Map({
      container: "map",
      style: this.mapStyle,
      zoom: zoomlevel,
      center: [4.341533, 50.894923],
      bearingSnap: 0,
      pitchWithRotate: false,
      logoPosition: 'top-left',
      dragRotate: false,
      dragPan: false,
      touchZoomRotate: true,
      doubleClickZoom: false,
    });
    this.map.touchZoomRotate.disableRotation();
    this.map.on('load', () => {
      this.$socket.emit('mapIsReady');
    });    
    this.map.on('zoom', () => {
      this.$cookie.set('mapZoomLevel', this.map.getZoom(), { expires: '1Y' });
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
    setPointAMarker(location){
      if(this.previousPointAMarker){
        this.previousPointAMarker.remove();
      }
      this.previousPointAMarker = new mapboxgl.Marker({
        color: '#FFA500',
      })
        .setLngLat(location)
        .setPopup(new mapboxgl.Popup({
            closeButton: false,            
          })
        )
        .addTo(this.map);
    },
    setPointBMarker(location){
      if(this.previousPointBMarker){
        this.previousPointBMarker.remove();
      }
      this.previousPointBMarker = new mapboxgl.Marker({
        color: '#005AFF',
      })
        .setLngLat(location)
        .addTo(this.map);
    },
    removeLineIfExist(id){
      if (this.map.getLayer(id))
      {
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
    }
  },
  sockets: {
    map_lines(lines) {
      this.drawLine('closestLine', lines.closestLine, 2);
      lines.others.forEach((line, index) => {
        this.drawLine(`line${index}`, line, 1);
        this.drawLine(`line${index}`, line, 1);
      });
    },
    map_ABpoints({pointA, pointB}){
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
    .rightGpsMarker, .leftGpsMarker{
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


