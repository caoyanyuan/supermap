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

/*四种状态
    STOP 停止状态，最开始的初始状态
    PLAY 播放中     PAUSE 暂停  COMPLETE播放完了
*/
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

        Object.assign(this, { step, ctl, player, mode, labels, positions })
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

        this.points = [ /* positions[ 0 ] */ ]  // 实际绘制的轨迹点数
        this.allQue = []                          // Array<TWEEN.Tween>   总的
        this.curQue = []                          // Array<TWEEN.Tween>    当前
        this[ _timeArr ] = []                   // 记录每个补间所需时间
        this[ _percent ] = 0                    // 当前百分比
        this[ points ] = []                     // 动态点集合

        let startPoint = this.positions[ 0 ]
        this[ points ].push( startPoint.lng, startPoint.lat )

        this[ promise ] = new Promise( ( re ) => re() )     // 动画添加点的 promise 对象
        this.$t = new TWEEN.Group()
        this[ animate ] = this[ animate ].bind( this )
        this.Emitter = new Emitter()

        this.calcTime()             //时间的计算
        this.init()                 //显示起点 ，走廊插入第一个点

        this.i = 0
    }

    setting() {
        this[ _state ] = STOP
        // 不做窗口变化自适应大小, 窗口改变大小需要刷新
        let scaleW = ( window.innerWidth / 1920 ) || .5
        let scaleH = ( window.innerHeight / 1080 ) || .5
        let _w = 56 * scaleW
        let _h = 63 * scaleW

         // 广告牌设置
        this.billboardOpt = {
            image: ICON_START,
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
        this.reset()
        this.corridor.destory()

        let firstPoint = new Cesium.Entity( {
            corridor: {
                show: true,
                width: 5,
                outline: false,
                material: new Cesium.Color( 40 / 255, 148 / 255, 240 / 255, 1 ),
                positions: new Cesium.CallbackProperty( () => {
                    return Cesium.Cartesian3.fromDegreesArray( this[ points ] )
                }, false )
            }
        } )
        this.corridor.add( firstPoint )

        //debugger
        return this
    }

    /**
     * 点播放的事件 此时播放器存在各种状态
     */
    play() {
        let state = this[ _state ]
        if(state == PAUSE) {
            this.calcCurQue()
        }else if(state == STOP || state == COMPLETE) {
            //debugger
            this.init()
            console.log(this.allQue)
            if ( this.allQue[ 0 ] ) {
                this[ animate ]()
                //this.allQue[ 0 ].start()
            }
        }
        return this
    }

    /**
     * TWEENJS 动画
     */
    [ animate ] () {
        this[ TIMER ] = window.requestAnimationFrame( this[ animate ] )
        this.$t.update()
    }

    /**计算总的补间队列 */
    calcAllQue() {
        // if ( this[ _state ] === STOP ) {
        //     this.labels.destroy()
        // }

        this.allQue = []

        this.positions.reduce((prev, current, index) => {
            let startTime = 0
            let prePoint = new TrackPoint( { position: prev, timestamp: prev.timestamp } )

            let billboard = {
                ...this.billboardOpt,
            }

            let entity = new Cesium.Entity( {     // 有几个position就对应几个广告图片
                billboard,
                position: new Cesium.CallbackProperty( () => {
                    return Cesium.Cartesian3.fromDegrees(
                        prePoint.lng, prePoint.lat, prePoint.height
                    )
                }, false )
            } )

            let stepTime = current.timestamp - prePoint.timestamp
            this[ _timeArr ].push( stepTime )
            //console.log(current)

            let tw = new TWEEN.Tween( prePoint, this.$t )
                .to( {
                    lng: current.lng, lat: current.lat
                }, ( stepTime ) / this.step )
                // 每完成一个补间队列
                .onUpdate( ( point ) => {

                    this[ onUpdate ]( point, startTime )
                } )
                // .repeat( Infinity )
                .onComplete( (point) => {
                    console.log(point)
                    this[ onComplete ]( current, prePoint )
                } )
                .onStop( () => {
                    this[ onStop ]()
                } )
                .onStart( (point) => {
                    console.log(point)
                    //this.addLabel( prePoint )
                    this.billboards.add( entity )
                    startTime = moment()
                } )

            this.allQue.push( tw )
            return prev
        }, 0)

        console.log(this.$t)
        this.allQue.reduce( ( pre, cur, index ) => {
            pre.chain( cur )
            return cur
        } )


    }

    [ onUpdate ]( point, startTime, isCurQue ) {
        this[ points ].push( point.lng, point.lat )

        let updateTime = moment() - startTime
        let curTime, stepTime = updateTime * this.step

        if ( !isCurQue ) {
            curTime = moment( point.time + stepTime )
        } else {
            curTime = moment( point.lastTime + stepTime )
        }

        this[ _percent ] = ( curTime - this.startTime ) / this.startTime
        point.curTime = curTime/* .format( TrackPoint.TIMEFORMAT ) */
        this.i ++
        if(this.i <= 10 ){
            console.log(curTime, this.startTime, this.totalTime)
        }
        // this.Emitter.trigger( {
        //     type: 'update',
        //     point: point,
        //     time: curTime,
        //     percent: this[ _percent ]
        // } )


    }

    [ onComplete ]() {

    }

    [ onStop ]() {

    }

    calcCurQue() {

    }

    reset() {
        this.cancelAnimationFrame()
        //this.labels.destroy()
        this[ _timeArr ] = []
        this[ _percent ] = -1

        let startPoint = this.positions[ 0 ]
        // this[ points ] = [ startPoint.lng, startPoint.lat ]
        // this.points.splice( 0 )
        // this.points.push( this.data[ 0 ] )
        this.billboards.destory()
        this.billboards.add( this.drawBillboard( startPoint ) )

        this.calcAllQue()
    }

    drawBillboard(point) {
        let billboard = {
            ...this.billboardOpt
        }

        if ( this.current === 1 ) { // 初始位置
            billboard.image = start
        }

        return new Cesium.Entity( {
            billboard,
            // label: this.labelOpt,
            position: Cesium.Cartesian3.fromDegrees(
                point.lng,
                point.lat,
                point.height + 1
            )
        } )
    }

    cancelAnimationFrame() {
        window.cancelAnimationFrame( this[ TIMER ] )
    }

    get length() {
        return this.positions.length
    }
    get percent () {
        return this[ _percent ]
    }
}
