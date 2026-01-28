import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],
  base: '/USC-BEAD-Lab-ECITT/',
  server: {
    port: 5173,
    host: '0.0.0.0',
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
})
