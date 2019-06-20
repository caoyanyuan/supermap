import Emitter from '@/map/Event/Emitter'
 
export default class PointAbs {
    static type = 'PointAbs'
    static entites = null
    static promise = null
    static resolve = null

    constructor ( { _default = {}, positions = [], label = 'label' } = {}, data = {} ) {
        this.entity = null

        Object.assign( this, {
            default: _default,
            positions, label, data
        } )
    }

    get length () {
        return this.constructor.entites.length
    }

    static get ctl () {
        return this.entites.ctl
    }

    selected () {
        this.constructor.entites.ctl.viewer.selectedEntity = this.entity
        return this
    }

    createEntity () { }

    hightLight () {}

    draw () { }

    static $emitter = new Emitter()

    static trigger ( event ) {
        this.$emitter.trigger( event )
        return this
    }

    static on ( type, ...fn ) {
        this.$emitter.on( type, ...fn )
        return this
    }

    static off () {
        this.$emitter.off( type, ...fn )
        return this
    }

    static init ( ctl ) {
        this.entites.init( ctl )
    }

    static initPromise () {
        this.promise = new Promise( ( resolve, reject ) => this.resolve = resolve )
    }

    static zoomTo( entity ) {
        this.entites.zoomTo( entity )
    }

    static show () {
        this.promise.then( () => {
            this.entites.show()
        } )
        return this
    }

    static hide () {
        this.promise.then( () => {
            this.entites.hide()
        } )
        return this
    }

    static pre () {
        this.promise.then( () => this.entites.pre() )
        return this
    }
}
