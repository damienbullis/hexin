import { describe, expect, it, jest } from 'bun:test'
import { initEvents } from '../events'
import { Hex } from '../engine'
import { LogLevel } from '../utils/log'

const hexOptions = {
    log_options: {
        level: LogLevel.DEBUG,
        outputs: [{ output: { write() {} } }],
    },
}

// To check if the types are working correctly uncomment the following:
// declare module '../events' {
//     interface EventRegistry {
//         testEvent: { type: 'testEvent' }
//     }
// }

// If the above is uncommented, you should see an lsp error on all @ts-expect-error lines

describe('Events', () => {
    const hex = new Hex(hexOptions)
    const { events } = initEvents(hex)

    it('can register and emit an event', () => {
        const mockListener = jest.fn()
        // @ts-expect-error - no events registered
        events.on('testEvent', mockListener)
        // @ts-expect-error - no events registered
        events.emit('testEvent', { type: 'testEvent' })
        expect(mockListener).toHaveBeenCalled()
    })

    it('can register a one-time event listener', () => {
        const mockListener = jest.fn()
        // @ts-expect-error - no events registered
        events.once('testEvent', mockListener)
        // @ts-expect-error - no events registered
        events.emit('testEvent', { type: 'testEvent' })
        // @ts-expect-error - no events registered
        events.emit('testEvent', { type: 'testEvent' })
        expect(mockListener).toHaveBeenCalledTimes(1)
    })

    it('can unregister an event listener', () => {
        const mockListener = jest.fn()
        // @ts-expect-error - no events registered
        events.on('testEvent', mockListener)
        // @ts-expect-error - no events registered
        events.off('testEvent', mockListener)
        // @ts-expect-error - no events registered
        events.emit('testEvent', { type: 'testEvent' })
        expect(mockListener).not.toHaveBeenCalled()
    })
})
