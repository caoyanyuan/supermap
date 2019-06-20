const canceled = Symbol( 'canceled' )

export default class AbstractEvent {

    static type = 'custom-event'

    static cancelable = false

    constructor ( data = {} ) {
        this[ canceled ] = false
        this.data = data
    }

    /**
     * 获取事件类型
     */
    get type () {
        return this.constructor.type
    }
}
