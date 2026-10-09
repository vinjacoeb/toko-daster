import React from 'react';

export default function Toast({ type = 'success', message, onClose }) {
    const borderColors = {
        success: 'border-l-pandan',
        error: 'border-l-cabai',
        warning: 'border-l-kunyit',
        info: 'border-l-lawon'
    };

    return (
        <div className={`fixed bottom-4 right-4 z-50 bg-putih border border-garis border-l-4 ${borderColors[type]} p-4 rounded-sm shadow-lg flex items-center space-x-4 max-w-md`}>
            <div className="flex-1 text-sm text-arang">
                {message}
            </div>
            {onClose && (
                <button
                    onClick={onClose}
                    className="text-abu hover:text-arang focus:outline-none"
                >
                    <span className="sr-only">Tutup</span>
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            )}
        </div>
    );
}