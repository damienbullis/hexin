import { initLog, LogLevel } from './log'
import type { HexinConfig } from '../types'

const DEFAULT: HexinConfig = {
    log_options: {
        level: LogLevel.DEBUG,
        outputs: [
            {
                output: console,
            },
        ],
    },
    rng_seed: 0,
}

export function initUtils(config: Partial<HexinConfig>) {
    const log = initLog(config)
    const utils = {
        log,
        // REFACTOR: might want to a deep merge here?
        config: { ...DEFAULT, ...config },
    }
    log.debug('UTILS: Initialized.', utils)
    return utils
}
