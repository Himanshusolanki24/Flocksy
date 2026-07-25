import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-dom/client',
      'react-router-dom',
      'framer-motion',
      'lucide-react',
      'recharts',
      'zustand',
      '@tanstack/react-query',
      'socket.io-client',
      'react-hot-toast',
      'gsap',
      'date-fns',
      'react-intersection-observer',
    ],
  },
  server: {
    port: 5173,
    strictPort: false,
    fs: {
      // Restrict Vite from traversing outside the project directory.
      // Prevents it from scanning ~/node_modules or parent dirs.
      allow: ['.'],
    },
  },
})
