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

interface ProductInfoProps {
    product: CategoryProduct
    onReviewsClick: () => void;
}

const ProductInfo = ({ product, onReviewsClick }: ProductInfoProps) => {

    const { addToCart } = useCart();
    const [quantity, setQuantity] = useState(1);

    const avgRating = (mockReviews.reduce((s, r) => s + r.rating, 0) / mockReviews.length).toFixed(1);

    const handleAddToCart = () => {
        for (let i = 0; i < quantity; i++) {
            addToCart({
                id: product.name.toLocaleLowerCase().replace(/\s+/g, '-'),
                name: product.name,
                price: product.price,
                image: product.image
            })
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-col gap-5"
        >
            {product.brand && (
                <span className="text-xs font-bold text-orange-500 uppercase tracking-widest">{product.brand}</span>
            )}

            <h1 className="text-3xl font-bold text-slate-300 leading-tight">{product.name}</h1>

            {/* Rating */}
            <div className="flex items-center gap-3">
                <StarRating
                    rating={Math.round(Number(avgRating))}
                    size={16}
                />
                <span className="text-sm font-bold text-slate-700">{avgRating}</span>
                <button onClick={onReviewsClick} className="text-sm text-gray-400 hover:text-orange-500 transition-colors">
                    ({mockReviews.length} reviews)
                </button>
            </div>

            {/* PRICE */}
            <div className="flex items-baseline gap-3">
                <span className="text-4xl font-bold text-orange-500">₱{product.price.toLocaleString()}</span>
                {product.originalPrice && (
                    <>
                        <span className="text-lg text-gray-400 line-through">₱{product.originalPrice.toLocaleString()}</span>
                        <span>Save ₱{(product.originalPrice - product.price).toLocaleString()}</span>
                    </>
                )}
            </div>

            <div className="h-px bg-gray-100" />

            {/* COLOR VARIANTS  */}
            <div className="flex flex-col gap-2">
                <span className="text-sm font-semibold text-slate-700">
                    Color: <span>Beige</span>
                </span>
                <div className="flex gap-2">
                    {[
                        { name: 'Beige', color: 'bg-amber-100 border-amber-300' },
                        { name: 'Gray', color: 'bg-gray-300 border-gray-400' },
                        { name: 'Navy', color: 'bg-blue-900 border-blue-800' },
                        { name: 'Green', color: 'bg-emerald-700 border-emerald-800' }
                    ].map(c => (
                        <button
                            key={c.name}
                            title={c.name}
                            className={`w-8 h-8 rounded-full border-2 ${c.color} hover:scale-110 transition-transform`}
                        ></button>
                    ))}
                </div>
            </div>

            {/* STOCK STATUS */}
            <div className="flex items-center gap-2">
                <span className="flex items-center gap-1.5 text-sm font-semibold text-green-600">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse shrink-0" />
                    In Stock
                    <span className="font-normal text-gray-400">- Only 8 left</span>
                </span>
            </div>

            {/* DELIVERY INFO */}
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

            {/* PAYMENT METHOD */}
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

            {/* QUANTITY */}
            <div className="flex items-center gap-4">
                <span className="text-sm font-semibold text-slate-700">Quantity:</span>
                <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                    <button onClick={() => setQuantity(qty => Math.max(1, qty - 1))} className="px-4 py-2.5 text-gray-500 hover:bg-gray-50 hover:text-orange-500 transition-colors text-lg font-medium">-</button>
                    <span className="px-5 py-2.5 text-sm font-bold text-slate-800 min-w-12 text-center border-x border-gray-200">{quantity}</span>
                    <button onClick={() => setQuantity(qty => qty + 1)} className="px-4 py-2.5 text-gray-500 hover:bg-gray-50 hover:text-orange-500 transition-colors text-lg font-medium">+</button>
                </div>
            </div>

            {/* CTA BUTTONS */}
            <div className="flex flex-col sm:flex-row gap-3">
                <motion.div
                    whileTap={{ scale: 0.97 }}
                    onClick={handleAddToCart}
                    className="flex-1 flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white py-3.5 rounded-2xl font-semibold text-sm transition-colors shadow-lg shadow-orange-200"
                >
                    <CartIcon /> Add to Cart
                </motion.div>
                <motion.div
                    whileTap={{ scale: 0.97 }}
                    className="flex-1 flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-900 text-white py-3.5 rounded-2xl font-semibold transition-colors shadow-lg shadow-orange-200"
                >
                    Buy Now
                </motion.div>
            </div>

            {/* TRUST BADGES */}
            <div className="grid grid-cols-3 gap-3">
                {[
                    { icon: <TruckIcon />, label: 'Free Shipping', sub: 'On orders ₱5k+' },
                    { icon: <ShieldIcon />, label: '1 Year Warranty', sub: 'Manufacturer' },
                    { icon: <ReturnIcon />, label: '30-Day Returns', sub: 'Easy returns' },
                ].map(b => (
                    <div key={b.label} className="flex flex-col items-center gap-1 bg-gray-50 rounded-2xl p-3 text-center">
                        <span className="text-orange-500">{b.icon}</span>
                        <span className="text-xs font-semibold text-slate-700">{b.label}</span>
                        <span className="text-[10px]">{b.sub}</span>
                    </div>
                ))}
            </div>
        </motion.div>
    )
}

export default ProductInfo
