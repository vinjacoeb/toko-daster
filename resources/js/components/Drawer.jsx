import React from 'react';

export default function Drawer({ isOpen, onClose, title, children }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-hidden">
            <div className="absolute inset-0 bg-arang/50 transition-opacity" onClick={onClose} />
            <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
                <div className="w-screen max-w-md bg-putih shadow-xl flex flex-col">
                    <div className="flex items-center justify-between px-6 py-4 border-b border-garis">
                        <h2 className="text-lg font-young-serif text-arang">{title}</h2>
                        <button
                            type="button"
                            onClick={onClose}
                            className="text-abu hover:text-arang focus:outline-none"
                        >
                            <span className="sr-only">Tutup</span>
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                    <div className="flex-1 overflow-y-auto p-6">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}