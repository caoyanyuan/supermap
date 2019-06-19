import ZP from 'zp-z'
import viewPosition from '@/config/superMap/position'

let count = 0
const _resolve = Symbol( 'resolve' )

export default class MapCtl {

    constructor ( {detail = ''} = {} ) {
        Object.assign( this, {
            detail,
            callbacks: null, // 点击队列
            handler: null, // 点击
            isAnimation: false, // 地图是否处于动画( 飞行, 旋转 )
            viewer: null,
            sensor: {}, // 传感器
            id: `cesiumContainer-${count++}`,
        } )

        this.promise = new Promise( ( resolve, reject ) => {
            this[ _resolve ] = resolve // promise 中的 resolve
        } )
    }
    
    init () {
        console.log('>>> Cesiun Init')

        this.viewer = new Cesium.Viewer( this.id, {
            infoBox: true,
            selectionIndicator:true 
        } )

        //readonlyimageryLayers: 获取将在地球上渲染的影像图层集合
        this.viewer.imageryLayers.addImageryProvider( new Cesium.TiandituImageryProvider( {
            credit: new Cesium.Credit(
                '天地图全球影像服务 数据来源：国家地理信息公共服务平台 & 四川省测绘地理信息局'
            ),
            token: URL_CONFIG.TOKEN_TIANDITU
        } ) )

        this[ _resolve ]( this.viewer )
    } 

    click( fn ) {
        this.callbacks = this.callbacks || ZP.Callback();
        this.callbacks.add(fn)

        this.handler = new Cesium.ScreenSpaceEventHandler( this.viewer.scene.canvas )
        
        this.handler.setInputAction( ( e ) => {
            this.callbacks.fire( e )
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK );
    }


    /**
     * 设置视角
     * @param { String } type
     */
    setView ( type ) {
        type = type == null ? 'DEF' : type;
        let opt = viewPosition[ type ];
        if ( opt ) {
            this.viewer.scene.camera.setView( opt );
        }
        return this;
    }
}