import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
export default defineConfig({ plugins: [vue()], base: './', publicDir: 'apps/web/public', build: { outDir: 'dist' } });
