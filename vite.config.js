import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [react()],
    // Caminhos relativos: o build funciona tanto na raiz do domínio quanto numa
    // subpasta, como a versão em HTML puro.
    base: './',
    build: {
        // public/assets (imagens, vídeos, fontes) já ocupa "assets/"; o JS e o CSS
        // gerados vão para outra pasta para não se misturarem.
        assetsDir: 'static',
        // O chunk grande é o Three.js, baixado só no desktop (import dinâmico).
        chunkSizeWarningLimit: 700,
    },
});
