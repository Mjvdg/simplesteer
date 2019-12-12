<template>
  <div>
    <line-chart
      class="steeringGraph"
      @click.native="clearGraph"
      ref="chart"
      :chart-data="datacollection"
      graph-title="Steering (deg)"
    />
  </div>
</template>

<script>
import LineChart from "../inc/lineChart.js";
export default {
  name: "SteeringGraph",
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
          },
          {
            borderColor: "rgb(0, 99, 255)",
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
    currentSteeringAngle(received) {
      this.updateCurrentSteeringAngle(received);
    },
    targetSteeringAngle(received) {
      this.updateTargetSteeringAngle(received);
    },
    currentWheelAngleHistory(data) {
      data.forEach(wheelAngle => {
        this.addSteeringAngleToGraph(wheelAngle);
      });
    },
    steeringHistory({steeringHistorys, targetHistorys}){
      this.clearGraph();
      steeringHistorys.forEach(data => {
        this.addSteeringAngleToGraph(data);
      });
      targetHistorys.forEach(data => {
        this.addTargetWheelAngleToGraph(data);
      });
    }
  },
  methods: {
    updateCurrentSteeringAngle(received) {
      this.addSteeringAngleToGraph(received);
    },
    updateTargetSteeringAngle(received) {
      this.removeOldData();
      this.addTargetWheelAngleToGraph(received);
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
      this.datacollection.datasets[1].data = [];
      this.$refs.chart.render();
    },
    addSteeringAngleToGraph(data) {
      this.datacollection.datasets[0].data.push({
        x: new Date(data.date),
        y: data.value
      });
    },
    addTargetWheelAngleToGraph(data) {
      this.datacollection.datasets[1].data.push({
        x: new Date(data.date),
        y: data.value
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.steeringGraph {
  height: 150px !important;
}
</style>
