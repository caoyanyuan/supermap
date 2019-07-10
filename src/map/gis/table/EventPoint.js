import PointAbs from './PointAbs'

export default class ShipPoint extends PointAbs {
    static type = '事件'
    static entites = null

    constructor ( {
        eventName,
        loc,
        type,
        detail
    } ) {
        let option = {
            eventName, loc, type, detail
        }

        super( {} )
        Object.assign( this, option )
    }

    createEntity () {}
    draw () {}
}
