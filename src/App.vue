<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style lang="stylus">
@import '~@/common/css/reset.styl';


#app{
  height:100%;
}
</style>
