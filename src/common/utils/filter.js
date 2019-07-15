import Vue from 'vue'

Vue.filter( 'getSrc', ( value ) => {

    if ( /^\./.test( value ) ) { // 相对路径直接返回
        return value
    }
    // 绝对路径
    return ( window.location.origin || '' ) + value
    // return value
} )
