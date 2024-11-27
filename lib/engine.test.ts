import { describe, it, expect } from 'bun:test'
import { Hex } from './engine'
import { LogLevel, MemoryLog, type LoggerOptions } from './log'

describe('core', () => {
    it('should initialize with no config', () => {
        const hex = new Hex()
        const options = hex.utils.config.log_options

        expect(options?.level).toBe(LogLevel.DEBUG)
        expect(options?.outputs).toHaveLength(1)
    })
    it('should initialize with a config', () => {
        const mem = new MemoryLog()
        const log_options: LoggerOptions = {
            level: LogLevel.DEBUG,
            outputs: [mem],
        }
        const hex = new Hex({ log_options })
        const options = hex.utils.config.log_options

        expect(options?.level).toBe(LogLevel.DEBUG)
        expect(options?.outputs).toHaveLength(1)
        expect(mem.print().length).toBeGreaterThan(0)
    })
})
