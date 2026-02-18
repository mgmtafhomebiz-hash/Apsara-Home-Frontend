'use client';

import { motion } from 'framer-motion'
import Image from 'next/image';
import { useCart } from '@/context/CartContext';

interface ProductCardProps {
    name: string;
    price: number;
    originalPrice?: number;
    image: string;
    badge?: string;
}

const ProductCard = ({ name, price, originalPrice, image, badge }: ProductCardProps) => {
    const { addToCart } = useCart()

    const handleAddToCart = () => {
        addToCart({
            id: name.toLowerCase().replace(/\s+/g, '-'),
            name,
            price,
            image,
        })
    }

    return (
        <motion.div
            whileHover={{ y: -6 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className='group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-shadow duration-500 cursor-pointer'
        >
            <div className='relative overflow-hidden aspect-square bg-gray-50'>
                <Image
                    src={image}
                    alt={name}
                    fill
                    className='object-cover transition-transform duration-700 group-hover:scale-110'
                />

                {badge && (
                    <span className='absolute top-3 left-3 bg-orange-500 text-white text-[10px] font-bold px-2 py-1 rounded-full z-10 tracking-wide'>
                        {badge}
                    </span>
                )}

                <div className='absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500' />

                <button className='absolute top-3 right-3 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-300 hover:bg-orange-50'>
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-600">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                    </svg>
                </button>

                <div className='absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out'>
                    <button
                        onClick={handleAddToCart}
                        className='w-full bg-orange-500 hover:bg-orange-600 active:scale-95 text-white py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-200 shadow-lg'
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
                            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                        </svg>
                        Add to Cart
                    </button>
                </div>
            </div>

            <div className='p-4'>
                <h3 className='text-sm font-medium text-gray-800 truncate group-hover:text-orange-500 transition-colors duration-200'>{name}</h3>
                <div className='flex items-center gap-2 mt-1'>
                    <span className='text-orange-500 font-bold text-base'>₱{price.toLocaleString()}</span>
                    {originalPrice && <span className='text-gray-400 text-sm line-through'>₱{originalPrice.toLocaleString()}</span>}
                </div>
            </div>
        </motion.div>
    )
}

export default ProductCard
