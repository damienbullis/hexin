import { describe, expect, it, jest } from 'bun:test'

import { LogLevel } from '../../utils/log'
import { Timer } from '../../utils/timers'
import { Hex } from '../..'
const options = {
    log_options: { level: LogLevel.DEBUG, outputs: [{ output: { write() {} } }] },
}
describe('Timer', () => {
    const hex = new Hex(options)
    let tick = 0
    const fn = jest.fn(() => tick++)
    const timer = new Timer(hex, fn)
    it('should measure time', () => {
        const end = timer.start('test')
        expect(fn).toHaveBeenCalledTimes(1)
        end()
        expect(fn).toHaveBeenCalledTimes(2)
        expect(() => end()).toThrow()
        expect(fn).toHaveBeenCalledTimes(2)
    })
})
