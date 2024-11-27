import type { HexinConfig } from './types'
import { initEntities } from './entities'
import { initSystems } from './systems'
import { initEvents } from './events'
import { initUtils } from './utils'
import { initLog } from './log'
// import { rainbowIntroText } from '../utils'

type HexEntities = ReturnType<typeof initEntities>
type HexSystems = ReturnType<typeof initSystems>
type HexEvents = ReturnType<typeof initEvents>
type HexUtils = ReturnType<typeof initUtils>
type HexLog = ReturnType<typeof initLog>

class Hex {
    entities: HexEntities
    systems: HexSystems
    events: HexEvents
    utils: HexUtils
    log: HexLog
    constructor(config: Partial<HexinConfig> = {}) {
        this.log = initLog(config)
        // this.log.info(rainbowIntroText())
        this.utils = initUtils(this, config)
        this.events = initEvents(this)
        this.systems = initSystems(this)
        this.entities = initEntities(this)
    }
}

export { Hex }
