import React from 'react';
import { Head } from '@inertiajs/react';
import GuestLayout from '../Layouts/GuestLayout';

export default function Beranda() {
    return (
        <GuestLayout>
            <Head title="Beranda" />
            <div>
                <h1 className="font-young-serif text-arang text-2xl">Selamat datang di Toko Daster</h1>
                <p className="mt-2 text-abu">Temukan daster yang nyaman untuk segala acara</p>
            </div>
        </GuestLayout>
    );
}
