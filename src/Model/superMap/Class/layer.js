import CesiumCtl from '../CesiumCtl'
import ZP from 'zp-z'
import getIds from '../methods/getIds'

const states = Symbol('states')

export default class Layer {
    
    static Layers = new Cesium.Layers()
    
    /**
     * 构造函数
     * 扩展属性
     * @param { Object } { name: 名字, detail: 详情, layer: 图层,
     *      visible: 默认显示隐藏 }
     */
    constructor({ name, detail, layer, visible }){
        Object.assign( this, {
            name, detail, layer
        })
    }
    
    click( fn ) {
       
        this._clickCallbacks = this._clickCallbacks || ZP.Callback();
        this._clickCallbacks.add(fn)
        
        CesiumCtl.click( (e) => {
            // 多选的模式下有多个 id
            
            let ids = this.layer.getSelection()
           

            // 判断是否点击图层
            if ( !ids.length ) {
                return;
            }

            this._clickCallbacks.fire( this, ids, e )
        } )
    }

    selected () {
        // ( new Array( 21 ).fill( 1 ) ).forEach( ( _, id ) => {
            // console.log( 'xxxx' )
        //     this.layer.setSelection( id + 1 )
        
        getIds( this.layer, ( data = [] ) => {
           
            data.forEach( ( item ) => {
                // console.log( '>>> Get ids:', item )
                this.layer.setSelection( item.data.SmID )
            } )
        } )
    }
}