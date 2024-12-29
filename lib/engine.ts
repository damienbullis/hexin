import type { Hex } from '.'

export function initEngine(hex: Hex) {
    // const tickRate = hex.utils.config.tick_rate
    const enableRendering = hex.utils.config.enable_rendering
    const intervalFn = hex.utils.config.interval_fn
    const maxTicks = hex.utils.config.max_ticks
    const tickInterval = hex.utils.config.tick_interval
    let tickTimeSinceLastUpdate = 0
    let running = false
    let count = 0 // tick count
    let paused = false

    const start = () => {
        running = true
        tickTimeSinceLastUpdate = 0
        count = 0

        // Start the game loop
        intervalFn(logicLoop)
        // logicLoop(totalTicks)

        if (enableRendering) {
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

    const logicLoop = (delta: number) => {
        if (!running || paused) return

        // // If paused, skip the update
        // if (paused) {
        //     tickTimeSinceLastUpdate += tickInterval
        //     logicLoop(totalTicks)
        // }

        // Stop the loop
        if (maxTicks !== undefined && count >= maxTicks) {
            stop()
            return
        }

        // Perform game logic update
        update(delta)

        // Update tick counts
        tickTimeSinceLastUpdate = 0
        count++

        // Recursively call the logic loop for the next tick
        tickTimeSinceLastUpdate += delta
        // logicLoop(totalTicks)
        hex.log.debug(`[TICK] ${count}`)
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
        hex.log.debug(`[RENDER] ${count}`)

        // Schedule the next frame
        requestAnimationFrame(renderLoop)
    }
    const getCount = () => count

    hex.log.debug('[HEX] Engine Initialized.')
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
