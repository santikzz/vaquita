import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import inertia from '@inertiajs/vite';
import laravel from 'laravel-vite-plugin';
import { defineConfig } from 'vite';
import os from 'os';

function getLocalIp(): string {
    for (const iface of Object.values(os.networkInterfaces())) {
        const hit = iface?.find(n => n.family === 'IPv4' && !n.internal);
        if (hit) return hit.address;
    }
    return '127.0.0.1';
}

export default defineConfig({
    server: {
        host: '0.0.0.0',
        port: 5173,
        cors: { origin: true },
        hmr: {
            host: getLocalIp(),
            clientPort: 5173,
        },
    },
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.tsx'],
            ssr: 'resources/js/ssr.tsx',
            refresh: true,
        }),
        inertia({
            ssr: false,
        }),
        react({
            babel: {
                plugins: ['babel-plugin-react-compiler'],
            },
        }),
        tailwindcss(),
        // wayfinder({ formVariants: true }), // breaks docker build
    ],
    esbuild: {
        jsx: 'automatic',
    },
});
