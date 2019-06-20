import PointAbs from './PointAbs'
import shipLocalEn from '@/map/entity/ship-local'
 
export default class ShipPoint extends PointAbs {
    static type = '重点关注渔船'
    static entites = shipLocalEn
    
    static promise = null

    constructor ( option, data = {} ) {

        /*  eventCategory: 0
            eventType: 0
            fileId: 12
            findEndTime: "2019-05-08 15:19:45"
            findStartTime: "2019-05-08 15:19:45"
            findWay: 0
            id: 1
            inOutId: 20
            locationDevice: 0
            orgId: "1001"
            orgName: "南山鱼港"
            remark: "xxx"
            shipName: "test1"
            shipNumber: "111" */

        super( { positions: option.positions }, data )
        Object.assign( this, option )
        this.draw()
    }

    createEntity ( point ) {
        this._createEntity( point )
    }

    _createEntity ( point ) {
        this.entity = new Cesium.Entity( {
            znvPoint: this,
            billboard: this.constructor.entites.opt.billboardOpt,
            position: Cesium.Cartesian3.fromDegrees(
                +point.lng,
                +point.lat,
                +(point.height||0) + 1
            )
        } )
        this.constructor.entites.add( this.entity, true )
    }

    draw () {
        this._draw()
    }

    _draw () {
        this.createEntity( this.positions[ 0 ] )
    }

    /**
     * TODO: 高亮点.
     * 由于是图片, 所以需要 UI 提供图片.
     */
    _hightLight () {
        console.log( `>>> ${this.constructor.type} to hightLight. TODO.` )
        //console.log(this.entity.billboard.image)
        return this
    }

    hightLight() {
        return this._hightLight()
    }


}
