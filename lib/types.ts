import type { LoggerOptions } from './log'

// System Types
export interface SystemBase {
    _type: string
    run(delta: number): void
}
// interface NullSystem extends SystemBase {
//     type: '__null'
// }
export interface SystemRegistry {
    // __null: NullSystem
}
export type SKeys = keyof SystemRegistry
export type Systems = SystemRegistry[SKeys]
export type System<
    K extends SKeys = SKeys,
    T extends SystemBase = SystemBase,
> = T extends SystemRegistry[K] ? T : SystemBase

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
