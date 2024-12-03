import { describe, it, expect } from 'bun:test'
import { Hex } from './engine'
import { LogLevel } from './utils/log'

describe('Core Engine', () => {
    it('initializing with no config', () => {
        const hex = new Hex()
        expect(hex).toBeDefined()
        expect(hex.config.log_options.level).toBe(LogLevel.DEBUG)
    })
    // TODO: Add more tests
})
