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
    enable_rendering: false,
}

export function initUtils(c: Partial<HexConfig>) {
    const config: HexConfig = {
        log_options: { ...DEFAULT.log_options, ...c.log_options },
        rng_seed: c.rng_seed ?? DEFAULT.rng_seed,
        tick_rate: c.tick_rate ?? DEFAULT.tick_rate,
        enable_rendering: c.enable_rendering ?? DEFAULT.enable_rendering,
    }
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
    log.debug('HEX: Utilities Initialized.', utils)
    return utils
}

export { Timer } from './timers'
