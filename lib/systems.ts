import type { Hex } from '.'
import type { SKeys, System, SystemI } from './types'

type AssertSystem = <K extends SKeys, T extends System<K>>(s: SystemI, type: K) => asserts s is T

/**
 * Hex Systems Initializer
 */
export function initSystems(hex: Hex) {
    const SystemError = hex.utils.errors.system
    const systemMap: Record<string, SystemI> = {}
    const graph = new Map<SystemI, SystemI[]>()
    let isDirty = false

    let systems: SystemI[] = []
    const preSystems: SystemI[] = []
    const postSystems: SystemI[] = []

    const assertSystem: AssertSystem = (s, type) => {
        if (s._type !== type) {
            throw new SystemError('TYPE_MISMATCH', `${s._type} !== ${type}`)
        }
    }

    // Dependency Graph Helpers
    const getDeps = (system: SystemI): SystemI[] => graph.get(system) || []
    const getSystems = (): SystemI[] => Array.from(graph.keys())
    const addDep = (system: SystemI, dep: SystemI) => {
        if (!graph.has(system)) throw new SystemError('NOT_FOUND', system._type)
        if (!graph.has(dep)) throw new SystemError('NOT_FOUND', dep._type)
        if (graph.get(dep)?.includes(system))
            throw new SystemError('CYCLE', `${dep._type} / ${system._type}`)
        graph.get(system)!.push(dep)
        isDirty = true
    }
    const hasCycle = (
        allSystems: SystemI[],
        visited: Set<SystemI> = new Set(),
        recStack: Set<SystemI> = new Set()
    ): boolean => {
        for (const s of allSystems) {
            if (hasCycleUtil(s, visited, recStack)) {
                return true
            }
        }
        return false
    }
    const hasCycleUtil = (
        system: SystemI,
        visited: Set<SystemI>,
        recStack: Set<SystemI>
    ): boolean => {
        if (!visited.has(system)) {
            visited.add(system)
            recStack.add(system)
            const deps = getDeps(system)
            for (const dep of deps) {
                if (!visited.has(dep) && hasCycleUtil(dep, visited, recStack)) {
                    return true
                } else if (recStack.has(dep)) {
                    return true
                }
            }
        }
        recStack.delete(system)
        return false
    }

    /**
     * Topological sort of systems, based on dependencies
     */
    const topSort = (): SystemI[] => {
        if (!isDirty) return systems

        // Initialize dependency count map
        const dependencyCountMap = new Map<SystemI, number>()
        for (const system of getSystems()) {
            dependencyCountMap.set(system, 0)
            for (const dependency of getDeps(system)) {
                dependencyCountMap.set(dependency, (dependencyCountMap.get(dependency) || 0) + 1)
            }
        }

        // Collect systems with no dependencies
        const queue: SystemI[] = []
        for (const [system, dependencyCount] of dependencyCountMap) {
            if (dependencyCount === 0) {
                queue.push(system)
            }
        }

        // Perform topological sort
        const sortedSystems: SystemI[] = []
        while (queue.length) {
            const system = queue.shift()!
            sortedSystems.push(system)
            for (const dependency of getDeps(system)) {
                dependencyCountMap.set(dependency, (dependencyCountMap.get(dependency) || 0) - 1)
                if ((dependencyCountMap.get(dependency) || 0) === 0) {
                    queue.push(dependency)
                }
            }
        }

        // Check for cycles
        const allSystems = getSystems()
        if (sortedSystems.length !== allSystems.length || hasCycle(allSystems)) {
            throw new SystemError('CYCLE')
        }

        // Reverse the list to get the correct order
        sortedSystems.reverse()
        // Add any pre or post systems
        systems = preSystems.concat(sortedSystems, postSystems)
        isDirty = false
        return systems
    }

    hex.log.debug('HEX: Systems Initialized.')
    return {
        /**
         * Add a system to the engine
         * @param system The system class to add.
         * @example
         * ```ts
         * class SomeSystem extends SystemI {
         *   // ...
         * }
         * engine.systems.add(SomeSystem) // Add the system class, not an instance.
         * ```
         */
        add(system: { new (e: Hex): SystemI }) {
            const s = new system(hex)
            if (systemMap[s._type]) throw new SystemError('EXISTS', s._type)
            systemMap[s._type] = s
            if (!graph.has(s)) {
                graph.set(s, [])
                isDirty = true
            }
        },
        /**
         * Get a system from the engine
         * @param type The type of system
         * @param dep Optional add a dependency to the system. (Typically used by systems, during initialization)
         */
        get<K extends SKeys>(type: K, dep?: SKeys): System<K> {
            const system = systemMap[type]
            if (!system) throw new SystemError('NOT_FOUND', type)
            if (dep) {
                const d = systemMap[dep]
                if (!d) throw new SystemError('NOT_FOUND', dep)
                addDep(system, d)
            }
            assertSystem(system, type)
            return system
        },
        /**
         * Add a dependency between two systems
         * @param system The system to add dependency to
         * @param dep The system to depend on
         */
        use(system: SKeys, dep: SKeys): void {
            const s = systemMap[system]
            const d = systemMap[dep]
            if (!s) throw new SystemError('NOT_FOUND', system)
            if (!d) throw new SystemError('NOT_FOUND', dep)
            addDep(s, d)
        },
        /**
         * Get all systems
         */
        all() {
            return topSort()
        },
        /**
         * Add a system to the pre or post hook
         */
        addHook(type: 'pre' | 'post', system: { new (e: Hex): SystemI }) {
            const s = new system(hex)
            if (type === 'post') postSystems.push(s)
            else preSystems.push(s)
        },
    }
}
