'use client';

import { categoryProducts, categoryMeta, CategoryProduct } from "@/libs/CategoryData";
import { useCart } from "@/context/CartContext";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

interface CompleteTheLookProps {
    currentCategory: string;
}

const CartIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
    </svg>
);

const CompleteTheLook = ({ currentCategory }: CompleteTheLookProps) => {
    const { addToCart } = useCart();

    const bundleItems: (CategoryProduct & { category: string })[] = Object.entries(categoryProducts)
        .filter(([cat]) => cat !== currentCategory)
        .map(([cat, products]) => ({ ...products[0], category: cat }));

    const [selected, setSelected] = useState<Set<string>>(
        () => new Set(bundleItems.map(p => p.name))
    );

    const toggleItem = (name: string) => {
        setSelected(prev => {
            const next = new Set(prev);
            if (next.has(name)) {
                next.delete(name);
            } else {
                next.add(name);
            }
            return next;
        });
    };

    const selectedItems = bundleItems.filter(p => selected.has(p.name));
    const total = selectedItems.reduce((sum, p) => sum + p.price, 0);

    const handleAddAll = () => {
        selectedItems.forEach(p => {
            addToCart({
                id: p.name.toLowerCase().replace(/\s+/g, '-'),
                name: p.name,
                price: p.price,
                image: p.image,
            });
        });
    };

    if (bundleItems.length === 0) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-12 sm:mt-16"
        >
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-xl font-bold text-slate-900">Complete the Look</h2>
                    <p className="text-sm text-gray-400 mt-0.5">Pair this with other pieces for a complete room</p>
                </div>
            </div>

            <div className="border border-gray-100 rounded-2xl overflow-hidden">
                {/* Item cards */}
                <div className="divide-y divide-gray-100">
                    {bundleItems.map((item, index) => {
                        const isSelected = selected.has(item.name);
                        const slug = item.name.toLowerCase().replace(/\s+/g, '-');
                        return (
                            <motion.div
                                key={item.name}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.1 + index * 0.07 }}
                                className={`flex items-center gap-4 p-4 transition-colors ${isSelected ? 'bg-white' : 'bg-gray-50/50'}`}
                            >
                                {/* Checkbox */}
                                <button
                                    onClick={() => toggleItem(item.name)}
                                    className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all ${
                                        isSelected
                                            ? 'bg-orange-500 border-orange-500'
                                            : 'border-gray-300 hover:border-orange-300'
                                    }`}
                                >
                                    {isSelected && (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5">
                                            <polyline points="20 6 9 17 4 12" />
                                        </svg>
                                    )}
                                </button>

                                {/* Image */}
                                <Link href={`/product/${slug}`} className="relative w-16 h-16 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                                    <Image src={item.image} alt={item.name} fill className="object-cover" />
                                </Link>

                                {/* Info */}
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs text-orange-500 font-semibold uppercase tracking-wide mb-0.5">
                                        {categoryMeta[item.category]?.label}
                                    </p>
                                    <Link href={`/product/${slug}`} className="text-sm font-semibold text-slate-800 hover:text-orange-500 transition-colors line-clamp-1">
                                        {item.name}
                                    </Link>
                                    {item.brand && (
                                        <p className="text-xs text-gray-400 mt-0.5">{item.brand}</p>
                                    )}
                                </div>

                                {/* Price */}
                                <div className="text-right shrink-0">
                                    <p className="text-sm font-bold text-slate-800">₱{item.price.toLocaleString()}</p>
                                    {item.originalPrice && (
                                        <p className="text-xs text-gray-400 line-through">₱{item.originalPrice.toLocaleString()}</p>
                                    )}
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Footer / Total + CTA */}
                <div className="bg-gray-50 px-4 py-4 flex items-center justify-between gap-4 flex-wrap">
                    <div>
                        <p className="text-xs text-gray-400">
                            {selected.size} item{selected.size !== 1 ? 's' : ''} selected
                        </p>
                        <p className="text-lg font-bold text-slate-900">
                            Total: <span className="text-orange-500">₱{total.toLocaleString()}</span>
                        </p>
                    </div>
                    <motion.button
                        whileTap={{ scale: 0.97 }}
                        onClick={handleAddAll}
                        disabled={selected.size === 0}
                        className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed text-white px-6 py-2.5 rounded-xl font-semibold text-sm transition-colors"
                    >
                        <CartIcon />
                        Add {selected.size > 0 ? `${selected.size} Items` : 'Items'} to Cart
                    </motion.button>
                </div>
            </div>
        </motion.div>
    );
};

export default CompleteTheLook;
