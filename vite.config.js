import { defineConfig } from 'vite';
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
                'admin/login': resolve(__dirname, 'src/admin/login/index.html')
            },
        },
    },
});