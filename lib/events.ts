import type { Hex } from '.'

/**
 * Base Event Interface
 */
export interface EventI {
    _type: EKey
}
export interface EventRegistry {}
export type EKey = keyof EventRegistry
export type Event<K extends EKey> = EventRegistry[K]

type Listener<T> = { listener: (event: T) => void; priority: number }

export function initEvents(hex: Hex) {
    const events: { [K in EKey]?: Listener<Event<K>>[] } = {}
    const queue: EventI[] = []

    const on = <K extends EKey>(type: K, listener: (event: Event<K>) => void, priority = 0) => {
        // @ts-expect-error - no events registered
        if (!events[type]) events[type] = []
        events[type]!.push({ listener, priority })
        events[type]!.sort((a, b) => b.priority - a.priority)
    }

    const off = <K extends EKey>(type: K, listener: (event: Event<K>) => void) => {
        if (!events[type]) return
        const i = events[type]!.findIndex((l) => l.listener === listener)
        if (i !== -1) events[type]!.splice(i, 1)
    }

    const once = <K extends EKey>(type: K, listener: (event: Event<K>) => void, priority = 0) => {
        const onceListener = (e: Event<K>) => {
            listener(e)
            off(type, onceListener)
        }
        on(type, onceListener, priority)
    }

    const emit = <K extends EKey>(type: K, event: Event<K>) => {
        if (!events[type]) return
        queue.push(event)
    }

    const processEvents = () => {
        while (queue.length) {
            const event = queue.shift()!
            const listeners = events[event._type]
            if (!listeners) continue
            // @ts-expect-error - no events registered
            for (const l of listeners) {
                l.listener(event)
            }
        }
    }

    hex.log.debug('[HEX] Events Initialized.')
    return {
        on,
        off,
        once,
        emit,
        processEvents,
    }
}
