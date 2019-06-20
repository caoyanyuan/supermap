import Vue from 'vue'
import Router from 'vue-router'
import SuperMap from '@/views/superMap/index'
import Health from '@/views/superMap/health/health'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'SuperMap',
      component: SuperMap
    },
    {
        path: '/health',
        name: 'Health',
        component: Health
      }
  ]
})
