'use client';

import { CategoryProduct } from "@/libs/CategoryData";
import { displayColorName } from "@/libs/colorUtils";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import StarRating from "../ui/StarRating";
import type { ProductReview, ProductReviewSummary } from "@/store/api/productsApi";

interface ProductTabsProps {
    product: CategoryProduct;
    defaultTab?: 'description' | 'specs' | 'reviews';
    onTabChange?: (tab: string) => void;
    reviews?: ProductReview[];
    reviewSummary?: ProductReviewSummary | null;
}

const tabs: { id: 'description' | 'specs' | 'reviews'; label: string }[] = [
    { id: 'description', label: 'Description' },
    { id: 'specs', label: 'Specifications' },
    { id: 'reviews', label: 'Reviews' },
];

const decodeHtmlEntities = (value: string) =>
    value
        .replace(/&lt;/gi, '<')
        .replace(/&gt;/gi, '>')
        .replace(/&quot;/gi, '"')
        .replace(/&#39;|&#039;/gi, "'")
        .replace(/&nbsp;/gi, ' ')
        .replace(/&amp;/gi, '&');

const cleanProductDescription = (value: string) => {
    let decoded = value.trim();

    // Some rows arrive double-encoded from the database, so decode a few times.
    for (let i = 0; i < 3; i += 1) {
        const next = decodeHtmlEntities(decoded);
        if (next === decoded) break;
        decoded = next;
    }

    return decoded
        .replace(/<\s*br\s*\/?>/gi, '\n')
        .replace(/<\s*\/p\s*>/gi, '\n\n')
        .replace(/<\s*\/div\s*>/gi, '\n')
        .replace(/<\s*\/li\s*>/gi, '\n')
        .replace(/<li\b[^>]*>/gi, '- ')
        .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, '')
        .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '')
        .replace(/<[^>]+>/g, ' ')
        .replace(/\r/g, '')
        .replace(/[ \t]+\n/g, '\n')
        .replace(/\n[ \t]+/g, '\n')
        .replace(/[ \t]{2,}/g, ' ')
        .replace(/\n{3,}/g, '\n\n')
        .trim();
};

