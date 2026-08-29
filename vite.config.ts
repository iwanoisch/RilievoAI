import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import {resolve} from 'path'
import * as fs from "node:fs";
import packageJson from './package.json';

// https://vite.dev/config/
export default defineConfig({
    define: {
        __APP_VERSION__: JSON.stringify(packageJson.version),
    },
    plugins: [
        react(),
        tailwindcss(),
    ],
    /**
     * Configurazione della cartella pubblica principale
     * - Contiene gli asset statici come immagini, font, favicon
     * - I file qui vengono serviti così come sono e copiati in dist/
     */
    // Specifica la cartella public dove mettere .htaccess
    publicDir: 'public',
    /**
     * Configurazione del build
     */
    build: {
        chunkSizeWarningLimit: 500,
        sourcemap: false,
        /**
         * Opzioni per Rollup (il bundler sottostante)
         */
        rollupOptions: {
            // Punto di ingresso principale
            input: {
                main: resolve(__dirname, 'index.html')
            },
            /**
             * Configurazione dell'output
             */
            output: {
                // Chunking semplificato per le librerie più pesanti
                manualChunks: {
                    // React core
                    'react-vendor': ['react', 'react-dom', 'react-router-dom'],

                    // State management
                    'state-management': ['@reduxjs/toolkit', 'react-redux', 'redux-persist'],

                    // UI Libraries
                    'ui-libs': ['@headlessui/react', '@heroicons/react', 'framer-motion'],

                    // i18n
                    'i18n': ['i18next', 'react-i18next', 'i18next-browser-languagedetector', 'i18next-http-backend'],

                    // Utilities
                    'utils': ['date-fns', 'axios'],

                    // Heavy libs (caricati on-demand)
                    'calendar': ['react-big-calendar'],
                    'charts': ['react-google-charts'],
                },

                // Configurazione aggiuntiva per gli asset
                assetFileNames: 'assets/[name]-[hash].[ext]',
                chunkFileNames: 'js/[name]-[hash].js',
                entryFileNames: 'js/[name]-[hash].js',
            },
            /**
             * Plugin personalizzato per copiare .htaccess dalla cartella static/
             * - Viene eseguito solo durante il build di produzione
             */
            plugins: [{
                name: 'copy-htaccess',
                generateBundle() {
                    try {
                        const htaccessContent = fs.readFileSync('static/.htaccess', 'utf-8');
                        this.emitFile({
                            type: 'asset',
                            fileName: '.htaccess',
                            source: htaccessContent
                        });
                        console.log('.htaccess copiato con successo');
                    } catch (error) {
                        console.error('Errore nella copia di .htaccess:', error);
                    }
                }
            }]
        },
        // Asset configuration
        assetsInlineLimit: 4096,

        // Abilita la copia della cartella public
        copyPublicDir: true
    },
    /**
     * Configurazione delle dipendenze da pre-ottimizzare
     */
    optimizeDeps: {
        include: [
            'react',
            'react-dom',
            'react-router-dom',
            '@headlessui/react',
            'framer-motion'
        ]
    },
    /**
     * Configurazione del server di sviluppo
     */
    server: {
        // Abilita l'accesso da altri dispositivi in rete locale
        host: true,

        // Configurazione aggiuntiva per il proxy se necessario
        proxy: {
            // Esempio: '/api': 'http://localhost:3000'
        }
    },

    /**
     * Risoluzione dei percorsi (alias)
     */
    resolve: {
        alias: {
            '@': resolve(__dirname, './src'),
            '@assets': resolve(__dirname, './public/assets')
        }
    }
})
