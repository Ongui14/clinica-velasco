import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: true,
    allowedHosts: true,
    strictPort: true,
    cors: true,
    hmr: {
      clientPort: 443
    }
  },
  preview: {
    port: 3000,
    host: true,
    allowedHosts: true
  }
})
