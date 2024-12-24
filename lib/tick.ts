import type { Hex } from './engine'

export function initTick(hex: Hex) {
    hex.log.debug('TICK: Initialized.')
    let count = 0
    return {
        count,
    }
}
