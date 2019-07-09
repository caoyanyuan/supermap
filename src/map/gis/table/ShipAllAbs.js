import ShipPointAbs from './ShipPointAbs'

export default class ShipAllAbs extends ShipPointAbs {
    static type = "所有渔船."
    static entites = null
    static promise = new Promise( ( resolve, reject ) => ShipAllAbs.resolve = resolve )
    static resolve = null
    static idMap = {} // 渔船 ID => entity.id
    static ensIdMap = {} // entity.id => entity

    /**
     * @param { Object } opt 渔船信息, { target: ShipPointAbs }.
     * @param { Object } data 其他信息,
     *  一般传递 { item: this, index } entity 与 页面交互使用到.
     *  item 会传递到 entity 下. entity.znvPoint 来访问.
     */
    constructor ( opt = {}, data = {} ) {
        super( {
            ...opt,
            isUnDraw: true
        }, data )

        // 向 target 添加 entity
        if ( typeof this.target === 'function' ) {
            // this.target.entites.push( this.entity )
            this.targetPoint = new this.target( opt, data )
        }
        this.draw()
    }

    /**
     * 绘制
     */
    draw () {
        this._draw()
        this.register()
    }

    createEntity () {
        this.entity = this.targetPoint.entity
        this.constructor.entites.add( this.entity )
    }

    /**
     * 映射, 记录天机的 entity
      */
    register () {
        this.constructor.idMap[ this.id ] = this.entity.id
        this.constructor.ensIdMap[ this.entity.id ] = this.entity
    }

    /**
     * 根据渔船 ID 获取 entity 对象
     * @param { Number } id 渔船 ID
     * @return { Cesium.Entity | null } 搜索不到返回 null
     */
    static seach ( id ) {
        return this.idMap[ id ] || null
    }

    /**
     * 推送的渔船信息, 搜索未果就添加.
     * @param { Object } opt 渔船信息, 需要 target 参数
     * @param { Object } data 其他信息
     */
    static pushOther ( opt = {}, data = {} ) {
        new this.constructor( opt, data )
    }
}

let a = new ShipAllAbs()
console.log(a)