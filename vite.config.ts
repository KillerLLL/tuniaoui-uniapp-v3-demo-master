import { defineConfig } from 'vite'
import uni from '@dcloudio/vite-plugin-uni'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [uni()],
  base: './',
  resolve: {
    alias: {
      '@tuniao/tnui-vue3-uniapp': path.resolve(__dirname, './tuniaoui'),
    },
  },
})
