import type { Hex } from '.'

export class HexTimer {
    private startTimes: Map<string, number> = new Map()
    private simulationTick = () => this.hex.engine.count()

    constructor(private hex: Hex) {}

    start<T extends string>(label: T): () => void {
        this.startTimes.set(label, this.simulationTick())
        return this.end.bind(this, label)
    }

    end(label: string): void {
        const startTick = this.startTimes.get(label)
        if (startTick === undefined) throw new Error(`Timer not started: ${label}`)
        const elapsedTicks = this.simulationTick() - startTick
        this.hex.log.debug(`[PERF] ${label}: ${elapsedTicks} ticks`)
        this.startTimes.delete(label)
    }
}
