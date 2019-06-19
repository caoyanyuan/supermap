import Vue from 'vue'
import Router from 'vue-router'
import SuperMap from '@/views/superMap/index'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'SuperMap',
      component: SuperMap
    }
  ]
})
