import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
    test: {
        globals: true,
        environmentMatchLabels: [
            { pattern: 'tests/client/**', environment: 'jsdom' },
            { pattern: 'tests/server/**', environment: 'node' },
        ],
        setupFiles: ['./tests/client/setup.js'],
    },
    resolve: {
        alias: {
            '@server': path.resolve(__dirname, './server'),
            '@client': path.resolve(__dirname, './client/src'),
        },
    },
});
