// import type { HexConfig } from './types'
import { initComponents } from './components'
// import { initUtils, HexTimer } from './utils'
import { initSystems } from './systems'
import { initEvents } from './events'
import { initEngine } from './engine'
import { initConfig } from './config'
import { initErrors } from './errors'
import { initLog } from './log'
import { HexTimer } from './timers'

type HexComponents = ReturnType<typeof initComponents>
type HexSystems = ReturnType<typeof initSystems>
type HexEvents = ReturnType<typeof initEvents>
type HexEngine = ReturnType<typeof initEngine>
// type HexUtils = ReturnType<typeof initUtils>
type HexConfig = ReturnType<typeof initConfig>
type HexErrors = ReturnType<typeof initErrors>
type HexLog = ReturnType<typeof initLog>

class Hex {
    components: HexComponents
    systems: HexSystems
    events: HexEvents
    engine: HexEngine
    log: HexLog

    utils: {
        config: HexConfig
        errors: HexErrors
        timer: HexTimer
    }

    constructor(c: Partial<HexConfig> = {}) {
        this.utils = { config: initConfig(this, c), errors: null!, timer: null! }
        this.log = initLog(this.utils.config.log_options)
        this.engine = initEngine(this)

        this.utils.errors = initErrors(this)
        this.utils.timer = new HexTimer(this)

        this.systems = initSystems(this)
        this.components = initComponents(this)
        this.events = initEvents(this)
    }
}

export { Hex }
