function assert<T>(
    condition: unknown,
    message: string
): asserts condition is T {
    if (!condition) {
        throw new Error(message)
    }
}

interface TestSystem extends Hex.System {
    __type__: 'test'
}
declare namespace Hex {
    interface SystemRegistry {}
    interface ComponentRegistry {}
    interface Registry {
        systems: {
            i: TestSystem
            // o: System
        }
    }
    interface Component {
        __type__: string
    }
    interface System {
        __type__: string
        run(delta: number): void
    }
    type Entity = number
}

type SystemKeys = keyof Hex.Registry['systems']
type GetSystem<K extends SystemKeys = SystemKeys> = Hex.Registry['systems'][K]

function makeEngine() {
    const systems: Hex.Registry['systems'][SystemKeys][] = []
    return {
        systems,
        getSystem<T extends SystemKeys>(
            key: T extends infer K ? K : T
        ): GetSystem<T> {
            const sys = systems.find((system) => system.__type__ === key)
            assert<GetSystem<T>>(sys, `System ${key} not found`)
            return sys
        },
    }
}

const eng = makeEngine()
const sys = eng.getSystem('i')
