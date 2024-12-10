import { describe, it, expect } from 'bun:test'
import { Hex } from '../engine'
import { LogLevel } from '../utils/log'

const hexOptions = {
    log_options: {
        level: LogLevel.DEBUG,
        outputs: [{ output: { write() {} } }],
    },
}
describe('Core Engine', () => {
    it('initializing with no config', () => {
        const hex = new Hex(hexOptions)
        expect(hex).toBeDefined()
        expect(hex.config.log_options.level).toBe(LogLevel.DEBUG)
    })
    // TODO: Add more tests
})
