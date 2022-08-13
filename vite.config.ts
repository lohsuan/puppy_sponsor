import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { createHtmlPlugin } from 'vite-plugin-html'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), createHtmlPlugin()],
  build: {
    cssCodeSplit: true,
    chunkSizeWarningLimit: 100000,
    rollupOptions: {
      output: {
        preferConst: true,
        freeze: true
      }
    }
  }
})
