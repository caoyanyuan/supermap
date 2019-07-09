import Entites from '@/map/Model/Entites'
import ShipAllAbs from '@/map/gis/table/ShipAllAbs'


let allEns = new Entites ( {
    ctl: null,
    detail: '首页所有.',
    opt: {
        billboardOpt: {
            image: '/static/img/large-screen/ais.png',
            width: Entites.scaleW * 12 * 2,
            height: Entites.scaleW * 13 * 2,
            ...Entites.billboardOpt,
        }
    }
} )

