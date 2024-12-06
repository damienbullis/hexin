import type { LoggerOptions } from './utils/log'

// System Types
export interface SystemI {
    _type: SKeys | string
    run(delta: number): void
}
// type RegisterSystem<T extends SystemI> = {
//     [K in T['_type']]: T
// }
export interface SystemRegistry {
    // TestSystem: NullSystem
}
export type SKeys = keyof SystemRegistry
export type System<K extends SKeys = SKeys> = SystemRegistry[K]
// export type System<
//     K extends SKeys = SKeys,
//     T extends SystemI = SystemI,
// > = T extends SystemRegistry[K] ? T : SystemI

// Component Types
export interface ComponentI {
    _type: CKeys | string
}
export interface ComponentRegistry {
    // Test: Test
}

// export type Component<
//     K extends CKeys = CKeys,
//     T extends ComponentBase = ComponentBase,
// > = T extends ComponentRegistry[K] ? T : ComponentBase

export type CKeys = keyof ComponentRegistry
export type Component<K extends CKeys = CKeys> = ComponentRegistry[K]

// Additional Types
export type HexConfig = {
    log_options: LoggerOptions
    rng_seed: number
}

// class Test implements ComponentBase {
//     _type = 'Test'
//     tesxt() {}
// }

// const eng = {
//     components: {} as Record<string, ComponentBase>,
//     add<T extends Component | ComponentBase>(c: T): T {
//         assertType<CKeys | string>(c._type)
//         // assertType<Record<string, ComponentBase>>(this.components)
//         this.components[c._type] = c
//         return c
//     },
//     get<K extends CKeys>(key: K): Component<K> {
//         const comp = this.components[key]
//         if (!comp) {
//             throw new Error(`Component ${key} not found`)
//         }
//         // assertType<ComponentBase>(comp)
//         if (comp._type !== key) {
//             throw new Error(`Component ${key} not mismatched`)
//         }
//         assertType<Component<K>>(comp)
//         return comp
//     },
// }

// const tt = eng.get('Test')
// eng.add(new Test())
