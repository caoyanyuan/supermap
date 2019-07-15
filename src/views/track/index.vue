<template>
    <div class="gis-player unselect">

        <div class="title">轨迹回放</div>
        <div class="progress">
            <el-slider ref="slider" v-model="curTime" :format-tooltip="formatToolTip"></el-slider>
            <div class="start time">{{ startTime }}</div>
            <div class="end time">{{ endTime }}</div>
        </div>
        <div class="tools clearfix">
            <div class="btns clearfix fl">
                <div :class="[ 'back', 'btn', {
                    active: playBtnIndex === 0
                } ]"
                    @mousedown="back"></div>
                <div :class="[ 'btn', {
                    pause: isPause,
                    play: !isPause,
                    active: playBtnIndex === 1
                } ]" @click="play"
                    @mousedown="playBtnIndex = 1"></div>
                <div :class="[ 'speed', 'btn', {
                    active: playBtnIndex === 2
                } ]"
                    @mousedown="speed"></div>
                <div :class="[ 'stop', 'btn', {
                    active: playBtnIndex === 3
                } ]"
                    @click="stop"
                    @mousedown="playBtnIndex = 3"></div>
            </div>
            <div class="options">
                <span class="item">公式</span>
                <el-checkbox class="item" v-model="mode">显示经纬度</el-checkbox>
                <span>间隔时间：</span>
                <input type="text" v-model="stepMinute">
                <span class="item">分钟</span>
                <el-button class="btn" type="primary"
                    v-if="/time/.test(btns)"
                    @click="$emit('time')">时间</el-button>
                <el-button class="btn" type="primary"
                    v-if="/export/.test('export')"
                    @click="$emit('export')">导出</el-button>
            </div>
        </div>
    </div>
</template>

<script>
import MapCtl from '@map/Model/Class/MapCtl'
import CesiumCtl from '@map/Model/CesiumCtl'
import TrackPoint from './Class/TrackPoint'
import TrackBack from './Class/TrackBack'
import Label from './Class/Label'
import Vue from 'vue'

export default {
    name: 'gis-player',

    props: {
        btns: {
            type: String,
            default: 'export'
        },

        ajax: {
            type: String,
            default: ''
        },

        labels: {
            type: Array
        },

        ctl: {
            type: MapCtl,
            default () {
                return CesiumCtl
            }
        }
    },

    data () {
        return {
            curTime: 0, // 绑定的进度条, 0-100
            isPause: false, // 是否暂停
            mode: false, // 是否显示经纬度, 没写这个功能
            stepMinute: 15, // 步长
            playBtnIndex: -1, // 当前长按对象

            track: null, // 轨迹回放对象
            data: [], // 存储轨迹坐标

            startTime: '00/00 00:00', // 开始时间
            endTime: '00/00 00:00', // 结束时间

            isWatch: true,
        }
    },

    computed: {
        step () {
            return this.stepMinute * 60
        }
    },

    created () {
        this.$nextTick( () => {
            this.$refs.slider.$refs.slider.addEventListener( 'click', this.sliderClick.bind( this ) )
        } )

        this.$axios.get( Vue.filter( 'getSrc' )( '/static/mork/playback.json' ) ).then( ( data ) => {


            data.data
                .forEach( ( item ) => this.data.push( new TrackPoint( item ) ) )

            this.track = new TrackBack( {
                labels: new Labels( this.labels ),
                positions: this.data, // 最好不要修改
                step: 60, // 实际 1 分钟, 用 1 s 时间 播放完
                ctl: this.ctl,
                player: this,
            } )

            this.startTime = this.track.data[ 0 ].timestamp
            this.endTime = this.track.data[ this.track.length - 1 ].timestamp

            this.register()

            this.$emit( 'succee', this.track )
        } )

        this.mouseup = this.mouseup.bind( this )
        window.addEventListener( 'mouseup', this.mouseup )
    },

    activated () {
        this.track && this.track.show()
    },

    deactivated () {
        this.track && this.track.hide()
    },

    destroyed () {
        window.removeEventListener( 'mouseup', this.mouseup )
    },

    watch: {
        curTime ( val ) {
            if ( this.isWatch ) {
                this.curTimeChange( val, true )
            }
            this.isWatch = true
        }
    },

    methods: {
        play () {
            if ( this.isPause ) {
                this.track.pause()
                this.$emit( 'pause', this )
            } else {
                this.track.play()
                this.$emit( 'play', this )
            }
            // this.isPause = !this.isPause
        },

        speed () {
            this.playBtnIndex = 2
            if ( !this.speed.flag ) {
                this.speed.flag = true
                this.track.speed( this.step )
                this.$emit( 'speed', this )
            }
        },

        back () {
            this.playBtnIndex = 0
            if ( !this.back.flag ) {
                this.back.flag = true
                this.track.back( this.step )
                this.$emit( 'back', this )
            }
        },

        stop () {
            this.track.stop()
            this.curTime = 0
            this.$emit( 'stop', this )
        },

        mouseup () {
            if ( this.playBtnIndex === 2 ) {
                this.speed.flag = false
                // 恢复默认的播放速度.
                this.track && this.track.normalSpeed()
            } else if ( this.playBtnIndex === 0 ) {
                this.back.flag = false
                // 恢复默认的播放速度.
                this.track && this.track.normalBack()
            }
            this.playBtnIndex = -1
        },

        register () {
            this.track.on( 'play', () => {
                this.isPause = true
            } )
            this.track.on( 'stop', () => {
                this.isPause = false
            } )
            this.track.on( 'complete', () => {
                this.isPause = false
                this.curTime = 100
            } )
            this.track.on( 'pause', () => {
                this.isPause = false
            } )
            this.track.on( 'update', ( { percent } ) => {
                this.isWatch = false
                this.curTime = percent * 100
            } )
        },

        /**
         * 进度条点击拖动触发事件
         * @param { Number } val curTime 的值. 0-100
         */
        curTimeChange ( val, isUnClick ) {
            if ( !isUnClick ) {
                this.isWatch = false
            }
            this.track.showAt( val / 100 )
        },

        sliderClick ( e ) {
            if ( this.track.isPlay() ) {
                this.track.stop( true )
                this.curTime = e.offsetX / this.$refs.slider.sliderSize * 100
            }
        },

        formatToolTip ( val ) {
            return Math.round( val )
        }
    }
}
</script>
