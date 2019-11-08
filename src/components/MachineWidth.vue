<template>
  <div class="machine_width">
    <span>width (cm): </span>
    <input type="number" 
      v-model="width"
      @blur="updateWidth"
      @keyup.enter="blur"
    >
  </div>  
</template>

<script>
export default {
  name: 'machineWidth',
  methods: {
    updateWidth: function () {
      this.$io.emit('machineWidth', this.width);
    },
    blur: function (event) {
      event.target.blur(); //closeKeyboard
    }
  },
  mounted(){
    this.$io.emit('getMachineWidth');
  },
  data: function(){
    return {
      width: undefined
    }
  },
  sockets: {
    machineWidth(val) {
      this.width = val;
    }
  },
}
</script>

<style lang="scss" scoped>
  .machine_width{
    background-color: #ffa500;
    padding: 0 10px;
    line-height: 50px;
    input{
      background-color: white;
      width: 55px;
      height: 30px;
    }
  }
</style>
