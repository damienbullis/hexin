import { initLog } from './log'
import type { HexinConfig } from '../types'

export function initUtils(config: Partial<HexinConfig>) {
    const log = initLog(config)
    log.debug('Initializing utils')
    const utils = {
        log,
        config,
    }
    log.debug('Utils initialized')
    return utils
}
