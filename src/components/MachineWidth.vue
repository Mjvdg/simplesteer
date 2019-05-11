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
      this.$store.commit('updateWidth', this.width);
    },
    blur: function (event) {
      event.target.blur(); //closeKeyboard
    }
  },
  data: function(){
    return {
      width: 0
    }
  },
  created: function(){
    this.width = this.$store.state.settings.machineWidth;
  }
}
</script>

<style lang="scss" scoped>
  .machine_width{
    background-color: #ffa500;
    padding: 0 10px;
    line-height: 50px;
    input{
      width: 55px;
      height: 30px;
    }
  }
</style>
