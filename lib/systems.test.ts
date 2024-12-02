import { Hex } from './engine'
import { initSystems } from './systems'
import { beforeEach, describe, expect, it } from 'bun:test'
import type { System, SystemBase } from './types'
import { LogLevel } from './utils/log'
import { MemoryLog } from './utils/log/writers'

// @ts-expect-error - test system
class TestSystem implements System {
    _type = 'TestSystem'
    run() {}
}

// To check if the types are working correctly uncomment the following:
// declare module './types' {
//     interface SystemRegistry {
//         TestSystem: TestSystem
//     }
// }

// After uncommenting the above,
// you should see each @ts-expect-error show an lsp error
describe('Core Systems', () => {
    let hex: Hex

    beforeEach(() => {
        // configure hex with memory log for testing
        hex = new Hex({
            log_options: {
                level: LogLevel.DEBUG,
                outputs: [{ output: new MemoryLog() }],
            },
        })
    })
    it('should initialize with no systems', () => {
        const systems = initSystems(hex)
        expect(systems.all()).toHaveLength(0)
    })
    it('should be able to add a system', () => {
        const systems = initSystems(hex)
        systems.add(TestSystem)

        expect(systems.all()).toHaveLength(1)
    })
    it('should get a system, and the type should match', () => {
        const systems = initSystems(hex)
        systems.add(TestSystem)

        // @ts-expect-error - no systems registered
        const system = systems.get('TestSystem')
        expect(system).toBeInstanceOf(TestSystem)

        // @ts-expect-error - no systems registered
        expect(system._type).toBe('TestSystem')
    })
    it('should throw when system not found', () => {
        const systems = initSystems(hex)

        // @ts-expect-error - no systems registered
        expect(() => systems.get('TestSystem')).toThrow()
    })
    it('should throw when adding a duplicate system', () => {
        const systems = initSystems(hex)
        systems.add(TestSystem)

        expect(() => systems.add(TestSystem)).toThrow()
    })

    it('should add a system with dependencies', () => {
        const systems = initSystems(hex)
        class DepSystem implements SystemBase {
            _type = 'DepSystem'
            run() {}
        }
        class DependentSystem implements SystemBase {
            _type = 'DependentSystem'
            run() {}
        }
        systems.add(DepSystem)
        systems.add(DependentSystem)
        // @ts-expect-error - no systems registered
        systems.use('DepSystem', 'DependentSystem')
        // @ts-expect-error - no systems registered
        systems.use('DependentSystem', 'DepSystem')

        const all = systems.all()
        expect(all).toHaveLength(2)
        expect(all[0]!._type).toBe('DependentSystem')
    })
})
