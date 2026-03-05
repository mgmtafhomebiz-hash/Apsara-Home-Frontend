'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';
import { useAddWishlistMutation, useGetWishlistQuery, useRemoveWishlistMutation } from '@/store/api/wishlistApi';
import { useMeQuery } from '@/store/api/userApi';

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

const ProductCard = ({ id, name, price, priceDp, prodpv, originalPrice, image, badge }: ProductCardProps) => {
  const router = useRouter();
  const { addToCart } = useCart();
  const { data: session } = useSession();
  const isAuthenticated = Boolean(session?.user);
  const { data: me } = useMeQuery(undefined, { skip: !isAuthenticated });
  const isVerifiedAccount = (me?.verification_status === 'verified') || (me?.account_status === 1);
  const canUseDealerPrice = isAuthenticated && isVerifiedAccount;
  const displayPv = Number(prodpv ?? 0);
  const basePrice = Number(price ?? 0);
  const dealerPrice = Number(priceDp ?? 0);
  const srpPrice = Number(originalPrice ?? basePrice);
  const hasDealerPrice = dealerPrice > 0 && dealerPrice < srpPrice;
  const displayPrice = canUseDealerPrice && hasDealerPrice ? dealerPrice : srpPrice;
  const displayOriginalPrice = canUseDealerPrice && hasDealerPrice ? srpPrice : undefined;
  const slug = name.toLowerCase().replace(/\s+/g, '-');
  const productPath = typeof id === 'number' ? `/product/${slug}-i${id}` : `/product/${slug}`;
  const productId = typeof id === 'number' ? id : null;

  const { data: wishlistItems = [] } = useGetWishlistQuery(undefined, {
    skip: !isAuthenticated,
  });

  const [addWishlist, { isLoading: isAddingWishlist }] = useAddWishlistMutation();
  const [removeWishlist, { isLoading: isRemovingWishlist }] = useRemoveWishlistMutation();

  const matchedWishlistItem = productId
    ? wishlistItems.find((item) => item.productId === productId)
    : wishlistItems.find((item) => item.slug === slug);
  const isWishlisted = Boolean(matchedWishlistItem);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      id: slug,
      name,
      price: displayPrice,
      image,
    });
  };
  
  const handleToggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    try {
      if (isWishlisted) {
        if (!matchedWishlistItem?.productId) return;
        await removeWishlist(matchedWishlistItem.productId).unwrap();
      } else {
        await addWishlist(
          productId
            ? { product_id: productId }
            : { product_name: name }
        ).unwrap();
      }
    } catch (error) {
      console.error('Failed to update wishlist:', error);
    }
  };

  return (
    <Link href={productPath}>
      <motion.div
        whileHover={{ y: -6 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="group relative cursor-pointer overflow-hidden rounded-2xl bg-white shadow-sm transition-shadow duration-500 hover:shadow-2xl"
      >
        <div className="relative aspect-square overflow-hidden bg-gray-50">
          <Image
            src={image}
            alt={name}
            fill
            unoptimized
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />

          {badge && (
            <span className="absolute left-3 top-3 z-10 rounded-full bg-orange-500 px-2 py-1 text-[10px] font-bold tracking-wide text-white">
              {badge}
            </span>
          )}

          <div className="absolute inset-0 bg-black/0 transition-colors duration-500 group-hover:bg-black/10" />

          <motion.button
            onClick={handleToggleWishlist} 
            disabled={isAddingWishlist || isRemovingWishlist}
            whileTap={{ scale: 0.9 }}
            className="absolute right-3 top-3 translate-x-2 rounded-full bg-white/90 p-2 opacity-0 shadow-md backdrop-blur-sm transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100 hover:bg-orange-50 disabled:cursor-not-allowed disabled:opacity-80"
          >
            <motion.svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill={isWishlisted ? 'currentColor' : 'none'}
              stroke="currentColor"
              strokeWidth="2"
              className={isWishlisted ? 'text-red-500' : 'text-gray-600'}
              initial={false}
              animate={
                isWishlisted
                  ? { scale: [1, 1.28, 1], rotate: [0, -10, 0] }
                  : { scale: [1, 0.82, 1], rotate: [0, 8, 0] }
              }
              transition={{ duration: 0.28, ease: 'easeOut' }}
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </motion.svg>
          </motion.button>

          <div className="absolute bottom-0 left-0 right-0 translate-y-full p-3 transition-transform duration-300 ease-out group-hover:translate-y-0">
            <button
              onClick={handleAddToCart}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 py-2.5 text-sm font-semibold text-white shadow-lg transition-all duration-200 hover:bg-orange-600 active:scale-95"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
              Add to Cart
            </button>
          </div>
        </div>

        <div className="p-4">
          <h3 className="truncate text-sm font-medium text-gray-800 transition-colors duration-200 group-hover:text-orange-500">{name}</h3>
          <div className="mt-1 flex items-center gap-2">
            <span className="text-base font-bold text-orange-500">₱{displayPrice.toLocaleString()}</span>
            {displayOriginalPrice && <span className="text-sm text-gray-400 line-through">₱{displayOriginalPrice.toLocaleString()}</span>}
          </div>
          {canUseDealerPrice && hasDealerPrice && (
            <div className="mt-1 inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
              Dealer Price
            </div>
          )}
          <div className="mt-1.5 inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-2 py-0.5 text-[11px] font-semibold text-blue-700">
            PV {displayPv.toLocaleString()}
          </div>
        </div>
      </motion.div>
    </Link>
  );
};

export default ProductCard;
