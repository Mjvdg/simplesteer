<template>
  <div class="lineOffset">
    <span>offset (cm): </span>
    <input type="number" 
      v-model.number="offset"
      @blur="updateOffset"
      @keyup.enter="blur"
    >
  </div>  
</template>

<script>
export default {
  name: 'lineOffset',
  methods: {
    updateOffset: function () {
      this.$io.emit('lineOffset', this.offset/100);
    },
    blur: function (event) {
      event.target.blur(); //closeKeyboard
    }
  },
  mounted(){
    this.$io.emit('getLineOffset');
  },
  data: function(){
    return {
      offset: undefined
    }
  },
  sockets: {
    lineOffset(val) {
      this.offset = val * 100;
    }
  },
}
</script>

<style lang="scss" scoped>
  .lineOffset{
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
