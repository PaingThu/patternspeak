import { defineConfig } from 'vite';
import viteImagemin from 'vite-plugin-imagemin';
import tailwindcss from '@tailwindcss/vite';
import handlebars from 'vite-plugin-handlebars';
import { resolve } from 'path';

export default defineConfig({
    // Tell Vite that the "root" of your website is the public folder
    base: './',
    root: 'src',

    build: {
        // Since root is 'public', we need to tell it to output 
        // the build to '../dist' (one level up)
        outDir: '../dist',

        // Clean the dist folder before each build
        emptyOutDir: true,

        rollupOptions: {
            // List every HTML file that serves as a "door" to your JS
            input: {
                main: resolve(__dirname, 'src/index.html'),
                admin: resolve(__dirname, 'src/admin/index.html'),
                'admin/login': resolve(__dirname, 'src/admin/login/index.html'),
                'admin/grammar': resolve(__dirname, 'src/admin/grammar/index.html')
            },
        },
    },
    plugins: [
        viteImagemin({
        gifsicle: { optimizationLevel: 7, interlaced: false },
        optipng: { optimizationLevel: 7 },
        mozjpeg: { quality: 20 },
        pngquant: { quality: [0.8, 0.9], speed: 4 },
        }),
        tailwindcss(),
        handlebars({
            // Tell it where your shared HTML files live
            partialDirectory: [
                resolve(__dirname, 'src/admin/partials'),
                resolve(__dirname, 'src/partials')
            ],
        }),
    ],
});