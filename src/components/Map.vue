<template>
  <div id="svg"></div>
</template>

<script>
  import Map from '@/inc/map.js'
  export default {
    name: 'Map',
    data: function(){
      return {
        map: undefined,
      }
    },
    mounted() {
      this.map = Map();
    },
    sockets: {
      connect(){
        // eslint-disable-next-line
        console.log("socketioconnnected");
      },
      svg_data(data){
        this.map.drawLinesAndABpoints(data.xyLines, data.xyPointA, data.xyPointB)
      },
      draw_vehicle(data){
        this.map.drawVehicle(-data.xyCurr.x, data.xyCurr.y, data.driveBearing);
        this.map.TRANSFORMSVGGROUP.setRotation(-data.driveBearing);
        this.map.TRANSFORMSVGGROUP.setPosition(-data.xyCurr.x, data.xyCurr.y);
      },
      xyClosestLine(data){
        this.map.drawClosestLine(data);
      }
    },
    methods: {
      
    }
  }

</script>

<style lang="scss" scoped>
  #svg{
    border: 1px solid gray;
  }
</style>
