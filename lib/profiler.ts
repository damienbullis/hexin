/**
 * Creates a profiler object that tracks the number of times specific labels are recorded
 * and the total number of ticks. It provides methods to track labels, end a tick, and
 * generate a report of the tracked data.
 *
 * @param io - An object with a `log` method that accepts a string.
 */
export function profiler(io: { log: (s: string) => void } = console, label = 'Profiler Report') {
    const counts: Record<string, number> = {}
    let totalTicks = 0

    return {
        /**
         * Tracks a label for the profiler.
         * @param label - The label to track.
         * @example
         * ```ts
         * const p = profiler()
         * p.track('label')
         *
         * // Later, end the tick
         * p.endTick()
         *
         * // Generate a report
         * p.report()
         * ```
         */
        track(label: string) {
            counts[label] = counts[label] ? counts[label] + 1 : 1
        },
        /**
         * Ends a tick and increments the total tick count.
         * @returns The total number of ticks recorded.
         */
        endTick() {
            return totalTicks++
        },
        /**
         * Generates a report of the tracked data.
         */
        report() {
            io.log(`[${label}] Total ticks: ${totalTicks}`)
            for (const [label, count] of Object.entries(counts)) {
                io.log(`\t${label}: ${count} operation${count === 1 ? '' : 's'}`)
            }
        },
    }
}
