import type { Hex } from '.'

export function initEngine(hex: Hex) {
    const { enable_rendering, interval_fn, max_ticks, tick_interval } = hex.utils.config
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

        if (enable_rendering) {
            // client side (browser) rendering
            requestAnimationFrame(renderLoop)
        }
    }

    const stop = () => {
        running = false
    }

    const pause = () => {
        paused = !paused
    }

    // This is the main game loop for server side logic
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

    // This is the render loop for client side rendering
    const renderLoop = (currentTime: number) => {
        if (!running || !enable_rendering) return

        const interpolation = (currentTime - lastTime) / tick_interval
        lastTime = currentTime

        for (const system of hex.systems.all()) {
            if (system.render) system.render(interpolation)
        }
        hex.log.debug(`[RENDER] Count: ${count}, Interpolation: ${interpolation}`)

        // Schedule the next frame
        requestAnimationFrame(renderLoop)
    }
    const getCount = () => count

    return {
        /**
         * The current tick count
         */
        getCount,
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
