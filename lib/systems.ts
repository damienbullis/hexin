import type { Hex } from './engine'
import type { SKeys, System } from './types'

/**
 * Initialize Hex Systems
 * @param engine
 * @returns
 */
export function initSystems(engine: Hex) {
    const systemMap = new Map<SKeys, System>()
    const systems: System[] = []
    return {
        /**
         * Add a system to the engine
         */
        add<T extends System>(system: T) {},
        /**
         * Get a system from the engine
         */
        get<K extends SKeys>(type: K): System<K> {
            // @ts-ignore
            return null as System<K>
        },
    }
}
