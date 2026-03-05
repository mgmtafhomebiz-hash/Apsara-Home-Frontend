'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useGetWishlistQuery, useRemoveWishlistMutation } from '@/store/api/wishlistApi';
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

export default function Wishlist() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const isAuthenticated = Boolean(session?.user);
  const [pendingRemoveId, setPendingRemoveId] = useState<number | null>(null);
  const [search, setSearch] = useState('');

  const {
    data: items = [],
    isFetching,
    isError,
    error,
    refetch,
  } = useGetWishlistQuery(undefined, {
    skip: !isAuthenticated,
  });

  const [removeWishlist] = useRemoveWishlistMutation();

  const filteredItems = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    if (!keyword) return items;
    return items.filter((item) => item.name.toLowerCase().includes(keyword));
  }, [items, search]);

  const hasItems = useMemo(() => filteredItems.length > 0, [filteredItems.length]);
  const totalValue = useMemo(
    () => filteredItems.reduce((sum, item) => sum + Number(item.price || 0), 0),
    [filteredItems],
  );

  const errorMessage = useMemo(() => {
    if (!error) return 'Failed to load wishlist from your account.';

    const err = error as FetchBaseQueryError;
    const status = typeof err.status === 'number' ? err.status : String(err.status ?? 'unknown');
    const data = (err.data ?? {}) as { message?: string; error?: string };
    const msg = data.message || data.error || 'Request failed.';

    return `Failed to load wishlist (HTTP ${status}): ${msg}`;
  }, [error]);

  const handleRemove = async (productId: number) => {
    setPendingRemoveId(productId);
    try {
      await removeWishlist(productId).unwrap();
    } finally {
      setPendingRemoveId(null);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-b from-orange-50/50 via-white to-white">
      <div className="pointer-events-none absolute -top-20 -left-10 h-72 w-72 rounded-full bg-orange-200/30 blur-3xl" />
      <div className="pointer-events-none absolute -top-6 right-0 h-64 w-64 rounded-full bg-amber-200/20 blur-3xl" />

      <div className="container mx-auto px-4 py-8 md:py-10">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.28 }}
          className="mb-6 rounded-3xl border border-orange-100 bg-white/90 p-5 shadow-[0_20px_50px_-28px_rgba(249,115,22,0.45)] backdrop-blur"
        >
          <div className="mb-4">
            <button
              type="button"
              onClick={() => {
                if (typeof window !== 'undefined' && window.history.length > 1) {
                  router.back();
                  return;
                }
                router.push('/shop');
              }}
              className="inline-flex items-center gap-2 rounded-xl border border-orange-200 bg-orange-50 px-3.5 py-2 text-xs font-semibold text-orange-700 transition-colors hover:bg-orange-100"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                <path d="M15 18l-6-6 6-6" />
              </svg>
              Back
            </button>
          </div>

          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-500">Account Space</p>
              <h1 className="mt-1 text-3xl font-black text-slate-900 sm:text-4xl">My Wishlist</h1>
              <p className="mt-1 text-sm text-slate-500">Your saved favorites in one place.</p>
            </div>

            <div className="grid grid-cols-2 gap-2 sm:flex sm:gap-3">
              <div className="rounded-2xl border border-orange-100 bg-orange-50/60 px-4 py-2.5">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-orange-600">Saved Items</p>
                <p className="text-lg font-extrabold text-slate-900">{items.length}</p>
              </div>
              <div className="rounded-2xl border border-amber-100 bg-amber-50/70 px-4 py-2.5">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-amber-700">Total Value</p>
                <p className="text-lg font-extrabold text-slate-900">PHP {totalValue.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <label className="relative block">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search wishlist..."
                className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 outline-none transition-all focus:border-orange-300 focus:ring-4 focus:ring-orange-100"
              />
            </label>
          </div>
        </motion.div>

        {status === 'loading' || isFetching ? (
          <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center text-gray-500 shadow-sm">
            Loading wishlist...
          </div>
        ) : !isAuthenticated ? (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center shadow-sm">
            <p className="text-gray-700 font-medium">Please sign in to view your wishlist.</p>
            <Link href="/login" className="mt-4 inline-block rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-orange-600">
              Go to Login
            </Link>
          </div>
        ) : isError ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-10 text-center">
            <p className="text-red-700">{errorMessage}</p>
            <button
              onClick={() => refetch()}
              className="mt-4 rounded-xl border border-red-200 bg-white px-5 py-2 text-sm font-semibold text-red-700 hover:bg-red-100"
            >
              Retry
            </button>
            <p className="mt-3 text-xs text-red-500">
              Check Laravel route and auth token. Expected route: <code>/api/wishlist</code>.
            </p>
          </div>
        ) : !hasItems ? (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-12 text-center shadow-sm">
            <h2 className="text-xl font-bold text-slate-900">No results in your wishlist</h2>
            <p className="mt-1 text-sm text-gray-500">
              {search ? 'Try a different keyword or clear your search.' : 'Start saving products you love.'}
            </p>
            <div className="mt-4 flex items-center justify-center gap-2">
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                >
                  Clear Search
                </button>
              )}
              <Link href="/shop" className="rounded-xl bg-orange-500 px-5 py-2 text-sm font-semibold text-white hover:bg-orange-600">
                Go to Shop
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredItems.map((item, index) => (
              (() => {
                const productPath = `/product/${item.slug}-i${item.productId}`;
                return (
                  <motion.div
                    key={item.productId}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25, delay: index * 0.04 }}
                    className="group overflow-hidden rounded-3xl border border-gray-200 bg-white p-3 shadow-[0_18px_45px_-30px_rgba(2,6,23,0.35)] transition-all hover:-translate-y-1 hover:shadow-[0_30px_50px_-30px_rgba(249,115,22,0.4)]"
                  >
                    <Link href={productPath} className="block">
                      <div className="relative mb-3 aspect-square overflow-hidden rounded-2xl bg-gray-50">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          unoptimized
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                      </div>
                      <h2 className="line-clamp-2 min-h-[2.8rem] text-sm font-semibold text-slate-900">{item.name}</h2>
                      <p className="mt-1 text-lg font-extrabold text-orange-500">PHP {item.price.toLocaleString()}</p>
                    </Link>

                    <div className="mt-3 grid grid-cols-2 gap-2">
                      <Link
                        href={productPath}
                        className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-center text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50"
                      >
                        View Product
                      </Link>
                      <button
                        onClick={() => handleRemove(item.productId)}
                        disabled={pendingRemoveId === item.productId}
                        className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 transition-colors hover:bg-red-100 disabled:opacity-60"
                      >
                        {pendingRemoveId === item.productId ? 'Removing...' : 'Remove'}
                      </button>
                    </div>
                  </motion.div>
                );
              })()
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
