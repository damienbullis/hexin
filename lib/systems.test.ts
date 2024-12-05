import { describe, expect, it } from 'bun:test'
import { Hex } from './engine'
import type { SystemI } from './types'
import { initSystems } from './systems'

import { MemoryLog } from './utils/log/writers'
import { LogLevel } from './utils/log'

// @ts-expect-error - test system
class A implements System {
    _type = 'A'
    run() {}
}
// @ts-expect-error - test system
class B implements System {
    _type = 'B'
    run() {}
}

const hex = new Hex({
    log_options: {
        level: LogLevel.DEBUG,
        outputs: [{ output: new MemoryLog() }],
    },
})

// To check if the types are working correctly uncomment the following:
// declare module './types' {
//     interface SystemRegistry {
//         A: A
//         B: B
//     }
// }

// After uncommenting the above,
// you should see each @ts-expect-error show an lsp error
describe('Systems', () => {
    const systems = initSystems(hex)
    it('Add a system', () => {
        systems.add(A)
        expect(systems.all()).toHaveLength(1)
    })
    it('Get a system', () => {
        // @ts-expect-error - no systems registered
        const system = systems.get('A')
        expect(system).toBeInstanceOf(A)
        // @ts-expect-error - no systems registered
        expect(system._type).toBe('A')
    })
    it('should throw when system not found', () => {
        // @ts-expect-error - no systems registered
        expect(() => systems.get('C')).toThrow('System not found: C')
    })
    it('should throw when adding a duplicate system', () => {
        expect(() => systems.add(A)).toThrow('System already exists: A')
    })
})

describe('w/ Dependencies', () => {
    it('add a dependency to a system', () => {
        const systems = initSystems(hex)
        systems.add(A)
        systems.add(B)
        expect(systems.all()[0]!._type).toBe('B')
        // @ts-expect-error - no systems registered
        systems.use('B', 'A')

        const all = systems.all()
        expect(all).toHaveLength(2)
        expect(all[0]!._type).toBe('A')
    })
    it('throws when adding a cycle', () => {
        const systems = initSystems(hex)
        systems.add(A)
        systems.add(B)
        // @ts-expect-error - no systems registered
        systems.use('A', 'B')
        // @ts-expect-error - no systems registered
        expect(() => systems.use('B', 'A')).toThrow('Cycle detected')
    })

    it('sort systems by dependencies', () => {
        class C implements SystemI {
            _type = 'C'
            run() {}
        }
        const systems = initSystems(hex)
        systems.add(A)
        systems.add(B)
        systems.add(C)

        // @ts-expect-error - no systems registered
        systems.use('A', 'B')
        // @ts-expect-error - no systems registered
        systems.use('C', 'B')
        // @ts-expect-error - no systems registered
        systems.use('A', 'C')
        const all = systems.all().map((s) => s._type)
        expect(all).toEqual(['B', 'C', 'A'])
    })

    it('get system & add dependency (A -> B) returns correct system order', () => {
        const systems = initSystems(hex)
        systems.add(A)
        systems.add(B)
        // @ts-expect-error - no systems registered
        systems.get('B', 'A')
        expect(systems.all()[0]!._type).toBe('A')
    })
    it('get system & add dependency (B -> A) returns correct system order', () => {
        const systems = initSystems(hex)
        systems.add(A)
        systems.add(B)
        // @ts-expect-error - no systems registered
        systems.get('A', 'B')
        expect(systems.all()[0]!._type).toBe('B')
        // @ts-expect-error - no systems registered
        expect(() => systems.get('A', 'C')).toThrow('System not found: C')
    })
})
