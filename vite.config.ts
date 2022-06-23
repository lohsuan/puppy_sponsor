import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { createHtmlPlugin } from 'vite-plugin-html'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), createHtmlPlugin()],
  build: {
    minify: 'terser',
    brotliSize: true,
    cssCodeSplit: true,
    terserOptions: {
      sourceMap: false,
      ecma: 5,
      ie8: true,
      safari10: true,
      keep_classnames: false,
      keep_fnames: false,
      compress: true,
      format: {
        preserve_annotations: false,
        comments: false
      }
    },
    chunkSizeWarningLimit: 100000,
    rollupOptions: {
      output: {
        preferConst: true,
        freeze: true
      }
    }
  }
})
