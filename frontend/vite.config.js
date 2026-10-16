import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// In sviluppo le chiamate /api vanno al backend Laravel (artisan serve su :8000).
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: { '/api': 'http://localhost:8000' },
  },
})
