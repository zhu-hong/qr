import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  root: 'playground',
  plugins: [
    vue(),
  ],
  optimizeDeps: {
    exclude: ['vue-demi'],
  },
})
