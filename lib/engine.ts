// import { coreSystems } from './systems'
// import { coreEntities } from './entities'

import { assert, assertType } from './utils'

// class Engine {
//     systems: ReturnType<typeof coreSystems>
//     entities: ReturnType<typeof coreEntities>
//     constructor() {
//         this.systems = coreSystems(this)
//         this.entities = coreEntities()
//     }
// }

// class OtherSystem implements SystemBase {
//     constructor(core: Hex) {
//         core.utils.log.debug('Initializing TestSystem')
//     }
//     run() {}
// }
// class TestSystem implements SystemBase {
//     constructor(core: Hex) {
//         core.utils.log.debug('Initializing TestSystem')
//     }
//     run() {}
// }
interface SystemRegistry {
    // TestSystem: TestSystem
    // OtherSystem: OtherSystem
}

type SKeys = keyof SystemRegistry
interface ComponentRegistry {}
type CKeys = keyof ComponentRegistry

type System<K extends SKeys = SKeys> = SystemRegistry[K]

interface SystemBase {
    run(delta: number): void
}
interface ComponentBase {}

type HexSystems = {
    add<K extends SKeys, S extends { new (e: Hex): System<K> }>(s: S): void
    get<K extends SKeys>(key: K): System<K>
    all(): System<SKeys>[]
}
type HexEntities = {
    add(): void
    get(): void
}

type HexinConfig = {
    log_level: 0 | 1 | 2 | 3
    rng_seed: number
}

function initLogger(config: Partial<HexinConfig>) {
    const no_op = (_: string) => {}
    const TODO = (msg: string) => console.error('Not implemented yet.', msg)
    const logger = {
        debug: TODO,
        info: TODO,
        warn: TODO,
        error: TODO,
        fatal: TODO,
    }
    const log_level = config.log_level || 0
    switch (log_level) {
        case 1:
            logger.debug = no_op
            break
        case 2:
            logger.debug = no_op
            logger.info = no_op
            break
        case 3:
            logger.debug = no_op
            logger.info = no_op
            logger.warn = no_op
            break
    }
    return logger
}

function initUtils(config: Partial<HexinConfig>) {
    const utils = {
        config,
        log: initLogger(config),
    }
    utils.log.debug('Initializing utils')
    utils.log.debug('Config: ' + config)
    return utils
}

const INIT_CONFIG: HexinConfig = {
    log_level: 0,
    rng_seed: 0,
}
class Hex {
    utils: ReturnType<typeof initUtils>
    systems = initSystems(this)
    entities = initEntities(this)
    constructor(config: Partial<HexinConfig> = INIT_CONFIG) {
        this.utils = initUtils(config)
    }
}

function initSystems(engine: Hex): HexSystems {
    // @ts-ignore
    const systemsMap: Record<SKeys, System> = {}
    const systems: System[] = []
    return {
        add(s) {
            engine.utils.log.debug('Adding system: ' + s.name)
            assert(!(s.name in systemsMap), 'System already exists')

            const system = new s(engine)

            assertType<SKeys>(s.name)
            systemsMap[s.name] = system
            systems.push(system)
        },
        get(key) {
            engine.utils.log.debug('Getting system: ' + key)
            return systemsMap[key]
        },
        all() {
            engine.utils.log.debug('Getting all systems')
            return systems
        },
    }
}
function initEntities(engine: Hex): HexEntities {
    return {} as HexEntities
}

export { Hex }
