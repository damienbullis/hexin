import { assert } from './utils'
import type {
    Component,
    CoreEntitiesI,
    Engine,
    ComponentRegistry,
} from './types'

function makeComponent<C extends Component, T extends ((e: Engine) => C) | C>(
    component: T
) {
    return component
}

function coreEntities(): CoreEntitiesI {
    const componentsMap: ComponentRegistry = {}
    return {
        getComponent(key) {
            assert(key in componentsMap, `Component (${key}) not found.`)
            return componentsMap[key]
        },
    }
}

export { makeComponent, coreEntities }
