import SensorEvent from '../SensorEvent'
import CesiumCtl from '../../Model/CesiumCtl'

// 坐标
export class Point {

    constructor ( { lng = 0, lat = 0, height = 0, ctl = CesiumCtl } = {}, opt = {} ) {
        Object.assign( this, {
            lng, lat, height, ctl, opt
        } )
    }

    // let point = Point.c3ToFd( Point.toC3( event.position ) )

    /**
     * 获取笛卡尔坐标
     * @param { Object } postion event.postion
     */
    static toC3 ( position, ctl = CesiumCtl ) {
        return ctl.viewer.scene.pickPosition( position )
    }

    /**
     * 将笛卡尔坐标装换为经纬度坐标
     * @param { Cesium.viewer.scene.pickPosition }
     */
    static c3ToFd ( position, ctl = CesiumCtl ) {
        let cartographic = Cesium.Cartographic.fromCartesian( position )
        let longitude = Cesium.Math.toDegrees( cartographic.longitude )  // 经度
        let latitude = Cesium.Math.toDegrees( cartographic.latitude )    // 纬度
        let height = cartographic.height // 高度
        // height = height > 0 ? height : 0;

        return new Point ( {
            lng: longitude,
            lat: latitude,
            height: height,
            ctl,
        } )
    }

    /**
     * 获取中心点
     * @param { Array<Object> } positions { lng, lat }
     */
    static getCenter ( positions ) {
        let points = [], polygon, center
        positions.forEach( ( point ) => {
            points.push( new SuperMap.Geometry.Point( +point.lng, +point.lat ) )
        } )
        polygon = new SuperMap.Geometry.Polygon( [
            new SuperMap.Geometry.LinearRing( points )
        ] )
        center = polygon.getBounds().getCenterLonLat()
        center = {
            lng: center.lon, lat: center.lat
        }

        return new Point( center, {
            polygon, positions, points
        } )
    }
}

// 坐标拾取事件对象
export class PickEvent extends SensorEvent {
    static type = 'pick'

    get lng () {
        return this.data.point.lng
    }

    get lat () {
        return this.data.point.lat
    }

    get height () {
        return this.data.point.height
    }

    get x () {
        return this.data.c3.x
    }

    get y () {
        return this.data.c3.y
    }

    get z () {
        return this.data.c3.z
    }
}

// 坐标定位事件对象
export class LocEvent extends SensorEvent {
    static type = 'location'
}
