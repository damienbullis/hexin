import type { LoggerOptions } from './utils/log'

// System Types
export interface SystemBase {
    _type: string
    run(delta: number): void
}
// interface NullSystem extends SystemBase {
//     type: 'TestSystem'
// }
export interface SystemRegistry {
    // TestSystem: NullSystem
}
export type SKeys = keyof SystemRegistry
type Systems = SystemRegistry[SKeys]
export type System<
    // K extends SKeys = SKeys, T extends Systems = Systems> =
    //     T extends PickSystem<K> ? T : SystemBase
    K extends SKeys = SKeys,
    T extends Systems = Systems,
> = T extends SystemRegistry[K] ? T : SystemBase

// Component Types
export interface ComponentBase {
    _type: CKeys
}
export interface ComponentRegistry {}
export type CKeys = keyof ComponentRegistry
export type Component<
    K extends CKeys = CKeys,
    T extends ComponentBase = ComponentBase,
> = T extends ComponentRegistry[K] ? T : ComponentBase

// Additional Types
export type HexinConfig = {
    log_options: LoggerOptions
    rng_seed: number
}
