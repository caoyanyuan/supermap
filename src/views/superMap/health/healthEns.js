/**
 * @file 卫生管理
 */

import Entites from '@/map/Model/Entites'

let entites = new Entites ( {
    ctl: null,
    detail: '船舶-本地.',
    opt: {
        billboardOpt: {
            //image: '/static/img/large-screen/boat-nor.png',
            image: '/static/img/large-screen/ship.png',
            width: Entites.scaleW * 56,
            height: Entites.scaleW * 63,
            ...Entites.billboardOpt,
        }
    }
} )

export default entites
