import { defineConfig, flattenDirPlugin } from 'vite'
import uni from '@dcloudio/vite-plugin-uni'
import UnoCSS from 'unocss/vite'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    UnoCSS(),
    uni(),
  ],
  base: './',
  resolve: {
    alias: {
      '@tuniao/tnui-vue3-uniapp': path.resolve(__dirname, './tuniaoui'),
    },
  },
  build: {
    outDir: 'dist',
    rollupOptions: {
      output: {
        // Override problematic chunk file names
        chunkFileNames: (chunkInfo) => {
          const name = chunkInfo.name.replace(/[^a-zA-Z0-9]/g, '-')
          return `assets/${name}-[hash].js`
        },
      },
    },
  },
})
