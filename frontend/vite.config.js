import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return;
          if (id.includes('react') || id.includes('react-dom') || id.includes('scheduler')) {
            return 'vendor-react';
          }
          if (id.includes('react-router') || id.includes('@remix-run')) {
            return 'vendor-router';
          }
          if (id.includes('framer-motion')) {
            return 'vendor-motion';
          }
          if (id.includes('socket.io-client') || id.includes('engine.io-client')) {
            return 'vendor-socket';
          }
          if (id.includes('axios')) {
            return 'vendor-axios';
          }
          if (id.includes('lucide-react')) {
            return 'vendor-icons';
          }
          return 'vendor-misc';
        },
      },
    },
  },
})
