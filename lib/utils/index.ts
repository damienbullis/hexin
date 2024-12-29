import { initLog, LogLevel } from './log'
import type { HexConfig } from '../types'
import { initErrors } from './errors'

const DEFAULT: HexConfig = {
    log_options: {
        level: LogLevel.DEBUG,
        outputs: [{ output: { write: console.log } }],
    },
    rng_seed: 0,
    // tick_rate: 60,
    tick_interval: 1 / 60,
    enable_rendering: false,
    interval_fn: (next) =>
        setInterval(() => next(DEFAULT.tick_interval), DEFAULT.tick_interval * 1000),
    max_ticks: undefined,
}

export function initUtils(c: Partial<HexConfig>) {
    const config: HexConfig = {
        ...DEFAULT,
        ...c,
        log_options: { ...DEFAULT.log_options, ...c.log_options },
    }
    const log = initLog(config.log_options)
    const makeErrors = initErrors(log)
    const utils = {
        log,
        config,
        errors: {
            system: makeErrors('System'),
            component: makeErrors('Component'),
            event: makeErrors('Event'),
        },
    }
    log.debug('HEX: Utilities Initialized.')
    return utils
}

export { HexTimer } from './timers'
