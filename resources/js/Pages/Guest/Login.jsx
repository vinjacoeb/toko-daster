import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import GuestLayout from '../../Layouts/GuestLayout';

export default function Login() {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: '',
    });

    function submit(e) {
        e.preventDefault();
        post('/login', {
            onSuccess: () => {
                // Redirect happens automatically
            }
        });
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-kapas py-12 px-4 sm:px-6 lg:px-8">
            <Head title="Masuk Admin" />
            
            <div className="max-w-md w-full space-y-8 bg-putih p-8 rounded-lg shadow-sm border border-garis">
                <div className="text-center">
                    <h1 className="font-young-serif text-3xl text-arang mb-2">Daster</h1>
                    <p className="text-sm text-abu">Dashboard pengelola</p>
                </div>

                <form className="space-y-6" onSubmit={submit}>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-abu mb-1">Email</label>
                        <input
                            id="email"
                            type="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            className="w-full px-3 py-2 border-b-2 border-arang text-arang placeholder-abu focus:border-pandan focus:ring-0 rounded-none"
                            placeholder="nama@contoh.com"
                            required
                        />
                        {errors.email && (
                            <p className="mt-1 text-sm text-cabai">{errors.email}</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-abu mb-1">Password</label>
                        <input
                            id="password"
                            type="password"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            className="w-full px-3 py-2 border-b-2 border-arang text-arang placeholder-abu focus:border-pandan focus:ring-0 rounded-none"
                            placeholder="••••••••"
                            required
                        />
                        {errors.password && (
                            <p className="mt-1 text-sm text-cabai">{errors.password}</p>
                        )}
                    </div>

                    {errors.general && (
                        <div className="bg-cabai-muda border-l-4 border-cabai p-4">
                            <p className="text-sm text-cabai">{errors.general}</p>
                        </div>
                    )}

                    <div>
                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-putih bg-pandan hover:bg-pandan-gelap focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pandan disabled:bg-pasir disabled:text-abu"
                        >
                            {processing ? 'Memproses...' : 'Masuk'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
