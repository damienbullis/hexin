import type { Hex } from '.'

export interface SystemRegistry {}

export interface HexSystem {
    _type: SKey
    run(delta: number): void
    render?(interpolation: number): void
}

type SKey = keyof SystemRegistry
type System<K extends SKey = SKey> = SystemRegistry[K]

type AssertSystem = <K extends SKey, T extends System<K>>(s: HexSystem, type: K) => asserts s is T

/**
 * Hex Systems Initializer
 */
export function initSystems(hex: Hex) {
    const { SystemError } = hex.utils.errors
    const systemMap: Record<string, HexSystem> = {}
    const graph = new Map<HexSystem, HexSystem[]>()
    let isDirty = false

    let systems: HexSystem[] = []
    const preSystems: HexSystem[] = []
    const postSystems: HexSystem[] = []

    const assertSystem: AssertSystem = (s, type) => {
        if (s._type !== type) {
            throw new SystemError('TYPE_MISMATCH', `${s._type} !== ${type}`)
        }
    }

    // Dependency Graph Helpers
    const getDeps = (system: HexSystem): HexSystem[] => graph.get(system) || []
    const getSystems = (): HexSystem[] => Array.from(graph.keys())
    const addDep = (system: HexSystem, dep: HexSystem) => {
        if (!graph.has(system)) throw new SystemError('NOT_FOUND', system._type)
        if (!graph.has(dep)) throw new SystemError('NOT_FOUND', dep._type)
        if (graph.get(dep)?.includes(system))
            throw new SystemError('CYCLE', `${dep._type} / ${system._type}`)
        graph.get(system)!.push(dep)
        isDirty = true
    }
    const hasCycle = (
        allSystems: HexSystem[],
        visited: Set<HexSystem> = new Set(),
        recStack: Set<HexSystem> = new Set()
    ): boolean => {
        for (const s of allSystems) {
            if (hasCycleUtil(s, visited, recStack)) {
                return true
            }
        }
        return false
    }
    const hasCycleUtil = (
        system: HexSystem,
        visited: Set<HexSystem>,
        recStack: Set<HexSystem>
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

    const topSort = (): HexSystem[] => {
        if (!isDirty) return systems

        // Initialize dependency count map
        const dependencyCountMap = new Map<HexSystem, number>()
        for (const system of getSystems()) {
            dependencyCountMap.set(system, 0)
            for (const dependency of getDeps(system)) {
                dependencyCountMap.set(dependency, (dependencyCountMap.get(dependency) || 0) + 1)
            }
        }

        // Collect systems with no dependencies
        const queue: HexSystem[] = []
        for (const [system, dependencyCount] of dependencyCountMap) {
            if (dependencyCount === 0) {
                queue.push(system)
            }
        }

        // Perform topological sort
        const sortedSystems: HexSystem[] = []
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

    return {
        add(system: { new (e: Hex): HexSystem }) {
            const s = new system(hex)
            if (systemMap[s._type]) throw new SystemError('EXISTS', s._type)
            systemMap[s._type] = s
            if (!graph.has(s)) {
                graph.set(s, [])
                isDirty = true
            }
        },

        get<K extends SKey>(type: K, dep?: SKey): System<K> {
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

        use(system: SKey, dep: SKey): void {
            const s = systemMap[system]
            const d = systemMap[dep]
            if (!s) throw new SystemError('NOT_FOUND', system)
            if (!d) throw new SystemError('NOT_FOUND', dep)
            addDep(s, d)
        },

        all() {
            return topSort()
        },

        addHook(type: 'pre' | 'post', system: { new (e: Hex): HexSystem }) {
            const s = new system(hex)
            if (type === 'post') postSystems.push(s)
            else preSystems.push(s)
        },
    }
}
