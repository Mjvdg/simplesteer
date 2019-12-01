import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store' //added by: vue add vuex
import VueSocketIOExt from 'vue-socket.io-extended'
import io from 'socket.io-client'
import BaseConnectionStatus from '@/components/BaseConnectionStatus.vue';
import VueCookie from 'vue-cookie';
import vuetify from './plugins/vuetify';
import 'typeface-roboto/index.css';
//import SVG from '@svgdotjs/svg.js'
Vue.config.productionTip = false
Vue.component('BaseConnectionStatus', BaseConnectionStatus);
Vue.prototype.$io = io(window.location.protocol + '//' + window.location.hostname + ':3000/', {transports: ['websocket']});

Vue.use(  
  VueSocketIOExt,
  Vue.prototype.$io,
  { store },
);

Vue.use(VueCookie);
new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')


