'use client';

import { useCart } from "@/context/CartContext";
import { CategoryProduct } from "@/libs/CategoryData";
<<<<<<< HEAD
import { AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
=======
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
>>>>>>> c6498253b282f9b5a2088dec2effa6db1b836c57
import Image from "next/image";

interface StickyAddToCartProps {
    product: CategoryProduct;
}

const StickyAddToCart = ({ product }: StickyAddToCartProps) => {
<<<<<<< HEAD
  const [visible, setVisible] = useState(false);
  const { addToCart } = useCart();

  useEffect(() => {
    const handler = () => setVisible(window.screenY > 500);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  },[])
  return (
    <AnimatePresence>
        {visible && (
            <motion.div
                initial={{ y: -80, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -80, opacity: 0 }}
                transition={{ duration: 0.3, ease: 'easeOut'}}
                className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-md"
            >
                <div className="container mx-auto px-4 py-3 flex items-center gap-3">
                    <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-gray-50 shrink-0">
                        <Image 
                            src={product.image}
                            alt={product.name}
                            fill
                            className="object-cover"
                        />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-slate-800 truncate max-w-64">{product.name}</p>
                        <p className="text-orange-500 font-bold text-sm">₱{product.price.toLocaleString()}</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => addToCart({
                            id: product.name.toLowerCase().replace(/\s+/g, '-'),
                            name: product.name,
                            price: product.price,
                            image: product.image,
                        })}
                        className="bg-orange=500 hover:bg-orange-600 text-white px-5 py-2 rounded-xl text-sm font-semibold transition-colors"
                    >
                        Add to Cart
                    </button>
                    <button className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-2 rounded-xl text-sm font-semibold transition-colors">
                        Buy Now
                    </button>
                </div>
            </motion.div>
        )}
    </AnimatePresence>
  )
}

export default StickyAddToCart
=======
    const [visible, setVisible] = useState(false);
    const { addToCart } = useCart();

    useEffect(() => {
        const handler = () => setVisible(window.scrollY > 500);
        window.addEventListener('scroll', handler);
        return () => window.removeEventListener('scroll', handler);
    }, []);

    const handleAddToCart = () => {
        addToCart({
            id: product.name.toLowerCase().replace(/\s+/g, '-'),
            name: product.name,
            price: product.price,
            image: product.image,
        });
    };

    return (
        <AnimatePresence>
            {visible && (
                <motion.div
                    initial={{ y: -80, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -80, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                    className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-md"
                >
                    <div className="container mx-auto px-4 py-2.5 flex items-center gap-3">
                        <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-gray-50 shrink-0">
                            <Image src={product.image} alt={product.name} fill className="object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-slate-800 truncate">{product.name}</p>
                            <p className="text-orange-500 font-bold text-sm">₱{product.price.toLocaleString()}</p>
                        </div>
                        <div className="flex gap-2 shrink-0">
                            <button
                                onClick={handleAddToCart}
                                className="bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white px-3 sm:px-5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-colors"
                            >
                                <span className="hidden sm:inline">Add to Cart</span>
                                <span className="sm:hidden">Cart</span>
                            </button>
                            <button className="bg-slate-900 hover:bg-slate-800 text-white px-3 sm:px-5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-colors">
                                Buy Now
                            </button>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default StickyAddToCart;
>>>>>>> c6498253b282f9b5a2088dec2effa6db1b836c57
