import type { Hex } from './engine'

type AssertEvent = <K extends EKey, T extends Event<K>>(
    type: K,
    event: EventRegistry[EKey]
) => asserts event is T
interface EventI {
    type: EKey
}
interface EventRegistry {}
type EKey = keyof EventRegistry
type Event<T extends EKey> = EventRegistry[T]
type Listener<T> = { listener: (event: T) => void; priority: number }
/**
 * A generic EventEmitter class that allows subscribing to and emitting events.
 *
 * @template E - A record type where keys are event names and values are the event payload types.
 */
class EventEmitter<E extends Record<string, unknown>> {
    /**
     * A private object that holds arrays of listeners for each event type.
     */
    private listeners: { [K in keyof E]?: Array<Listener<E[K]>> } = {}

    /**
     * Registers a listener for a specific event type.
     *
     * @param type - The event type to listen for.
     * @param listener - The callback function to invoke when the event is emitted.
     * @param priority - The priority of the listener. Higher priority listeners are called first. Default is 0.
     */
    on<K extends keyof E>(type: K, listener: (event: E[K]) => void, priority = 0) {
        if (!this.listeners[type]) this.listeners[type] = []
        this.listeners[type]!.push({ listener, priority })
        this.listeners[type]!.sort((a, b) => b.priority - a.priority)
    }

    /**
     * Unregisters a listener for a specific event type.
     *
     * @param type - The event type to stop listening for.
     * @param listener - The callback function to remove.
     */
    off<K extends keyof E>(type: K, listener: (event: E[K]) => void) {
        if (!this.listeners[type]) return
        const i = this.listeners[type]!.findIndex((l) => l.listener === listener)
        if (i !== -1) this.listeners[type]!.splice(i, 1)
    }

    /**
     * Emits an event of a specific type, invoking all registered listeners for that event type.
     *
     * @param type - The event type to emit.
     * @param event - The event payload to pass to the listeners.
     */
    emit<K extends keyof E>(type: K, event: E[K]) {
        if (!this.listeners[type]) return
        for (const l of this.listeners[type]!) {
            l.listener(event)
        }
    }
}

export function initEvents(hex: Hex) {
    hex.log.debug('EVENTS: Initialized.')

    const events: Record<EKey, EventI> = {}
}
