export interface SystemRegistry {}
export interface ComponentRegistry {}

// Base Interfaces
export interface SystemI {
    _type: SKeys | string
    run(delta: number): void
    render?(interpolation: number): void
}
export interface ComponentI {
    _type: CKeys | string
}
export type SKeys = keyof SystemRegistry
export type System<K extends SKeys = SKeys> = SystemRegistry[K]

export type CKeys = keyof ComponentRegistry
export type Component<K extends CKeys = CKeys> = ComponentRegistry[K]

// type RegisterSystem<T extends SystemI> = {
//     [K in T['_type']]: T
// }
