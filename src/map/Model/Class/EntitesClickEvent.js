import SensorEvent from '../../Event/SensorEvent'
import CesiumCtl from '../../Model/CesiumCtl'

// 坐标拾取事件对象
export class EntityClick extends SensorEvent {
    static type = 'click:entity'

    get entity () {
        return this.data.entity
    }

    get lat () {
        return this.data.lat
    }

    get lng () {
        return this.data.lng
    }

    get height () {
        return this.data.height
    }
}
