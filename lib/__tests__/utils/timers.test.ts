import { describe, expect, it, jest } from 'bun:test'

import { Timer, timer } from '../../utils/timers'
import { Hex } from '../../engine'
import { LogLevel } from '../../utils/log'
const options = {
    log_options: { level: LogLevel.DEBUG, outputs: [{ output: { write() {} } }] },
}
describe('Timer', () => {
    const hex = new Hex(options)
    let tick = 0
    const fn = jest.fn(() => tick)
    const timer = new Timer(hex, fn)
    it('should measure time', () => {
        const end = timer.start('test')
        expect(fn).toHaveBeenCalledTimes(1)
        tick = 1
        end()
        expect(fn).toHaveBeenCalledTimes(2)
    })
})

describe('timer', () => {
    const writer = jest.fn((s) => s)
    const hex = new Hex({
        log_options: {
            level: LogLevel.DEBUG,
            outputs: [{ output: { write: writer }, formatter: (m) => m.message }],
        },
    })
    let tick = 0
    const fn = jest.fn(() => tick)
    const timerFn = timer(hex, fn)
    it('should measure time', () => {
        const label = 'test'
        const end = timerFn(label)
        expect(fn).toHaveBeenCalledTimes(1)
        tick = 1
        end()
        expect(fn).toHaveBeenCalledTimes(2)
        expect(writer).toHaveBeenCalledTimes(4)
        expect(writer).toHaveBeenNthCalledWith(4, `[Performance] ${label}: 1 ticks`)
    })
})
