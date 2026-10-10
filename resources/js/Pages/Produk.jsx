import React, { useState, useEffect } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import GuestLayout from '../Layouts/GuestLayout';
import CardProduct from '../components/CardProduct';
import InputSearch from '../components/InputSearch';
import DropdownSort from '../components/DropdownSort';
import CheckboxFilter from '../components/CheckboxFilter';
import Drawer from '../components/Drawer';
import Pagination from '../components/Pagination';

export default function Produk() {
    const { products, categories, filters } = usePage().props;
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    
    const [search, setSearch] = useState(filters.search || '');
    const [selectedCategory, setSelectedCategory] = useState(filters.category || '');
    const [selectedSizes, setSelectedSizes] = useState(filters.size || []);
    const [minPrice, setMinPrice] = useState(filters.min_price || '');
    const [maxPrice, setMaxPrice] = useState(filters.max_price || '');
    const [inStock, setInStock] = useState(filters.in_stock === 'true' || filters.in_stock === true);
    const [sort, setSort] = useState(filters.sort || 'terbaru');

    useEffect(() => {
        const timer = setTimeout(() => {
            if (search !== (filters.search || '')) {
                applyFilters({ search });
            }
        }, 500);
        return () => clearTimeout(timer);
    }, [search]);

    const applyFilters = (newFilters = {}) => {
        const params = {
            search,
            category: selectedCategory,
            size: selectedSizes,
            min_price: minPrice,
            max_price: maxPrice,
            in_stock: inStock,
            sort,
            ...newFilters
        };

        Object.keys(params).forEach(key => {
            if (params[key] === '' || (Array.isArray(params[key]) && params[key].length === 0) || params[key] === false || params[key] === null) {
                delete params[key];
            }
        });

        router.get('/product', params, {
            preserveState: true,
            preserveScroll: true,
            replace: true
        });
    };

    const handleReset = () => {
        setSearch('');
        setSelectedCategory('');
        setSelectedSizes([]);
        setMinPrice('');
        setMaxPrice('');
        setInStock(false);
        setSort('terbaru');
        router.get('/product', {}, { replace: true });
    };

    const removeFilter = (key, value = null) => {
        if (key === 'search') setSearch('');
        if (key === 'category') setSelectedCategory('');
        if (key === 'min_price') setMinPrice('');
        if (key === 'max_price') setMaxPrice('');
        if (key === 'in_stock') setInStock(false);
        if (key === 'size' && value) {
            setSelectedSizes(prev => prev.filter(s => s !== value));
        }
        setTimeout(() => applyFilters(), 0);
    };

    const SIZES = ['All Size', 'S', 'M', 'L', 'XL', 'Jumbo'];

    const FilterContent = () => (
        <div className="space-y-8">
            <div>
                <h3 className="font-hanken-grotesk font-semibold text-arang mb-4">Kategori</h3>
                <div className="space-y-3">
                    {categories && categories.map(cat => (
                        <label key={cat.id} className="flex items-center space-x-2 cursor-pointer group">
                            <input
                                type="radio"
                                name="category"
                                checked={Number(selectedCategory) === cat.id}
                                onChange={() => {
                                    const val = Number(selectedCategory) === cat.id ? '' : cat.id;
                                    setSelectedCategory(val);
                                    applyFilters({ category: val });
                                }}
                                className="h-4 w-4 text-pandan border-garis focus:ring-pandan"
                            />
                            <span className={`text-sm ${Number(selectedCategory) === cat.id ? 'text-pandan font-medium' : 'text-arang group-hover:text-pandan'}`}>
                                {cat.name}
                            </span>
                        </label>
                    ))}
                </div>
            </div>

            <div>
                <h3 className="font-hanken-grotesk font-semibold text-arang mb-4">Ukuran</h3>
                <div className="grid grid-cols-2 gap-2">
                    {SIZES.map(size => (
                        <CheckboxFilter
                            key={size}
                            id={`size-${size}`}
                            label={size}
                            checked={selectedSizes.includes(size)}
                            onChange={(e) => {
                                const newSizes = e.target.checked 
                                    ? [...selectedSizes, size]
                                    : selectedSizes.filter(s => s !== size);
                                setSelectedSizes(newSizes);
                                applyFilters({ size: newSizes });
                            }}
                        />
                    ))}
                </div>
            </div>

            <div>
                <h3 className="font-hanken-grotesk font-semibold text-arang mb-4">Rentang Harga</h3>
                <div className="space-y-3">
                    <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-abu text-sm">Rp</span>
                        <input
                            type="number"
                            placeholder="Min"
                            value={minPrice}
                            onChange={(e) => setMinPrice(e.target.value)}
                            onBlur={() => applyFilters()}
                            className="w-full pl-10 pr-3 py-2 border border-garis rounded-sm text-sm focus:ring-1 focus:ring-pandan focus:border-pandan bg-putih"
                        />
                    </div>
                    <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-abu text-sm">Rp</span>
                        <input
                            type="number"
                            placeholder="Max"
                            value={maxPrice}
                            onChange={(e) => setMaxPrice(e.target.value)}
                            onBlur={() => applyFilters()}
                            className="w-full pl-10 pr-3 py-2 border border-garis rounded-sm text-sm focus:ring-1 focus:ring-pandan focus:border-pandan bg-putih"
                        />
                    </div>
                </div>
            </div>

            <div>
                <CheckboxFilter
                    id="in-stock"
                    label="Hanya yang tersedia"
                    checked={inStock}
                    onChange={(e) => {
                        setInStock(e.target.checked);
                        applyFilters({ in_stock: e.target.checked });
                    }}
                />
            </div>

            <button
                onClick={handleReset}
                className="w-full py-2 text-sm text-abu hover:text-cabai border border-garis hover:border-cabai rounded-sm transition-colors"
            >
                Hapus semua filter
            </button>
        </div>
    );

    const ActiveFilters = () => {
        const hasFilters = search || selectedCategory || selectedSizes.length > 0 || minPrice || maxPrice || inStock;
        if (!hasFilters) return null;

        const categoryName = categories?.find(c => c.id === Number(selectedCategory))?.name;

        return (
            <div className="flex flex-wrap gap-2 mb-6">
                {search && (
                    <button onClick={() => removeFilter('search')} className="inline-flex items-center gap-1 px-3 py-1 bg-pasir text-arang text-xs rounded-full hover:bg-garis">
                        Cari: {search} <span>×</span>
                    </button>
                )}
                {selectedCategory && (
                    <button onClick={() => removeFilter('category')} className="inline-flex items-center gap-1 px-3 py-1 bg-pasir text-arang text-xs rounded-full hover:bg-garis">
                        Kategori: {categoryName} <span>×</span>
                    </button>
                )}
                {selectedSizes.map(size => (
                    <button key={size} onClick={() => removeFilter('size', size)} className="inline-flex items-center gap-1 px-3 py-1 bg-pasir text-arang text-xs rounded-full hover:bg-garis">
                        Ukuran: {size} <span>×</span>
                    </button>
                ))}
                {minPrice && (
                    <button onClick={() => removeFilter('min_price')} className="inline-flex items-center gap-1 px-3 py-1 bg-pasir text-arang text-xs rounded-full hover:bg-garis">
                        Min: Rp{Number(minPrice).toLocaleString('id-ID')} <span>×</span>
                    </button>
                )}
                {maxPrice && (
                    <button onClick={() => removeFilter('max_price')} className="inline-flex items-center gap-1 px-3 py-1 bg-pasir text-arang text-xs rounded-full hover:bg-garis">
                        Max: Rp{Number(maxPrice).toLocaleString('id-ID')} <span>×</span>
                    </button>
                )}
                {inStock && (
                    <button onClick={() => removeFilter('in_stock')} className="inline-flex items-center gap-1 px-3 py-1 bg-pasir text-arang text-xs rounded-full hover:bg-garis">
                        Tersedia <span>×</span>
                    </button>
                )}
            </div>
        );
    };

    return (
        <GuestLayout>
            <Head title="Produk" />
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
                <nav className="text-sm text-abu mb-6">
                    <a href="/" className="hover:text-pandan">Beranda</a>
                    {' / '}
                    <span className="text-arang">Produk</span>
                </nav>

                <div className="flex flex-col lg:flex-row gap-12">
                    <aside className="hidden lg:block lg:w-1/4">
                        <div className="sticky top-8">
                            <h2 className="text-xl font-young-serif text-arang mb-8 border-b border-garis pb-4">Filter</h2>
                            <FilterContent />
                        </div>
                    </aside>

                    <div className="lg:w-3/4">
                        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-8">
                            <div>
                                <h1 className="text-4xl font-young-serif text-arang mb-2">Semua produk</h1>
                                <p className="text-abu text-sm">Menampilkan <span className="text-arang font-medium">{products.total}</span> produk</p>
                            </div>
                            
                            <div className="flex flex-wrap items-center gap-3">
                                <button
                                    onClick={() => setIsFilterOpen(true)}
                                    className="lg:hidden flex items-center gap-2 px-4 py-2 border border-garis rounded-sm text-sm text-arang bg-putih"
                                >
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                                    </svg>
                                    Filter
                                </button>

                                <InputSearch
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="w-full md:w-64"
                                />
                                
                                <DropdownSort
                                    value={sort}
                                    onChange={(val) => {
                                        setSort(val);
                                        applyFilters({ sort: val });
                                    }}
                                    className="w-full md:w-48"
                                />
                            </div>
                        </div>

                        <ActiveFilters />

                        {products.data.length > 0 ? (
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-8 md:gap-x-6 md:gap-y-10">
                                {products.data.map(product => (
                                    <CardProduct key={product.id} product={product} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-20 bg-putih rounded-sm border border-garis border-dashed">
                                <h3 className="font-young-serif text-xl text-arang mb-2">Belum ada produk yang cocok</h3>
                                <p className="text-abu mb-6">Coba ubah kata kunci pencarian atau sesuaikan filter yang digunakan.</p>
                                <button
                                    onClick={handleReset}
                                    className="inline-flex items-center px-6 py-2 bg-pandan text-putih rounded-sm font-medium hover:bg-pandan-gelap"
                                >
                                    Hapus filter
                                </button>
                            </div>
                        )}

                        <Pagination links={products.links} />
                    </div>
                </div>
            </div>

            <Drawer
                isOpen={isFilterOpen}
                onClose={() => setIsFilterOpen(false)}
                title="Filter Produk"
            >
                <div className="pb-12">
                    <FilterContent />
                    <div className="fixed bottom-0 left-0 right-0 p-4 bg-putih border-t border-garis lg:hidden">
                        <button
                            onClick={() => setIsFilterOpen(false)}
                            className="w-full py-3 bg-pandan text-putih rounded-sm font-bold"
                        >
                            Lihat {products.total} Produk
                        </button>
                    </div>
                </div>
            </Drawer>
        </GuestLayout>
    );
}