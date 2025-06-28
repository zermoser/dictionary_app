import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/dictionary_app/',
  server: {
    open: true,
    port: 3019
  }
});
