import ShipPointAbs from '@/map/gis/table/ShipPointAbs'
import healthEns from './healthEns'
 
const idMap = Symbol( 'idMap' )
const activeIcon = "/static/img/large-screen/Panoramic_camera.png"

export default class HealthPointSmallMap extends ShipPointAbs {
    static entites = healthEns
    static type = "卫生管理."
    static promise = new Promise( ( resolve, reject ) => HealthPointSmallMap.resolve = resolve )

    static [ idMap ] = {}

    get lng () {
        return this.positions[ 0 ].lng
    }

    get lat () {
        return this.positions[ 0 ].lat
    }

    get height () {
        return this.positions[ 0 ].height
    }

    /**
     * 创建点的时候, 添加映射表
     * @param { Object | Point } point { lng, lat }
     */
    createEntity ( point ) {
        this._createEntity( point )
        this.constructor[ idMap ][ this.id + '' ] = this
    }

    /**
     * 清除实例
     */
    static destory () {
        this.entites.destory()
        this[ idMap ] = {}
    }

    /**
     * 根据卫生管理区域 id 获取模型实例
     * @param { String | Number } id example: 5
     */
    static search ( id ) {
        let target = this[ idMap ][ id + '' ]
        if(target)  {
            this.zoomTo( target.entity )
        }

        return ( target && target.hightLight() )
    }

    hightLight() {
        this.entity.billboard.image = activeIcon
        // console.log(this.entity.billboard.image, this.id, this)
        return this._hightLight()
    }
    
}
