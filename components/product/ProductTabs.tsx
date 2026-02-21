'use client';

import { CategoryProduct } from "@/libs/CategoryData";
import { mockReviews, mockSpecs } from "@/libs/MockProductData";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import StarRating from "../ui/StarRating";

interface ProductTabsProps {
    product: CategoryProduct;
    defaultTab?: 'description' | 'specs' | 'reviews';
    onTabChange?: (tab: string) => void;
}

<<<<<<< HEAD
=======
const tabs: { id: 'description' | 'specs' | 'reviews'; label: string }[] = [
    { id: 'description', label: 'Description' },
    { id: 'specs', label: 'Specifications' },
    { id: 'reviews', label: 'Reviews' },
];

>>>>>>> c6498253b282f9b5a2088dec2effa6db1b836c57
const ProductTabs = ({ product, defaultTab = 'description', onTabChange }: ProductTabsProps) => {
    const [activeTab, setActiveTab] = useState<'description' | 'specs' | 'reviews'>(defaultTab);

    const handleTabChange = (tab: 'description' | 'specs' | 'reviews') => {
        setActiveTab(tab);
<<<<<<< HEAD
        onTabChange?.(tab)
    };

    const avgRating = (mockReviews.reduce((s, r) => s + r.rating, 0) / mockReviews.length).toFixed(1);
=======
        onTabChange?.(tab);
    };

    const avgRating = (mockReviews.reduce((s, r) => s + r.rating, 0) / mockReviews.length).toFixed(1);

>>>>>>> c6498253b282f9b5a2088dec2effa6db1b836c57
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
<<<<<<< HEAD
            className="mt-16"
        >
            {/* TAB HEADERS */}
            <AnimatePresence>
=======
            className="mt-12 sm:mt-16"
        >
            <div className="flex border-b border-gray-200 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => handleTabChange(tab.id)}
                        className={`relative px-4 sm:px-6 py-3 text-sm font-semibold whitespace-nowrap shrink-0 transition-colors ${
                            activeTab === tab.id ? 'text-orange-500' : 'text-gray-400 hover:text-slate-600'
                        }`}
                    >
                        {tab.label}
                        {tab.id === 'reviews' && (
                            <span className={`ml-1.5 text-xs px-1.5 py-0.5 rounded-full ${
                                activeTab === 'reviews' ? 'bg-orange-100 text-orange-500' : 'bg-gray-100 text-gray-400'
                            }`}>
                                {mockReviews.length}
                            </span>
                        )}
                        {activeTab === tab.id && (
                            <motion.div
                                layoutId="tab-underline"
                                className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500 rounded-full"
                            />
                        )}
                    </button>
                ))}
            </div>

            <AnimatePresence mode="wait">
