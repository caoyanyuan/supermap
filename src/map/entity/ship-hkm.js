/**
 * @file 船舶-港澳
 */

import CesiumCtl from '@map/Model/CesiumCtl'
import Entites from '@map/Model/Entites'
import ais from './ais'
import beidou from './beidou'

let entites = new Entites ( {
    ctl: null,
    detail: '船舶-港澳.',
    opt: {
        billboardOpt: {
            image: '/static/img/large-screen/boat-pre.png',
            width: Entites.scaleW * 56,
            height: Entites.scaleW * 63,
            ...Entites.billboardOpt,
        }
    }
} )

// 首页: 显示的时候, 对应的 ais, beidou 签也要显示
let _show = entites.show.bind( entites )
entites.show = function () {
    return _show( undefined, ( entity ) => {
        if ( ais.visible && /2/.test( entity.znvPoint.tab ) ) {
            return true
        }
        if ( beidou.visible && /3/.test( entity.znvPoint.tab ) ) {
            return true
        }
        return false
    } )
}

// let _hide = entites.hide.bind( entites )
// entites.hide = function ( ...rest ) {
//     _hide( ...rest ).then( () => {
//         let aisFlag = ais.every( ( entity ) => {
//             return !this.ctl.viewer.entities.contains( entity )
//         } )
//         if ( aisFlag ) {
//             ais._visible = false
//         }
//         let beidouFlag = beidou.every( ( entity ) => {
//             return !this.ctl.viewer.entities.contains( entity )
//         } )
//         if ( beidouFlag ) {
//             beidou._visible = false
//         }
//     } )
// }

// let position = {
//     "lng": "113.91822769069954",
//     "lat": "22.48110818841796",
//     "height": "-0.37613601998893303"
// }

// CesiumCtl.promise.then( () => {
//     entites.add( new Cesium.Entity( {
//         billboard: entites.opt.billboardOpt,
//         position: Cesium.Cartesian3.fromDegrees(
//             +position.lng,
//             +position.lat,
//             +position.height + 1
//         )
//     } ), true )
// } )

export default entites
