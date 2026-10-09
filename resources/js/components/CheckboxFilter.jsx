import React from 'react';

export default function CheckboxFilter({ id, label, checked, onChange, disabled = false, className = "" }) {
    return (
        <label className={`flex items-center space-x-2 cursor-pointer ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}>            <input
                id={id}
                type="checkbox"
                checked={checked}
                onChange={onChange}
                disabled={disabled}
                className="h-4 w-4 rounded border-garis text-pandan focus:ring-pandan"
            />
            <span className="text-sm text-arang">{label}</span>
        </label>
    );
}