import type { HexinConfig } from './types'
// import { initEntities } from './entities'
import { initSystems } from './systems'
// import { initEvents } from './events'
import { initUtils } from './utils'
import { initLog } from './log'
// import { rainbowIntroText } from '../utils'

// type HexEntities = ReturnType<typeof initEntities>
type HexSystems = ReturnType<typeof initSystems>
// type HexEvents = ReturnType<typeof initEvents>
// type HexUtils = ReturnType<typeof initUtils>
type HexLog = ReturnType<typeof initLog>

class Hex {
    log: HexLog
    config: Partial<HexinConfig>
    systems: HexSystems
    // events: HexEvents
    constructor(c: Partial<HexinConfig> = {}) {
        const { log, config } = initUtils(c)
        this.log = log
        this.config = config
        this.systems = initSystems(this)
    }
}

export { Hex }
