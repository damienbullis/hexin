import { describe, expect, it, jest } from 'bun:test'
import { profiler } from '../../utils/profiler'

describe('profiler', () => {
    const writer = jest.fn((s) => s)
    const label = 'Profiler Report'
    const p = profiler({ log: writer }, label)

    const l1 = 'test'
    const l2 = 'another'

    it('should track labels', () => {
        p.track(l1)
        p.track(l1)
        p.track(l2)
        expect(writer).not.toHaveBeenCalled()
    })

    it('should end ticks', () => {
        const totalTicks = p.endTick()
        expect(totalTicks).toBe(0)
        const nextTotalTicks = p.endTick()
        expect(nextTotalTicks).toBe(1)
    })

    it('should generate a report', () => {
        p.report()
        expect(writer).toHaveBeenCalledTimes(3)
        expect(writer).toHaveBeenNthCalledWith(1, `[${label}] Total ticks: 2`)
        expect(writer).toHaveBeenNthCalledWith(2, `\t${l1}: 2 operations`)
        expect(writer).toHaveBeenNthCalledWith(3, `\t${l2}: 1 operation`)
    })
})
