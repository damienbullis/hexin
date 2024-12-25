import type { Hex } from './engine'

export function initTick(hex: Hex) {
    hex.log.debug('HEX: Tick Initialized.')
    const tickRate = hex.utils.config.tick_rate
    const tickInterval = 1 / tickRate
    let count = 0
    return {
        count,
    }
}
