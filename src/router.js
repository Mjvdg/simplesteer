import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Settings from './views/Settings.vue'
import OpenField from './views/OpenField.vue'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/settings',
      name: 'settings',
      component: Settings,
    },
    {
      path: '/OpenField',
      name: 'OpenField',
      component: OpenField,
    },
  ]
})
