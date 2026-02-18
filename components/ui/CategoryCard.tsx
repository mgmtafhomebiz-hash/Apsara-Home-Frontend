'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

interface CategoryCardProps {
    name: string;
    count: number;
    image: string;
    index?: number;
}

// Convert category name to URL slug
// "Chairs & Stools" → "chairs-stools"
const toSlug = (name: string) =>
    name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

const CategoryCard = ({ name, count, image, index = 0 }: CategoryCardProps) => {
    return (
        <Link href={`/category/${toSlug(name)}`}>
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.12, ease: 'easeOut' }}
                whileHover={{ y: -6 }}
                className='group relative overflow-hidden rounded-2xl cursor-pointer h-64 md:h-80 shadow-sm hover:shadow-xl transition-shadow duration-500'
            >
                <Image
                    src={image}
                    alt={name}
                    fill
                    className='object-cover transition-transform duration-700 group-hover:scale-110'
                />
                <div className='absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent' />

                <div className='absolute bottom-0 left-0 right-0 p-5'>
                    <h3 className='text-white font-bold text-lg leading-tight group-hover:text-orange-300 transition-colors duration-300'>{name}</h3>
                    <p className='text-white/60 text-xs mt-0.5'>{count} Products</p>
                    <div className='overflow-hidden h-0 group-hover:h-7 transition-all duration-300 mt-1'>
                        <span className='text-orange-400 text-sm font-semibold flex items-center gap-1'>
                            Shop Now
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6" /></svg>
                        </span>
                    </div>
                </div>
            </motion.div>
        </Link>
    );
};

export default CategoryCard;
