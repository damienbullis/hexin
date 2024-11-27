import type { LoggerOptions } from './log'

// System Types
export interface SystemBase {
    _type: string
    run(delta: number): void
}
export interface SystemRegistry {}
export type SKeys = keyof SystemRegistry
export type System<T extends SystemBase = SystemBase> = T extends {
    _type: infer U extends SKeys
}
    ? SystemRegistry[U]
    : SystemBase

// Component Types
export interface ComponentBase {}
export interface ComponentRegistry {}
export type CKeys = keyof ComponentRegistry
export type Component<T extends ComponentBase = ComponentBase> = T extends {
    _type: infer U extends CKeys
}
    ? ComponentRegistry[U]
    : ComponentBase

// Additional Types
export type HexinConfig = {
    log_options: LoggerOptions
    rng_seed: number
}
