import AreaAbs from './AreaAbs'
import parkEn from '@map/entity/park'

export default class ParkPoint extends AreaAbs {
    static type = '泊位管理'
    static entites = parkEn
    static promise = new Promise( ( resolve, reject ) => ParkPoint.resolve = resolve )

    constructor ( {
        parkName = '',
        type = '',
        parkCount = 0,
        parkCounted = 0,
        positions = [],
        opt = {},
    } = {}, data = {} ) {
        let option = {
            parkName, type, parkCount, parkCounted, opt
        }

        super( {
            _default: {
                outlineColor: [ 255 / 255, 171 / 255, 26 / 255, 1 ],
                bgc: [ 255 / 255, 171 / 255, 26 / 255, .8 ],
            },
            positions ,
            label: parkName
        }, data )
        Object.assign( this, option )
    }
}
