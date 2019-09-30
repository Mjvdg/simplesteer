<template>
  <div id="app">
    <div class="flexContainer">
      <AutoButton />
      <SteeringButtons />
      <ABButtons />
      <MachineWidth />  
    </div>
    <div class="flexContainer">
      <div>
        <GPSinfo v-bind:gps-info="$store.state.info.left" />
        <GPSinfo v-bind:gps-info="$store.state.info.right" />  
      </div>
      <img src="../assets/open-icon.png" width="25"/>
      <img src="../assets/save-icon.png" width="25"/>
      <router-link to="/Settings"><img src="../assets/settings.png" width="25" height="25"/></router-link>     
      <div class="zoombuttons">
        <button @click="zoomIn">+</button>
        <button @click="zoomOut">-</button>
      </div>
    </div>
    <Map2 />
    <!-- <TravelMap class="travel-map"/> -->
    <DataGrid />
    <CrossTrackDistanceGraph />
    <ConnectionStatus />    
  </div>
</template>

<script>
// import HelloWorld from './components/HelloWorld.vue'
// @ is an alias to /src
import SteeringButtons from "@/components/SteeringButtons.vue"
import AutoButton from "@/components/autoButton.vue"
import ABButtons from "@/components/ABButtons.vue"
import MachineWidth from "@/components/MachineWidth.vue"
import ConnectionStatus from "@/components/ConnectionStatus.vue"
import GPSinfo from "@/components/GPSinfo.vue"
import Map2 from "@/components/Map2.vue"
// import TravelMap from "@/components/TravelMap.vue"
import DataGrid from '@/components/DataGrid.vue'
import CrossTrackDistanceGraph from '@/components/CrossTrackDistanceGraph.vue'
import { EventBus } from '@/event-bus'
export default {
  name: 'home',
  components: {
    SteeringButtons,
    AutoButton,
    ABButtons,
    MachineWidth,
    ConnectionStatus,
    GPSinfo,
    Map2,
    // TravelMap,
    DataGrid,
    CrossTrackDistanceGraph
  },
  computed:{
    count() {
      return this.$store.state.count;
    }
  },
  methods: {
    zoomIn: () => EventBus.$emit('zoomIn'),
    zoomOut: () => EventBus.$emit('zoomOut'),
  }
}
</script>

<style lang="scss">
  // @import '/src/assets/css/normalize.css';
  body{
    box-sizing: border-box;
  }
  a{
    margin-bottom:0px !important; 
  }
  .flexContainer{
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: flex-end;
    &>*{
      margin-bottom: 5px;
    }
  }
  .row2{
    display: flex;
    justify-content: space-between;
  }

  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    color: #2c3e50;
  }
  .zoombuttons{
    button{
      width: 25px;
    }
  }
  .travel-map {
    height: 400px;
  }
</style>