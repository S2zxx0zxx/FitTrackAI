import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const plugins = [react()];

  // enable bundle analysis when ANALYZE env var is set
  if (process.env.ANALYZE === 'true' || mode === 'analyze') {
    plugins.push(
      visualizer({ filename: 'dist/bundle-report.html', open: false, gzipSize: true })
    );
  }

  return {
    plugins,
    build: {
      // increase to avoid chunk size warnings for this demo app
      chunkSizeWarningLimit: 700000
    }
  };
});