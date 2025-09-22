import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import viteTsconfigPaths from 'vite-tsconfig-paths';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
    // depending on your application, base can also be "/"
    base: '',
    plugins: [
        react(), 
        viteTsconfigPaths(),
        VitePWA({
            registerType: 'autoUpdate',
            includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
            manifest: {
                name: 'Manazl App',
                short_name: 'Manazl',
                description: 'Manazl Progressive Web App',
                theme_color: '#ffffff',
                icons: [
                    {
                        src: 'assets/icons/icon-192.webp',
                        sizes: '192x192',
                        type: 'image/webp'
                    },
                    {
                        src: 'assets/icons/icon-512.webp',
                        sizes: '512x512',
                        type: 'image/webp'
                    },
                    {
                        src: 'assets/icons/icon-512.webp',
                        sizes: '512x512',
                        type: 'image/webp',
                        purpose: 'any maskable'
                    }
                ]
            },
            workbox: {
                maximumFileSizeToCacheInBytes: 3 * 1024 * 1024, // 3 MB
            }
        })
    ],
    resolve: {
        alias: {
          src: "/src",
        },
    },
    root: '',
      
    server: {
        // this ensures that the browser opens upon server start
        open: true,
        // this sets a default port to 3000  
        port: 3000,
    },
});
