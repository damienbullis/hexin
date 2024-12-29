import { describe, it, expect, beforeEach, afterEach } from 'bun:test'
import { Hex } from '..'
import { LogLevel } from '../utils/log'

describe('Engine', () => {
    let hex: Hex
    let nextFn: (delta: number) => void
    const tick = 1 / 60
    beforeEach(() => {
        const h = new Hex({
            log_options: {
                outputs: [{ output: { write: () => {} } }],
                level: LogLevel.DEBUG,
            },
            interval_fn: (next) => {
                nextFn = next
            },
        })

        hex = h
        hex.engine.start()
    })

    afterEach(() => {
        hex.engine.stop()
    })

    it('should initialize', () => {
        expect(hex.engine).toBeDefined()
    })

    it('should start & stop', () => {
        hex.engine.start()
        expect(hex.engine.getCount()).toBe(0)
        nextFn(tick)
        expect(hex.engine.getCount()).toBe(1)
        hex.engine.stop()
        nextFn(tick)
        expect(hex.engine.getCount()).toBe(1)
        hex.engine.start()
        expect(hex.engine.getCount()).toBe(0)
    })

    it('should tick', () => {
        nextFn(tick)
        nextFn(tick)
        expect(hex.engine.getCount()).toBe(2)
    })

    it('should pause & unpause', () => {
        nextFn(tick)
        hex.engine.pause() // pause it
        nextFn(tick)
        expect(hex.engine.getCount()).toBe(1)
        hex.engine.pause() // unpause it
        nextFn(tick)
        expect(hex.engine.getCount()).toBe(2)
    })

    it('should run X number of times', () => {
        const total = 1000
        for (let i = 0; i < total; i++) {
            nextFn(tick)
        }
        expect(hex.engine.getCount()).toBe(total)
    })
})
