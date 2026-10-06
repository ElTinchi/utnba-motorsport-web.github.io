import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'seo-prerender',
      apply: 'build',
      async closeBundle() {
        const { build } = await import('vite');
        await build({
          configFile: false,
          root: process.cwd(),
          plugins: [react()],
          build: {
            ssr: 'scripts/ssr-entry.jsx',
            outDir: 'dist',
            emptyOutDir: false,
            rollupOptions: { output: { format: 'cjs', entryFileNames: 'server-render.cjs' } },
          },
        });
        const { generateSeoArtifacts } = await import('./scripts/generate-seo-artifacts.js');
        await generateSeoArtifacts();
      },
    },
  ],
});
