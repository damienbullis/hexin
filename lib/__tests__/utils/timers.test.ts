import { describe, expect, it, jest } from 'bun:test'

import { HexTimer } from '../../timers'
import { LogLevel } from '../../utils/log'
import { Hex } from '../..'

describe('Timer', () => {
    const hex = new Hex({
        log_options: { level: LogLevel.DEBUG, outputs: [{ output: { write() {} } }] },
    })
    let tick = 0
    const fn = jest.fn(() => tick++)
    const timer = new HexTimer(hex, fn)
    it('should measure time by callback', () => {
        const end = timer.start('test')
        expect(fn).toHaveBeenCalledTimes(1)
        end()
        expect(fn).toHaveBeenCalledTimes(2)
        expect(() => end()).toThrow()
        expect(fn).toHaveBeenCalledTimes(2)
    })

    it('should measure time by label', () => {
        timer.start('test2')
        expect(fn).toHaveBeenCalledTimes(3)
        timer.end('test2')
        expect(fn).toHaveBeenCalledTimes(4)
        expect(() => timer.end('test2')).toThrow()
    })
})
