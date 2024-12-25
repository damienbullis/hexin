import type { HexConfig } from './types'
import { initComponents } from './entities'
import { initSystems } from './systems'
import { initUtils, Timer } from './utils'
import { initEvents } from './events'
import { initEngine } from './tick'

type HexLog = HexUtils['log']
type HexUtils = ReturnType<typeof initUtils>
type HexEntities = ReturnType<typeof initComponents>
type HexSystems = ReturnType<typeof initSystems>
type HexEvents = ReturnType<typeof initEvents>
type HexEngine = ReturnType<typeof initEngine>

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
    // Engine
    count: HexEngine['count']
    start: HexEngine['start']
    stop: HexEngine['stop']
    pause: HexEngine['pause']
    resume: HexEngine['resume']

    constructor(c: Partial<HexConfig> = {}) {
        const { log, config, errors } = initUtils(c)
        this.log = log

        const { count, start, stop, pause, resume } = initEngine(this)
        this.count = count
        this.start = start
        this.stop = stop
        this.pause = pause
        this.resume = resume

        this.utils = { config, errors, timer: new Timer(this, () => this.count) }

        this.systems = initSystems(this)
        this.entities = initComponents(this)
        this.events = initEvents(this)
    }
}

export { Hex }
