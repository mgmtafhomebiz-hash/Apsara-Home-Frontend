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
    <main className="min-h-screen bg-slate-50">
      <div className="container mx-auto px-4 py-8 md:py-10 max-w-7xl">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.28 }}
          className="mb-8"
        >
          {/* Breadcrumb + back */}
          <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-3">
            <button
              type="button"
              onClick={() => {
                if (typeof window !== 'undefined' && window.history.length > 1) {
                  router.back();
                  return;
                }
                router.push('/shop');
              }}
              className="hover:text-slate-600 transition-colors"
            >
              Shop
            </button>
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 18l6-6-6-6" /></svg>
            <span className="text-slate-600 font-medium">Wishlist</span>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">My Wishlist</h1>
              <p className="mt-1 text-sm text-slate-500">Your saved favorites in one place.</p>
            </div>

            {isAuthenticated && !isFetching && !isError && (
              <div className="flex items-center gap-3">
                <div className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 shadow-sm">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Saved Items</p>
                  <p className="text-xl font-bold text-slate-900">{items.length}</p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 shadow-sm">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Total Value</p>
                  <p className="text-xl font-bold text-slate-900">PHP {totalValue.toLocaleString()}</p>
                </div>
              </div>
            )}
          </div>

          {/* Search */}
          {isAuthenticated && !isError && items.length > 0 && (
            <div className="mt-5 relative max-w-sm">
              <svg
                className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none"
                xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
              >
                <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
              </svg>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search wishlist..."
                className="w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 py-2.5 text-sm text-slate-800 outline-none transition-all focus:border-orange-300 focus:ring-2 focus:ring-orange-100 placeholder:text-slate-400"
              />
            </div>
          )}
        </motion.div>

        {/* States */}
        {status === 'loading' || isFetching ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="rounded-2xl border border-slate-200 bg-white overflow-hidden animate-pulse">
                <div className="aspect-square bg-slate-100" />
                <div className="p-4 space-y-2">
                  <div className="h-3.5 bg-slate-100 rounded-lg w-3/4" />
                  <div className="h-3.5 bg-slate-100 rounded-lg w-1/2" />
                  <div className="h-5 bg-slate-100 rounded-lg w-1/3 mt-3" />
                  <div className="grid grid-cols-2 gap-2 mt-3">
                    <div className="h-8 bg-slate-100 rounded-xl" />
                    <div className="h-8 bg-slate-100 rounded-xl" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : !isAuthenticated ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white py-20 text-center shadow-sm">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
              <svg className="h-7 w-7 text-slate-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>
            </div>
            <h2 className="text-base font-bold text-slate-900">Sign in to view your wishlist</h2>
            <p className="mt-1 text-sm text-slate-500">Save and track your favorite items.</p>
            <Link href="/login" className="mt-5 inline-flex items-center gap-2 rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-orange-600 transition-colors">
              Sign In
            </Link>
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-red-100 bg-red-50 py-16 text-center">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
              <svg className="h-6 w-6 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
            </div>
            <p className="text-sm font-semibold text-red-700 max-w-sm">{errorMessage}</p>
            <button
              onClick={() => refetch()}
              className="mt-4 rounded-xl border border-red-200 bg-white px-5 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : !hasItems ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white py-20 text-center shadow-sm">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-orange-50">
              <svg className="h-7 w-7 text-orange-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>
            </div>
            <h2 className="text-base font-bold text-slate-900">
              {search ? 'No matching items' : 'Your wishlist is empty'}
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              {search ? 'Try a different keyword or clear your search.' : 'Start saving products you love.'}
            </p>
            <div className="mt-5 flex items-center gap-2">
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  Clear Search
                </button>
              )}
              <Link href="/shop" className="rounded-xl bg-orange-500 px-5 py-2 text-sm font-semibold text-white hover:bg-orange-600 transition-colors">
                Browse Shop
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredItems.map((item, index) => {
              const productPath = `/product/${item.slug}-i${item.productId}`;
              return (
                <motion.div
                  key={item.productId}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.22, delay: index * 0.04 }}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md hover:border-slate-300"
                >
                  {/* Image */}
                  <Link href={productPath} className="block relative aspect-square overflow-hidden bg-slate-50">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      unoptimized
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/20 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  </Link>

                  {/* Info */}
                  <div className="flex flex-1 flex-col p-4">
                    <Link href={productPath} className="block flex-1">
                      <h2 className="line-clamp-2 text-sm font-semibold text-slate-900 leading-snug">{item.name}</h2>
                      <p className="mt-2 text-base font-bold text-orange-500">PHP {Number(item.price).toLocaleString()}</p>
                    </Link>

                    <div className="mt-4 grid grid-cols-2 gap-2">
                      <Link
                        href={productPath}
                        className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-center text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-100"
                      >
                        View
                      </Link>
                      <button
                        onClick={() => handleRemove(item.productId)}
                        disabled={pendingRemoveId === item.productId}
                        className="rounded-xl border border-red-100 bg-red-50 px-3 py-2 text-xs font-semibold text-red-500 transition-colors hover:bg-red-100 disabled:opacity-50"
                      >
                        {pendingRemoveId === item.productId ? 'Removing...' : 'Remove'}
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
