/**
 * Hexin Engine
 *
 * A simple modular game engine, using TypeScript.
 */
interface System {
    name: string
}
interface OtherSystem extends System {}
interface AnotherSystem extends System {}
function Hexin<
    T extends {
        [K in keyof T]: T[K] extends System ? T[K] : never
    },
>(options: T): T {
    return options
}

function wrong(): System {
    return {
        name: 'wrong',
    }
}
class s1 implements System {
    name = 's1'
}
class s2 implements OtherSystem {
    name = 's2'
}
class s3 implements AnotherSystem {
    name = 's3'
}

const engine = Hexin({
    system1: new s1(),
    system2: new s2(),
    system3: wrong(),
})

console.log('Hello via Bun!')
