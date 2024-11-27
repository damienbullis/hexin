import type { Hex } from './engine'
import type { SKeys, System } from './types'

enum SystemErrors {
    NOT_FOUND = 'System not found',
    TYPE_MISMATCH = 'System type mismatch',
    EXISTS = 'System already exists',
}

/**
 * Initialize Hex Systems
 * @param engine
 * @returns Systems API
 */
export function initSystems(engine: Hex) {
    const systemMap = new Map<string, System>()
    const systems: System[] = []
    // const depGraph = []
    return {
        /**
         * Add a system to the engine
         */
        add<T extends System>(s: { new (e: Hex): T }) {
            const system = new s(engine)
            if (systemMap.has(system._type))
                throw new Error(`${SystemErrors.EXISTS}: ${system._type}`)
            systemMap.set(system._type, system)
        },
        /**
         * Get a system from the engine
         */
        get<K extends SKeys>(type: K): System<K> {
            const system = systemMap.get(type)
            if (!system) throw new Error(`${SystemErrors.NOT_FOUND}: ${type}`)

            assertSystem(system, type)
            return system
        },
        all() {
            return systems
        },
    }
}

function assertSystem<K extends SKeys>(
    system: System,
    type: K
): asserts system is System<K> {
    if (system._type !== type) throw new Error(SystemErrors.TYPE_MISMATCH)
}
