import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store' //added by: vue add vuex
import VueSocketIOExt from 'vue-socket.io-extended'
import io from 'socket.io-client'
import SVG from '@svgdotjs/svg.js'
Vue.config.productionTip = false

Vue.prototype.$io = io(window.location.protocol + '//' + window.location.hostname + ':3000/', {transports: ['websocket']});
Vue.use(  
  VueSocketIOExt,
  Vue.prototype.$io,
  { store },
  SVG
);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')


