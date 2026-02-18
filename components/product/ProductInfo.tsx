'use client'

import { useCart } from "@/context/CartContext";
import { CategoryProduct } from "@/libs/CategoryData";
import { mockReviews } from "@/libs/MockProductData";
import { motion } from "framer-motion"
import { useState } from "react";
import StarRating from "../ui/StarRating";

const CartIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
    </svg>
);
const TruckIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="1" y="3" width="15" height="13" rx="1" /><path d="M16 8h4l3 5v3h-7V8z" />
        <circle cx="5.5" cy="18.5" r="1.5" /><circle cx="18.5" cy="18.5" r="1.5" />
    </svg>
);
const ShieldIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
);
const ReturnIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <polyline points="1 4 1 10 7 10" /><path d="M3.51 15a9 9 0 1 0 .49-3.51" />
    </svg>
);
const ShareIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
        <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
    </svg>
);

const colors = [
    { name: 'Beige', color: 'bg-amber-100 border-amber-300' },
    { name: 'Gray', color: 'bg-gray-300 border-gray-400' },
    { name: 'Navy', color: 'bg-blue-900 border-blue-800' },
    { name: 'Green', color: 'bg-emerald-700 border-emerald-800' },
];

interface ProductInfoProps {
    product: CategoryProduct
    onReviewsClick: () => void;
}

