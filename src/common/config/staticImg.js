/**
 * static下面的图片
*/
import Vue from 'vue'

export const ICON_SHIP = getImg( '/ship.png' )
export const ICON_CAMERA = getImg( '/Panoramic_camera.png' )
export const ICON_START = getImg( '/start.png' )
export const ICON_END = getImg( '/end.png' )

function getImg(url) {
    return Vue.filter( 'getSrc' )( `/static/img/large-screen/${url}` )
}