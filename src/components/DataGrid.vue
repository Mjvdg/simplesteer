<template>
  <table>
    <tr>
      <th>XTD:</th>
      <td>{{crossTrackDistance}}cm</td>
    </tr>
    <tr>
      <th>Speed:</th>
      <td>{{currentSpeed}}km/h</td>
    </tr>
    <tr>
      <th>Steering angle:</th>
      <td>{{currentWheelAngle}}°</td>
    </tr>
    <tr>
      <th>Target steering angle:</th>
      <td>{{targetSteeringAngle}}°</td>
    </tr>
    <tr v-bind:class="{disabled: currentLineNumber===undefined}">
      <th>LineNr:</th>
      <td>{{currentLineNumber}}</td>
    </tr>
    <tr>
      <th>Slope:</th>
      <td>{{currentSlope}}°</td>
    </tr>
  </table>
</template>

<script>
export default {
  name: "dataGrid",
  data: function() {
    return {
      crossTrackDistance: 0,
      currentSpeed: 0,
      currentLineNumber: undefined,
      currentWheelAngle: undefined,
      targetSteeringAngle: undefined,
      currentSlope: undefined
    };
  },
  sockets: {
    crossTrackDistance(data) {
      this.crossTrackDistance = parseFloat(data.value).toFixed(2);
    },
    currentSpeed(data) {
      this.currentSpeed = parseFloat(data).toFixed(2);
    },
    currentLineNumber(data) {
      this.currentLineNumber = data;
    },
    currentSteeringAngle(data) {
      this.currentWheelAngle = parseFloat(data.value).toFixed(2);
    },
    currentSlope(data) {
      this.currentSlope = parseFloat(data).toFixed(2);
    },
    targetSteeringAngle(data) {
      this.targetSteeringAngle = parseFloat(data.value).toFixed(2);
    }
  }
};
</script>

<style lang="scss" scoped>
th {
  text-align: left;
}
.disabled {
  color: gray;
}
</style>
