import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'production-seo-robots',
      transformIndexHtml(html) {
        const site = process.env.VITE_PUBLIC_SITE_URL?.trim() ?? ''
        const production = /^https:\/\/[a-z0-9.-]+\/?$/i.test(site) && !/onrender\.com|localhost|127\.0\.0\.1/i.test(site)
        return production ? html.replace('<meta name="robots" content="noindex,nofollow" />', '<meta name="robots" content="index,follow" />') : html
      },
    },
  ],
  server: {
    proxy: {
      '/bookings': 'http://localhost:8080',
    },
  },
})
