import CesiumCtl from './CesiumCtl'
import Layer from './Class/Layer'

import {
    URLS, IP
} from '@/config/superMap/layersName'


let LayerCtl = {
    _layers: [],
    
    /**
     * 
     * @param {String} id  图层id example: XZMTGX // 现状码头岸线
     */
    load( id ) {
        //Scene: 所有三维图形对象和状态的容器
        //addS3MTilesLayerByScp： 三维切片缓存图层
        let name = URLS[ id ].name;
        return CesiumCtl.viewer.scene.addS3MTilesLayerByScp(IP + URLS[ id ].url ,{ name })
            .then( layer => {
                let prop = id

                if( this.hasOwnProperty( prop ) ) {
                    prop = '_' + prop
                }
                this[ prop ] = new Layer({
                    id,
                    layer,
                    name 
                })
                this._layers.push(this[ prop ])
            } )
    },
    
    /**
     * 
     * @param { Array<String> } layersName  图层数组
     * @param { Function } done 图层加载完成的回调
     */
    all( layersName, done) {

        if(this._layers.length) {
            this._layers = []
        }

        let fns = layersName.map(item => {
            return  this.load(item)
        })
            
        Promise.all(fns).then(layers => {
            done(this._layers)
           
        })
        
        //在这里 Cesium.when.all 和 Promise.all效果一样的
        // Cesium.when.all( fns, ( layers ) => {
        //     console.log(this._layers)
        //     //console.log(layers)
        // })
    }

}

export default LayerCtl