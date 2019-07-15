/**
 * @file 全部渔船
 */

import Entites from '@map/Model/Entites'

let entites = new Entites ( {
    ctl: null,
    detail: '全部渔船.',
    opt: {
        billboardOpt: {
            image: '/static/img/large-screen/ship.png',
            width: Entites.scaleW * 56,
            height: Entites.scaleW * 63,
            ...Entites.billboardOpt,
        }
    }
} )

export default entites
