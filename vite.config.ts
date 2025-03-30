import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/Shiritori/',
  server: {
    proxy: {
      '/api-viet': {
        target: 'https://vietnamese-dictionary-api.vercel.app',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api-viet/, ""),
      }
    }
  }
})
