import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    // Keep React and router dependencies in a reusable, cacheable chunk.
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('/node_modules/')) {
            if (id.includes('/react-router/') || id.includes('/react-router-dom/')) {
              return 'router'
            }
            if (id.includes('/react/') || id.includes('/react-dom/') || id.includes('/scheduler/')) {
              return 'react'
            }
          }
        },
      },
    },
  },
  server: {
    proxy: {
      '/bookings': 'http://localhost:8080',
    },
  },
})
