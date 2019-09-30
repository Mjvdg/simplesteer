<template>
  <div class="map"></div>
</template>

<script>
const loadGoogleMapsApi = require('load-google-maps-api');

export default {
  data() {
    return {
      
    };
  },

  mounted(){
    loadGoogleMapsApi({key: "HIDDEN_TOKEN"}).then(function (googleMaps) {
      new googleMaps.Map(document.querySelector('.map'), {
        center: {
          lat: 50.951721,
          lng: 2.646615
        },
        zoom: 20,
        mapTypeId: 'hybrid',
        mapTypeControlOptions: {
            mapTypeIds: []
        },
        disableDefaultUI: true,
        gestureHandling: 'cooperative'
      })
    }).catch(function (error) {
      console.error(error)
    })
  }
};
</script>


<style>
  .map {
    height: 500px;
  }
</style>