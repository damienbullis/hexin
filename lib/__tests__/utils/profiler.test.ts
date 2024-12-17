import { describe, expect, it, jest } from 'bun:test'
import { profiler } from '../../utils/profiler'

describe('profiler', () => {
    const writer = jest.fn((s) => s)
    const p = profiler({ log: writer })

    it('should track labels', () => {
        p.track('test')
        p.track('test')
        p.track('another')
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
        expect(writer).toHaveBeenNthCalledWith(1, '[Profiler Report] Total ticks: 2')
        expect(writer).toHaveBeenNthCalledWith(2, '\ttest: 2 ticks')
        expect(writer).toHaveBeenNthCalledWith(3, '\tanother: 1 ticks')
    })
})
