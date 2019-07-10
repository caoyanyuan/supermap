<template>
    <div class="gis">

    </div>
</template>

<script>
import CesiumCtl from '@/map/Model/CesiumCtl'

import ALLShipPoint from '@/map/gis/shipPoint/all'
import Ais from '@map/gis/shipPoint/ais'
import Beidou from '@map/gis/shipPoint/beidou'
import Local from '@map/gis/shipPoint/local'
import Hkm from '@map/gis/shipPoint/hkm'



export default {
    methods: {
        init() {
            ALLShipPoint.init()
        }
    },
    mounted() {
        this.init()
        CesiumCtl.promise.then((viewer) => {
            // console.log(viewer)
        })
    }
}
</script>

