<template>
  <span
    v-bind:class="{ connected: $store.state.connection.isConnected, isPing }"
  >{{$store.state.connection.connectionStatus}}</span>
</template>

<script>
export default {
  name: 'connectionStatus',
  data() {
    return {
      isConnected: false,
      isPing: false,
      connectionStatus: 'Connecting...'
    }
  },
  sockets: {
    pingt(data){ //ping is already used
      this.isPing = data;
    }
  },
}
</script>

<style lang="scss" scoped>
  span{
    position: fixed;
    bottom: 0px;
    left: 0px;
    background-color: #FFA500;
    color: white;
    padding: 2px;
    font-size: 8px;
    &.connected{
      background-color: #4CAF50;
      &.isPing{
        background-color: rgb(146, 207, 148);
      }
    }
  }
  
</style>
