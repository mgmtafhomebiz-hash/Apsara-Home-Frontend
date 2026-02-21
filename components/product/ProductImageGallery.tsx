'use client';

import { CategoryProduct } from '@/libs/CategoryData';
import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import { useState } from 'react';

interface ProductImageGalleryProps {
  product: CategoryProduct;
}

const HeartIcon = ({ filled }: { filled: boolean }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill={filled ? '#f97316' : 'none'}
    stroke={filled ? '#f97316' : 'currentColor'}
    strokeWidth="2"
  >
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const THUMBNAIL_COUNT = 4;

const ProductImageGallery = ({ product }: ProductImageGalleryProps) => {
  const [activeImage, setActiveImage] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  return (
    <>
      <AnimatePresence>
        {isZoomed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsZoomed(false)}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 cursor-zoom-out"
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="relative w-full max-w-xl aspect-square"
              onClick={(e) => e.stopPropagation()}
            >
              <Image src={product.image} alt={product.name} fill className="object-contain" priority />
            </motion.div>
            <button
              onClick={() => setIsZoomed(false)}
              className="absolute top-4 right-4 text-white bg-white/20 hover:bg-white/40 rounded-full p-2.5 transition-colors backdrop-blur-sm"
            >
              <CloseIcon />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="md:sticky md:top-4"
      >
        <div
          className="relative aspect-square rounded-2xl sm:rounded-3xl overflow-hidden bg-gray-50 shadow-sm cursor-zoom-in group"
          onClick={() => setIsZoomed(true)}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={activeImage}
              initial={{ opacity: 0, scale: 1.03 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0"
            >
              <Image src={product.image} alt={product.name} fill className="object-cover" priority />
            </motion.div>
          </AnimatePresence>

          {product.badge && (
            <span className="absolute top-3 left-3 sm:top-4 sm:left-4 bg-orange-500 text-white text-[10px] sm:text-xs font-bold px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full z-10">
              {product.badge}
            </span>
          )}

          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsWishlisted((w) => !w);
            }}
            className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-white/90 backdrop-blur-sm p-2 sm:p-2.5 rounded-full shadow-md hover:scale-110 transition-all z-10"
            title={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <HeartIcon filled={isWishlisted} />
          </button>

          <div className="absolute bottom-3 right-3 bg-black/30 text-white text-[10px] px-2.5 py-1 rounded-full backdrop-blur-sm hidden group-hover:flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
              <line x1="11" y1="8" x2="11" y2="14" />
              <line x1="8" y1="11" x2="14" y2="11" />
            </svg>
            Zoom
          </div>

          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 sm:hidden z-10">
            {Array.from({ length: THUMBNAIL_COUNT }).map((_, i) => (
              <button
                key={i}
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveImage(i);
                }}
                className={`h-1.5 rounded-full transition-all duration-200 ${activeImage === i ? 'bg-orange-500 w-4' : 'bg-white/80 w-1.5'}`}
              />
            ))}
          </div>
        </div>

        <div className="hidden sm:flex gap-3 mt-4">
          {Array.from({ length: THUMBNAIL_COUNT }).map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveImage(index)}
              className={`relative flex-1 aspect-square rounded-xl overflow-hidden bg-gray-50 border-2 transition-all duration-200 ${
                activeImage === index ? 'border-orange-400 shadow-sm shadow-orange-100' : 'border-transparent hover:border-orange-200'
              }`}
            >
              <Image src={product.image} alt={`View ${index + 1}`} fill className="object-cover" />
            </button>
          ))}
        </div>

        <div className="flex sm:hidden gap-2 mt-3 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
          {Array.from({ length: THUMBNAIL_COUNT }).map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveImage(index)}
              className={`relative shrink-0 w-16 h-16 rounded-xl overflow-hidden bg-gray-50 border-2 transition-all duration-200 ${
                activeImage === index ? 'border-orange-400' : 'border-gray-100'
              }`}
            >
              <Image src={product.image} alt={`View ${index + 1}`} fill className="object-cover" />
            </button>
          ))}
        </div>
      </motion.div>
    </>
  );
};

export default ProductImageGallery;
