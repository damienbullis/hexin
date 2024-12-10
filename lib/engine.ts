import type { HexConfig } from './types'
// import { initEntities } from './entities'
import { initSystems } from './systems'
// import { initEvents } from './events'
import { initUtils } from './utils'
// import { rainbowIntroText } from '../utils'

// type HexEntities = ReturnType<typeof initEntities>
type HexSystems = ReturnType<typeof initSystems>
// type HexEvents = ReturnType<typeof initEvents>
// type HexUtils = ReturnType<typeof initUtils>
type HexLog = ReturnType<typeof initUtils>['log']
type HexErrors = ReturnType<typeof initUtils>['errors']

class Hex {
    log: HexLog
    config: HexConfig
    systems: HexSystems
    errors: HexErrors
    // events: HexEvents
    constructor(c: Partial<HexConfig> = {}) {
        const { log, config, errors } = initUtils(c)
        this.log = log
        this.config = config
        this.errors = errors

        // NEXT: Events
        this.systems = initSystems(this)
        // NEXT: Components / Entities
    }
}

export { Hex }
