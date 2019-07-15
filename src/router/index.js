import Vue from 'vue'
import Router from 'vue-router'
import SuperMap from '@/views/superMap/index'
import Health from '@/views/superMap/health/health'

const Gis = () => import('@/views/gis')
const Playback = () => import('@/views/track')

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
          path: 'playback',
          name: 'playback',
          component: Playback
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
