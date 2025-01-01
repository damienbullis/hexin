import { type LoggerOptions } from './log'

export type HexConfig = {
    log_options: LoggerOptions
    rng_seed: number
    // tick_rate: number
    tick_interval: number
    enable_rendering: boolean
    interval_fn: (next: (delta: number) => void) => void
    max_ticks: number | undefined
}

const DEFAULT: HexConfig = {
    log_options: {
        level: 'DEBUG',
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

export function initConfig(c: Partial<HexConfig>): HexConfig {
    return {
        ...DEFAULT,
        ...c,
        log_options: { ...DEFAULT.log_options, ...c.log_options },
    }
}
