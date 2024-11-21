import { makeSystem } from './systems'

export const someSystem = makeSystem({
    run() {},
    newProps: 'hello',
})

export const otherSystem = makeSystem({
    run() {},
    otherProps: 'world',
})

declare module './types' {
    interface SystemRegistry {
        SomeSystem: {
            run(): void
            newProps: string
        }
        OtherSystem: {
            run(): void
            otherProps: string
        }
    }
}
