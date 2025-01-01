import type { Hex } from '.'

export interface EventRegistry {}

export interface HexEvent {
    _type: EKey
}

type EKey = keyof EventRegistry
type Event<K extends EKey> = EventRegistry[K]

type Listener<T> = { listener: (event: T) => void; priority: number }

export function initEvents(hex: Hex) {
    const events: { [K in EKey]?: Listener<Event<K>>[] } = {}
    const queue: HexEvent[] = []

    const on = <K extends EKey>(type: K, listener: (event: Event<K>) => void, priority = 0) => {
        // @ts-expect-error - no events registered
        if (!events[type]) events[type] = []
        events[type]!.push({ listener, priority })
        events[type]!.sort((a, b) => b.priority - a.priority)
        hex.log.debug(`[EVENTS] Registered listener for ${type}`)
    }

    const off = <K extends EKey>(type: K, listener: (event: Event<K>) => void) => {
        if (!events[type]) return
        const i = events[type]!.findIndex((l) => l.listener === listener)
        if (i !== -1) events[type]!.splice(i, 1)
        hex.log.debug(`[EVENTS] Unregistered listener for ${type}`)
    }

    const once = <K extends EKey>(type: K, listener: (event: Event<K>) => void, priority = 0) => {
        const onceListener = (e: Event<K>) => {
            listener(e)
            off(type, onceListener)
        }
        hex.log.debug(`[EVENTS] Created one-time listener for ${type}`)
        on(type, onceListener, priority)
    }

    const emit = <K extends EKey>(type: K, event: Event<K>) => {
        if (!events[type]) return
        hex.log.debug(`[EVENTS] Emitting event ${type}`)
        queue.push(event)
    }

    const processEvents = () => {
        if (!queue.length) return
        hex.log.debug(`[EVENTS] Processing...`)
        while (queue.length) {
            const event = queue.shift()!
            const listeners = events[event._type]
            if (!listeners) continue
            // @ts-expect-error - no events registered
            for (const l of listeners) {
                l.listener(event)
                hex.log.debug(`[EVENTS] ${event._type} Processed`)
            }
        }
        hex.log.debug(`[EVENTS] Finished processing for tick ${hex.engine.count()}`)
    }

    return {
        on,
        off,
        once,
        emit,
        processEvents,
    }
}
