import { coreSystems } from './systems'
import { coreEntities } from './entities'

class Engine {
    systems: ReturnType<typeof coreSystems>
    entities: ReturnType<typeof coreEntities>
    constructor() {
        this.systems = coreSystems(this)
        this.entities = coreEntities()
    }
}

function makeEngine() {
    return new Engine()
}

export { makeEngine }
