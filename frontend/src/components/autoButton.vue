<template>
  <button 
    class="btnAuto" 
    v-bind:class="{active: $store.state.controls.autoSteer }"
    @click="toggleAuto"
    :disabled="!isAutosteerAllowed"
  >Auto</button>
</template>

<script>
export default {
  name: 'autoButton',
  data: function() {
    return{
      isAutosteerAllowed: false,
    }    
  },
  methods:{
    toggleAuto(){
      this.$store.commit('toggleAutosteer');
      this.$socket.client.emit('isAutosteerEnabled', this.$store.state.controls.autoSteer);
    }
  },
  sockets: {
    isAutosteerAllowed(isAutosteerAllowed){
      this.isAutosteerAllowed = isAutosteerAllowed;
    }
  },
  mounted(){
    this.$socket.client.emit('getIsAutosteerAllowedStatus');
  }
}
</script>

<style lang="scss" scoped>
  .btnAuto{
    height: 50px;
    user-select: none;
    color: white;
    background-color: #904CAF;
    border: none;
    font-size: 20px;
    width: 100px;
    outline: none;
    &.active{
      background-color: red;
    }
    &:disabled {
      background-color: gray;
    }
  }
</style>
