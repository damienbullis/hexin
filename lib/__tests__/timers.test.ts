import { describe, expect, it, jest } from 'bun:test'

import { Hex } from '..'

describe('Timer', () => {
    const tick = 1 / 60
    let nextFn: (delta: number) => void
    const write = jest.fn((s) => s)
    const hex = new Hex({
        log_options: {
            level: 'DEBUG',
            outputs: [{ output: { write } }],
        },
        interval_fn: (next) => (nextFn = next),
    })
    const timer = hex.utils.timer
    hex.engine.start()
    it('should measure time by callback', () => {
        const ticks = 2
        const label = 'test'
        const end = timer.start(label)

        for (let i = 0; i < ticks; i++) nextFn(tick)
        expect(hex.engine.count()).toBe(2)
        end()

        const last = write.mock.calls[write.mock.calls.length - 1]

        // @ts-expect-error - test is a string
        expect(JSON.parse(last).message).toBe(`[PERF] ${label}: ${ticks} ticks`)
        expect(() => end()).toThrow()
    })

    it('should measure time by label', () => {
        const label = 'test2'
        timer.start(label)

        nextFn(tick)
        expect(hex.engine.count()).toBe(3)
        timer.end(label)

        const last = write.mock.calls[write.mock.calls.length - 1]

        // @ts-expect-error - test2 is a string
        expect(JSON.parse(last).message).toBe(`[PERF] ${label}: 1 ticks`)
        expect(() => timer.end(label)).toThrow()
    })
})
