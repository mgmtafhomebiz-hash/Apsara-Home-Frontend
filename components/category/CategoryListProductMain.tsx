'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useState, useMemo, useEffect, useRef } from 'react';
import Footer from '@/components/landing-page/Footer';
import TopBar from '@/components/layout/TopBar';
import Navbar from '@/components/layout/Navbar';
import ItemCard from '@/components/item/ItemCard';
import TopFilter from '@/components/item/TopFilter';
import ProductFilter, { FilterState } from '@/components/item/ProductFilter';
import { CategoryProduct, categoryMeta, categoryProducts, CATEGORY_BRANDS } from '@/libs/CategoryData';
import type { Category } from '@/store/api/categoriesApi';

const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.06, delayChildren: 0.05 } },
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] } },
};

const GridIcon = ({ active }: { active: boolean }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill={active ? '#f97316' : '#9ca3af'}>
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
);

const ListIcon = ({ active }: { active: boolean }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none"
        stroke={active ? '#f97316' : '#9ca3af'} strokeWidth="2" strokeLinecap="round">
        <rect x="3" y="4" width="18" height="4" rx="1" />
        <rect x="3" y="11" width="18" height="4" rx="1" />
        <rect x="3" y="18" width="18" height="4" rx="1" />
    </svg>
);

const ChevronDown = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="6 9 12 15 18 9" /></svg>
);


interface CategoryListProductMainProps {
    slug: string;
    initialCategoryLabel?: string;
    initialProducts?: CategoryProduct[];
    initialCategories?: Category[];
}

const titleFromSlug = (slug: string) =>
    slug
        .split('-')
        .filter(Boolean)
        .map((chunk) => chunk.charAt(0).toUpperCase() + chunk.slice(1))
        .join(' ');

