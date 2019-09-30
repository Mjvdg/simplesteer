import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)


const moduleInfo = {
  state: {
    left: {
      time: '00:00:00:000',
      satCount: 0,
      quality: 'Loading'
    },
    right: {
      time: '00:00:00:000',
      satCount: 0,
      quality: 'Loading'
    }    
  },
  mutations: {
    SOCKET_INFO_LEFT: (state, data) => {
      state.left.time = data.time;
      state.left.satCount = data.satCount;
      state.left.quality = data.quality;
    },
    SOCKET_INFO_RIGHT: (state, data) => {
      state.right.time = data.time;
      state.right.satCount = data.satCount;
      state.right.quality = data.quality;
    },
  }
}

const moduleControls = {
  state: {
    autoSteer: false,
    turnLeft: false,
    turnRight: false,
    A: false,
    B: false,
  },
  mutations: {
    startTurnLeft (state){
      state.turnLeft = true;
    },
    stopTurnLeft (state){
      state.turnLeft = false;
    },

    startTurnRight (state){
      state.turnRight = true;
    },
    stopTurnRight (state){
      state.turnRight = false;
    },

    toggleAutosteer(state){
      state.autoSteer = !state.autoSteer;
    },

    setA(state){
      state.A = true;
    },
    setB(state){
      state.B = true;
    },

    SOCKET_AB_IS_SET: (state, data) => {
      state.A = data.A;
      state.B = data.B;
    },
    SOCKET_AUTOSTEER_IS_SET: (state, data) => {
      state.autoSteer = data;
    },
  },
  actions: {},
  getters: {},
}

export default new Vuex.Store({
  strict: false, //disable for production!
  modules:{
    controls: moduleControls,
    info: moduleInfo,
  }
})

