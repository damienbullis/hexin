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
type HexError = ReturnType<ReturnType<typeof initUtils>['makeErrors']>
type HexErrors = {
    system: HexError
    entity: HexError
    event: HexError
}

class Hex {
    log: HexLog
    config: HexConfig
    systems: HexSystems
    errors: HexErrors
    // events: HexEvents
    constructor(c: Partial<HexConfig> = {}) {
        const { log, config, makeErrors } = initUtils(c)
        this.log = log
        this.config = config
        this.errors = {
            system: makeErrors('System'),
            entity: makeErrors('Entity'),
            event: makeErrors('Event'),
        }

        // NEXT: Events
        this.systems = initSystems(this)
        // NEXT: Components / Entities
    }
}

export { Hex }
