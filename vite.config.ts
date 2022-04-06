import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react(),
        {
            name: 'configure-response-headers',
            configureServer: (server) => {
                server.middlewares.use((_req, res, next) => {
                    res.setHeader('Cross-Origin-Embedder-Policy', '*');
                    res.setHeader('Cross-Origin-Opener-Policy', '*');
                    res.setHeader('Access-Control-Allow-Origin', '*');
                    next();
                });
            },
        },
    ],
    base: './',
    server: {
        cors: false,
    },
});
