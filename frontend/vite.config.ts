import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from 'tailwindcss';

// https://vitejs.dev/config/
export default defineConfig({
  /* 
    TS compiler complains about some of the plugins, so
    providing a bandaid fix for the time being
  */
  plugins: [react(), tailwindcss()],
  test: {
    globals: true,
    environment: 'jsdom',
    setUpFiles: ['./test-config/tests-setup.ts'],
  },
} as unknown as object);
