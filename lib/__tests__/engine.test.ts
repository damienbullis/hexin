import { describe, it, expect, beforeEach, afterEach } from 'bun:test'
import { Hex } from '..'

describe('Engine', () => {
    let hex: Hex
    let nextFn: (delta: number) => void
    const tick = 1 / 60
    beforeEach(() => {
        const h = new Hex({
            log_options: {
                outputs: [{ output: { write: () => {} } }],
                level: 'DEBUG',
            },
            interval_fn: (next) => {
                nextFn = next
            },
            max_ticks: 1000,
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
        expect(hex.engine.count()).toBe(0)
        nextFn(tick)
        expect(hex.engine.count()).toBe(1)
        hex.engine.stop()
        nextFn(tick)
        expect(hex.engine.count()).toBe(1)
        hex.engine.start()
        expect(hex.engine.count()).toBe(0)
    })

    it('should tick', () => {
        nextFn(tick)
        nextFn(tick)
        expect(hex.engine.count()).toBe(2)
    })

    it('should pause & unpause', () => {
        expect(hex.engine.isPaused()).toBeFalse()
        nextFn(tick)
        hex.engine.pause()
        expect(hex.engine.isPaused()).toBeTrue()
        nextFn(tick)
        expect(hex.engine.count()).toBe(1)
        hex.engine.pause() // unpause
        expect(hex.engine.isPaused()).toBeFalse()
        nextFn(tick)
        expect(hex.engine.count()).toBe(2)
    })

    it('should run until max ticks is reached', () => {
        const total = 1000
        for (let i = 0; i < total; i++) {
            nextFn(tick)
        }
        expect(hex.engine.count()).toBe(total)
        nextFn(tick)
        expect(hex.engine.count()).toBe(total)
    })
})
