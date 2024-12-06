import type { Hex } from './engine'
import type { CKeys, Component, ComponentI } from './types'

// TODO: Add deferred system for interfacing with entities to avoid changing state during system execution.
// Defer changes to the end of the frame.

type Entity = number

export function initEntities(engine: Hex) {
    let nextId = 0
    const pool: Entity[] = []
    const entities: Array<ComponentI[]> = []
    const componentEntityMap: Record<string, Entity[]> = {}

    return {
        /**
         * Create a new entity
         */
        create() {
            const id = pool.length ? pool.pop()! : nextId++
            entities[id] = []
            return id
        },
        delete(entity: Entity) {
            if (!entities[entity]) throw new Error(`Entity ${entity} not found`)
            for (const comp of entities[entity]) {
                const key = comp._type
                const map = componentEntityMap[key]
                if (!map) throw new Error(`Component ${key} not found in map`)
                const idx = map.indexOf(entity)
                if (idx === -1)
                    throw new Error(
                        `Entity ${entity} not found in component map`
                    )
                map.splice(idx, 1)
            }
            delete entities[entity]
            pool.push(entity)
        },
        add() {},
        /**
         * Get a component or components from an entity
         */
        get<K extends CKeys>(entity: Entity, type: K): Component<K> {
            const ent = entities[entity]
            if (!ent) throw new Error(`Entity ${entity} not found`)
            const comp = ent.find((c) => c._type === type)
            if (!comp)
                throw new Error(
                    `Component ${type} not found in entity ${entity}`
                )
            assertComponent(comp, type)
            return comp
        },
        with() {},
        getWith() {},
        all() {
            return entities
        },
    }
}

function assertComponent<K extends CKeys, T extends Component<K>>(
    comp: ComponentI,
    type: K
): asserts comp is T {
    if (comp._type !== type) {
        throw new Error(`Component ${type} not mismatched`)
    }
}

// show me a infer the first element of an array in typescript
type First<T extends any[]> = T extends [infer F, ...any[]] ? F : never
