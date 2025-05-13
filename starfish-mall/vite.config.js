import { defineConfig } from 'vite'
import uni from '@dcloudio/vite-plugin-uni'
import path from 'path'

import AutoImport from 'unplugin-auto-import/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    uni(),
    // ---- 配置自动引入 ----
    AutoImport({
      imports: ['vue', 'uni-app', {
          '@/libs/utils': [['default', '$$']],
          '@/libs/api': [['default', 'api']]
      }]
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@utils': path.resolve('src/libs/utils')
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        silenceDeprecations: ['legacy-js-api'],
        api: 'modern-compiler', // or 'modern'
      },
    },
  }
})