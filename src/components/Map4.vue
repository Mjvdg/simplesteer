<template>
  <MglMap
    container="mapb"
    :accessToken="accessToken"
    :mapStyle="mapStyle"
    :center="mapCenter"
    :zoom="18"
    :bearing="bearing"
    :pitch="60"
  >
    <MglMarker :coordinates="gpsLeftPosition" color="blue" />
    <MglMarker :coordinates="gpsRightPosition" color="red" />

    <MglGeojsonLayer
      v-for="geoJSONLine in geoJSONLines"
      :key="geoJSONLine.data.id"
      :source="geoJSONLine"
      :sourceId="'source1'+geoJSONLine.data.id"
      :layerId="'layer'+geoJSONLine.data.id"
      :layer="geoJsonLayer"
    />


    <MglGeojsonLayer
      v-if="lines.abLine"
      :source="getGeoJsonLine('abLine', prepareLineFromServer(lines.abLine))"
      :sourceId="'source1'"
      :layerId="'layer'"
      :layer="geoJsonLayer"
    />
    <MglGeojsonLayer
      :source="getGeoJsonLine('line2', prepareLineFromServer(lines.line2))"
      :sourceId="'source1'"
      :layerId="'layer'"
      :layer="geoJsonLayer"
    />
    <MglGeojsonLayer
      :source="getGeoJsonLine('line1', prepareLineFromServer(lines.line1))"
      :sourceId="'source1'"
      :layerId="'layer'"
      :layer="geoJsonLayer"
    />
    <MglGeojsonLayer
      :source="getGeoJsonLine('closestLine', prepareLineFromServer(lines.closestLine))"
      :sourceId="'sourceClosestLine'"
      :layerId="'layerClosestLine'"
      :layer="geoJsonLayer"
    />
    
  </MglMap>
</template>

<script>
import { MglMap, MglMarker, MglGeojsonLayer } from "vue-mapbox";
export default {
  name: "Map4",
  components: {
    MglMap,
    MglMarker,
    MglGeojsonLayer
  },
  data() {
    return {
      map: undefined,
      bearing: 0,
      accessToken:
        "REPLACE_WITH_MAPBOX_ACCESSTOKEN",
      mapStyle: `mapbox://styles/mapbox/satellite-v9`,
      mapCenter: [0, 0],
      gpsLeftPosition: [],
      gpsRightPosition: [],
      geoJSONLines: [],
      geoJsonLayer: {
        type: "line",
        paint: {
          "line-color": "#f00",
          "line-width": 2
        }
      },
      lines: {
        abLine: {},
        closestLine: {},
        line1: {},
        line2: {}
      }

    };
  },
  mounted(){
    this.map = MglMap;
  },
  methods: {
    getGeoJsonLine(lineName, line){
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
      }
    },
    prepareLineFromServer(line){
      return  [line.A.longitude, line.A.latitude],
              [line.B.longitude, line.B.latitude]
    }
  },
  sockets: {
    svg_data({ lines, PointA, PointB }) {
      this.lines = lines;
      // let abLine = lines.abLine;
      // let closestLine = lines.closestLine;
      // let line1 = lines.line1;
      // let line2 = lines.line2;

      

      // console.log(lines);
      // let parsedMapLines = [];
      // lines.forEach(line => {
      //   parsedMapLines.push([
      //     [line.A.longitude, line.A.latitude],
      //     [line.B.longitude, line.B.latitude]
      //   ]);
      // });
      // this.geoJSONLines = [];
      // parsedMapLines.forEach((line, i) => {
      //   console.log(line);
      //   let lineName = "line" + i;
      // });
      
    },
    current_location({
      currentLocation,
      leftLocation,
      rightLocation,
      driveBearing
    }) {
      this.mapCenter = [currentLocation.longitude, currentLocation.latitude];
      this.gpsLeftPosition = [leftLocation.longitude, leftLocation.latitude];
      this.gpsRightPosition = [rightLocation.longitude, rightLocation.latitude];
      this.bearing = driveBearing;
    }
  }
};
</script>

<style lang="scss">
.leftGPSmarker{
  content: ' \25CF';
  font-size: 200px;
}
.mgl-map-wrapper {
  height: 500px;
}
</style>


