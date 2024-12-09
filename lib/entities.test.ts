import { describe, expect, it } from 'bun:test'
import { initEntities } from './entities'
import { Hex } from './engine'
// import type { Component } from './types'

describe('Entities', () => {
    const hex = new Hex() // add log options
    const entities = initEntities(hex)
    it('can create an entity', () => {
        const id = entities.create()
        expect(id).toBe(0)
    })
    it('can delete an entity', () => {
        expect(
            () => entities.delete(1),
            'cannot delete an entity that does not exist'
        ).toThrow()
        expect(entities.all()[0]).toBeDefined()
        expect(
            entities.delete(0),
            'can delete an entity that does exist'
        ).toBeUndefined()
        expect(entities.all()[0]).toBeUndefined()
    })
    it('pool deleted entities', () => {
        entities.create()
        const id = entities.create()
        expect(id).toBe(1)
        entities.delete(id)
        const id2 = entities.create()
        expect(id2).toBe(1)
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
})

//     declare module './types' {
//         interface ComponentRegistry {
//         A: { _type: 'A' }
//         B: { _type: 'B' }
//     }
// }
