import type { Hex } from './engine'
import type { CKeys, Component, ComponentI } from './types'

// TODO: Add deferred system for interfacing with entities to avoid changing state during system execution.
// Defer changes to the end of the frame.

type Entity = number

const assertComponent: AssertComponent = (comp, type) => {
    if (comp._type !== type) {
        throw new Error(`Component ${type} not mismatched`)
    }
}

export function initEntities(_: Hex) {
    let nextId = 0
    const pool: Entity[] = []
    const entities: Array<ComponentI[]> = []
    const componentEntityMap: Record<string, Entity[]> = {}

    const addComponent = (entity: Entity, component: ComponentI) => {
        const key = component._type
        const map = componentEntityMap[key]
        if (entities[entity]!.find((c) => c._type === key))
            throw new Error(`Entity ${entity} already has component ${key}`)
        if (!map) {
            componentEntityMap[key] = [entity]
        } else {
            map.push(entity)
        }
        entities[entity]!.push(component)
    }

    const removeComponent = (entity: Entity, type: CKeys) => {
        const ent = entities[entity]
        if (!ent) throw new Error(`Entity ${entity} not found`)
        const map = componentEntityMap[type]
        if (!map) throw new Error(`Component ${type} not found in map`)
        const idx = ent.findIndex((c) => c._type === type)
        if (idx === -1)
            throw new Error(`Component ${type} not found in entity ${entity}`)
        // Remove component from entity
        ent.splice(idx, 1)

        const mapIdx = map.indexOf(entity)
        if (mapIdx === -1)
            throw new Error(`Entity ${entity} not found in component map`)
        // Remove entity from component map
        map.splice(mapIdx, 1)
    }

    return {
        /**
         * Create a new entity
         */
        create() {
            const id = pool.length ? pool.pop()! : nextId++
            entities[id] = []
            return id
        },
        /**
         * Delete an entity
         */
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
        /**
         * Add a component or components to an entity
         */
        add(entity: Entity, components: ComponentI | Array<ComponentI>) {
            if (!entities[entity]) throw new Error(`Entity ${entity} not found`)
            if (Array.isArray(components)) {
                for (const component of components) {
                    addComponent(entity, component)
                }
            } else {
                addComponent(entity, components)
            }
        },
        /**
         * Remove a component or components from an entity
         */
        remove(entity: Entity, types: CKeys | Array<CKeys>) {
            const ent = entities[entity]
            if (!ent) throw new Error(`Entity ${entity} not found`)
            if (Array.isArray(types)) {
                for (const type of types) {
                    removeComponent(entity, type)
                }
            } else {
                removeComponent(entity, types)
            }
        },
        /**
         * Get a component or components from an entity
         */
        get<K extends CKeys>(entity: Entity, type: K): Component<K> {
            const ent = entities[entity]
            if (!ent) throw new Error(`Entity ${entity} not found`)
            const c = ent.find((c) => c._type === type)
            if (!c)
                throw new Error(
                    `Component ${type} not found in entity ${entity}`
                )

            assertComponent(c, type)
            return c
        },
        /**
         * Get all components from an entity
         */
        getMany<T extends Component[]>(entity: Entity, types: CKeys[]): T {
            return types.map((t) => this.get(entity, t)) as T
        },
        /**
         * Get all entities with a component or components
         */
        with(types: CKeys | Array<CKeys>) {
            if (Array.isArray(types)) {
                const sets = types.map((type) => componentEntityMap[type] || [])
                const [first, ...rest] = sets.sort(
                    (a, b) => a.length - b.length
                )
                return (
                    first?.filter((e) => rest.every((s) => s.includes(e))) || []
                )
            } else {
                const map = componentEntityMap[types]
                return map || []
            }
        },
        /**
         * Convenience method to get entities with components, then get those components.
         */
        getWith<T extends Component[]>(types: CKeys | Array<CKeys>) {
            return this.with(types).map((e) => {
                if (Array.isArray(types)) {
                    return this.getMany<T>(e, types)
                } else {
                    return this.get(e, types)
                }
            })
        },
        /**
         * Get all entities
         */
        all() {
            return entities
        },
    }
}
type AssertComponent = <K extends CKeys, T extends Component<K>>(
    c: ComponentI,
    type: K
) => asserts c is T
