<template>
  <div id="svg"></div>
</template>

<script>
  import Map from '@/inc/map.js';
  export default {
    name: 'Map',
    data: function(){
      return {
        map: undefined,
        dataReceived: false,
      }
    },
    mounted() {
        this.map = Map();
        this.$socket.emit('getSVGData');

    },
    sockets: {
      connect(){
        console.log("socketioconnnected");
      },
      disconnect(){
        console.log("socketiodisconnected");
      },
      svg_data(data){
        this.map.drawLinesAndABpoints(data.xyLines, data.xyPointA, data.xyPointB);
        this.dataReceived = true;
      },
      draw_vehicle(data){
        if(!this.dataReceived){return}
        this.map.drawVehicle(-data.xyCurr.x, data.xyCurr.y, data.driveBearing);
        this.map.TRANSFORMSVGGROUP.setRotation(-data.driveBearing);
        this.map.TRANSFORMSVGGROUP.setPosition(-data.xyCurr.x, data.xyCurr.y);
      },
      xyClosestLine(data){
        if(this.$router.currentRoute.path !== "/"){
          return
        }
        if(!this.dataReceived){return}
        this.map.drawClosestLine(data);
      }
    },

  }

</script>

<style lang="scss" scoped>
  #svg{
    border: 1px solid gray;
  }
</style>
