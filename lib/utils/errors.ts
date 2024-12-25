import type { Hex } from '..'

type ErrorDomainTypes = 'System' | 'Entity' | 'Event'

export function initErrors(log: Hex['log']) {
    const errors = {
        TYPE_MISMATCH: 'Type Mismatch',
        EXISTS: 'Already Exists',
        NOT_FOUND: 'Not Found',
        CYCLE: 'Cycle Detected',
    }

    return (domain: ErrorDomainTypes) =>
        class HexError extends Error {
            constructor(type: keyof typeof errors, message?: string) {
                const msgEnd = message ? `: ${message}` : ''
                super(`${errors[type]}${msgEnd}`)
                this.name = `Hex${domain}`
                log.error(this.message)
            }
        }
}
