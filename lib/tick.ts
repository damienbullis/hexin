import type { Hex } from './engine'

export function initEngine(hex: Hex) {
    const tickRate = hex.utils.config.tick_rate
    const enableRendering = hex.utils.config.enable_rendering
    const tickInterval = 1 / tickRate
    let tickTimeSinceLastUpdate = 0
    let running = false
    let count = 0 // tick count
    let paused = false

    const start = (totalTicks?: number) => {
        running = true
        tickTimeSinceLastUpdate = 0
        count = 0

        if (enableRendering) {
            // client side (browser) rendering
            requestAnimationFrame(renderLoop)
        }

        // Start the game loop
        logicLoop(totalTicks)
    }

    const stop = () => {
        running = false
    }

    const pause = () => {
        paused = true
    }

    const resume = () => {
        paused = false
    }

    const update = (delta: number) => {
        // Update game logic
        for (const system of hex.systems.all()) {
            system.run(delta)
        }
        // Possibly need to process entities here as well...
        // Though, I think that's more of a system thing...

        // Process events for this tick
        hex.events.processEvents()
    }

    const logicLoop = (totalTicks?: number) => {
        if (!running) return

        // If paused, skip the update
        if (paused) {
            tickTimeSinceLastUpdate += tickInterval
            logicLoop(totalTicks)
        }

        // Stop the loop
        if (totalTicks !== undefined && count >= totalTicks) {
            stop()
            return
        }

        // Perform game logic update
        update(tickInterval)

        // Update tick counts
        tickTimeSinceLastUpdate = 0
        count++

        // Recursively call the logic loop for the next tick
        tickTimeSinceLastUpdate += tickInterval
        logicLoop(totalTicks)
    }

    const render = (interpolation: number) => {
        for (const system of hex.systems.all()) {
            if (system.render) system.render(interpolation)
        }
    }

    const renderLoop = () => {
        if (!running || !enableRendering) return

        // Perform rendering logic (interpolated for smoother visuals)
        const interpolation = tickTimeSinceLastUpdate / tickInterval
        render(interpolation)

        // Schedule the next frame
        requestAnimationFrame(renderLoop)
    }

    hex.log.debug('HEX: Tick Initialized.')
    return {
        /**
         * The current tick count
         */
        count,
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
        /**
         * Resume the game loop
         */
        resume,
    }
}
