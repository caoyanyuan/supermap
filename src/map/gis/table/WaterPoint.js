import AreaAbs from './AreaAbs'
import waterEn from '@map/entity/water'

export default class WaterPoint extends AreaAbs {
    static type = '敏感水域'
    static entites = waterEn
    static promise = new Promise( ( resolve, reject ) => WaterPoint.resolve = resolve )

    constructor ( {
        name, loc, startDate, detail, positions, number
    } = {}, data = {} ) {
        let option = {
            name, loc, startDate, detail, number
        }

        super( {
            _default: {
                outlineColor: [ 255 / 255, 204 / 255, 0, 1 ],
                bgc: [ 87 / 255, 49 / 255, 46 / 255, .7 ],
            },
            positions,
            label: name,
        }, data )
        Object.assign( this, option )
    }
}
