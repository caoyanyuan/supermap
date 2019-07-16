import moment from 'moment'

export default class TrackPoint {
    constructor( { timestamp, position = {} } = {}) {
        let { lng, lat, height } = position

        Object.assign( this, { lng: +lng, lat: +lat, height: +height, timestamp } )

        // 当为标签的时候, 是否显示标签
        this.labelShow = false

        // 动态时间戳, 动态添加
        this.curTime = moment( timestamp )

        // 暂停计算时间用
        this.lastTime = 0
        
    }

    // 文本信息
    get content () {
        return `北纬 ${this.lat} 东经 ${this.lng}`
    }

    get position () {
        return Cesium.Cartesian3.fromDegrees(
            this.lng, this.lat, this.height
        )
    }

    get timeTxt () {
        return `${this.lng.toFixed(5)}, ${this.lat.toFixed(5)}`
    }

    // 分钟
    get time () {
        return moment( this.timestamp )
    }

    get curTimeString () {
        return this.curTime.format( TrackPoint.TIMEFORMAT )
    }
}