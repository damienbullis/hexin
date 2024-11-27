import type { Hex } from './engine'
import type { SKeys, System } from './types'

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
                throw new Error(
                    `System with type ${system._type} already exists`
                )

            systemMap.set(system._type, system)
        },
        /**
         * Get a system from the engine
         */
        get<K extends SKeys>(type: K): System<K> {
            const system = systemMap.get(type)
            if (!system) throw new Error(`System with type ${type} not found`)
            if (system._type !== type) throw new Error(`System type mismatch`)
            return system as System<K>
        },
        all() {
            return systems
        },
    }
}
