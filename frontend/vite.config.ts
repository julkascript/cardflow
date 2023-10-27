import { Plugin, defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from 'tailwindcss';

// https://vitejs.dev/config/
export default defineConfig({
  /* 
    TS compiler complains about the TailwindCSS plugin, so
    providing a bandaid fix for the time being
  */
  plugins: [react(), tailwindcss() as unknown as Plugin],
  test: {
    environment: 'jsdom',
  },
} as unknown as object)
