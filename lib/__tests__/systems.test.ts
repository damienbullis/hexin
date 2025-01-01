import { describe, expect, it } from 'bun:test'
import { Hex } from '..'
import { initSystems, type SystemRegistry, type HexSystem } from '../systems'

const createSystem = (type: string) => {
    return class implements HexSystem {
        _type = type as keyof SystemRegistry
        run() {}
    }
}
const A = createSystem('A')
const B = createSystem('B')
const C = createSystem('C')

// To check if the types are working correctly uncomment the following:
// declare module '..' {
//     interface SystemRegistry {
//         A: typeof A
//         B: typeof B
//     }
// }

// After uncommenting the above,
// you should see each @ts-expect-error show an lsp error

describe('Systems', () => {
    const hex = new Hex({
        log_options: {
            level: 'DEBUG',
            outputs: [{ output: { write() {} } }],
        },
    })

    const systems = initSystems(hex)
    it('can add a system', () => {
        systems.add(A)
        expect(systems.all()).toHaveLength(1)
    })
    it('can get a system', () => {
        // @ts-expect-error - no systems registered
        const system = systems.get('A')
        expect(system).toBeInstanceOf(A)
        // @ts-expect-error - no systems registered
        expect(system._type).toBe('A')
    })
    it('should throw when system not found', () => {
        // @ts-expect-error - no systems registered
        expect(() => systems.get('C')).toMatchSnapshot()
    })
    it('should throw when adding a duplicate system', () => {
        expect(() => systems.add(A)).toMatchSnapshot()
    })
})

describe('w/ Dependencies', () => {
    const hex = new Hex({
        log_options: {
            level: 'DEBUG',
            outputs: [{ output: { write() {} } }],
        },
    })
    it('add a dependency to a system', () => {
        const systems = initSystems(hex)
        systems.add(A)
        systems.add(B)
        // @ts-expect-error - no systems registered
        expect(systems.all()[0]!._type).toBe('B')
        // @ts-expect-error - no systems registered
        systems.use('B', 'A')

        const all = systems.all()
        expect(all).toHaveLength(2)
        // @ts-expect-error - no systems registered
        expect(all[0]!._type).toBe('A')
    })
    it('throws when adding a cycle', () => {
        const systems = initSystems(hex)
        systems.add(A)
        systems.add(B)
        // @ts-expect-error - no systems registered
        systems.use('A', 'B')

        // @ts-expect-error - no systems registered
        expect(() => systems.use('B', 'A')).toMatchSnapshot()
    })

    it('sort systems by dependencies', () => {
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
        // @ts-expect-error - no systems registered
        expect(all).toEqual(['B', 'C', 'A'])
    })

    it('get system & add dependency (A -> B)', () => {
        const systems = initSystems(hex)
        systems.add(A)
        systems.add(B)
        // @ts-expect-error - no systems registered
        systems.get('B', 'A')
        // @ts-expect-error - no systems registered
        expect(systems.all()[0]!._type).toBe('A')
    })
    it('get system & add dependency (B -> A)', () => {
        const systems = initSystems(hex)
        systems.add(A)
        systems.add(B)
        // @ts-expect-error - no systems registered
        systems.get('A', 'B')
        // @ts-expect-error - no systems registered
        expect(systems.all()[0]!._type).toBe('B')
        // @ts-expect-error - no systems registered
        expect(() => systems.get('A', 'C')).toMatchSnapshot()
    })
})

describe('w/ Hooks', () => {
    const hex = new Hex({
        log_options: {
            level: 'DEBUG',
            outputs: [{ output: { write() {} } }],
        },
    })
    it('can add systems to pre hook', () => {
        const systems = initSystems(hex)
        systems.add(A)
        systems.add(B)
        // @ts-expect-error - no systems registered
        systems.use('A', 'B')
        systems.addHook('pre', C)
        // @ts-expect-error - no systems registered
        expect(systems.all()[0]!._type).toBe('C')
        // @ts-expect-error - no systems registered
        expect(systems.all()[1]!._type).toBe('B')
        // @ts-expect-error - no systems registered
        expect(systems.all()[2]!._type).toBe('A')
    })

    it('can add systems to post hook', () => {
        const systems = initSystems(hex)
        systems.add(A)
        systems.add(B)
        // @ts-expect-error - no systems registered
        systems.use('A', 'B')
        systems.addHook('post', C)
        // @ts-expect-error - no systems registered
        expect(systems.all()[0]!._type).toBe('B')
        // @ts-expect-error - no systems registered
        expect(systems.all()[1]!._type).toBe('A')
        // @ts-expect-error - no systems registered
        expect(systems.all()[2]!._type).toBe('C')
    })
})
