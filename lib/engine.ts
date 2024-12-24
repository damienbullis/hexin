import type { HexConfig } from './types'
import { initEntities } from './entities'
import { initSystems } from './systems'
import { initUtils } from './utils'
import { initEvents } from './events'

type HexLog = HexUtils['log']
type HexUtils = ReturnType<typeof initUtils>
type HexEntities = ReturnType<typeof initEntities>
type HexSystems = ReturnType<typeof initSystems>
type HexEvents = ReturnType<typeof initEvents>

class Hex {
    log: HexLog
    systems: HexSystems
    entities: HexEntities
    utils: Omit<HexUtils, 'log'>
    events: HexEvents
    constructor(c: Partial<HexConfig> = {}) {
        const { log, config, errors } = initUtils(c)
        this.log = log
        this.utils = { config, errors }

        this.systems = initSystems(this)
        this.entities = initEntities(this)
        this.events = initEvents(this)
    }
}

export { Hex }
