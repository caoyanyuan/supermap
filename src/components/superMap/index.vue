<template>
    <div ref="map" 
        :id=ctl.id
        v-show="show" 
        class="cesiumContainer" 
        :style="{
            height: height,
            width: width
        }" oncontextmenu="event.preventDefault()"></div>
</template>

<script>
     
import defCtl from '@/map/Model/CesiumCtl' 
import MapCtl from '@/map/Model/Class/MapCtl'
import LayersCtl from '@/map/Model/LayersCtl'

import layersName from '@/config/superMap/layersName'

export default {
    name: 'superMap',
    props: {
        layer: {
            type: Boolean,
            default: false
        },
        ctl: {
            type: MapCtl,
            default () {
                return defCtl
            }
        },
        camera: {
            type: String,
            default: 'DEF'
        }
    },
    data() {
        return {
            show: true,
            height: 0,
            width: 0
        }
    },
    methods: {
        setMapSize() {
            this.show = false
            this.$nextTick(() => {
                let {width, height} = this.$refs.map.parentElement.getBoundingClientRect()
                this.height = height + 'px'
                this.width = width + 'px'
                this.show = true
            })
        },
        initMap() {
            this.ctl.init()
           
            if(this.layer) {
                LayersCtl.all(layersName, layers => {
                    layers.forEach(layer => {
                        
                        layer.click((_, ids) => {
                            
                            console.log( `${layer.name} id: ${ids}`, layer )
                            
                            layer.selected()
                        })
                    })
                    // layers[0].click((_, ids) => {
                            
                    //     console.log( `${layers.name} id: ${ids}`, layers )
                    // })
                })
            }
        }
        
        
    },
    created() {
        console.log( 'ctl:', this.ctl )

        this.$nextTick( () => {
            
            this.setMapSize()
            this.initMap()
            this.ctl.promise.then( () => this.ctl.setView( 'DEF' ) )
        })

     
    }

}
</script>




