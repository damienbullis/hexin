import type { makeEngine } from './engine'

export interface SystemRegistry {}
export interface ComponentRegistry {}

export interface ComponentBase {
    // __type: string
}
export interface SystemBase {
    // __type: string
    run(delta: number): void
}

export type Engine = ReturnType<typeof makeEngine>
export type SKeys = keyof SystemRegistry
export type System<T extends SKeys = SKeys> = SystemRegistry[T]
export type CKeys = keyof ComponentRegistry
export type Component<T extends CKeys = CKeys> = ComponentRegistry[T]

export interface CoreSystemsI {
    addSystem<K extends SKeys, S extends System<K>>(
        system: [K, S | ((core: Engine) => S)]
    ): void
    getSystem<K extends SKeys, S extends System<K>>(id: K): S
}
export interface CoreEntitiesI {
    getComponent<K extends CKeys, C extends Component<K>>(id: K): C
}
