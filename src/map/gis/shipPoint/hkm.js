import ShipPointAbs from '../table/ShipPointAbs'
import shipHkmEn from '@map/entity/ship-hkm'

export default class ShipPoint extends ShipPointAbs {
    static type = "关注渔船-港澳."
    static promise = new Promise( ( resolve, reject ) => ShipPoint.resolve = resolve )
    static entites = shipHkmEn
}
