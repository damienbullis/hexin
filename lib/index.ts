// import type { HexConfig } from './types'
import { initComponents } from './components'
import { initSystems } from './systems'
import { initUtils, HexTimer } from './utils'
import { initEvents } from './events'
import { initEngine } from './engine'
import { initConfig } from './config'
import { initLog } from './log'

type HexComponents = ReturnType<typeof initComponents>
type HexSystems = ReturnType<typeof initSystems>
type HexEvents = ReturnType<typeof initEvents>
type HexEngine = ReturnType<typeof initEngine>
type HexUtils = ReturnType<typeof initUtils>
type HexConfig = ReturnType<typeof initConfig>
type HexLog = HexUtils['log']

class Hex {
    log: HexLog
    components: HexComponents
    systems: HexSystems
    events: HexEvents
    engine: HexEngine
    utils: {
        config: HexConfig
        errors: HexUtils['errors']
        timer: HexTimer
    }

    constructor(c: Partial<HexConfig> = {}) {
        // const { log, config, errors } = initUtils(c)
        const config = initConfig(this, c)
        const log = initLog()
        // this.utils = { config: null!, errors: null!, timer: null! }
        this.engine = initEngine(this)
        // this.utils.timer = new HexTimer(this, () => this.engine.getCount())

        this.systems = initSystems(this)
        this.components = initComponents(this)
        this.events = initEvents(this)
    }
}

export { Hex }
