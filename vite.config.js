import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    dedupe: ['react', 'react-dom', 'react-router-dom'],
    alias: {
      react: path.resolve('./node_modules/react'),
      'react-dom': path.resolve('./node_modules/react-dom'),
    },
  },
  // ADD THIS SERVER BLOCK:
  server: {
    proxy: {
      '/api': {
        target: 'https://placify-backend-nvvw.onrender.com', // Your live Render backend
        changeOrigin: true,
        secure: false, // Useful if you have HTTPS certificate issues locally
      }
    }
  }
})