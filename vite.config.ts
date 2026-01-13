import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: true
  },
  server: {
    port: 3000,
    headers: {
      // Fix for Firebase popup auth COOP warning
      'Cross-Origin-Opener-Policy': 'same-origin-allow-popups',
    }
  }
});