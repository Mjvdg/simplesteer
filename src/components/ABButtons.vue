<template>
  <div class="ABButtons">
    <button 
      id="btnA" 
      @click="setA"
      v-bind:class="{ isSet: $store.state.controls.A }"
      >A</button>
    <button 
      id="btnB"
      @click="setB"
      v-bind:class="{ isSet: $store.state.controls.B }"
      >B</button>
  </div>
</template>

<script>
export default {
  name: 'abbuttons',
  sockets: {
    connect: function () {
      // console.log('socket connected')     
    },
    customEmit: function (/*data*/) {
      // console.log('this method was fired by the socket server. eg: io.emit("customEmit", data)')
    }
  },
  methods: {
    setA: function() {
      this.$store.commit('setA');
      this.$socket.client.emit('setA');
    },
    setB: function() {
      this.$store.commit('setB');
      this.$socket.client.emit('setB');
    }
  }
}
</script>

<style lang="scss" scoped>
  .ABButtons{
    width: 145px;
    display: flex;
    justify-content: space-between;
    height: 50px;
  }
  button{
    width: 70px;
    border: none;
    color: white;
    font-size: 20px;
    &#btnA {
      background-color: #FFA500;
    }
    &#btnB {
      background-color: #005AFF;
    }
    &.isSet{
      border: 2px solid black;
      box-shadow: inset 0 0 10px black;
    }
    &:active{
      border: 2px solid red;
    }
  }

</style>
