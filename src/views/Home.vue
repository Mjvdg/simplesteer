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
    </div>
    <Map5 />
    <DataGrid />
    <CrossTrackDistanceGraph />
  </div>
</template>

<script>
// import HelloWorld from './components/HelloWorld.vue'
// @ is an alias to /src
import SteeringButtons from "@/components/SteeringButtons.vue"
import AutoButton from "@/components/autoButton.vue"
import ABButtons from "@/components/ABButtons.vue"
import MachineWidth from "@/components/MachineWidth.vue"
import GPSinfo from "@/components/GPSinfo.vue"
import Map5 from "@/components/Map5.vue"
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
    GPSinfo,
    Map5,
    DataGrid,
    CrossTrackDistanceGraph
  },
  computed:{
    count() {
      return this.$store.state.count;
    }
  },
  methods: {

  }
}
</script>

<style lang="scss" scoped>
  // @import '/src/assets/css/normalize.css';

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

  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    color: #2c3e50;
    padding: 5px;
  }

</style>