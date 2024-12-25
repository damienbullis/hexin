import { describe, expect, it } from 'bun:test'
import { initComponents } from '../entities'
import { Hex } from '../engine'
import { LogLevel } from '../utils/log'
// import type { Component } from './types'

const hexOptions = {
    log_options: {
        level: LogLevel.DEBUG,
        outputs: [{ output: { write() {} } }],
    },
}
describe('Entities', () => {
    const hex = new Hex(hexOptions)
    const entities = initComponents(hex)

    it('can create an entity', () => {
        const id = entities.create()
        expect(id).toBe(0)
    })

    it('can delete an entity', () => {
        expect(() => entities.delete(1), 'cannot delete an entity that does not exist').toThrow()
        expect(entities.all()[0]).toBeDefined()
        expect(entities.delete(0), 'can delete an entity that does exist').toBeUndefined()
        expect(entities.all()[0]).toBeUndefined()
    })

    it('pool deleted entities', () => {
        const _ = entities.create()
        const id = entities.create()
        expect(id).toBe(1)
        entities.delete(id)
        const id2 = entities.create()
        expect(id2).toBe(1)
        entities.delete(_)
        entities.delete(id2)
    })

    it('can add a component to an entity', () => {
        const id = entities.create()
        expect(() => entities.add(id, { _type: 'A' })).not.toThrow()
        expect(() => entities.add(id, { _type: 'A' })).toThrow()
        entities.delete(id)
    })

    it('can remove a component', () => {
        const id = entities.create()
        entities.add(id, { _type: 'A' })
        // @ts-expect-error - no components registered
        expect(() => entities.remove(id, 'A')).not.toThrow()
        // @ts-expect-error - no components registered
        expect(() => entities.remove(id, 'A')).toThrow()
        entities.add(id, [{ _type: 'A' }, { _type: 'B' }])
        // @ts-expect-error - no components registered
        expect(() => entities.remove(id, ['A', 'B'])).not.toThrow()
        // @ts-expect-error - no components registered
        expect(() => entities.remove(id, ['A', 'B'])).toThrow()
        entities.delete(id)
    })

    it('can get a component', () => {
        const id = entities.create()
        entities.add(id, { _type: 'A' })
        entities.add(id, { _type: 'B' })
        // @ts-expect-error - no components registered
        expect(entities.get(id, 'A')['_type']).toBe('A')
        entities.delete(id)
    })

    it('can get multiple components', () => {
        const id = entities.create()
        entities.add(id, { _type: 'A' })
        entities.add(id, { _type: 'B' })
        // @ts-expect-error - no components registered
        const components = entities.getMany(id, ['A', 'B'])
        expect(components.length).toBe(2)
        // @ts-expect-error - no components registered
        expect(components[0]!['_type']).toBe('A')
        // @ts-expect-error - no components registered
        expect(components[1]!['_type']).toBe('B')
        entities.delete(id)
    })

    it('can get all entities with a component', () => {
        const id1 = entities.create()
        const id2 = entities.create()
        entities.add(id1, { _type: 'A' })
        entities.add(id2, { _type: 'A' })
        // @ts-expect-error - no components registered
        const entitiesWithA = entities.with('A')
        expect(entitiesWithA.length).toBe(2)
        expect(entitiesWithA).toContain(id1)
        expect(entitiesWithA).toContain(id2)
        entities.delete(id1)
        entities.delete(id2)
    })

    it('can get all entities with multiple components', () => {
        const id1 = entities.create()
        const id2 = entities.create()
        entities.add(id1, { _type: 'A' })
        entities.add(id1, { _type: 'B' })
        entities.add(id2, { _type: 'A' })
        // @ts-expect-error - no components registered
        const entitiesWithAB = entities.with(['A', 'B'])
        expect(entitiesWithAB.length).toBe(1)
        expect(entitiesWithAB).toContain(id1)
        entities.delete(id1)
        entities.delete(id2)
    })

    it('can get entities with components and their components', () => {
        const id1 = entities.create()
        const id2 = entities.create()
        entities.add(id1, { _type: 'A' })
        entities.add(id1, { _type: 'B' })
        entities.add(id2, { _type: 'A' })
        // @ts-expect-error - no components registered
        const entitiesWithAB = entities.getWith(['A', 'B'])
        expect(entitiesWithAB.length).toBe(1)
        expect(entitiesWithAB[0]!.length).toBe(2)
        // @ts-expect-error - no components registered
        expect(entitiesWithAB[0]![0]!['_type']).toBe('A')
        // @ts-expect-error - no components registered
        expect(entitiesWithAB[0]![1]!['_type']).toBe('B')
        entities.delete(id1)
        entities.delete(id2)
    })
})
