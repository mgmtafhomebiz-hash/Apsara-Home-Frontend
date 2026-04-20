'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Page {
  title: string;
  href: string;
  breadcrumbs: string[];
}

const ADMIN_PAGES: Page[] = [
  { title: 'Dashboard', href: '/admin/dashboard', breadcrumbs: ['Admin', 'Dashboard'] },
  { title: 'Chat', href: '/admin/chat', breadcrumbs: ['Admin', 'Chat'] },

  // Members
  { title: 'All Members', href: '/admin/members', breadcrumbs: ['Admin', 'Members'] },
  { title: 'Member Tiers / Levels', href: '/admin/members/tiers', breadcrumbs: ['Admin', 'Members', 'Tiers'] },
  { title: 'KYC / Verifications', href: '/admin/members/kyc', breadcrumbs: ['Admin', 'Members', 'KYC'] },
  { title: 'Wallet / Credits', href: '/admin/members/wallet', breadcrumbs: ['Admin', 'Members', 'Wallet'] },
  { title: 'Commission / Referral Tree', href: '/admin/members/referrals', breadcrumbs: ['Admin', 'Members', 'Referrals'] },
  { title: 'Top Earners', href: '/admin/members/top-earners', breadcrumbs: ['Admin', 'Members', 'Top Earners'] },
  { title: 'Members Activity Logs', href: '/admin/members/activity-logs', breadcrumbs: ['Admin', 'Members', 'Activity Logs'] },
  { title: 'Members Exports', href: '/admin/members/exports', breadcrumbs: ['Admin', 'Members', 'Exports'] },

  // Orders
  { title: 'Orders', href: '/admin/orders', breadcrumbs: ['Admin', 'Orders'] },

  // Interior Requests
  { title: 'Interior Requests', href: '/admin/interior-requests', breadcrumbs: ['Admin', 'Interior Requests'] },

  // Encashment
  { title: 'All Requests', href: '/admin/encashment', breadcrumbs: ['Admin', 'Encashment'] },
  { title: 'Queue / Pending', href: '/admin/encashment/pending', breadcrumbs: ['Admin', 'Encashment', 'Pending'] },
  { title: 'Ready for Release', href: '/admin/encashment/approved_by_admin', breadcrumbs: ['Admin', 'Encashment', 'Ready'] },
  { title: 'Released', href: '/admin/encashment/released', breadcrumbs: ['Admin', 'Encashment', 'Released'] },
  { title: 'Rejected', href: '/admin/encashment/rejected', breadcrumbs: ['Admin', 'Encashment', 'Rejected'] },
  { title: 'Failed Payouts', href: '/admin/encashment/failed', breadcrumbs: ['Admin', 'Encashment', 'Failed'] },

  // Accounting
  { title: 'Accounting Dashboard', href: '/admin/accounting', breadcrumbs: ['Admin', 'Accounting'] },
  { title: 'Release Center', href: '/admin/accounting/release-center', breadcrumbs: ['Admin', 'Accounting', 'Release Center'] },
  { title: 'Disbursement History', href: '/admin/accounting/disbursement-history', breadcrumbs: ['Admin', 'Accounting', 'Disbursement'] },
  { title: 'Reconciliation', href: '/admin/accounting/reconciliation', breadcrumbs: ['Admin', 'Accounting', 'Reconciliation'] },
  { title: 'Invoices', href: '/admin/accounting/invoices', breadcrumbs: ['Admin', 'Accounting', 'Invoices'] },
  { title: 'Audit Trail', href: '/admin/accounting/audit', breadcrumbs: ['Admin', 'Accounting', 'Audit'] },
  { title: 'Reports', href: '/admin/accounting/reports', breadcrumbs: ['Admin', 'Accounting', 'Reports'] },
  { title: 'Accounting Settings', href: '/admin/accounting/settings', breadcrumbs: ['Admin', 'Accounting', 'Settings'] },

  // Finance
  { title: 'Finance Dashboard', href: '/admin/finance', breadcrumbs: ['Admin', 'Finance'] },

  // Reports
  { title: 'Sales Report', href: '/admin/reports/sales', breadcrumbs: ['Admin', 'Reports', 'Sales'] },
  { title: 'Member Report', href: '/admin/reports/members', breadcrumbs: ['Admin', 'Reports', 'Members'] },
  { title: 'Product Report', href: '/admin/reports/products', breadcrumbs: ['Admin', 'Reports', 'Products'] },
  { title: 'Financial Report', href: '/admin/reports/financial', breadcrumbs: ['Admin', 'Reports', 'Financial'] },

  // Products
  { title: 'All Products', href: '/admin/products', breadcrumbs: ['Admin', 'Products'] },
  { title: 'Categories', href: '/admin/products/categories', breadcrumbs: ['Admin', 'Products', 'Categories'] },
  { title: 'Brands', href: '/admin/products/brands', breadcrumbs: ['Admin', 'Products', 'Brands'] },
  { title: 'Inventory', href: '/admin/products/inventory', breadcrumbs: ['Admin', 'Products', 'Inventory'] },
  { title: 'Reviews', href: '/admin/products/reviews', breadcrumbs: ['Admin', 'Products', 'Reviews'] },

  // Shipping
  { title: 'Shipping Rates', href: '/admin/shipping/rates', breadcrumbs: ['Admin', 'Shipping', 'Rates'] },
  { title: 'Couriers', href: '/admin/shipping/couriers', breadcrumbs: ['Admin', 'Shipping', 'Couriers'] },
  { title: 'Tracking', href: '/admin/shipping/tracking', breadcrumbs: ['Admin', 'Shipping', 'Tracking'] },

  // Suppliers
  { title: 'Suppliers', href: '/admin/suppliers', breadcrumbs: ['Admin', 'Suppliers'] },

  // Inquiry
  { title: 'Inquiry', href: '/admin/inquiry', breadcrumbs: ['Admin', 'Inquiry'] },

  // Project
  { title: 'Project', href: '/admin/project', breadcrumbs: ['Admin', 'Project'] },

  // Web Content
  { title: 'Shop Builder', href: '/admin/webpages/shop-builder', breadcrumbs: ['Admin', 'Web Content', 'Shop Builder'] },
  { title: 'Partner Storefronts', href: '/admin/webpages/partner-storefronts', breadcrumbs: ['Admin', 'Web Content', 'Storefronts'] },
  { title: 'Partner Users', href: '/admin/webpages/partner-users', breadcrumbs: ['Admin', 'Web Content', 'Partner Users'] },
  { title: 'Assembly Guides', href: '/admin/webpages/assembly-guides', breadcrumbs: ['Admin', 'Web Content', 'Guides'] },
  { title: 'Bulk Edit', href: '/admin/webpages/bulk-edit', breadcrumbs: ['Admin', 'Web Content', 'Bulk Edit'] },

  // Expenses
  { title: 'All Expenses', href: '/admin/expenses', breadcrumbs: ['Admin', 'Expenses'] },
  { title: 'Expense Categories', href: '/admin/expenses/categories', breadcrumbs: ['Admin', 'Expenses', 'Categories'] },

  // Payments
  { title: 'Transactions', href: '/admin/payments', breadcrumbs: ['Admin', 'Payments'] },
  { title: 'E-Wallet', href: '/admin/payments/ewallet', breadcrumbs: ['Admin', 'Payments', 'E-Wallet'] },
  { title: 'Vouchers', href: '/admin/payments/giftcards', breadcrumbs: ['Admin', 'Payments', 'Vouchers'] },

  // Settings
  { title: 'General Settings', href: '/admin/settings/general', breadcrumbs: ['Admin', 'Settings', 'General'] },
  { title: 'Users & Roles', href: '/admin/settings/users', breadcrumbs: ['Admin', 'Settings', 'Users'] },
  { title: 'Security', href: '/admin/settings/security', breadcrumbs: ['Admin', 'Settings', 'Security'] },
  { title: 'Notifications', href: '/admin/settings/notifications', breadcrumbs: ['Admin', 'Settings', 'Notifications'] },

  // Other
  { title: 'Profile', href: '/admin/profile', breadcrumbs: ['Admin', 'Profile'] },
];

