import CesiumCtl from '@map/Model/CesiumCtl'
import Entites from '@map/Model/Entites'
// import Track from './Track'
import TWEEN from '@tweenjs/tween.js'
import TrackPoint from './TrackPoint'
import Emitter from '@map/Event/Emitter'
import moment from 'moment'
import Vue from 'vue'
import { debounce } from 'lodash'

import { ICON_SHIP, ICON_START, ICON_END } from "@/common/config/staticImg"

const MODE = {
    track: 'track',             //轨迹播放器
    trackBack: 'trackBack'      //轨迹回放
} 

const STEP = Symbol( 'step' )
const TIMER = Symbol( 'timer' )
const STOP = Symbol( 'stop' )
const PLAY = Symbol( 'play' )
const PAUSE = Symbol( 'pause' )
const COMPLETE = Symbol( 'complete' )

const TRACK = 'track'
const TRACKBACK = 'trackback'

const animate = Symbol( 'animate' )
const onStop = Symbol( 'onStop' )
const onUpdate = Symbol( 'onUpdate' )
const onComplete = Symbol( 'onComplete' )

const _step = Symbol( 'step' )
const promise = Symbol( 'promise' )
const points = Symbol( 'points' )
const _state = Symbol( 'state' )
const _timeArr = Symbol( 'timeArr' )
const _percent = Symbol( 'percent' )
const _stateForTrack = Symbol( 'stateForTrack' )




export default class TrackBack {
    /**
     * @constructor
     * @param { Object } opt
     * @param { Number } step    播放间隔
     * @param { Array<TrackPoint> } positions 轨迹集合, 必传
     * @param { Labels } labels 标签集合.
     * @param { MapCtl } ctl 地图控制器
     */
    constructor({
        step = 1,
        positions = [],
        labels = {},
        ctl = CesiumCtl,
        player,
        mode = MODE.trackBack
    }){
        if ( positions.length < 2 ) { 
            console.warn( '<<< 轨迹至少需要 2 个点.' )
            return
        }
        //正常情况下的速度
        this.normalStep = step
        
        Object.assign(this, { ctl, player, mode, labels, positions })
        this[ _step ] = step
        this.billboards = new Entites( {
            detail: '图片集合.',
            ctl,
        } )
        this.corridor = new Entites( {
            detail: '走廊.',
            ctl,
        } )

        /**初始化设置 */
        this.setting()

        this[ points ] = []                     // 动态点集合
        this.points = [ /* positions[ 0 ] */ ]  // 实际绘制的轨迹点数
        this.allQue = []                          // Array<TWEEN.Tween>   总的
        this.curQue = []                          // Array<TWEEN.Tween>    当前
        this[ _timeArr ] = []                   // 记录每个补间所需时间
        this[ _percent ] = 0                    // 当前百分比

        
        this[ promise ] = new Promise( ( re ) => re() )     // 动画添加点的 promise 对象
        //this[ animate ] = this[ animate ].bind( this )
        this.Emitter = new Emitter()

        this.calcTime()             //时间的计算
        this.init()                 //显示第一个点
    }

    setting() {
         // 不做窗口变化自适应大小, 窗口改变大小需要刷新
         let scaleW = ( window.innerWidth / 1920 ) || .5
         let scaleH = ( window.innerHeight / 1080 ) || .5
         let _w = 56 * scaleW
         let _h = 63 * scaleW
         
         // 广告牌设置
         this.billboardOpt = {
            image: ICON_SHIP,
            width: _w,
            height: _h,
            // sizeInMeters: true,
            horizontalOrigin : Cesium.HorizontalOrigin.CENTER,
            verticalOrigin : Cesium.VerticalOrigin.BOTTOM,
        }

        // 标签设置
        this.labelOpt = {
            text: 'zxxx',
            fillColor: new Cesium.Color( 1, 1, 1, 1 ),
            show: true,
            showBackground: true,
            backgroundColor: new Cesium.Color( 7, 32, 69, 0.5 ),
            horizontalOrigin : Cesium.HorizontalOrigin.CENTER,
            verticalOrigin : Cesium.VerticalOrigin.TOP,
            // pixelOffset: new Cesium.Cartesian2( 10, 10 )
        }

       
    }

    calcTime() {
        this.startTime = moment( this.positions[ 0 ].timestamp )
        this.endTime = moment( this.positions[ this.length - 1 ].timestamp )
        this.totalTime = this.end - this.startTime
    }

    init() {

    }
    
    get length() {
        return this.positions.length
    }
    get percent () {
        return this[ _percent ]
    }
}