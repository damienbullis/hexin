import type { Hex } from '.'

export function initEngine(hex: Hex) {
    const { enable_rendering, interval_fn, max_ticks, tick_interval } = hex.utils.config
    const interval = tick_interval * 1000 // convert to milliseconds for requestAnimationFrame
    let count = 0 // tick count
    let lastTime = 0 // last time the render loop was called
    let running = false
    let paused = false

    const start = () => {
        running = true
        count = 0
        lastTime = 0

        // Start the game loop
        interval_fn(logicLoop)

        // Start the render loop (client side)
        if (enable_rendering) {
            requestAnimationFrame(renderLoop)
        }
    }

    const stop = () => {
        running = false
    }

    const pause = () => {
        paused = !paused
    }

    // Main game loop for server side logic (can also be used client side)
    const logicLoop = (delta: number) => {
        if (!running || paused) return
        if (max_ticks !== undefined && count >= max_ticks) {
            stop()
            return
        }

        // Process systems for this tick
        for (const system of hex.systems.all()) {
            system.run(delta)
        }

        // Process events for this tick
        hex.events.processEvents()

        // Update tick counts
        count++
        hex.log.debug(`[TICK] Count: ${count}, Delta: ${delta}`)
    }

    // Render loop for client side rendering (currentTime is in milliseconds from requestAnimationFrame)
    const renderLoop = (currentTime: number) => {
        if (!running || !enable_rendering) return

        // Calculate interpolation
        const interpolation = (currentTime - lastTime) / interval
        lastTime = currentTime

        for (const system of hex.systems.all()) {
            if (system.render) system.render(interpolation)
        }
        hex.log.debug(`[RENDER] Count: ${count}, Interpolation: ${interpolation}`)

        // Schedule the next frame
        requestAnimationFrame(renderLoop)
    }

    return {
        /**
         * The current tick count of the game loop
         */
        count: () => count,
        /**
         * Check if the game loop is running
         */
        isPaused: () => paused,
        /**
         * Start the game loop
         */
        start,
        /**
         * Stop the game loop
         */
        stop,
        /**
         * Pause the game loop
         */
        pause,
    }
}
