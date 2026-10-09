import React from 'react';

export default function Button({ children, variant = 'primary', className = "", ...props }) {
    const baseStyle = "inline-flex items-center justify-center px-4 py-2 rounded-sm font-semibold text-sm transition-colors h-[44px] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pandan";
    const variants = {
        primary: "bg-pandan text-putih hover:bg-pandan-gelap disabled:bg-pasir disabled:text-abu disabled:cursor-not-allowed",
        secondary: "bg-transparent border border-arang text-arang hover:bg-pasir disabled:opacity-50 disabled:cursor-not-allowed",
        danger: "border border-cabai text-cabai hover:bg-cabai-muda disabled:opacity-50 disabled:cursor-not-allowed"
    };

    return (
        <button className={`${baseStyle} ${variants[variant]} ${className}`} {...props}>
            {children}
        </button>
    );
}