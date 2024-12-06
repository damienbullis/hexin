import { describe, expect, it } from 'bun:test'
import { initEntities } from './entities'
import { Hex } from './engine'

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
            'Should throw when trying to delete a incorrect id'
        ).toThrow()
        expect(entities.all()[0]).toBeDefined()
        expect(
            entities.delete(0),
            'can delete an entity that does exist'
        ).toBeUndefined()
        expect(entities.all()[0]).toBeUndefined()
    })
})