export default function CategoryListProductMain({
    slug,
    initialCategoryLabel,
    initialProducts,
    initialCategories = [],
}: CategoryListProductMainProps) {
    const meta = categoryMeta[slug];
    const staticProducts = categoryProducts[slug];
    const hasDynamicProducts = Array.isArray(initialProducts);
    const safeProducts = useMemo(
        () => (hasDynamicProducts ? (initialProducts ?? []) : (staticProducts ?? [])),
        [hasDynamicProducts, initialProducts, staticProducts],
    );

    const categoryLabel = initialCategoryLabel ?? meta?.label ?? titleFromSlug(slug);

    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [showCount, setShowCount] = useState(16);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const listingTopRef = useRef<HTMLDivElement | null>(null);
    
    // Filter state for ProductFilter component
    const [filterState, setFilterState] = useState<FilterState>({
        priceRange: [0, 10000],
        sortBy: 'default',
        inStock: false,
        discountOnly: false,
        minDiscount: 0,
        pvRange: [0, 5000],
        search: '',
        hasPvOnly: false
    });

    // Filter change handler for ProductFilter component
    const handleFilterChange = (filters: FilterState) => {
        setFilterState(filters);
    };

    // Reset filters function
    const resetFilters = () => {
        setFilterState({
            priceRange: [0, 10000],
            sortBy: 'default',
            inStock: false,
            discountOnly: false,
            minDiscount: 0,
            pvRange: [0, 5000],
            search: '',
            hasPvOnly: false
        });
        setSearchQuery('');
    };

    // Search change handler for TopFilter component
    const handleSearchChange = (search: string) => {
        setSearchQuery(search);
    };

    // View type change handler for TopFilter component
    const handleViewTypeChange = (viewType: 'grid' | 'list') => {
        setViewMode(viewType);
    };

    // Show number change handler for TopFilter component
    const handleShowNumberChange = (showNumber: number | 'all') => {
        setShowCount(showNumber === 'all' ? safeProducts.length : showNumber);
    };

    // Sort change handler for TopFilter component
    const handleSortChange = (sort: string) => {
        // Map TopFilter sort values to our internal values
        const sortMapping: Record<string, 'default' | 'asc' | 'desc'> = {
            'default': 'default',
            'name-asc': 'asc',
            'name-desc': 'desc',
            'price-asc': 'asc',
            'price-desc': 'desc'
        };
        
        const newSortBy = sortMapping[sort] || 'default';
        setFilterState(prev => ({ ...prev, sortBy: newSortBy }));
    };

    const filteredProducts = useMemo(() => {
        let result = safeProducts.filter(p => {
            // Filter by price range
            const passPrice = p.price >= filterState.priceRange[0] && p.price <= filterState.priceRange[1];
            
            // Filter by search query
            const passSearch = searchQuery === '' || 
                p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (p.brand && p.brand.toLowerCase().includes(searchQuery.toLowerCase()));
            
            // Filter by stock (assuming all products are in stock for now)
            const passStock = !filterState.inStock || true;
            
            // Filter by discount (assuming no discount data for now)
            const passDiscount = !filterState.discountOnly || false;
            
            return passPrice && passSearch && passStock && passDiscount;
        });

        // Apply sorting
        if (filterState.sortBy === 'asc') {
            // For simplicity, sort by price ascending
            result = [...result].sort((a, b) => a.price - b.price);
        }
        if (filterState.sortBy === 'desc') {
            // For simplicity, sort by price descending
            result = [...result].sort((a, b) => b.price - a.price);
        }
        if (filterState.sortBy === 'default') {
            // Keep original order (newest first)
            result = [...result];
        }
        
        return result;
    }, [safeProducts, filterState, searchQuery]);

    // Reset to page 1 when filters/sort/showCount change.
    useEffect(() => { setCurrentPage(1); }, [filterState, searchQuery, showCount]);

    // Reset pagination when switching to a different category route.
    useEffect(() => {
        setCurrentPage(1);
    }, [slug]);

    const totalPages = Math.max(1, Math.ceil(filteredProducts.length / showCount));
    const boundedCurrentPage = Math.min(currentPage, totalPages);
    const paginatedProducts = filteredProducts.slice((boundedCurrentPage - 1) * showCount, boundedCurrentPage * showCount);

    useEffect(() => {
        if (boundedCurrentPage <= 1) return;
        listingTopRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, [boundedCurrentPage]);

    const hasActiveFilters = filterState.priceRange[0] > 0 || 
        filterState.priceRange[1] < 10000 || 
        filterState.inStock || 
        filterState.discountOnly ||
        filterState.minDiscount > 0 ||
        filterState.hasPvOnly ||
        searchQuery !== '';
    
    const activeFilterCount = [
        filterState.priceRange[0] > 0,
        filterState.priceRange[1] < 10000,
        filterState.inStock,
        filterState.discountOnly,
        filterState.minDiscount > 0,
        filterState.hasPvOnly,
        searchQuery !== ''
    ].filter(Boolean).length;

    return (
        <div className="min-h-screen bg-white flex flex-col">
            <TopBar />
            <Navbar initialCategories={initialCategories} />

            <main className="flex-1">
                {/* Breadcrumb */}
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

                <div className="container mx-auto px-4 py-6 lg:py-8">
                    <div className="flex gap-6 items-start">

                        {/* ─── PRODUCT FILTER SIDEBAR ─── */}
                        <aside className="hidden lg:block w-80 shrink-0 sticky top-4">
                            <ProductFilter
                                onFilterChange={handleFilterChange}
                                search={searchQuery}
                                categories={initialCategories}
                                currentCategory={categoryLabel}
                            />
                            {/* Video Section */}
                            <div className="mt-4 rounded-2xl overflow-hidden aspect-square border border-slate-100 bg-slate-50">
                                <video
                                    className="h-full w-full object-cover"
                                    src="/loginpageVideo/afhome.mp4"
                                    autoPlay
                                    muted
                                    loop
                                    playsInline
                                />
                            </div>
                        </aside>

                        {/* ─── MAIN CONTENT ─── */}
                        <div className="flex-1 min-w-0">

                            {/* Top Filter */}
                            <div ref={listingTopRef} className="mb-5">
                                <TopFilter
                                    onSearchChange={handleSearchChange}
                                    onViewTypeChange={handleViewTypeChange}
                                    onShowNumberChange={handleShowNumberChange}
                                    onSortChange={handleSortChange}
                                    searchValue={searchQuery}
                                    viewType={viewMode}
                                    showNumber={showCount}
                                    sortValue={filterState.sortBy}
                                    className="mb-4"
                                />
                                <div className="flex items-center justify-between text-sm text-gray-600">
                                    <span>
                                        Showing <span className="font-semibold text-slate-700">{paginatedProducts.length}</span> of{' '}
                                        <span className="font-semibold text-slate-700">{filteredProducts.length}</span> products
                                    </span>
                                    {hasActiveFilters && (
                                        <span className="text-xs text-orange-500 font-medium">
                                            {activeFilterCount} filter{activeFilterCount !== 1 ? 's' : ''} active
                                        </span>
                                    )}
                                </div>
                            </div>

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
                                <div className={
                                    viewMode === 'grid'
                                        ? 'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4'
                                        : 'flex flex-col gap-3'
                                }>
                                    {paginatedProducts.map((product, i) => (
                                        <motion.div
                                            key={`${product.name}-${i}`}
                                            initial={{ opacity: 0, y: 14 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.22, delay: i * 0.02, ease: 'easeOut' }}
                                        >
                                            {viewMode === 'grid' ? (
                                                <ItemCard key={product.id} product={product} brandName={product.brand || ''} />
                                            ) : (
                                                <Link
                                                    key={product.id}
                                                    href={`/product/${product.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-i${product.id}`}
                                                    className="flex gap-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden hover:border-orange-500 dark:hover:border-orange-400 transition-colors group relative"
                                                >
                                                    {/* Action Icons */}
                                                    <div className="absolute top-2 right-2 flex flex-col gap-2 z-10">
                                                        <button
                                                            onClick={(e) => {
                                                                e.preventDefault()
                                                                e.stopPropagation()
                                                                // Add to wishlist functionality here
                                                            }}
                                                            className="p-2 rounded-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-md border border-gray-200 dark:border-gray-600 shadow-lg hover:bg-orange-500 hover:border-orange-500 dark:hover:bg-orange-500 dark:hover:border-orange-500 transition-all duration-200 cursor-pointer"
                                                            title="Add to Wishlist"
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-700 dark:text-gray-300 hover:text-white transition-colors">
                                                                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                                                            </svg>
                                                        </button>
                                                        <button
                                                            onClick={(e) => {
                                                                e.preventDefault()
                                                                e.stopPropagation()
                                                                const productUrl = `${window.location.origin}/product/${product.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-i${product.id}`
                                                                navigator.clipboard.writeText(productUrl).then(() => {
                                                                    // Show success message
                                                                }).catch(() => {
                                                                    // Show error message
                                                                })
                                                            }}
                                                            className="p-2 rounded-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-md border border-gray-200 dark:border-gray-600 shadow-lg hover:bg-orange-500 hover:border-orange-500 dark:hover:bg-orange-500 dark:hover:border-orange-500 transition-all duration-200 cursor-pointer"
                                                            title="Share"
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-700 dark:text-gray-300 hover:text-white transition-colors">
                                                                <circle cx="18" cy="5" r="3" />
                                                                <circle cx="6" cy="12" r="3" />
                                                                <circle cx="18" cy="19" r="3" />
                                                                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                                                                <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                    <div className="relative aspect-square w-32 bg-gray-100 dark:bg-gray-700 overflow-hidden shrink-0">
                                                        {product.image ? (
                                                            <img
                                                                src={product.image}
                                                                alt={product.name}
                                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                            />
                                                        ) : (
                                                            <div className="flex h-full items-center justify-center text-gray-400 dark:text-gray-500">
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                                                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                                                                    <circle cx="8.5" cy="8.5" r="1.5" />
                                                                    <polyline points="21 15 16 10 5 21" />
                                                                </svg>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="flex flex-col justify-center flex-1 p-4 relative">
                                                        <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-orange-500 dark:group-hover:text-orange-400 transition-colors">{product.name}</h3>
                                                        <div className="flex items-baseline gap-2 mb-2">
                                                            <span className="text-lg font-bold text-orange-500 dark:text-orange-400">
                                                                ₱{Number(product.price || 0).toLocaleString()}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            {product.prodpv && Number(product.prodpv) > 0 && (
                                                                <span className="inline-flex items-center rounded-full border border-blue-200 dark:border-blue-700 bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 text-[11px] font-semibold text-blue-700 dark:text-blue-300">
                                                                    PV {Number(product.prodpv).toLocaleString()}
                                                                </span>
                                                            )}
                                                        </div>
                                                        {/* Sales/Ratings */}
                                                        <div className="flex items-center gap-1 mt-1">
                                                            <div className="flex items-center">
                                                                {[1, 2, 3, 4, 5].map((star) => (
                                                                    <svg
                                                                        key={star}
                                                                        xmlns="http://www.w3.org/2000/svg"
                                                                        width="10"
                                                                        height="10"
                                                                        viewBox="0 0 24 24"
                                                                        fill={star <= 4 ? '#f97316' : 'none'}
                                                                        stroke={star <= 4 ? '#f97316' : '#d1d5db'}
                                                                        strokeWidth="2"
                                                                    >
                                                                        <path d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                                                                    </svg>
                                                                ))}
                                                            </div>
                                                            <span className="text-xs text-gray-400 dark:text-gray-500">124 sold</span>
                                                        </div>
                                                        {/* Add to Cart Button */}
                                                        <button
                                                            onClick={(e) => {
                                                                e.preventDefault()
                                                                e.stopPropagation()
                                                                // Add to cart functionality here
                                                            }}
                                                            className="absolute bottom-4 right-4 flex items-center justify-center gap-2 rounded-full bg-orange-500 hover:bg-orange-600 px-4 py-2 text-sm font-semibold text-white opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 cursor-pointer"
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                                <circle cx="9" cy="21" r="1" />
                                                                <circle cx="20" cy="21" r="1" />
                                                                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                                                            </svg>
                                                            Add to Cart
                                                        </button>
                                                    </div>
                                                </Link>
                                            )}
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}