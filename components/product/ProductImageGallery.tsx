'use client';

import { CategoryProduct } from "@/libs/CategoryData";
import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

interface ProductImageGalleryProps {
    product: CategoryProduct
}

const ProductImageGallery = ({ product }:ProductImageGalleryProps) => {
    const [activeImage, setActiveImage] = useState(0);

    return (
        <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="sticky top-4"
        >
            <div className="relative aspect-square rounded-3xl overflow-hidden bg-gray-50 shadow-sm">
                <Image 
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover"
                    priority
                />
                { product.badge && (
                    <span className="absolute top-4 left-4 bg-orange-500 text-white text-xs font-bold px-3 py-1.5 rounded-full">
                        {product.badge}
                    </span>
                )}
            </div>

            {/* THUMBNAILS */}
            <div className="flex gap-3 mt-4">
                {[0, 1, 2, 3].map((index) => (
                    <button
                        key={index}
                        onClick={() => setActiveImage(index)}
                        className={`relative flex-1 aspect-square rounded-xl overflow-hidden bg-gray-50 border-2 transition-colors ${activeImage === index ? 'border-orange-400' : 'border-transparent hover:border-orange-200'}`}
                    >
                        <Image 
                            src={product.image}
                            alt={`view ${index + 1}`}
                            fill
                            className="object-cover"
                        />
                    </button>
                ))}
            </div>
        </motion.div>
    )
}

export default ProductImageGallery
