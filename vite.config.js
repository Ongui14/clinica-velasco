import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['logo-icon.svg'],
      manifest: {
        name: 'Clínica Velasco',
        short_name: 'Clínica Velasco',
        description: 'Plataforma oficial de reservas médicas, telemedicina y emergencias de Clínica Velasco en Trinidad, Beni.',
        theme_color: '#059669',
        background_color: '#F8FAFC',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: '/logo-icon.svg',
            sizes: '192x192 512x512',
            type: 'image/svg+xml',
            purpose: 'any maskable'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,ico,woff2}']
      }
    })
  ],
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
