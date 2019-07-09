<template>
    <div class="gis">

    </div>
</template>

<script>
import CesiumCtl from '@/map/Model/CesiumCtl'

export default {
    methods: {
        init() {

        }
    },
    mounted() {
        this.init()
        CesiumCtl.promise.then((viewer) => {
            console.log(viewer)
        })
    }
}
</script>

