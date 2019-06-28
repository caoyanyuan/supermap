<template>
    <super-map ref="map"></super-map>
</template>

<script>
import HealthPoint from './HealthPoint'

export default {
    mounted() {
        let ctl = this.$refs.map.ctl
        HealthPoint.init( ctl )
    },
</script>

