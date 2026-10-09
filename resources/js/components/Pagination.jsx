import React from 'react';

export default function Pagination({ links }) {
    if (!links || links.length <= 3) return null;

    return (
        <nav className="flex justify-center mt-8">
            <ul className="flex items-center space-x-1">
                {links.map((link, index) => {
                    const isUrl = link.url !== null;
                    const isActive = link.active;

                    return (
                        <li key={index}>
                            {isUrl ? (
                                <a
                                    href={link.url}
                                    className={`px-4 py-2 border text-sm rounded-sm ${isActive ? 'bg-pandan text-putih border-pandan' : 'bg-putih text-arang border-garis hover:bg-pasir'}`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ) : (
                                <span
                                    className="px-4 py-2 border text-sm rounded-sm bg-pasir text-abu border-garis cursor-not-allowed"
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            )}
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
}