<template>
    <div class="main-page">
        <super-map layer></super-map>

        <router-view/>
    </div>
</template> 

<script>
    import SuperMap from '@/components/superMap'

export default {
    name: 'map2',
    props: {
        
    },
    data() {
        return {

        }
    },
    methods: {
        
    },
    components: {
        SuperMap
    }

}
</script>

<style scoped>
    .main-page{
        height:100%;width:100%;
    }
</style>


