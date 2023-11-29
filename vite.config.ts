import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import Unfonts from 'unplugin-fonts/vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    Unfonts({
      custom: {
        families: [
          {
            name: 'Larken',
            local: ['Larken', 'Larken-Variable'],
            src: './src/assets/fonts/*.ttf',
          },
        ],
      },
    }),
  ],
});
