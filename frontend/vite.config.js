import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
server: {
    // Durante o desenvolvimento (npm run dev), encaminha /api/* para a
    // API Express rodando em outra porta, evitando problemas de CORS
    proxy: {
      "/api": "http://127.0.0.1:4567",
    },
  },
})
