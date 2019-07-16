<template>
    <div class="gis-player">
        <div class="title">轨迹回放</div>
        <div class="progress">
            <el-slider ref="slider" v-model="curTime"></el-slider>
            <div class="start time">{{ startTime }}</div>
            <div class="end time">{{ endTime }}</div>
        </div>
        <div class="tools clearfix">
            <el-button type="primary" size="mini" @click="onChangePlay(0)">播放</el-button>
            <el-button type="primary" size="mini" @click="onChangePlay(1)">暂停</el-button>
            <el-button type="primary" size="mini" @click="onChangePlay(2)">快进</el-button>
            <el-button type="primary" size="mini" @click="onChangePlay(3)">快退</el-button>
        </div>
    </div>
</template>

<script>
import MapCtl from '@map/Model/Class/MapCtl'
import CesiumCtl from '@map/Model/CesiumCtl'
import TrackPoint from './Class/TrackPoint'
import TrackBack from './Class/TrackBack'
import Labels from './Class/Labels'
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
    methods: {
        
        onChangePlay(value) {
            switch(value) {
                case 0:
                    break;
                case 1:
                    break;
                case 2:
                    break;
                case 3:
                    break;
            }
        },
        _getData() {
            let url = Vue.filter( 'getSrc' )( '/static/mork/playback.json' )
            this.$axios.get( url ).then( ( data ) => {

                data.data
                    .forEach( ( item ) => this.data.push( new TrackPoint( item ) ) )
                
                this.track = new TrackBack( {
                    labels: new Labels( this.labels ),
                    positions: this.data, // 最好不要修改
                    step: 60, // 实际 1 分钟, 用 1 s 时间 播放完
                    ctl: this.ctl,
                    player: this,
                } )
                console.log(this.track)
                

                // this.startTime = this.track.data[ 0 ].timestamp
                // this.endTime = this.track.data[ this.track.length - 1 ].timestamp

                // this.register()
            } )
        }
    },
    computed: {
        step () {
            return this.stepMinute * 60
        }
    },
    created () {
        this.$nextTick( () => {
            // this.$refs.slider.$refs.slider.addEventListener( 'click', this.sliderClick.bind( this ) )
        } )
        this._getData()

        // this.mouseup = this.mouseup.bind( this )
        // window.addEventListener( 'mouseup', this.mouseup )
    },

    activated () {
        //this.track && this.track.show()
    },

    deactivated () {
       // this.track && this.track.hide()
    },

    // destroyed () {
    //     window.removeEventListener( 'mouseup', this.mouseup )
    // },

    watch: {
        curTime ( val ) {
            if ( this.isWatch ) {
                this.curTimeChange( val, true )
            }
            this.isWatch = true
        }
    }
    
}
</script>


<style lang="less" scoped>
.gis-player{
    position:absolute;bottom:0;background:rgba(0,0,0,0.5);right:0;width:300px;padding:20px;
    color:#fff;
    .tools{
        margin-top:10px;
    }
}
</style>