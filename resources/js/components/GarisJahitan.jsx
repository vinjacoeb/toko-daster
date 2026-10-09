import React from 'react';

export default function GarisJahitan({ className = "" }) {
    return (
        <div className={`w-full border-t-2 border-dashed border-garis my-8 ${className}`} />
    );
}