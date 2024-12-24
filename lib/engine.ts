import type { HexConfig } from './types'
import { initEntities } from './entities'
import { initSystems } from './systems'
import { initUtils } from './utils'
import { initEvents } from './events'
import { Timer } from './timers'
import { initTick } from './tick'

type HexLog = HexUtils['log']
type HexUtils = ReturnType<typeof initUtils>
type HexEntities = ReturnType<typeof initEntities>
type HexSystems = ReturnType<typeof initSystems>
type HexEvents = ReturnType<typeof initEvents>
type HexTick = ReturnType<typeof initTick>

class Hex {
    log: HexLog
    systems: HexSystems
    entities: HexEntities
    utils: {
        config: HexConfig
        errors: HexUtils['errors']
        timer: Timer
    }
    events: HexEvents
    tick: HexTick

    constructor(c: Partial<HexConfig> = {}) {
        const { log, config, errors } = initUtils(c)
        this.log = log
        this.tick = initTick(this)
        this.utils = { config, errors, timer: new Timer(this, () => this.tick.count) }

        this.systems = initSystems(this)
        this.entities = initEntities(this)
        this.events = initEvents(this)
    }
}

export { Hex }
