import { initLog, LogLevel } from './log'
import type { HexConfig } from '../types'
import { initErrors } from './errors'

const DEFAULT: HexConfig = {
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

export function initUtils(config: Partial<HexConfig>) {
    const log = initLog(config)
    const makeErrors = initErrors(log)
    const utils = {
        log,
        // REFACTOR: might want to a deep merge here?
        config: { ...DEFAULT, ...config },
        makeErrors,
    }
    log.debug('UTILS: Initialized.', utils)
    return utils
}
