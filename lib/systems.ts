// import type { SystemRegistry } from './core'
import type {
    CoreSystemsI,
    System,
    SKeys,
    Engine,
    SystemRegistry,
} from './types'
import { assert, assertType } from './utils'

// declare module './core' {
//     interface SystemRegistry {}
//     // interface ComponentRegistry {}
// }

function makeSystem<S extends System, T extends ((e: Engine) => S) | S>(
    system: T
) {
    return system
}

function coreSystems(engine: Engine): CoreSystemsI {
    const systemsMap: Partial<SystemRegistry> = {}
    const systems: System[] = []
    // const graph = null // TODO: Implement dependency graph
    return {
        addSystem([id, system]) {
            const sys = typeof system === 'function' ? system(engine) : system
            assert(!systemsMap[id], `System (${id}) already exists.`)
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
