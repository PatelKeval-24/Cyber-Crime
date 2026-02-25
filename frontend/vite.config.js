import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),tailwindcss()],
  //  server: {
  //   host: true,              // 👈 REQUIRED
  //   port: 5173,              // or your port
  //   strictPort: true,
  //   allowedHosts: [
  //     '.portmap.host'
  //   ]
  // }
})
