<template>
  <div>
    <line-chart
      class="crossTrackDistanceGraph"
      @click.native="clearGraph"
      ref="chart"
      :chart-data="datacollection"
      graph-title="CrossTrack Distance (cm)"
    />
  </div>
</template>

<script>
import LineChart from "../inc/lineChart.js";
export default {
  name: "crossTrackDistanceGraph",
  components: {
    LineChart
  },
  data: function() {
    return {
      datacollection: {
        datasets: [
          {
            borderColor: "rgb(255, 99, 132)",
            data: [],
            fill: false,
            pointRadius: 0,
            borderWidth: 1.5
          }
        ]
      }
    };
  },
  sockets: {
    crossTrackDistance(received) {
      this.update(received);
    },
    crossTrackDistanceHistory(data) {
      data.forEach(crosstrackDistance => {
        this.addToDataGraph(crosstrackDistance);
      });
    }
  },
  methods: {
    update(received) {
      this.removeOldData();
      this.addToDataGraph(received);
      this.$refs.chart.render();
    },
    removeOldData() {
      this.datacollection.datasets.forEach(dataset => {
        dataset.data = dataset.data.filter(isYoung);
      });
      function isYoung(history) {
        let isYoung = history.x.getTime() + 60 * 1000 > new Date().getTime();
        return isYoung;
      }
    },
    clearGraph() {
      this.datacollection.datasets[0].data = [];
      this.$refs.chart.render();
    },
    addToDataGraph(data) {
      this.datacollection.datasets[0].data.push({
        x: new Date(data.date),
        y: data.value
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.crossTrackDistanceGraph {
  height: 150px !important;
}
</style>
