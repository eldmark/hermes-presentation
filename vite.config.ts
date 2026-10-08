import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// BASE=/nombre-del-repo/ para GitHub Pages; en Vercel y en local queda '/'.
export default defineConfig({
  base: process.env.BASE ?? '/',
  plugins: [react()],
})
