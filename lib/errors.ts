import type { Hex } from '.'

export function initErrors(hex: Hex) {
    const errors = {
        TYPE_MISMATCH: 'Type Mismatch',
        EXISTS: 'Already Exists',
        NOT_FOUND: 'Not Found',
        CYCLE: 'Cycle Detected',
    }

    const makeError = (name: string) => {
        return class HexError extends Error {
            constructor(type: keyof typeof errors, message?: string) {
                const msgEnd = message ? `: ${message}` : ''
                super(`${errors[type]}${msgEnd}`)
                this.name = `Hex${name}Error`
                hex.log.error(this.message)
            }
        }
    }

    return {
        SystemError: makeError('System'),
        ComponentError: makeError('Component'),
        EventError: makeError('Event'),
    }
}
