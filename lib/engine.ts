import type { HexinConfig } from './types'
import { initSystems } from './systems'
import { initEntities } from './entities'
import { initUtils } from './utils'
import { initLog } from './log'
import { rainbowIntroText } from '../utils'
import { initEvents } from './events'

type HexUtils = ReturnType<typeof initUtils>
type HexLog = ReturnType<typeof initLog>
type HexSystems = ReturnType<typeof initSystems>
type HexEntities = ReturnType<typeof initEntities>
type HexEvents = ReturnType<typeof initEvents>

class Hex {
    log: HexLog
    utils: HexUtils
    events: HexEvents
    systems: HexSystems
    entities: HexEntities
    constructor(config: Partial<HexinConfig> = {}) {
        this.log = initLog(config)
        this.log.info(rainbowIntroText())
        this.utils = initUtils(this, config)
        this.events = initEvents(this)
        this.systems = initSystems(this)
        this.entities = initEntities(this)
    }
}

export { Hex }
