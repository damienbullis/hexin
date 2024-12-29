import type { HexConfig } from './types'
import { initComponents } from './components'
import { initSystems } from './systems'
import { initUtils, Timer } from './utils'
import { initEvents } from './events'
import { initEngine } from './engine'

type HexComponents = ReturnType<typeof initComponents>
type HexSystems = ReturnType<typeof initSystems>
type HexEvents = ReturnType<typeof initEvents>
type HexEngine = ReturnType<typeof initEngine>
type HexUtils = ReturnType<typeof initUtils>
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
        timer: Timer
    }

    constructor(c: Partial<HexConfig> = {}) {
        const { log, config, errors } = initUtils(c)
        this.log = log
        this.utils = { config, errors, timer: null! }
        this.engine = initEngine(this)

        const timer = new Timer(this, () => this.engine.getCount())
        this.utils.timer = timer

        this.systems = initSystems(this)
        this.components = initComponents(this)
        this.events = initEvents(this)
    }
}

export { Hex }
