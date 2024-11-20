import { defineConfig } from 'tsup'

export default defineConfig({
    entryPoints: ['lib/index.ts'],
    clean: true,
    format: ['esm'],
    dts: true,
})
