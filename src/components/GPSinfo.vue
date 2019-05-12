<template>
  <div class="info" v-bind:class="{ warning: gpsInfo.quality != 'Fix' }">
    <p>{{ gpsInfo.time }}</p>
    <p>Sats: {{ gpsInfo.satCount }}</p>
    <p>{{ gpsInfo.quality }}</p>
  </div>
</template>

<script>
export default {
  name: 'GPSinfo',
  props: ['gpsInfo']
}
</script>

<style lang="scss" scoped>
  .info{
    display: inline-block;
    font-size: 12px;
    background-color: lightgreen;
    padding: 5px;
    margin-right: 5px;
    width: 70px;
    &.warning{
      background-color: lightcoral;
    }
  }
  p{
    margin: 0;
  }
</style>

