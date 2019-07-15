import ShipAllAbs from '@map/gis/table/ShipAllAbs'

import Entites from '@map/Model/Entites'
import Ais from './ais'
import Beidou from './beidou'
import Local from './local'
import Hkm from './hkm'
import { defer } from 'lodash'


let allEns = new Entites ( {
    ctl: null,
    detail: '首页所有.',
    opt: {
        billboardOpt: {
            image: '/static/img/large-screen/ais.png',
            width: Entites.scaleW * 12 * 2,
            height: Entites.scaleW * 13 * 2,
            ...Entites.billboardOpt,
        }
    }
} )

let _resolve

export default class ShipAll extends ShipAllAbs {
    static type = '首页.'
    static entites = allEns
    static promise = new Promise( ( resolve, reject ) => _resolve = resolve )
    static idMap = {}
    static ensIdMap = {}
    static isLoad = false
    static cacheStatus = [ true, true, true, true ]
    static pointClassArr = [ Local, Hkm, Ais, Beidou ]

    static resolve () {
        _resolve()
        Ais.resolve()
        Beidou.resolve()
        Local.resolve()
        Hkm.resolve()
        this.isLoad = true
    }

    static show () {
        this.promise.then( () => {
            Ais.show()
            Beidou.show()
            Local.show()
            Hkm.show()
        } )
        return this
    }

    static hide () {
        this.promise.then( () => {
            Ais.hide()
            Beidou.hide()
            Local.hide()
            Hkm.hide()
        } )
        return this
    }

    static pre () {
        this.promise.then( () => {
            defer( () => {
                Ais.pre()
                Beidou.pre()
            } )
            Local.pre()
            Hkm.pre()
        } )
        return this
    }

    static init ( ctl ) {
        Ais.init( ctl )
        Beidou.init( ctl )
        Local.init( ctl )
        Hkm.init( ctl )
    }

    static destory () {
        Ais.entites.destory()
        Beidou.entites.destory()
        Local.entites.destory()
        Hkm.entites.destory()
    }

    // draw () {}
}
