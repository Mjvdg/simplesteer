<template>
  <div class="gpsInfo" v-bind:class="{ lowGpsQualtiy: gpsInfo.quality != 'Fix' }">
    <p>{{ gpsInfo.time }}</p>
    <p>Sats: {{ gpsInfo.satCount }}</p>
    <p>{{ gpsInfo.quality }}</p>
  </div>
</template>

<script>
export default {
  name: "GPSinfo",
  props: ["gpsInfo"]
};
</script>

<style lang="scss" scoped>
.gpsInfo {
  display: inline-block;
  font-size: 12px;
  background-color: lightgreen;
  padding: 5px;
  margin-right: 5px;
  width: 80px;
  &.lowGpsQualtiy {
    background-color: lightcoral;
  }
  p {
    margin-bottom: 0;
  }
}
</style>


