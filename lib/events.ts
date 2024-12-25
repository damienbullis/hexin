import type { Hex } from '.'

/**
 * Base Event Interface
 */
interface EventI {
    type: string
}
/**
 * Event Registry
 */
export interface EventRegistry {}
type ER = EventRegistry
export type EKey = keyof ER
export type Event<T extends EventI> = T extends ER[infer K extends keyof ER] ? ER[K] : EventI
type Listener<T> = { listener: (event: T) => void; priority: number }

/**
 * A generic EventEmitter class that allows subscribing to and emitting events.
 *
 * @template E - A record type where keys are event names and values are the event payload types.
 */
class EventEmitter<E> {
    /**
     * A private object that holds arrays of listeners for each event type.
     */
    private listeners: { [K in keyof E]?: Listener<E[K]>[] } = {}
    private eventQueue: E[keyof E][] = []

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
     * Registers a one-time event listener for the specified event type.
     * The listener is invoked at most once after being added. If the event is emitted,
     * the listener is removed immediately after being called.
     *
     * @template K - The type of the event.
     * @param type - The name of the event to listen for.
     * @param listener - The callback function to execute when the event is emitted.
     * @param priority - The priority of the listener. Higher priority listeners are called first. Default is 0.
     */
    once<K extends keyof E>(type: K, listener: (event: E[K]) => void, priority = 0) {
        const onceListener = (e: E[K]) => {
            listener(e)
            this.off(type, onceListener)
        }
        this.on(type, onceListener, priority)
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
        this.eventQueue.push(event)
    }

    /**
     * Processes all events in the event queue.
     */
    processEvents() {
        while (this.eventQueue.length) {
            const event = this.eventQueue.shift()!

            // NEXT: Fix these type cast
            assertEvent(event)
            const listeners = this.listeners[event.type as keyof E]
            if (!listeners) continue
            for (const l of listeners) {
                l.listener(event)
            }
        }
    }
}

function assertEvent(_: unknown): asserts _ is EventI {}

export function initEvents(hex: Hex) {
    const events = new EventEmitter<ER>()
    const on = events.on.bind(events)
    const once = events.once.bind(events)
    const off = events.off.bind(events)
    const emit = events.emit.bind(events)
    const processEvents = events.processEvents.bind(events)

    hex.log.debug('HEX: Events Initialized.')
    return {
        on,
        once,
        off,
        emit,
        processEvents,
    }
}
