import type { Hex } from '../engine'

export class Timer {
    private startTimes: Map<string, number> = new Map()

    constructor(
        private hex: Hex,
        private simulationTick: () => number
    ) {}

    start<T extends string>(label: T): () => void {
        this.startTimes.set(label, this.simulationTick())
        return this.end.bind(this, label)
    }

    private end(label: string): void {
        const startTick = this.startTimes.get(label)
        if (startTick === undefined) throw new Error(`Timer not started: ${label}`)
        const elapsedTicks = this.simulationTick() - startTick
        this.hex.log.debug(`[PERF] ${label}: ${elapsedTicks} ticks`)
        this.startTimes.delete(label)
    }
}

export function timer(hex: Hex, tick: () => number) {
    return <T extends string>(label: T): (() => void) => {
        const t = tick()
        return () => {
            hex.log.debug(`[Performance] ${label}: ${tick() - t} ticks`)
        }
    }
}
