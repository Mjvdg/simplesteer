<template>
  <div class="steeringbuttons">
    <button 
      @touchstart.prevent="leftPressed"
      @mousedown.prevent="leftPressed"
      @touchend.prevent="leftReleased"
      @mouseup.prevent="leftReleased"
      v-bind:class="{ active: $store.state.controls.turnLeft }"
      :disabled="$store.state.controls.autoSteer"
    >Left</button>
    <button 
      @touchstart.prevent="rightPressed"
      @mousedown.prevent="rightPressed"
      @touchend.prevent="rightReleased"
      @mouseup.prevent="rightReleased"
      v-bind:class="{ active: $store.state.controls.turnRight }"
      :disabled="$store.state.controls.autoSteer"
    >Right</button>
  </div>
</template>

<script>
export default {
  name: 'steeringButtons',
  components:{

  },
  data: function() {
    return{

    }
  },
  methods:{
    leftPressed: function () {
      this.$store.commit('startTurnLeft');      
      this.$socket.emit('turnLeft');
    },
    leftReleased: function(){
      this.$store.commit('stopTurnLeft');
      this.$socket.emit('turnStop');
    },
    rightPressed: function(){
      this.$store.commit('startTurnRight');
      this.$socket.emit('turnRight');
    },
    rightReleased: function(){
      this.$store.commit('stopTurnRight');
      this.$socket.emit('turnStop');
    }
  }
}
</script>

<style lang="scss" scoped>
  .steeringbuttons{
    display: flex;
    height: 50px;
    width: 130px;
    justify-content: space-around;
    
    button{
      border: none;
      background-color: #4CAF50;
      font-size: 20px;
      
      width: 60px;
      color: white;
      user-select: none;
      outline: none;
      &.active{
        background-color: red;
      }
      &:disabled{
        background-color: gray;
      }
    }
  }
</style>
