<template>
  <span
    v-bind:class="{ connected: this.isConnected, isPing }"
  >{{connectionStatus}}</span>
</template>

<script>
export default {
  name: 'connectionStatus',
  data: function(){
    return {
      isConnected: false,
      isPing: false,
      connectionStatus: 'Connecting...'
    }
  },
  sockets: {
    ping(data){
      this.isPing = data;
    }
  },
  mounted: function(){
    this.$io.on('connect', () => {
      this.isConnected = true;
      this.connectionStatus = 'Connected';
    });
    this.$io.on('disonnect', () => {
      this.isConnected = false;
      this.connectionStatus = 'Connected';
    });
    this.$io.on('error', () => {
      this.isConnected = false;
      this.connectionStatus= 'Error';
    });
    this.$io.on('reconnecting', () => {
      this.isConnected = false;
      this.connectionStatus= 'Reconnecting...';
    });
    this.$io.on('ping', (isPing) => {
      this.isPing = isPing;
    });
  }
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
