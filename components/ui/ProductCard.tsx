'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { useCart } from '@/context/CartContext';

interface ProductCardProps {
  id?: number;
  name: string;
  price: number;
  priceDp?: number;
  prodpv?: number;
  originalPrice?: number;
  image: string;
  badge?: string;
}

const FALLBACK_IMAGE = '/Images/HeroSection/chairs_stools.jpg';

export default function ProductCard({
  id,
  name,
  price,
  priceDp,
  prodpv,
  originalPrice,
  image,
  badge,
}: ProductCardProps) {
  const { addToCart } = useCart();
  const [imageSrc, setImageSrc] = useState(image || FALLBACK_IMAGE);

  const safeName = (name || 'Untitled Product').trim();
  const slug = safeName.toLowerCase().replace(/\s+/g, '-');
  const productPath = typeof id === 'number' ? `/product/${slug}-i${id}` : `/product/${slug}`;
  const displayPrice = Number(priceDp ?? price ?? 0);
  const strikePrice = Number(originalPrice ?? 0);
  const displayPv = Number(prodpv ?? 0);

  return (
    <Link href={productPath} className="block h-full">
      <motion.article
        whileHover={{ y: -4 }}
        transition={{ duration: 0.2 }}
        className="flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
      >
        <div className="relative aspect-square overflow-hidden bg-slate-100">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageSrc}
            alt={safeName}
            className="h-full w-full object-cover"
            loading="lazy"
            onError={() => setImageSrc(FALLBACK_IMAGE)}
          />
          {badge && (
            <span className="absolute left-3 top-3 rounded-full bg-orange-500 px-2 py-1 text-[10px] font-bold text-white">
              {badge}
            </span>
          )}
        </div>

        <div className="flex flex-1 flex-col p-4">
          <h3 className="line-clamp-2 text-sm font-semibold text-slate-800">{safeName}</h3>

          <div className="mt-2 flex items-center gap-2">
            <span className="text-base font-bold text-orange-500">PHP {displayPrice.toLocaleString()}</span>
            {strikePrice > displayPrice && (
              <span className="text-xs text-slate-400 line-through">PHP {strikePrice.toLocaleString()}</span>
            )}
          </div>

          {displayPv > 0 && (
            <div className="mt-2 inline-flex w-fit items-center rounded-full border border-blue-200 bg-blue-50 px-2 py-0.5 text-[11px] font-semibold text-blue-700">
              PV {displayPv.toLocaleString()}
            </div>
          )}

          <button
            type="button"
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              addToCart({
                id: typeof id === 'number' ? String(id) : slug,
                name: safeName,
                price: displayPrice,
                image: imageSrc,
              });
            }}
            className="mt-4 rounded-xl bg-orange-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-orange-600"
          >
            Add to Cart
          </button>
        </div>
      </motion.article>
    </Link>
  );
}
