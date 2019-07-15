import ShipPointAbs from '../table/ShipPointAbs'
import shipLocalEn from '@map/entity/ship-local'

export default class ShipPoint extends ShipPointAbs {
    static type = "关注渔船-本地."
    static promise = new Promise( ( resolve, reject ) => ShipPoint.resolve = resolve )
    static entites = shipLocalEn
}