export default function SearchCommandPalette() {
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const filteredPages = search.trim() === ''
    ? ADMIN_PAGES
    : ADMIN_PAGES.filter((page) => {
        const searchLower = search.toLowerCase();
        return (
          page.title.toLowerCase().includes(searchLower) ||
          page.breadcrumbs.some((bc) => bc.toLowerCase().includes(searchLower))
        );
      });

  const handleSelectPage = useCallback((href: string) => {
    setIsOpen(false);
    setSearch('');
    setSelectedIndex(0);
    router.push(href);
  }, [router]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
      setSearch('');
      setSelectedIndex(0);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % filteredPages.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredPages.length) % filteredPages.length);
    } else if (e.key === 'Enter' && filteredPages.length > 0) {
      e.preventDefault();
      handleSelectPage(filteredPages[selectedIndex].href);
    }
  };

  useEffect(() => {
    setSelectedIndex(0);
  }, [search]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  return (
    <>
      <div className="flex-1 max-w-md mx-auto">
        <div className="relative">
          <svg className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            placeholder="Search pages, members, products..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            onKeyDown={handleKeyDown}
            className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pl-10 pr-4 text-sm text-gray-700 transition-all placeholder:text-gray-400 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-500/40 dark:border-gray-700 dark:bg-gray-800/80 dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus:border-sky-400 dark:focus:ring-sky-400/40"
          />
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="fixed inset-0 z-40 bg-black/30"
              onClick={() => setIsOpen(false)}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ duration: 0.15 }}
              className="absolute left-1/2 top-full z-50 w-full max-w-md -translate-x-1/2 mt-3 max-h-96 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800"
            >
              {filteredPages.length === 0 ? (
                <div className="flex flex-col items-center justify-center px-4 py-8">
                  <svg className="w-12 h-12 text-gray-300 dark:text-gray-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">No pages found</p>
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">Try adjusting your search</p>
                </div>
              ) : (
                <div ref={listRef} className="max-h-96 overflow-y-auto overscroll-contain">
                  {filteredPages.map((page, index) => (
                    <motion.button
                      key={page.href}
                      onClick={() => handleSelectPage(page.href)}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.02 }}
                      className={`flex w-full items-start justify-between gap-4 px-4 py-3 text-left transition-colors ${
                        index === selectedIndex
                          ? 'bg-sky-50 dark:bg-sky-500/10'
                          : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'
                      }`}
                    >
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium ${
                          index === selectedIndex
                            ? 'text-sky-700 dark:text-sky-300'
                            : 'text-gray-800 dark:text-gray-100'
                        }`}>
                          {page.title}
                        </p>
                        <div className="flex items-center gap-1 mt-1">
                          {page.breadcrumbs.map((bc, i) => (
                            <div key={`${bc}-${i}`} className="flex items-center gap-1">
                              <span className="text-xs text-gray-500 dark:text-gray-400">{bc}</span>
                              {i < page.breadcrumbs.length - 1 && (
                                <span className="text-gray-300 dark:text-gray-600">/</span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                      {index === selectedIndex && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="flex h-6 w-6 items-center justify-center rounded-full bg-sky-500 flex-shrink-0 mt-1"
                        >
                          <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </motion.div>
                      )}
                    </motion.button>
                  ))}
                </div>
              )}

              <div className="border-t border-gray-200 bg-gray-50 px-4 py-2.5 text-xs text-gray-500 dark:border-gray-700 dark:bg-gray-800/50 dark:text-gray-400">
                <div className="flex items-center justify-between">
                  <span>Type to search • Use ↑↓ to navigate • Enter to select</span>
                  <span className="text-[11px] text-gray-400 dark:text-gray-600">Esc to close</span>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
