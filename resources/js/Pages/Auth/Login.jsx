import React from 'react';
import { useForm, Head } from '@inertiajs/react';

export default function Login() {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: '',
    });

    function submit(e) {
        e.preventDefault();
        post('/login');
    }

    return (
        <div className="min-h-screen flex flex-col md:flex-row">
            <Head title="Masuk Admin" />

            {/* Panel Kiri (Desktop) */}
            <div className="hidden md:flex md:w-1/2 bg-pandan items-center justify-center p-12 relative overflow-hidden">
                <div className="text-kapas text-center">
                    <h1 className="font-young-serif text-6xl mb-4">Daster</h1>
                    <p className="text-xl">Dashboard pengelola</p>
                </div>
                {/* Garis jahitan */}
                <div className="absolute inset-x-0 bottom-16 border-t-2 border-dashed border-garis/30"></div>
            </div>

            {/* Panel Kanan (Formulir) */}
            <div className="flex-1 flex items-center justify-center p-8 bg-kapas">
                <div className="w-full max-w-md">
                    {/* Wordmark Mobile */}
                    <div className="md:hidden text-center mb-8">
                        <h1 className="font-young-serif text-pandan text-4xl">Daster</h1>
                    </div>

                    <h2 className="font-young-serif text-arang text-4xl mb-8">Masuk</h2>

                    <form onSubmit={submit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-abu mb-1">Email</label>
                            <input
                                type="email"
                                value={data.email}
                                onChange={e => setData('email', e.target.value)}
                                className="w-full bg-transparent border-0 border-b border-arang text-arang focus:ring-0 focus:border-pandan px-0 py-2 placeholder-abu"
                                placeholder="nama@contoh.com"
                                required
                            />
                            {errors.email && <div className="text-cabai text-sm mt-1">{errors.email}</div>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-abu mb-1">Password</label>
                            <input
                                type="password"
                                value={data.password}
                                onChange={e => setData('password', e.target.value)}
                                className="w-full bg-transparent border-0 border-b border-arang text-arang focus:ring-0 focus:border-pandan px-0 py-2 placeholder-abu"
                                placeholder="••••••••"
                                required
                            />
                            {errors.password && <div className="text-cabai text-sm mt-1">{errors.password}</div>}
                        </div>
                        
                        {errors.general && (
                            <div className="p-3 bg-cabai-muda text-cabai text-sm rounded">
                                {errors.general}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full bg-pandan text-putih py-3 rounded hover:bg-pandan-gelap disabled:bg-pasir disabled:text-abu transition-colors"
                        >
                            {processing ? 'Memproses...' : 'Masuk'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
