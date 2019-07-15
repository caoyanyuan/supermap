import PointAbs from './PointAbs'

const POSITIONS = Symbol( 'positions' )
const POINT = '__point__'

const _changeCamera = Symbol( 'changeCamera' )

export default class AreaAbs extends PointAbs {
    static type = 'AreaAbs'
    static entites = null
    static promise = null
    static resolve = null
    static cameraHight = 2000 // 配置相机高度变化的时候缩小成点
    static preHightLightEntity = null

    constructor ( opt = {}, data = {} ) {
        super( opt, data )

        this[ POSITIONS ] = [] // 坐标集合
        this.points = [] // 计算中心点使用. SuperMap
        this.ploygon = null // 计算中心点使用, 不是 entity. SuperMap
        this.point = null // 点 entity
        this[ POINT ] = {}

        this.normal = this.normal.bind( this )
        this.small = this.small.bind( this )

        this.constructor.on( 'camera:normal', this.normal )
        this.constructor.on( 'camera:small', this.small )

        this.draw()
    }

    createEntity () {
        let bgc = this.default.outlineColor
        bgc[ 3 ] = 1

        // 计算中心点坐标, Point 类有计算中心点的方法
        this.ploygon = new SuperMap.Geometry.Polygon( [
            new SuperMap.Geometry.LinearRing( this.points )
        ] )
        this.center = this.ploygon.getBounds().getCenterLonLat()

        this.entity = new Cesium.Entity( {
            // show: true,
            isArea: true,
            znvPoint: this,
            position : Cesium.Cartesian3.fromDegrees(
                +this.center.lon, +this.center.lat, 30
            ),
            label: {
                text: this.label,
                ...this.constructor.entites.constructor.labelOpt
            },
            polygon: {
                show: true,
                height: 1,
                outline: true,
                outlineColor : new Cesium.Color( ...this.default.outlineColor ),
                material: new Cesium.Color( ...this.default.bgc ),

                hierarchy: new Cesium.CallbackProperty( () => {
                    return Cesium.Cartesian3.fromDegreesArray( this[ POSITIONS ] )
                }, false )
            },
            point : new Cesium.PointGraphics( {
                color : new Cesium.Color( ...bgc ),
                pixelSize : 10,
                outlineColor : new Cesium.Color( ...bgc ),
                // ...this.constructor.entites.constructor.pointOpt,
                show: false,
                heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND
            } )
        } )

        this.point = new Cesium.Entity( {
            // show: false,
            isPoint: true,
            znvPoint: this,
            point : new Cesium.PointGraphics( {
                color : new Cesium.Color( ...bgc ),
                pixelSize : 10,
                outlineColor : new Cesium.Color( ...bgc ),
                // ...this.constructor.entites.constructor.pointOpt,
                show: false,
                heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND
            } ),
            // ellipse: {
            //     show: false,
            //     height: 5,
            //     semiMajorAxis: 30, // 长轴长度
            //     semiMinorAxis: 30, // 短轴长度
            //     outlineColor : new Cesium.Color( ...this.default.outlineColor ),
            //     material: new Cesium.Color( ...bgc )
            // },
            position : Cesium.Cartesian3.fromDegrees(
                +this.center.lon, +this.center.lat, 30
            ),
            // position : new Cesium.CallbackProperty( () => {
            //     return Cesium.Cartesian3.fromDegrees( this[ POINT ].lng, this[ POINT ].lat, this[ POINT ].height )
            // }, false ),
            // label: {
            //     text: this.label,
            //     ...this.constructor.entites.constructor.labelOpt
            // }
        } )

        this.constructor.entites.push( this.entity )
        // this.constructor.entites.add( this.point, true )
    }

    draw () {

        if ( !this.positions || this.positions.length < 3 ) {
            return console.error( `<<< 绘制区域, 至少需要 3 个点. ${this.label}, ${this.positions}` )
        }

        this.positions.forEach( ( point ) => {
            this[ POSITIONS ].push( +point.lng, +point.lat )
            this.points.push( new SuperMap.Geometry.Point( +point.lng, +point.lat ) )
        } )
        this.createEntity()
    }

    hightLight () {
        let pre = this.constructor.preHightLightEntity
        let target = this.entity
        if ( pre instanceof Cesium.Entity ) {
            pre.polygon.material = new Cesium.Color( ...this.default.bgc )
            pre.polygon.outlineColor = new Cesium.Color( ...this.default.outlineColor )
        }
        target.polygon.outlineColor = new Cesium.Color( 103 / 255, 194 / 255, 58 / 255, 1 )
        target.polygon.material = new Cesium.Color( 103 / 255, 194 / 255, 58 / 255, 1 )
        this.constructor.preHightLightEntity = this.entity
    }

    /**
     * 正常显示
     * 事件类型: camera:normal
     * @param { Object } event { type, ctl, camare } 自定义的事件对象
     */
    normal ( event ) {
        this._setAreaToPoint( false )
    }
    /**
     * 缩小成点
     * 事件类型: camera:small
     * @param { Object } event { type, ctl, camare } 自定义的事件对象
     */
    small ( event ) {
        this._setAreaToPoint( true )
    }
    _setAreaToPoint ( isSoHeight ) {
        let { entites } = this.constructor
        entites.forEach( ( entity ) => {
            entity.point.show = isSoHeight
            entity.polygon.show = !isSoHeight
            entity.label.show = !isSoHeight
        } )
    }

    /**
     * 注册相机改变高度的事件
     */
    static _initCameraChange () {
        let ctl = this.entites.ctl

        this[ _changeCamera ] = this[ _changeCamera ].bind( this )
        // TODO: 缩小成点.
        ctl.promise.then( () => {
            ctl.camera.changed.removeEventListener( this[ _changeCamera ] )
            ctl.camera.changed.addEventListener( this[ _changeCamera ] )
        } )
    }
    static [ _changeCamera ] () {
        let ctl = this.entites.ctl
        let cartographic = Cesium.Cartographic.fromCartesian( ctl.scene.camera.position )

        this.pointHeight = ctl.camera.height

        if ( cartographic.height > this.cameraHight ) {
            // 缩小成点
            this.trigger( {
                type: 'camera:small',
                ctl,
                camera: ctl.camera
            } )
        } else {
            // 正常显示
            this.trigger( {
                type: 'camera:normal',
                ctl,
                camera: ctl.camera
            } )
        }
    }

    /**
     * 初始化, 改变 ctl 等
     * 可以不调用, 默认控制器是 CesiumCtl
     */
    static init ( ctl ) {
        this.entites.init( ctl )
        this._initCameraChange()
        // this.promise = new Promise( ( resolve, reject ) => this.resolve = resolve )
    }
}
