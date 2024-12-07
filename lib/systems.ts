import type { Hex } from './engine'
import type { SKeys, System, SystemI } from './types'
type AssertSystem = <K extends SKeys, T extends System<K>>(
    s: SystemI,
    type: K
) => asserts s is T
/**
 * Initialize Hex Systems
 * @param engine
 * @returns Systems API
 */
export function initSystems<S extends SystemI = SystemI>(engine: Hex) {
    const systemMap: Record<string, S> = {}
    const graph = new Map<S, S[]>()
    let systems: S[] = []
    let isDirty = false

    const systemError = (type: keyof typeof SystemErrors, message?: string) => {
        const err = new HexSystemError(type, message)
        // not sure if I like including the stack
        engine.log.error(err.message, { stack: err.stack })
        return err
    }
    const assertSystem: AssertSystem = (s, type) => {
        if (s._type !== type) {
            throw systemError('TYPE_MISMATCH', `${s._type} !== ${type}`)
        }
    }
    const getDeps = (system: S): S[] => {
        return graph.get(system) || []
    }
    const getSystems = (): S[] => {
        return Array.from(graph.keys())
    }
    const addDep = (system: S, dep: S) => {
        if (!graph.has(system)) throw systemError('NOT_FOUND', system._type)
        if (!graph.has(dep)) throw systemError('NOT_FOUND', dep._type)
        if (graph.get(dep)?.includes(system))
            throw systemError('CYCLE', `${dep._type} deps on ${system._type}`)
        graph.get(system)!.push(dep)
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
        if (sorted.length !== allSystems.length) throw systemError('CYCLE')
        if (hasCycle(allSystems)) throw systemError('CYCLE')

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
            if (systemMap[s._type]) throw systemError('EXISTS', s._type)
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
            if (!system) throw systemError('NOT_FOUND', type)
            if (dep) {
                const d = systemMap[dep]
                if (!d) throw systemError('NOT_FOUND', dep)
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
            if (!s) throw systemError('NOT_FOUND', system)
            if (!d) throw systemError('NOT_FOUND', dep)
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

// Do I like these?
enum SystemErrors {
    NOT_FOUND = 'System not found',
    TYPE_MISMATCH = 'System type mismatch',
    EXISTS = 'System already exists',
    CYCLE = 'Cycle detected',
}
class HexSystemError extends Error {
    constructor(type: keyof typeof SystemErrors, message?: string) {
        super(`${SystemErrors[type]}${message ? `: ${message}` : ''}`)
        this.name = type
    }
}
