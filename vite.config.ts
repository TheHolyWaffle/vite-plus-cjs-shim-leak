import { defineConfig } from 'vite-plus';

export default defineConfig({
    pack: {
        entry: ['src/index.ts'],
        format: ['esm', 'cjs'],
        // Both flags are required to trigger the bug. Setting either alone
        // produces valid CommonJS.
        shims: true,
        unbundle: true,
        dts: false,
        sourcemap: false,
    },
});
