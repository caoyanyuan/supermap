<template>
    <div class="gis">

    </div>
</template>

<script>
import CesiumCtl from '@/map/Model/CesiumCtl'

import ALLShipPoint from '@/map/gis/shipPoint/all'

export default {
    methods: {
        init() {

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