const ProductTabs = ({ product, defaultTab = 'description', onTabChange, reviews = [], reviewSummary }: ProductTabsProps) => {
    const [activeTab, setActiveTab] = useState<'description' | 'specs' | 'reviews'>(defaultTab);
    const cleanedDescription = product.description ? cleanProductDescription(product.description) : '';

    const handleTabChange = (tab: 'description' | 'specs' | 'reviews') => {
        setActiveTab(tab);
        onTabChange?.(tab);
    };

    const reviewCount = reviewSummary?.count ?? reviews.length ?? 0;
    const avgRatingValue = typeof reviewSummary?.average === 'number'
        ? reviewSummary.average
        : (reviewCount > 0 ? reviews.reduce((s, r) => s + r.rating, 0) / reviewCount : 0);
    const avgRating = avgRatingValue.toFixed(1);
    const breakdown = reviewSummary?.breakdown ?? { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    const formattedDate = (value?: string | null) => {
        if (!value) return '';
        const date = new Date(value);
        if (Number.isNaN(date.getTime())) return '';
        return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(date);
    };
    const getInitials = (name: string) =>
        name
            .split(' ')
            .filter(Boolean)
            .map((part) => part[0]?.toUpperCase())
            .slice(0, 2)
            .join('') || 'CU';

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
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
                                {reviewCount}
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
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.25 }}
                    className="py-6 sm:py-8"
                >
                    {activeTab === 'description' && (
                        <div className="max-w-2xl text-gray-600 text-sm leading-relaxed">
                            {cleanedDescription ? (
                                <div className="space-y-3 text-sm text-gray-600">
                                    {cleanedDescription.split(/\n{2,}/).map((paragraph, index) => (
                                        <p key={`${index}-${paragraph.slice(0, 24)}`} className="whitespace-pre-line">
                                            {paragraph.trim()}
                                        </p>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-400 italic">No description available.</p>
                            )}
                        </div>
                    )}

                    {activeTab === 'specs' && (
                        <div className="max-w-lg">
                            {(() => {
                                const dimParts: string[] = []
                                if (product.pswidth  && product.pswidth  > 0) dimParts.push(`W: ${product.pswidth} cm`)
                                if (product.pslenght && product.pslenght > 0) dimParts.push(`D: ${product.pslenght} cm`)
                                if (product.psheight && product.psheight > 0) dimParts.push(`H: ${product.psheight} cm`)
                                const dimensions = dimParts.length > 0 ? dimParts.join(' × ') : null

                                const colorSet = new Set<string>()
                                product.variants?.forEach(v => { if (v.color) colorSet.add(displayColorName(v.color, v.colorHex)) })
                                const colorOptions = colorSet.size > 0 ? [...colorSet].join(', ') : null

                                const rows = [
                                    product.material                          ? { label: 'Material',          value: product.material }         : null,
                                    dimensions                                ? { label: 'Dimensions',         value: dimensions }                : null,
                                    product.weight && product.weight > 0      ? { label: 'Weight Capacity',   value: `${product.weight} kg` }   : null,
                                    product.assemblyRequired                  ? { label: 'Assembly Required',  value: 'Yes' }                    : null,
                                    product.warranty                          ? { label: 'Warranty',           value: product.warranty }          : null,
                                    colorOptions                              ? { label: 'Color Options',       value: colorOptions }              : null,
                                ].filter(Boolean) as { label: string; value: string }[]

                                return rows.length > 0 ? (
                                    <div className="border border-gray-100 rounded-2xl overflow-hidden">
                                        {rows.map((spec, index) => (
                                            <div
                                                key={spec.label}
                                                className={`flex items-center justify-between px-4 sm:px-5 py-3.5 text-sm gap-4 ${
                                                    index % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                                                }`}
                                            >
                                                <span className="font-semibold text-slate-700 w-36 sm:w-44 shrink-0">{spec.label}</span>
                                                <span className="text-gray-500 text-right">{spec.value}</span>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-gray-400 italic text-sm">No specifications available.</p>
                                )
                            })()}
                        </div>
                    )}

                    {activeTab === 'reviews' && (
                        <div className="space-y-4 max-w-2xl">
                            <div className="flex items-center gap-4 sm:gap-6 bg-orange-50 rounded-2xl p-4 sm:p-5 mb-6">
                                <div className="text-center shrink-0">
                                    <div className="text-4xl sm:text-5xl font-bold text-orange-500">{avgRating}</div>
                                    <StarRating rating={Math.round(Number(avgRating))} size={14} />
                                    <div className="text-xs text-gray-400 mt-1">{reviewCount} reviews</div>
                                </div>
                                <div className="flex-1 space-y-1.5">
                                    {[5, 4, 3, 2, 1].map(star => {
                                        const count = breakdown[star] ?? 0;
                                        const pct = reviewCount > 0 ? (count / reviewCount) * 100 : 0;
                                        return (
                                            <div key={star} className="flex items-center gap-2 text-xs">
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
                                    })}
                                </div>
                            </div>

                            {reviews.length > 0 ? (
                                reviews.map((review, index) => (
                                    <motion.div
                                        key={review.id ?? index}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.08 }}
                                        className="border border-gray-100 rounded-2xl p-4 sm:p-5 hover:border-orange-100 hover:shadow-sm transition-all"
                                    >
                                        <div className="flex items-start gap-3 mb-3">
                                            {review.customer_avatar ? (
                                                // eslint-disable-next-line @next/next/no-img-element
                                                <img
                                                    src={review.customer_avatar}
                                                    alt={review.customer_name}
                                                    className="w-9 h-9 rounded-full object-cover border border-orange-100 shrink-0"
                                                />
                                            ) : (
                                                <div className="w-9 h-9 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 text-xs font-bold shrink-0">
                                                    {getInitials(review.customer_name)}
                                                </div>
                                            )}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between gap-2 flex-wrap">
                                                    <span className="text-sm font-semibold text-slate-800">{review.customer_name}</span>
                                                    {review.created_at && (
                                                        <span className="text-xs text-gray-400 shrink-0">{formattedDate(review.created_at)}</span>
                                                    )}
                                                </div>
                                                <StarRating rating={review.rating} size={12} />
                                            </div>
                                        </div>
                                        <p className="text-sm text-gray-600 leading-relaxed">{review.review}</p>
                                    </motion.div>
                                ))
                            ) : (
                                <div className="border border-dashed border-gray-200 rounded-2xl p-6 text-center text-sm text-gray-400">
                                    No reviews yet. Be the first to share your experience.
                                </div>
                            )}
                        </div>
                    )}
                </motion.div>
            </AnimatePresence>
        </motion.div>
    );
};

export default ProductTabs;
