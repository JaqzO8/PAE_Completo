import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  
  // Configuración para Docker
  server: {
    host: '0.0.0.0', // Permite acceso externo
    port: 5173,
    watch: {
      usePolling: true, // Necesario para hot-reload en Docker
    },
  },
  
  // Resolver alias (opcional, para imports limpios)
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})