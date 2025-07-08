import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/DIPLOM/',
  build: {
    outDir: 'docs' // или 'dist', в зависимости от того, что вы используете
  },
  plugins: [react()],
});
