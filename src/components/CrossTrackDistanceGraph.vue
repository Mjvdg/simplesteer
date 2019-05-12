<template>
  <div class="small">
    <line-chart 
      @click.native="clearGraph"
      ref='chart' 
      :chart-data="datacollection" 
      graph-title="CrossTrack Distance (cm)"
    />
  </div>
</template>

<script>
import LineChart from '../inc/lineChart.js'
export default {
  name: 'crossTrackDistanceGraph',
  components: {
    LineChart
  },
  data: function(){
    return {
      datacollection:{
<<<<<<< HEAD
=======
        // labels: [],
>>>>>>> 070f2e4f2c3be8c89cf79b95dc70f21c5e183309
        datasets: [
          {
            borderColor: 'rgb(255, 99, 132)',
            data: [],
            fill: false,
            pointRadius: 0,
            borderWidth: 1.5
          },
        ]
      }
    }
  },
  sockets: {
    crossTrackDistance(received){
      this.update(received)
    }
  },
  methods: {
    update(received){
      this.removeOldData();
      this.datacollection.datasets[0].data.push({
         x: new Date(received.date),
         y: received.value,
      })
      this.$refs.chart.render();
    },
    removeOldData() {
      this.datacollection.datasets.forEach((dataset) => {        
          dataset.data = dataset.data.filter(isYoung);
      });      
      function isYoung(history){
          let isYoung = (history.x.getTime() + 60*1000) > new Date().getTime();
          return isYoung;
      }
    },
    clearGraph(){
      this.datacollection.datasets[0].data = [];
      this.$refs.chart.render();
    }
  }
}
</script>

<style lang="scss">
  canvas{
    height: 200px !important;
  }
</style>
