import { describe, it, expect } from 'bun:test'
import { Hex } from '..'

describe('Core Engine', () => {
    it('initializing with no config', () => {
        const hex = new Hex({
            log_options: {
                level: 'DEBUG',
                outputs: [{ output: { write() {} } }],
            },
        })
        expect(hex).toBeDefined()
        expect(hex.utils.config.log_options.level).toBe('DEBUG')
    })
    // TODO: Add more tests
})
