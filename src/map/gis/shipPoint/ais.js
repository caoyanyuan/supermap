import ShipPointAbs from '../table/ShipPointAbs'
import ens from '@map/entity/ais'

export default class ShipPoint extends ShipPointAbs {
    static type = "关注渔船-ais."
    static promise = new Promise( ( resolve, reject ) => ShipPoint.resolve = resolve )
    static entites = ens
}
