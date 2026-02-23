'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { use, useState, useMemo } from 'react';
import Footer from '@/components/layout/Footer';
import TopBar from '@/components/layout/TopBar';
import Navbar from '@/components/layout/Navbar';
import ProductCard from '@/components/ui/ProductCard';
import { categoryMeta, categoryProducts, CATEGORY_BRANDS, PRICE_MAX } from '@/libs/CategoryData';

const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.06, delayChildren: 0.05 } },
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] } },
};

// Grid icon
const GridIcon = ({ active }: { active: boolean }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill={active ? '#f97316' : '#9ca3af'}>
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
);

// List icon
const ListIcon = ({ active }: { active: boolean }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none"
        stroke={active ? '#f97316' : '#9ca3af'} strokeWidth="2" strokeLinecap="round">
        <rect x="3" y="4" width="18" height="4" rx="1" />
        <rect x="3" y="11" width="18" height="4" rx="1" />
        <rect x="3" y="18" width="18" height="4" rx="1" />
    </svg>
);

// Chevron icon
const ChevronDown = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="6 9 12 15 18 9" /></svg>
);

interface FilterSectionProps {
    title: string;
    children: React.ReactNode;
    defaultOpen?: boolean;
}

function FilterSection({ title, children, defaultOpen = true }: FilterSectionProps) {
    const [open, setOpen] = useState(defaultOpen);
    return (
        <div className="border-b border-gray-100 pb-4 mb-4 last:border-0 last:mb-0 last:pb-0">
            <button
                onClick={() => setOpen(o => !o)}
                className="flex items-center justify-between w-full mb-3 group"
            >
                <span className="text-xs font-bold text-slate-700 uppercase tracking-widest group-hover:text-orange-500 transition-colors">
                    {title}
                </span>
                <span className={`text-gray-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}>
                    <ChevronDown />
                </span>
            </button>
            <AnimatePresence initial={false}>
                {open && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                    >
                        {children}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = use(params);

    const meta = categoryMeta[slug];
    const products = categoryProducts[slug];
    const hasValidCategory = Boolean(meta && products);
    const safeProducts = useMemo(() => products ?? [], [products]);
    const categoryLabel = meta?.label ?? '';

    // Compute price bounds from actual products
    const minProductPrice = safeProducts.length > 0 ? Math.min(...safeProducts.map(p => p.price)) : 0;

    // Filter state
    const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
    const [maxPrice, setMaxPrice] = useState(PRICE_MAX);
    const [sortBy, setSortBy] = useState('best-selling');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [showCount, setShowCount] = useState(32);

    const toggleBrand = (brand: string) =>
        setSelectedBrands(prev => prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]);

    const resetFilters = () => {
        setSelectedBrands([]);
        setMaxPrice(PRICE_MAX);
    };

    const filteredProducts = useMemo(() => {
        let result = safeProducts.filter(p => {
            const passPrice = p.price <= maxPrice;
            const passBrand = selectedBrands.length === 0 || (p.brand && selectedBrands.includes(p.brand));
            return passPrice && passBrand;
        });
        if (sortBy === 'price-asc') result = [...result].sort((a, b) => a.price - b.price);
        if (sortBy === 'price-desc') result = [...result].sort((a, b) => b.price - a.price);
        if (sortBy === 'newest') result = [...result].reverse();
        return result;
    }, [safeProducts, maxPrice, selectedBrands, sortBy]);

    const hasActiveFilters = selectedBrands.length > 0 || maxPrice < PRICE_MAX;

    if (!hasValidCategory) return notFound();

    return (
        <div className="min-h-screen bg-white flex flex-col">
            <TopBar />
            <Navbar />

            <main className="flex-1">
                {/* Breadcrumb bar */}
                <div className="bg-gray-50 border-b border-gray-100">
                    <div className="container mx-auto px-4 py-3 flex items-center justify-between">
                        <h1 className="text-base font-bold text-slate-800">{categoryLabel}</h1>
                        <nav className="flex items-center gap-1.5 text-xs text-gray-400">
                            <Link href="/" className="hover:text-orange-500 transition-colors font-medium">Home</Link>
                            <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6" /></svg>
                            <span className="text-slate-600 font-semibold">{categoryLabel}</span>
                        </nav>
                    </div>
                </div>

                <div className="container mx-auto px-4 py-8">
                    <div className="flex gap-6 items-start">

                        {/* ───── LEFT SIDEBAR ───── */}
                        <aside className="w-60 shrink-0 sticky top-4">
                            <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">

                                {/* Header */}
                                <div className="flex items-center justify-between mb-5">
                                    <span className="text-sm font-bold text-slate-800">Filters</span>
                                    {hasActiveFilters && (
                                        <button
                                            onClick={resetFilters}
                                            className="text-xs text-orange-500 hover:text-orange-600 font-semibold transition-colors"
                                        >
                                            Clear all
                                        </button>
                                    )}
                                </div>

                                {/* Product Type */}
                                <FilterSection title="Product Type">
                                    <label className="flex items-center justify-between cursor-pointer group">
                                        <div className="flex items-center gap-2.5">
                                            <div className="w-4 h-4 rounded border-2 border-orange-500 bg-orange-500 flex items-center justify-center shrink-0">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12" /></svg>
                                            </div>
                                            <span className="text-sm text-slate-700 group-hover:text-orange-500 transition-colors">{categoryLabel}</span>
                                        </div>
                                        <span className="text-xs text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded-full">{safeProducts.length}</span>
                                    </label>
                                </FilterSection>

                                {/* Price */}
                                <FilterSection title="Price">
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between text-xs text-gray-500">
                                            <span className="font-medium">₱{minProductPrice.toLocaleString()}</span>
                                            <span className="font-semibold text-orange-500">
                                                up to ₱{maxPrice.toLocaleString()}
                                            </span>
                                        </div>
                                        <input
                                            type="range"
                                            min={minProductPrice}
                                            max={PRICE_MAX}
                                            step={500}
                                            value={maxPrice}
                                            onChange={e => setMaxPrice(Number(e.target.value))}
                                            className="w-full h-1.5 rounded-full accent-orange-500 cursor-pointer"
                                        />
                                        <div className="flex gap-2">
                                            <div className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs text-gray-600 text-center">
                                                ₱{minProductPrice.toLocaleString()}
                                            </div>
                                            <div className="flex-1 bg-orange-50 border border-orange-200 rounded-lg px-2.5 py-1.5 text-xs text-orange-600 font-semibold text-center">
                                                ₱{maxPrice.toLocaleString()}
                                            </div>
                                        </div>
                                    </div>
                                </FilterSection>

                                {/* Brands */}
                                <FilterSection title="Brands">
                                    <div className="flex flex-col gap-2.5">
                                        {CATEGORY_BRANDS.map(brand => {
                                            const count = safeProducts.filter(p => p.brand === brand).length;
                                            if (count === 0) return null;
                                            const checked = selectedBrands.includes(brand);
                                            return (
                                                <label key={brand} className="flex items-center justify-between cursor-pointer group">
                                                    <div className="flex items-center gap-2.5">
                                                        <div className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-colors ${checked ? 'border-orange-500 bg-orange-500' : 'border-gray-300 bg-white group-hover:border-orange-400'}`}>
                                                            {checked && (
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12" /></svg>
                                                            )}
                                                        </div>
                                                        <span className={`text-sm transition-colors ${checked ? 'text-orange-600 font-medium' : 'text-gray-600 group-hover:text-orange-500'}`}>
                                                            {brand}
                                                        </span>
                                                    </div>
                                                    <span className="text-xs text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded-full">{count}</span>
                                                    <input
                                                        type="checkbox"
                                                        className="sr-only"
                                                        checked={checked}
                                                        onChange={() => toggleBrand(brand)}
                                                    />
                                                </label>
                                            );
                                        })}
                                    </div>
                                </FilterSection>
                            </div>

                            {/* Square Ad Banner */}
                            <div className="mt-4 rounded-2xl overflow-hidden aspect-square bg-linear-to-br from-blue-50 to-sky-100 border border-dashed border-sky-200 flex flex-col items-center justify-center gap-2 text-center p-4">
                                <div className="w-10 h-10 rounded-full bg-sky-200 flex items-center justify-center mb-1">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0ea5e9" strokeWidth="2" strokeLinecap="round">
                                        <rect x="2" y="3" width="20" height="14" rx="2" />
                                        <line x1="8" y1="21" x2="16" y2="21" />
                                        <line x1="12" y1="17" x2="12" y2="21" />
                                    </svg>
                                </div>
                                <p className="text-xs font-semibold text-sky-700">Advertisement</p>
                                <p className="text-[10px] text-sky-500">300 × 300</p>
                            </div>
                        </aside>

                        {/* ───── MAIN CONTENT ───── */}
                        <div className="flex-1 min-w-0">

                            {/* Toolbar */}
                            <div className="flex items-center justify-between mb-5 flex-wrap gap-3 bg-gray-50 rounded-xl px-4 py-3 border border-gray-100">
                                <div className="flex items-center gap-3">
                                    <span className="text-xs text-gray-400 font-medium">View as:</span>
                                    <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-lg p-1">
                                        <button
                                            onClick={() => setViewMode('grid')}
                                            className={`p-1.5 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-orange-50' : 'hover:bg-gray-100'}`}
                                            title="Grid view"
                                        >
                                            <GridIcon active={viewMode === 'grid'} />
                                        </button>
                                        <button
                                            onClick={() => setViewMode('list')}
                                            className={`p-1.5 rounded-md transition-colors ${viewMode === 'list' ? 'bg-orange-50' : 'hover:bg-gray-100'}`}
                                            title="List view"
                                        >
                                            <ListIcon active={viewMode === 'list'} />
                                        </button>
                                    </div>
                                    <span className="text-xs text-gray-400">
                                        Showing <span className="font-semibold text-slate-700">{Math.min(showCount, filteredProducts.length)}</span> of{' '}
                                        <span className="font-semibold text-slate-700">{filteredProducts.length}</span> products
                                    </span>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                                        <span>Show:</span>
                                        <select
                                            value={showCount}
                                            onChange={e => setShowCount(Number(e.target.value))}
                                            className="border border-gray-200 bg-white rounded-lg px-2 py-1 text-xs text-gray-700 focus:outline-none focus:ring-1 focus:ring-orange-300 cursor-pointer"
                                        >
                                            <option value={16}>16</option>
                                            <option value={32}>32</option>
                                            <option value={48}>48</option>
                                        </select>
                                    </div>
                                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                                        <span>Sort by:</span>
                                        <select
                                            value={sortBy}
                                            onChange={e => setSortBy(e.target.value)}
                                            className="border border-gray-200 bg-white rounded-lg px-2 py-1 text-xs text-gray-700 focus:outline-none focus:ring-1 focus:ring-orange-300 cursor-pointer"
                                        >
                                            <option value="best-selling">Best Selling</option>
                                            <option value="price-asc">Price: Low to High</option>
                                            <option value="price-desc">Price: High to Low</option>
                                            <option value="newest">Newest</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Active filter chips */}
                            {hasActiveFilters && (
                                <div className="flex items-center gap-2 flex-wrap mb-4">
                                    {selectedBrands.map(b => (
                                        <span key={b} className="flex items-center gap-1.5 bg-orange-50 border border-orange-200 text-orange-600 text-xs font-medium px-2.5 py-1 rounded-full">
                                            {b}
                                            <button onClick={() => toggleBrand(b)} className="hover:text-orange-800 transition-colors">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                                            </button>
                                        </span>
                                    ))}
                                    {maxPrice < PRICE_MAX && (
                                        <span className="flex items-center gap-1.5 bg-orange-50 border border-orange-200 text-orange-600 text-xs font-medium px-2.5 py-1 rounded-full">
                                            Up to ₱{maxPrice.toLocaleString()}
                                            <button onClick={() => setMaxPrice(PRICE_MAX)} className="hover:text-orange-800 transition-colors">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                                            </button>
                                        </span>
                                    )}
                                </div>
                            )}

                            {/* Products */}
                            {filteredProducts.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-24 text-center">
                                    <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="1.5" strokeLinecap="round">
                                            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                                        </svg>
                                    </div>
                                    <p className="text-slate-700 font-semibold mb-1">No products found</p>
                                    <p className="text-gray-400 text-sm mb-4">Try adjusting your filters</p>
                                    <button onClick={resetFilters} className="text-sm font-semibold text-orange-500 hover:text-orange-600 transition-colors">
                                        Clear all filters
                                    </button>
                                </div>
                            ) : (
                                <motion.div
                                    key={`${viewMode}-${sortBy}`}
                                    className={
                                        viewMode === 'grid'
                                            ? 'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4'
                                            : 'flex flex-col gap-3'
                                    }
                                    variants={containerVariants}
                                    initial="hidden"
                                    animate="visible"
                                >
                                    {filteredProducts.slice(0, showCount).map((product, i) => (
                                        <motion.div key={`${product.name}-${i}`} variants={itemVariants}>
                                            <ProductCard {...product} />
                                        </motion.div>
                                    ))}
                                </motion.div>
                            )}

                            {/* Bottom count */}
                            {filteredProducts.length > 0 && (
                                <p className="mt-8 text-center text-xs text-gray-400">
                                    Showing {Math.min(showCount, filteredProducts.length)} of {filteredProducts.length} products
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
