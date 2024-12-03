import type { Hex } from './engine'
import type { SKeys, System, SystemBase } from './types'

// Do I like these?
enum SystemErrors {
    NOT_FOUND = 'System not found',
    TYPE_MISMATCH = 'System type mismatch',
    EXISTS = 'System already exists',
    CYCLE = 'Cycle detected',
}

/**
 * Initialize Hex Systems
 * @param engine
 * @returns Systems API
 */
export function initSystems<S extends SystemBase = SystemBase>(engine: Hex) {
    const systemMap = new Map<string, S>()
    const graph = new Map<S, S[]>()
    let systems: S[] = []
    let isDirty = false

    const getDeps = (system: S): S[] => {
        return graph.get(system) || []
    }
    const getSystems = (): S[] => {
        return Array.from(graph.keys())
    }

    const addDep = (system: S, dep: S) => {
        if (!graph.has(system))
            throw new Error(`${SystemErrors.NOT_FOUND}: ${system}`)
        if (!graph.has(dep))
            throw new Error(`${SystemErrors.NOT_FOUND}: ${dep}`)
        graph.get(system)!.push(dep)
        if (hasCycle(getSystems())) {
            throw new Error(SystemErrors.CYCLE)
        }
        isDirty = true
    }

    const hasCycle = (
        allSystems: S[],
        visited: Set<S> = new Set(),
        recStack: Set<S> = new Set()
    ): boolean => {
        for (const s of allSystems) {
            if (hasCycleUtil(s, visited, recStack)) {
                return true
            }
        }
        return false
    }

    const hasCycleUtil = (
        system: S,
        visited: Set<S>,
        recStack: Set<S>
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
     * Topological sort of systems
     */
    const topSort = (): S[] => {
        if (!isDirty) return systems

        let inDegree = new Map<S, number>()
        for (const system of getSystems()) {
            inDegree.set(system, 0)
            for (const dep of getDeps(system)) {
                inDegree.set(dep, (inDegree.get(dep) || 0) + 1)
            }
        }

        let queue: S[] = []
        for (const [system, degree] of inDegree) {
            if (degree === 0) {
                queue.push(system)
            }
        }

        let sorted: S[] = []
        while (queue.length) {
            const system = queue.shift()!
            sorted.push(system)
            for (const dep of getDeps(system)) {
                inDegree.set(dep, (inDegree.get(dep) || 0) - 1)
                if ((inDegree.get(dep) || 0) === 0) {
                    queue.push(dep)
                }
            }
        }

        const allSystems = getSystems()
        if (sorted.length !== allSystems.length) {
            throw new Error(SystemErrors.CYCLE)
        }
        if (hasCycle(allSystems)) {
            throw new Error(SystemErrors.CYCLE)
        }

        sorted.reverse()
        systems = sorted
        isDirty = false
        return systems
    }

    return {
        /**
         * Add a system to the engine
         * @param system The system to add. Must extend SystemBase.
         */
        add<T extends S>(system: { new (e: Hex): T }): void {
            const s = new system(engine)
            if (systemMap.has(s._type))
                throw new Error(`${SystemErrors.EXISTS}: ${s._type}`)
            systemMap.set(s._type, s)
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
            const system = systemMap.get(type)
            if (!system) throw new Error(`${SystemErrors.NOT_FOUND}: ${type}`)
            if (dep) {
                const d = systemMap.get(dep)
                if (!d) throw new Error(`${SystemErrors.NOT_FOUND}: ${dep}`)
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
            const s = systemMap.get(system)
            const d = systemMap.get(dep)
            if (!s) throw new Error(`${SystemErrors.NOT_FOUND}: ${system}`)
            if (!d) throw new Error(`${SystemErrors.NOT_FOUND}: ${dep}`)
            addDep(s, d)
        },
        /**
         * Return all systems in topological order
         */
        all() {
            return topSort()
        },
    }
}

function assertSystem<K extends SKeys, T extends System<K>>(
    system: SystemBase,
    type: K
): asserts system is T {
    if (system._type !== type) throw new Error(SystemErrors.TYPE_MISMATCH)
}