>>>>>>> c6498253b282f9b5a2088dec2effa6db1b836c57
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.25 }}
<<<<<<< HEAD
                    className="py-8"
                >
                    {/* DESCRIPTION */}
                    {activeTab === 'description' && (
                        <div className="max-w-2xl space-y-4 text-gray-600 text-sm leading-relaxed">
                            <p>Experience the perfect blend of comfort and style with the <strong className="text-slate-800">{product.name}</strong>. Crafter with premium materials and built to last, this piece is designed to elevate any space in your home.</p>
                            <p>Whether you're furnishing your living room, bedrom, or dining area, this piece fits seamlessly into modern, Scandinavian, and contemporary design styles.</p>
                            <ul className="space-y-2 mt-4">
=======
                    className="py-6 sm:py-8"
                >
                    {activeTab === 'description' && (
                        <div className="max-w-2xl space-y-4 text-gray-600 text-sm leading-relaxed">
                            <p>
                                Experience the perfect blend of comfort and style with the{' '}
                                <strong className="text-slate-800">{product.name}</strong>. Crafted with
                                premium materials and built to last, this piece is designed to elevate any
                                space in your home.
                            </p>
                            <p>
                                Whether you&apos;re furnishing your living room, bedroom, or dining area,
                                this piece fits seamlessly into modern, Scandinavian, and contemporary
                                design styles.
                            </p>
                            <ul className="space-y-2.5 mt-4">
>>>>>>> c6498253b282f9b5a2088dec2effa6db1b836c57
                                {[
                                    'Premium quality materials for long-lasting durability',
                                    'Ergonomic design for maximum comfort',
                                    'Easy to assemble with included hardware',
                                    'Available in multiple color options',
                                    'Suitable for both residential and commercial use',
                                ].map(f => (
<<<<<<< HEAD
                                    <li
                                        key={f}
                                        className="flex items-start gap-2.5"

                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2.5" className="shrink-0 mt-0.5"><polyline points="20 6 9 17 4 12" /></svg>
=======
                                    <li key={f} className="flex items-start gap-2.5">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2.5" className="shrink-0 mt-0.5">
                                            <polyline points="20 6 9 17 4 12" />
                                        </svg>
>>>>>>> c6498253b282f9b5a2088dec2effa6db1b836c57
                                        <span>{f}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

<<<<<<< HEAD
                    {/* SPECIFICATIONS */}
=======
>>>>>>> c6498253b282f9b5a2088dec2effa6db1b836c57
                    {activeTab === 'specs' && (
                        <div className="max-w-lg">
                            <div className="border border-gray-100 rounded-2xl overflow-hidden">
                                {mockSpecs.map((spec, index) => (
<<<<<<< HEAD
                                    <div key={spec.label} className={`flex items-center justify-between px-5 py-3.5 text-sm ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
                                        <span className="font-semibold text-slate-700 w-40 shrink-0">{spec.label}</span>
                                        <span className="text-gray-500">{spec.value}</span>
=======
                                    <div
                                        key={spec.label}
                                        className={`flex items-center justify-between px-4 sm:px-5 py-3.5 text-sm gap-4 ${
                                            index % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                                        }`}
                                    >
                                        <span className="font-semibold text-slate-700 w-32 sm:w-40 shrink-0">{spec.label}</span>
                                        <span className="text-gray-500 text-right">{spec.value}</span>
>>>>>>> c6498253b282f9b5a2088dec2effa6db1b836c57
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

<<<<<<< HEAD
                    {/* REVIEWS */}
                    {activeTab === 'reviews' && (
                        <div className="space-y-4 max-w-2xl">
                            {/* SUMMARY */}
                            <div className="flex items-center gap-6 bg-orange-50 rounded-2xl p-5 mb-6">
                                <div className="text-center">
                                    <div className="text-5xl font-bold text-orange-500">{avgRating}</div>
                                    <StarRating rating={Math.round(Number(avgRating))} size={14}/>
=======
                    {activeTab === 'reviews' && (
                        <div className="space-y-4 max-w-2xl">
                            <div className="flex items-center gap-4 sm:gap-6 bg-orange-50 rounded-2xl p-4 sm:p-5 mb-6">
                                <div className="text-center shrink-0">
                                    <div className="text-4xl sm:text-5xl font-bold text-orange-500">{avgRating}</div>
                                    <StarRating rating={Math.round(Number(avgRating))} size={14} />
>>>>>>> c6498253b282f9b5a2088dec2effa6db1b836c57
                                    <div className="text-xs text-gray-400 mt-1">{mockReviews.length} reviews</div>
                                </div>
                                <div className="flex-1 space-y-1.5">
                                    {[5, 4, 3, 2, 1].map(star => {
                                        const count = mockReviews.filter(r => r.rating === star).length;
                                        const pct = (count / mockReviews.length) * 100;
                                        return (
                                            <div key={star} className="flex items-center gap-2 text-xs">
<<<<<<< HEAD
                                                <span className="w-4 text-gray-500">{star}</span>
                                                <div className="flex-1 bg-gray-200 rounded-full h-1.5 overflow-hidden">
                                                    <div className="bg-orange-400 h-full rounded-full" style={{ width: `${pct}%`}}></div>
                                                </div>
                                                <span className="w-4 text-gray-400">{count}</span>
                                            </div>
                                        )
=======
                                                <span className="w-3 text-gray-500">{star}</span>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="#f97316" className="shrink-0">
                                                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                                                </svg>
                                                <div className="flex-1 bg-gray-200 rounded-full h-1.5 overflow-hidden">
                                                    <motion.div
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${pct}%` }}
                                                        transition={{ duration: 0.6, delay: star * 0.05 }}
                                                        className="bg-orange-400 h-full rounded-full"
                                                    />
                                                </div>
                                                <span className="w-4 text-gray-400 text-right">{count}</span>
                                            </div>
                                        );
>>>>>>> c6498253b282f9b5a2088dec2effa6db1b836c57
                                    })}
                                </div>
                            </div>

<<<<<<< HEAD
                            {/* REVIEWS CARDS */}
=======
>>>>>>> c6498253b282f9b5a2088dec2effa6db1b836c57
                            {mockReviews.map((review, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.08 }}
<<<<<<< HEAD
                                    className="border border-gray-100 rounded-2xl p-5"
=======
                                    className="border border-gray-100 rounded-2xl p-4 sm:p-5 hover:border-orange-100 hover:shadow-sm transition-all"
>>>>>>> c6498253b282f9b5a2088dec2effa6db1b836c57
                                >
                                    <div className="flex items-start gap-3 mb-3">
                                        <div className="w-9 h-9 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 text-xs font-bold shrink-0">
                                            {review.avatar}
                                        </div>
<<<<<<< HEAD
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm font-semibold text-slate-800">{review.name}</span>
                                                <span className="text-xs text-gray-400">{review.date}</span>
                                            </div>
                                            <StarRating rating={review.rating} size={12}/>
=======
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between gap-2 flex-wrap">
                                                <span className="text-sm font-semibold text-slate-800">{review.name}</span>
                                                <span className="text-xs text-gray-400 shrink-0">{review.date}</span>
                                            </div>
                                            <StarRating rating={review.rating} size={12} />
>>>>>>> c6498253b282f9b5a2088dec2effa6db1b836c57
                                        </div>
                                    </div>
                                    <p className="text-sm text-gray-600 leading-relaxed">{review.comment}</p>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </motion.div>
            </AnimatePresence>
        </motion.div>
<<<<<<< HEAD
    )
}

export default ProductTabs
=======
    );
};

export default ProductTabs;
>>>>>>> c6498253b282f9b5a2088dec2effa6db1b836c57
