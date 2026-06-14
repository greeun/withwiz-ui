import { defineConfig } from 'vitest/config'
import { resolve } from 'path'

export default defineConfig({
  resolve: {
    alias: { '@withwiz/ui': resolve(__dirname, './src') },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    exclude: ['node_modules', 'dist'],
  },
})
