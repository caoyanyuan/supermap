import Router from 'vue-router'
import SuperMap from '@/views/superMap/index'
import Health from '@/views/superMap/health/health'
import Vue from "vue"

const Gis = () => import('@/views/gis')
const track = () => import('@/views/track')

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'SuperMap',
      component: SuperMap,
      children: [
        {
          path: 'gis',
          name: 'gis',
          component: Gis
        },
        {
          path: 'track',
          name: 'track',
          component: track
        }
      ]
    },
    {
        path: '/health',
        name: 'Health',
        component: Health
      }
  ]
})
