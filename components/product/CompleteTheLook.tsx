'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useCart } from '@/context/CartContext';
import { useGetPublicProductsQuery } from '@/store/api/productsApi';

interface CompleteTheLookProps {
  currentCategory: string;
  currentCategoryLabel?: string;
  currentCategoryId?: number;
  currentProductId?: number;
}

const CartIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="9" cy="21" r="1" />
    <circle cx="20" cy="21" r="1" />
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
  </svg>
);

const FALLBACK_IMAGE = '/Images/HeroSection/chairs_stools.jpg';

const formatMoney = (value: number) =>
  new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    maximumFractionDigits: 0,
  }).format(value || 0);

const slugify = (value: string) =>
  (value || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const buildProductPath = (name: string, id?: number) => {
  const base = slugify(name || 'product');
  return typeof id === 'number' && id > 0 ? `/product/${base}-i${id}` : `/product/${base}`;
};

const resolveBundleCopy = (categoryLabel?: string, categorySlug?: string) => {
  const label = (categoryLabel || categorySlug || '').toLowerCase();

  const isAccessory = /(accessor|mobile|gadget|wearable|smart|tech|electronics|device|band|strap|watch)/.test(label);
  const isRoom = /(sofa|chair|table|rack|cabinet|bed|dining|living|room|home|furniture)/.test(label);

  if (isAccessory) {
    return {
      title: 'Complete the Setup',
      subtitle: 'Pair this with compatible add-ons and essentials for daily use.',
    };
  }

  if (isRoom) {
    return {
      title: 'Complete the Look',
      subtitle: 'Pair this with other pieces for a complete room.',
    };
  }

  return {
    title: 'You May Also Like',
    subtitle: 'More items that go well with your current pick.',
  };
};

type BundleItem = {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  brand?: string | null;
};

const CompleteTheLook = ({ currentCategory, currentCategoryId, currentCategoryLabel, currentProductId }: CompleteTheLookProps) => {
  const { addToCart } = useCart();
  const { title, subtitle } = useMemo(
    () => resolveBundleCopy(currentCategoryLabel, currentCategory),
    [currentCategoryLabel, currentCategory],
  );

  const canQuery = typeof currentCategoryId === 'number' && currentCategoryId > 0;
  const { data, isFetching, isError } = useGetPublicProductsQuery(
    canQuery
      ? {
          page: 1,
          perPage: 18,
          status: 1,
          catId: currentCategoryId,
        }
      : undefined,
    { skip: !canQuery },
  );

  const bundleItems: BundleItem[] = useMemo(() => {
    const products = data?.products ?? [];

    return products
      .filter((product) => (currentProductId ? product.id !== currentProductId : true))
      .slice(0, 6)
      .map((product) => {
        const srpPrice = Number(product.priceSrp ?? 0) || 0;
        const memberPrice = Number(product.priceMember ?? 0) || 0;
        const effectivePrice = memberPrice > 0 && memberPrice < srpPrice ? memberPrice : srpPrice;

        return {
          id: product.id,
          name: product.name,
          price: effectivePrice,
          originalPrice: effectivePrice < srpPrice ? srpPrice : undefined,
          image: product.image || FALLBACK_IMAGE,
          brand: product.brand ?? null,
        };
      });
  }, [data, currentProductId]);

  const [selected, setSelected] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (bundleItems.length === 0) return;

    setSelected((prev) => {
      if (prev.size === 0) return new Set(bundleItems.map((item) => item.id));

      const allowed = new Set(bundleItems.map((item) => item.id));
      const next = new Set(Array.from(prev).filter((id) => allowed.has(id)));

      return next.size > 0 ? next : new Set(bundleItems.map((item) => item.id));
    });
  }, [bundleItems]);

  const toggleItem = (id: number) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const selectedItems = useMemo(() => bundleItems.filter((item) => selected.has(item.id)), [bundleItems, selected]);
  const total = useMemo(() => selectedItems.reduce((sum, item) => sum + item.price, 0), [selectedItems]);

  const handleAddAll = () => {
    selectedItems.forEach((item) => {
      addToCart({
        id: String(item.id),
        name: item.name,
        price: item.price,
        originalPrice: typeof item.originalPrice === 'number' ? item.originalPrice : null,
        image: item.image,
        brand: item.brand ?? null,
      });
    });
  };

  if (!canQuery || bundleItems.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="mt-12 sm:mt-16"
    >
      <div className="flex items-center justify-between gap-3 mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900">{title}</h2>
          <p className="text-sm text-gray-400 mt-0.5">{subtitle}</p>
        </div>
        {isFetching ? <p className="text-xs text-slate-400">Loading...</p> : null}
        {isError ? <p className="text-xs text-red-500">Failed to load.</p> : null}
      </div>

      <div className="border border-gray-100 rounded-2xl overflow-hidden">
        <div className="divide-y divide-gray-100">
          {bundleItems.map((item, index) => {
            const isSelected = selected.has(item.id);
            const productPath = buildProductPath(item.name, item.id);

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + index * 0.07 }}
                className={`flex items-center gap-4 p-4 transition-colors ${isSelected ? 'bg-white' : 'bg-gray-50/50'}`}
              >
                <button
                  type="button"
                  onClick={() => toggleItem(item.id)}
                  className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all ${
                    isSelected ? 'bg-orange-500 border-orange-500' : 'border-gray-300 hover:border-orange-300'
                  }`}
                >
                  {isSelected ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  ) : null}
                </button>

                <Link href={productPath} className="relative w-16 h-16 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                  <Image src={item.image} alt={item.name} fill className="object-cover" unoptimized />
                </Link>

                <div className="flex-1 min-w-0">
                  <p className="text-xs text-orange-500 font-semibold uppercase tracking-wide mb-0.5">
                    {currentCategoryLabel || 'Recommended'}
                  </p>
                  <Link href={productPath} className="text-sm font-semibold text-slate-800 hover:text-orange-500 transition-colors line-clamp-1">
                    {item.name}
                  </Link>
                  {item.brand ? <p className="text-xs text-gray-400 mt-0.5">{item.brand}</p> : null}
                </div>

                <div className="text-right shrink-0">
                  <p className="text-sm font-bold text-slate-800">{formatMoney(item.price)}</p>
                  {typeof item.originalPrice === 'number' && item.originalPrice > item.price ? (
                    <p className="text-xs text-gray-400 line-through">{formatMoney(item.originalPrice)}</p>
                  ) : null}
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="bg-gray-50 px-4 py-4 flex items-center justify-between gap-4 flex-wrap">
          <div>
            <p className="text-xs text-gray-400">
              {selected.size} item{selected.size !== 1 ? 's' : ''} selected
            </p>
            <p className="text-lg font-bold text-slate-900">
              Total: <span className="text-orange-500">{formatMoney(total)}</span>
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
