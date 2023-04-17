import { defineConfig } from 'vite'

export default defineConfig({
  root: 'playground',
  optimizeDeps: {
    exclude: ['vue-demi'],
  },
})
