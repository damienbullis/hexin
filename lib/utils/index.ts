import { initLog, LogLevel } from './log'
import type { HexConfig } from '../types'
import { initErrors } from './errors'

const DEFAULT: HexConfig = {
    log_options: {
        level: LogLevel.DEBUG,
        outputs: [{ output: { write: console.log } }],
    },
    rng_seed: 0,
    tick_rate: 60,
}

export function initUtils(c: Partial<HexConfig>) {
    const config = { ...DEFAULT, ...c }
    const log = initLog(config.log_options)
    const makeErrors = initErrors(log)
    const utils = {
        log,
        config,
        errors: {
            system: makeErrors('System'),
            entity: makeErrors('Entity'),
            event: makeErrors('Event'),
        },
    }
    log.debug('UTILS: Initialized.', utils)
    return utils
}
