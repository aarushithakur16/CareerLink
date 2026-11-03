import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Vite configuration for CareerLink frontend
// Port 5173 with strictPort ensures it runs strictly on 5173 as expected by backend CORS
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    strictPort: true
  }
});

