import React, { forwardRef } from 'react';

const InputSearch = forwardRef(({ id, name, value, onChange, onKeyDown, placeholder = "Cari produk atau motif...", className = "", ...props }, ref) => (
    <div className="relative">
        <input
            ref={ref}
            id={id}
            name={name}
            type="text"
            value={value}
            onChange={onChange}
            onKeyDown={onKeyDown}
            placeholder={placeholder}
            className={`w-full px-3 py-2 pr-10 border-b-2 border-arang text-arang placeholder-abu focus:border-pandan focus:ring-0 ${className}`}
            {...props}
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-abu pointer-events-none">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
        </div>
    </div>
));

export default InputSearch;