const ProductInfo = ({ product, onReviewsClick }: ProductInfoProps) => {
    const { addToCart } = useCart();
    const [quantity, setQuantity] = useState(1);
    const [selectedColor, setSelectedColor] = useState('Beige');

    const avgRating = (mockReviews.reduce((s, r) => s + r.rating, 0) / mockReviews.length).toFixed(1);

    const handleAddToCart = () => {
        for (let i = 0; i < quantity; i++) {
            addToCart({
                id: product.name.toLocaleLowerCase().replace(/\s+/g, '-'),
                name: product.name,
                price: product.price,
                image: product.image,
            });
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-col gap-5"
        >
            {/* Brand + Share */}
            <div className="flex items-center justify-between">
                {product.brand && (
                    <span className="text-xs font-bold text-orange-500 uppercase tracking-widest">{product.brand}</span>
                )}
                <button className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-orange-500 transition-colors ml-auto">
                    <ShareIcon /> Share
                </button>
            </div>

            {/* fixed: was text-slate-300 (invisible on white bg) */}
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 leading-tight">{product.name}</h1>

            {/* Rating */}
            <div className="flex items-center gap-3 flex-wrap">
                <StarRating rating={Math.round(Number(avgRating))} size={16} />
                <span className="text-sm font-bold text-slate-700">{avgRating}</span>
                <button
                    onClick={onReviewsClick}
                    className="text-sm text-gray-400 hover:text-orange-500 transition-colors"
                >
                    ({mockReviews.length} reviews)
                </button>
                <span className="text-xs text-gray-300">|</span>
                <span className="text-xs text-green-600 font-semibold">✓ Verified Product</span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 flex-wrap">
                <span className="text-3xl sm:text-4xl font-bold text-orange-500">₱{product.price.toLocaleString()}</span>
                {product.originalPrice && (
                    <>
                        <span className="text-base sm:text-lg text-gray-400 line-through">₱{product.originalPrice.toLocaleString()}</span>
                        <span className="text-sm font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                            Save ₱{(product.originalPrice - product.price).toLocaleString()}
                        </span>
                    </>
                )}
            </div>

            <div className="h-px bg-gray-100" />

            {/* Color */}
            <div className="flex flex-col gap-2">
                <span className="text-sm font-semibold text-slate-700">
                    Color: <span className="text-orange-500">{selectedColor}</span>
                </span>
                <div className="flex gap-2.5">
                    {colors.map(c => (
                        <button
                            key={c.name}
                            title={c.name}
                            onClick={() => setSelectedColor(c.name)}
                            className={`w-8 h-8 rounded-full border-2 ${c.color} hover:scale-110 transition-all duration-200 ${selectedColor === c.name ? 'ring-2 ring-orange-400 ring-offset-2' : ''}`}
                        />
                    ))}
                </div>
            </div>

            {/* Stock Status — fixed: "In Stock" text was inside the dot span */}
            <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse inline-block shrink-0" />
                <span className="text-sm font-semibold text-green-600">In Stock</span>
                <span className="text-sm text-gray-400">— Only 8 left</span>
            </div>

            {/* Delivery Info */}
            <div className="bg-gray-50 rounded-2xl p-4 space-y-2.5">
                {[
                    { icon: '📦', text: 'Ships within 1–3 business days' },
                    { icon: '🏙️', text: 'Nationwide delivery via LBC / J&T' },
                    { icon: '✅', text: 'Free assembly for Metro Manila orders' },
                ].map(item => (
                    <div key={item.text} className="flex items-center gap-2.5 text-sm text-gray-600">
                        <span>{item.icon}</span>
                        <span>{item.text}</span>
                    </div>
                ))}
            </div>

            {/* Payment Methods — fixed: added key prop */}
            <div>
                <p className="text-xs text-gray-400 mb-2 font-medium">We accept:</p>
                <div className="flex items-center gap-2 flex-wrap">
                    {['GCash', 'Maya', 'Visa', 'Mastercard', 'COD'].map(method => (
                        <span key={method} className="text-xs font-semibold bg-white border border-gray-200 rounded-lg px-2.5 py-1.5 text-slate-600 shadow-sm">
                            {method}
                        </span>
                    ))}
                </div>
            </div>

            {/* Quantity — fixed: was "flex items gap-4" missing -center */}
            <div className="flex items-center gap-4">
                <span className="text-sm font-semibold text-slate-700">Quantity:</span>
                <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                    <button
                        onClick={() => setQuantity(qty => Math.max(1, qty - 1))}
                        className="px-4 py-2.5 text-gray-500 hover:bg-gray-50 hover:text-orange-500 transition-colors text-lg font-medium"
                    >
                        −
                    </button>
                    <span className="px-5 py-2.5 text-sm font-bold text-slate-800 min-w-12 text-center border-x border-gray-200">
                        {quantity}
                    </span>
                    <button
                        onClick={() => setQuantity(qty => qty + 1)}
                        className="px-4 py-2.5 text-gray-500 hover:bg-gray-50 hover:text-orange-500 transition-colors text-lg font-medium"
                    >
                        +
                    </button>
                </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
                <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={handleAddToCart}
                    className="flex-1 flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white py-3.5 rounded-2xl font-semibold text-sm transition-colors shadow-lg shadow-orange-200 cursor-pointer"
                >
                    <CartIcon /> Add to Cart
                </motion.button>
                <motion.button
                    whileTap={{ scale: 0.97 }}
                    className="flex-1 flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white py-3.5 rounded-2xl font-semibold text-sm transition-colors shadow-lg shadow-slate-200 cursor-pointer"
                >
                    Buy Now
                </motion.button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-2 sm:gap-3">
                {[
                    { icon: <TruckIcon />, label: 'Free Shipping', sub: 'On orders ₱5k+' },
                    { icon: <ShieldIcon />, label: '1 Year Warranty', sub: 'Manufacturer' },
                    { icon: <ReturnIcon />, label: '30-Day Returns', sub: 'Easy returns' },
                ].map(b => (
                    <div key={b.label} className="flex flex-col items-center gap-1 bg-gray-50 rounded-2xl p-2.5 sm:p-3 text-center">
                        <span className="text-orange-500">{b.icon}</span>
                        <span className="text-[10px] sm:text-xs font-semibold text-slate-700 leading-tight">{b.label}</span>
                        <span className="text-[9px] sm:text-[10px] text-gray-400">{b.sub}</span>
                    </div>
                ))}
            </div>
        </motion.div>
    );
};

export default ProductInfo;
