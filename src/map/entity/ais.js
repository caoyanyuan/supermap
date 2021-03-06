/**
 * @file AIS
 */

import Entites from '@/map/Model/Entites'
import local from './ship-local'
import hkm from './ship-hkm'

let entites = new Entites ( {
    detail: 'AIS.',
    opt: {
        billboardOpt: {
            image: '/static/img/large-screen/ais.png',
            width: Entites.scaleW * 56,
            height: Entites.scaleW * 63,
            ...Entites.billboardOpt,
        }
    }
} )

// 首页: 显示的时候, 对应的本地港澳标签也要显示
let _show = entites.show.bind( entites )
entites.show = function () {
    return _show( undefined, ( entity ) => {
        if ( local.visible &&  /0/.test( entity.znvPoint.tab ) ) {
            return true
        } else if ( hkm.visible &&  /1/.test( entity.znvPoint.tab ) ) {
            return true
        }
        return false
    } )
}
// 隐藏的时候如果没有对应的本地港澳标签, 就隐藏
// let _hide = entites.hide.bind( entites )
// entites.hide = function ( ...rest ) {
//     return _hide( ...rest ).then( () => {
//         let localFlag = local.every( ( entity ) => {
//             return !this.ctl.viewer.entities.contains( entity )
//         } )
//         if ( localFlag ) {
//             local._visible = false
//         }
//         let hkmFlag = hkm.every( ( entity ) => {
//             return !this.ctl.viewer.entities.contains( entity )
//         } )
//         if ( hkmFlag ) {
//             hkm._visible = false
//         }
//     } )
// }

// let position = {
//     "lng": "113.91935178526401",
//     "lat": "22.4815807633645",
//     "height": "-0.3762348133844449"
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
