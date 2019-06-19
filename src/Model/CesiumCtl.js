/**
 * @file 超图二次封装
 */

// import { once } from 'lodash'
import MapCtl from './Class/MapCtl'


// 判断是否加载 cesiumCtl
if ( window.Cesium ) {
    console.log( '>>> Cesium.js loaded.' )
} else {
    console.error( 'Cesium.js 加载失败.' )
}

// 默认的地图控制器
export default new MapCtl( {
    detail: '默认地图的控制器.'
} )

