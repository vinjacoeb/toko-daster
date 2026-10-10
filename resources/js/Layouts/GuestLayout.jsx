import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function GuestLayout({ children }) {
    return (
        <div className="min-h-screen bg-kapas flex flex-col">
            <Header />
            <main className="flex-grow">
                {children}
            </main>
            <Footer />
        </div>
    );
}
