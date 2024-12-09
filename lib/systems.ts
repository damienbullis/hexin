import type { Hex } from './engine'
import type { SKeys, System, SystemI } from './types'

type AssertSystem = <K extends SKeys, T extends System<K>>(
    s: SystemI,
    type: K
) => asserts s is T

// Do I like these?
enum SystemErrors {
    TYPE_MISMATCH = 'System type mismatch',
    EXISTS = 'System already exists',
    NOT_FOUND = 'System not found',
    CYCLE = 'Cycle detected',
}
class HexSystemError extends Error {
    constructor(type: keyof typeof SystemErrors, message?: string) {
        super(`${SystemErrors[type]}${message ? `: ${message}` : ''}`)
        this.name = type
    }
}
// Default System
export class Deferred implements SystemI {
    _type = `Deferred`
    private arr: (() => void)[] = []

    add(fn: () => void) {
        this.arr.push(fn)
    }
    run() {
        for (const fn of this.arr) {
            fn()
        }
        this.arr = []
    }
}

/**
 * Hex Systems Initializer
 */
export function initSystems(engine: Hex) {
    const deferred = new Deferred()
    const systemMap: Record<string, SystemI> = {}
    const graph = new Map<SystemI, SystemI[]>()
    let systems: SystemI[] = []
    let isDirty = false

    // Errors
    const systemError = (type: keyof typeof SystemErrors, message?: string) => {
        const err = new HexSystemError(type, message)
        engine.log.error(err.message)
        return err
    }
    const assertSystem: AssertSystem = (s, type) => {
        if (s._type !== type) {
            throw systemError('TYPE_MISMATCH', `${s._type} !== ${type}`)
        }
    }

    // Dependency Graph Helpers
    const getDeps = (system: SystemI): SystemI[] => graph.get(system) || []
    const getSystems = (): SystemI[] => Array.from(graph.keys())
    const addDep = (system: SystemI, dep: SystemI) => {
        if (!graph.has(system)) throw systemError('NOT_FOUND', system._type)
        if (!graph.has(dep)) throw systemError('NOT_FOUND', dep._type)
        if (graph.get(dep)?.includes(system))
            throw systemError('CYCLE', `${dep._type} deps on ${system._type}`)
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

        let inDegree = new Map<SystemI, number>()
        for (const system of getSystems()) {
            inDegree.set(system, 0)
            for (const dep of getDeps(system)) {
                inDegree.set(dep, (inDegree.get(dep) || 0) + 1)
            }
        }

        let queue: SystemI[] = []
        for (const [system, degree] of inDegree) {
            if (degree === 0) {
                queue.push(system)
            }
        }

        let sorted: SystemI[] = []
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
        sorted.push(deferred)
        systems = sorted
        isDirty = false
        return systems
    }

    engine.log.debug('SYSTEMS: Initialized.')
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
        add<T extends SystemI>(system: { new (e: Hex): T }): void {
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
         * Get all systems
         */
        all() {
            return topSort()
        },
    }
}
