import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],

  server: {
    proxy: {
      '/api': {
        target: 'https://mk-brand-api.onrender.com',
        changeOrigin: true,
        secure: false,
      },
    },
  },

  build: {
    // No source maps in production — keeps bundle small and hides internals
    sourcemap: false,

    rollupOptions: {
      output: {
        // Manual chunk splitting keeps the initial download lean
        manualChunks: {
          // React core — rarely changes, long-lived cache
          'vendor-react': ['react', 'react-dom'],
          // Router — separate cache layer
          'vendor-router': ['react-router-dom'],
          // Google OAuth — isolated so it doesn't bloat main bundle
          'vendor-oauth': ['@react-oauth/google'],
        },
      },
    },
  },
})
