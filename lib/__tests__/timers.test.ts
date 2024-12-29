import { describe, expect, it, jest } from 'bun:test'

import { LogLevel } from '../log'
import { Hex } from '..'

describe('Timer', () => {
    const tick = 1 / 60
    let nextFn: (delta: number) => void
    const write = jest.fn((s) => s)
    const hex = new Hex({
        log_options: {
            level: LogLevel.DEBUG,
            outputs: [{ output: { write } }],
        },
        interval_fn: (next) => (nextFn = next),
    })
    const timer = hex.utils.timer
    hex.engine.start()
    it('should measure time by callback', () => {
        const end = timer.start('test')
        nextFn(tick)
        nextFn(tick)
        expect(write).lastCalledWith('[HEX] Timer: test took 0.03333333333333333s')
        expect(hex.engine.getCount()).toBe(2)
        end()
        expect(hex.engine.getCount()).toBe(2)

        // expect(hex.engine.getCount()).toBe(1)
        // expect(() => end()).toThrow()
        // expect(hex.engine.getCount()).toBe(1)
        // expect(hex.engine.getCount)
    })

    it('should measure time by label', () => {
        // timer.start('test2')
        // expect(fn).toHaveBeenCalledTimes(3)
        // timer.end('test2')
        // expect(fn).toHaveBeenCalledTimes(4)
        // expect(() => timer.end('test2')).toThrow()
    })
})
