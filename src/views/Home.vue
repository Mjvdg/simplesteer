<template>
  <div id="app">
    <v-app>
    <div class="flexContainer">
      <AutoButton />
      <ABButtons v-if="$store.state.settings.mode==='straightABlines'" />
      <CurvedRecordButton v-if="$store.state.settings.mode==='curvedABlines'" />
      <MachineWidth />  
      <LineOffset />
      <WorkRecordButton />
    </div>
    <div class="flexContainer">
      <div>
        <GPSinfo @click.native="test" v-bind:gps-info="$store.state.info.left" />
        <GPSinfo v-bind:gps-info="$store.state.info.right" />  
      </div>
      <Open />
      <Save />
      <v-btn to="/Settings" icon><v-icon color='black' x-large>mdi-tools</v-icon></v-btn>
    </div>
    <Map5/>
    
    <CrossTrackDistanceGraph />
    <SteeringGraph />
    <DataGrid />
    </v-app>
  </div>
</template>

<script>
// import HelloWorld from './components/HelloWorld.vue'
// @ is an alias to /src
import AutoButton from "@/components/autoButton.vue"
import ABButtons from "@/components/ABButtons.vue"
import MachineWidth from "@/components/MachineWidth.vue"
import LineOffset from "@/components/LineOffset.vue"
import GPSinfo from "@/components/GPSinfo.vue"
import Map5 from "@/components/Map5.vue"
import DataGrid from '@/components/DataGrid.vue'
import CrossTrackDistanceGraph from '@/components/CrossTrackDistanceGraph.vue'
import SteeringGraph from '@/components/SteeringGraph.vue'
import CurvedRecordButton from '@/components/CurvedRecordButton.vue';
import WorkRecordButton from '@/components/WorkRecordButton.vue';
import Save from '@/components/Save.vue';
import Open from '@/components/Open.vue';

export default {
  name: 'home',
  components: {
    AutoButton,
    ABButtons,
    MachineWidth,
    LineOffset,
    GPSinfo,
    Map5,
    DataGrid,
    CrossTrackDistanceGraph,
    SteeringGraph,
    CurvedRecordButton,
    Save,
    Open,
    WorkRecordButton
  }
}
</script>

<style lang="scss" scoped>
  // @import '/src/assets/css/normalize.css';
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