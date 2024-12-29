import { initComponents } from './components'
import { initSystems } from './systems'
import { initEvents } from './events'
import { initEngine } from './engine'
import { initConfig } from './config'
import { initErrors } from './errors'
import { HexTimer } from './timers'
import { initLog } from './log'

type HexComponents = ReturnType<typeof initComponents>
type HexSystems = ReturnType<typeof initSystems>
type HexEvents = ReturnType<typeof initEvents>
type HexEngine = ReturnType<typeof initEngine>
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
        this.log.debug('[HEX] Initializing...')
        this.log.debug('[HEX] Config Initialized.')
        this.engine = initEngine(this)
        this.log.debug('[HEX] Engine Initialized.')

        this.utils.errors = initErrors(this)
        this.log.debug('[HEX] Errors Initialized.')
        this.utils.timer = new HexTimer(this)
        this.log.debug('[HEX] Timer Initialized.')

        this.systems = initSystems(this)
        this.log.debug('[HEX] Systems Initialized.')
        this.components = initComponents(this)
        this.log.debug('[HEX] Components Initialized.')
        this.events = initEvents(this)
        this.log.debug('[HEX] Events Initialized.')
        this.log.debug('[HEX] Initialized.')
    }
}

export { Hex }
