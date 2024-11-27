import type { Hex } from './engine'
import type { HexinConfig } from './types'

export function initUtils(hex: Hex, config: Partial<HexinConfig>) {
    hex.log.debug('Initializing utils')
    const utils = {
        config,
    }
    hex.log.debug('Utils initialized')
    return utils
}
