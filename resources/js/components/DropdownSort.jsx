import React, { useState, useRef, useEffect } from 'react';

const SORT_OPTIONS = [
    { value: 'terbaru', label: 'Terbaru' },
    { value: 'harga_asc', label: 'Harga terendah' },
    { value: 'harga_desc', label: 'Harga tertinggi' },
];

export default function DropdownSort({ value, onChange, className = "" }) {
    const [isOpen, setIsOpen] = useState(false);
    const ref = useRef();

    const selected = SORT_OPTIONS.find(opt => opt.value === value) || SORT_OPTIONS[0];

    useEffect(() => {
        function handleClickOutside(event) {
            if (ref.current && !ref.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    return (
        <div ref={ref} className={`relative inline-block text-left ${className}`}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex justify-between w-full rounded-sm border border-garis bg-putih px-4 py-2 text-sm text-arang hover:border-pandan focus:outline-none focus:ring-2 focus:ring-pandan focus:ring-offset-2"
            >
                <span className="block truncate">{selected.label}</span>
                <svg className="ml-2 -mr-1 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
            </button>

            {isOpen && (
                <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-sm shadow-lg bg-putih ring-1 ring-black ring-opacity-5 z-50">
                    <div className="py-1">
                        {SORT_OPTIONS.map(opt => (
                            <button
                                key={opt.value}
                                onClick={() => {
                                    onChange(opt.value);
                                    setIsOpen(false);
                                }}
                                className={`block w-full text-left px-4 py-2 text-sm ${opt.value === value ? 'bg-pandan-muda text-arang' : 'text-arang hover:bg-pasir'}`}
                            >
                                {opt.label}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}