import '../css/app.css';
import React from 'react';
import { createInertiaApp } from '@inertiajs/react';
import { createRoot } from 'react-dom/client';

createInertiaApp({
    resolve: (name) => {
        const pages = import.meta.glob('./Pages/**/*.jsx');
        const path = `./Pages/${name.replace(/\\/g, '/')}.jsx`;
        
        if (!pages[path]) {
            throw new Error(`Halaman ${name} tidak ditemukan di ${path}`);
        }
        
        return pages[path]();
    },
    setup({ el, App, props }) {
        createRoot(el).render(<App {...props} />);
    },
});
