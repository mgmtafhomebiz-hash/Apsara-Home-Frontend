'use client';

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Button, Card, Chip, Label, Pagination, SearchField } from "@heroui/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useGetCheckoutHistoryQuery } from "@/store/api/paymentApi";
import { TABS } from "@/types/Data";
import Icon from "./Icons";
import OrderCard from "./OrderCard";

type TabKey = typeof TABS[number]['key'];

const PAGE_SIZE = 5;

const formatPeso = (value: number) =>
  new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    maximumFractionDigits: 2,
  }).format(value);

const getPaginationPages = (currentPage: number, totalPages: number) => {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const pages = new Set<number>([1, totalPages, currentPage, currentPage - 1, currentPage + 1]);

  return Array.from(pages)
    .filter((page) => page >= 1 && page <= totalPages)
    .sort((first, second) => first - second);
};

const OrdersPageMain = () => {
  const router = useRouter();
  const { status: authStatus } = useSession();
  const [activeTab, setActiveTab] = useState<TabKey>('all');
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isLoading, isError } = useGetCheckoutHistoryQuery(undefined, {
    skip: authStatus !== 'authenticated',
  });

  const orders = useMemo(() => data?.orders ?? [], [data?.orders]);

  const filtered = useMemo(() => {
    let list = orders;

    if (activeTab !== 'all') {
      list = list.filter((order) => order.status === activeTab || (activeTab === 'shipped' && order.status === 'out_for_delivery'));
    }

    if (search.trim()) {
      const normalizedSearch = search.toLowerCase();
      list = list.filter((order) =>
        order.order_number.toLowerCase().includes(normalizedSearch) ||
        order.items.some((item) => item.name.toLowerCase().includes(normalizedSearch)),
      );
    }

    return list;
  }, [activeTab, orders, search]);

  const tabCounts = useMemo(() => {
    const counts: Record<string, number> = { all: orders.length };

    orders.forEach((order) => {
      const key = order.status === 'out_for_delivery' ? 'shipped' : order.status;
      counts[key] = (counts[key] ?? 0) + 1;
    });

    return counts;
  }, [orders]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safeCurrentPage = Math.min(currentPage, totalPages);

  const paginatedOrders = useMemo(() => {
    const startIndex = (safeCurrentPage - 1) * PAGE_SIZE;
    return filtered.slice(startIndex, startIndex + PAGE_SIZE);
  }, [filtered, safeCurrentPage]);

  const paginationPages = useMemo(() => getPaginationPages(safeCurrentPage, totalPages), [safeCurrentPage, totalPages]);
  const deliveredCount = tabCounts.delivered ?? 0;
  const inTransitCount = (tabCounts.shipped ?? 0) + (tabCounts.out_for_delivery ?? 0);
  const totalSpent = useMemo(
    () => orders.reduce((sum, order) => sum + Number(order.total ?? 0), 0),
    [orders],
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="relative min-h-screen overflow-hidden bg-gradient-to-br from-orange-50/50 via-white to-white"
    >
      <div className="pointer-events-none absolute -top-20 -left-20 h-56 w-56 rounded-full bg-orange-200/25 blur-3xl" />
      <div className="pointer-events-none absolute top-0 right-0 h-56 w-56 rounded-full bg-amber-200/20 blur-3xl" />

      <div className="container mx-auto px-4 py-8 md:py-10">
        <div className="mb-7 space-y-6">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h1 className="text-2xl font-extrabold text-gray-900 md:text-3xl">My Orders</h1>
              <p className="text-sm text-slate-500">{orders.length} total order{orders.length !== 1 ? 's' : ''}</p>
            </div>
<<<<<<< Updated upstream
            <button
              type="button"
              onClick={() => router.push('/')}
              className="inline-flex items-center gap-2 rounded-xl bg-orange-500 hover:bg-orange-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors shadow-sm shadow-orange-200 whitespace-nowrap"
=======
            <Button
              onPress={() => router.push('/shop')}
              className="bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-orange-200 transition hover:bg-orange-600"
>>>>>>> Stashed changes
            >
              <Icon.ShoppingBag className="h-4 w-4" />
              Shop More
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <Card variant="default" className="border border-slate-100 bg-white/95 shadow-none">
              <Card.Content className="space-y-2 px-5 py-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">Order Snapshot</p>
                <div className="flex items-end justify-between gap-3">
                  <div>
                    <p className="text-2xl font-bold text-slate-900">{orders.length}</p>
                    <p className="text-sm text-slate-500">Total orders placed</p>
                  </div>
                  <Chip color="warning" size="sm" variant="soft">All Orders</Chip>
                </div>
              </Card.Content>
            </Card>

            <Card variant="default" className="border border-slate-100 bg-white/95 shadow-none">
              <Card.Content className="space-y-2 px-5 py-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">Active Deliveries</p>
                <div className="flex items-end justify-between gap-3">
                  <div>
                    <p className="text-2xl font-bold text-slate-900">{inTransitCount}</p>
                    <p className="text-sm text-slate-500">Shipped or out for delivery</p>
                  </div>
                  <Chip size="sm" variant="soft" className="bg-teal-50 text-teal-700">In Transit</Chip>
                </div>
              </Card.Content>
            </Card>

            <Card variant="default" className="border border-slate-100 bg-white/95 shadow-none">
              <Card.Content className="space-y-2 px-5 py-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">Completed</p>
                <div className="flex items-end justify-between gap-3">
                  <div>
                    <p className="text-2xl font-bold text-slate-900">{deliveredCount}</p>
                    <p className="text-sm text-slate-500">Delivered orders</p>
                  </div>
                  <p className="text-sm font-semibold text-orange-600">{formatPeso(totalSpent)}</p>
                </div>
              </Card.Content>
            </Card>
          </div>

          <Card variant="default" className="border border-slate-100 bg-white/95 shadow-none">
            <Card.Content className="space-y-5 px-5 py-5">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="w-full max-w-2xl">
                  <SearchField
                    aria-label="Search orders"
                    value={search}
                    onChange={(value) => {
                      setSearch(value);
                      setCurrentPage(1);
                    }}
                    className="w-full"
                  >
                    <Label className="sr-only">Search orders</Label>
                    <SearchField.Group className="flex min-h-12 items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 transition-all duration-200 focus-within:border-orange-300 focus-within:bg-white">
                      <SearchField.SearchIcon className="h-4 w-4 text-slate-400" />
                      <SearchField.Input
                        placeholder="Search by order number or item name..."
                        className="flex-1 border-none bg-transparent p-0 text-sm text-slate-700 outline-none placeholder:text-slate-400"
                      />
                      {search ? <SearchField.ClearButton className="text-slate-400 transition hover:text-slate-600" /> : null}
                    </SearchField.Group>
                  </SearchField>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <Chip size="sm" variant="soft" className="bg-slate-100 text-slate-600">
                    {filtered.length} match{filtered.length !== 1 ? 'es' : ''}
                  </Chip>
                  <Chip size="sm" variant="soft" className="bg-orange-50 text-orange-700">
                    Page {safeCurrentPage} of {totalPages}
                  </Chip>
                </div>
              </div>

              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
                {TABS.map((tab) => {
                  const count = tabCounts[tab.key] ?? 0;
                  const active = activeTab === tab.key;

                  return (
                    <Button
                      key={tab.key}
                      size="sm"
                      onPress={() => {
                        setActiveTab(tab.key);
                        setCurrentPage(1);
                      }}
                      className={active
                        ? 'bg-orange-500 text-white shadow-sm'
                        : 'border border-slate-200 bg-white text-slate-600 hover:border-orange-200 hover:bg-orange-50 hover:text-orange-700'}
                    >
                      <span>{tab.label}</span>
                      <Chip
                        size="sm"
                        variant="soft"
                        className={active ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'}
                      >
                        {count}
                      </Chip>
                    </Button>
                  );
                })}
              </div>
            </Card.Content>
          </Card>
        </div>

        {authStatus !== 'authenticated' && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800"
          >
            Sign in required to view your checkout history.
          </motion.div>
        )}

        {isError && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            Failed to load your order history.
          </motion.div>
        )}

        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl border border-gray-200 bg-white p-8 text-center"
            >
              <p className="text-sm text-gray-500">Loading your order history...</p>
            </motion.div>
          ) : paginatedOrders.length > 0 ? (
            <motion.div
              key={activeTab + search}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              {paginatedOrders.map((order) => (
                <OrderCard key={order.id} order={order} />
              ))}

              {totalPages > 1 && (
                <Card variant="default" className="border border-slate-100 bg-white shadow-none">
                  <Card.Content className="px-4 py-3">
                    <Pagination size="sm" className="w-full justify-between gap-3">
                      <Pagination.Summary>
                        {filtered.length === 0 ? 0 : ((safeCurrentPage - 1) * PAGE_SIZE) + 1} to {Math.min(safeCurrentPage * PAGE_SIZE, filtered.length)} of {filtered.length} results
                      </Pagination.Summary>
                      <Pagination.Content>
                        <Pagination.Item>
                          <Pagination.Previous
                            isDisabled={safeCurrentPage === 1}
                            onPress={() => setCurrentPage(Math.max(1, safeCurrentPage - 1))}
                          >
                            <Pagination.PreviousIcon />
                            Prev
                          </Pagination.Previous>
                        </Pagination.Item>

                        {paginationPages.map((page, index) => {
                          const previousPage = paginationPages[index - 1];
                          const shouldShowEllipsis = typeof previousPage === 'number' && page - previousPage > 1;

                          return (
                            <span key={`fragment-${page}`} className="contents">
                              {shouldShowEllipsis && (
                                <Pagination.Item>
                                  <Pagination.Ellipsis />
                                </Pagination.Item>
                              )}
                              <Pagination.Item>
                                <Pagination.Link isActive={page === safeCurrentPage} onPress={() => setCurrentPage(page)}>
                                  {page}
                                </Pagination.Link>
                              </Pagination.Item>
                            </span>
                          );
                        })}

                        <Pagination.Item>
                          <Pagination.Next
                            isDisabled={safeCurrentPage === totalPages}
                            onPress={() => setCurrentPage(Math.min(totalPages, safeCurrentPage + 1))}
                          >
                            Next
                            <Pagination.NextIcon />
                          </Pagination.Next>
                        </Pagination.Item>
                      </Pagination.Content>
                    </Pagination>
                  </Card.Content>
                </Card>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-white py-16 text-center"
            >
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-50 text-orange-300">
                <Icon.Package className="h-8 w-8" />
              </div>
              <p className="text-base font-bold text-gray-800">No orders</p>
              <p className="mt-1 max-w-xs text-sm text-gray-400">
                {search ? `No results for ${search}. Try a different keyword.` : "You don't have any orders in this category yet."}
              </p>
              <Button
                onPress={() => {
                  setSearch('');
                  setActiveTab('all');
                  router.push(authStatus === 'authenticated' ? '/' : '/login');
                }}
                className="mt-5 bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-amber-600"
              >
                <Icon.ShoppingBag className="h-4 w-4" />
                {authStatus === 'authenticated' ? 'Start Shopping' : 'Go to Login'}
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div />
    </motion.div>
  );
};

export default OrdersPageMain;
