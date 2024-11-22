import { makeSystem } from './systems'

export const someSystem = makeSystem({
    __type: 'SomeSystem',
    run() {},
    newProps: 'hello',
})

export const otherSystem = makeSystem({
    __type: 'OtherSystem',
    run() {},
    otherProps: 'world',
})

declare module './types' {
    interface SystemRegistry {
        SomeSystem: typeof someSystem
        OtherSystem: typeof otherSystem
    }
}
