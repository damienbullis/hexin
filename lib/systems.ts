import type { CoreSystemsI, System, SKeys, Engine, SystemBase } from './types'
import { assert, assertType } from './utils'

function makeSystem<S extends SystemBase, T extends ((e: Engine) => S) | S>(
    system: T
) {
    return system
}

function coreSystems(engine: Engine): CoreSystemsI {
    const systemsMap: { [K in SKeys]?: System<K> } = {}
    const systems: System[] = []
    // const graph = null // TODO: Implement dependency graph
    return {
        addSystem(system) {
            const sys = typeof system === 'function' ? system(engine) : system
            // @ts-ignore - because we dont have initial systems
            const id = sys.__type
            assert(
                // @ts-ignore - because we dont have initial systems
                !systemsMap[id],
                `System (${id}) already exists.`
            )
            // @ts-ignore - because we dont have initial systems
            systemsMap[id] = sys
            systems.push(sys)
        },
        getSystem<K extends SKeys, S extends System<K>>(id: K): S {
            assert(systemsMap[id], `System (${id}) not found.`)
            assertType<S>(systemsMap[id])
            return systemsMap[id]
        },
    }
}

export { makeSystem, coreSystems }
