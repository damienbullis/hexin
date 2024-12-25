import type { HexConfig } from './types'
import { initComponents } from './components'
import { initSystems } from './systems'
import { initUtils, Timer } from './utils'
import { initEvents } from './events'
import { initEngine } from './engine'

type HexLog = HexUtils['log']
type HexUtils = ReturnType<typeof initUtils>
type HexComponents = ReturnType<typeof initComponents>
type HexSystems = ReturnType<typeof initSystems>
type HexEvents = ReturnType<typeof initEvents>
type HexEngine = ReturnType<typeof initEngine>

class Hex {
    log: HexLog
    systems: HexSystems
    components: HexComponents
    utils: {
        config: HexConfig
        errors: HexUtils['errors']
        timer: Timer
    }
    events: HexEvents
    count: HexEngine['count']
    start: HexEngine['start']
    stop: HexEngine['stop']
    pause: HexEngine['pause']
    resume: HexEngine['resume']

    constructor(c: Partial<HexConfig> = {}) {
        const { log, config, errors } = initUtils(c)
        this.log = log
        this.utils = { config, errors, timer: new Timer(this, () => this.count) }

        const { count, start, stop, pause, resume } = initEngine(this)
        this.count = count
        this.start = start
        this.stop = stop
        this.pause = pause
        this.resume = resume

        this.systems = initSystems(this)
        this.components = initComponents(this)
        this.events = initEvents(this)
    }
}

export { Hex }
