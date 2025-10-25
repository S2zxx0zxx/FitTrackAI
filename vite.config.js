import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // increase to avoid chunk size warnings for this demo app
    chunkSizeWarningLimit: 700000
  }
})