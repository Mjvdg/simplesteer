<template>
  <button 
    class="btnAuto" 
    v-bind:class="{active: $store.state.controls.autoSteer }"
    @click="toggleAuto"
  >Auto</button>
</template>

<script>
export default {
  name: 'autoButton',
  data: function() {
    return{
      isAutoEnabled: false,
    }    
  },
  methods:{
    toggleAuto(){
      this.$store.commit('toggleAutosteer');
      // this.isAutoEnabled = !this.isAutoEnabled;
    }
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
  }
</style>
