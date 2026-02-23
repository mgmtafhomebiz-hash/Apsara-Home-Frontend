'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'

interface SubItem { label: string; path: string }
interface NavItem {
  id: string
  label: string
  path?: string
  icon: React.ReactNode
  badge?: number
  children?: SubItem[]
}

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
  isCollapsed: boolean
  onToggleCollapse: () => void
}

const navItems: NavItem[] = [
  {
    id: 'dashboard', label: 'Dashboard', path: '/super_admin',
    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 4h7v7H3V4zm11 0h7v4h-7V4zm0 7h7v9h-7v-9zM3 15h7v5H3v-5z"/></svg>,
  },
  {
    id: 'members', label: 'Members', badge: 3,
    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/></svg>,
    children: [
      { label: 'All Members', path: '/super_admin/members' },
      { label: 'Pending Approval', path: '/super_admin/members/pending' },
      { label: 'Blocked', path: '/super_admin/members/blocked' },
    ],
  },
  {
    id: 'orders', label: 'Orders', badge: 12,
    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>,
    children: [
      { label: 'All Orders', path: '/super_admin/orders' },
      { label: 'Pending', path: '/super_admin/orders/pending' },
      { label: 'Processing', path: '/super_admin/orders/processing' },
      { label: 'Completed', path: '/super_admin/orders/completed' },
      { label: 'Cancelled', path: '/super_admin/orders/cancelled' },
    ],
  },
  {
    id: 'encashment', label: 'Encashment',
    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"/></svg>,
    children: [
      { label: 'All Requests', path: '/super_admin/encashment' },
      { label: 'Pending', path: '/super_admin/encashment/pending' },
      { label: 'Released', path: '/super_admin/encashment/released' },
    ],
  },
  {
    id: 'reports', label: 'Reports',
    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>,
    children: [
      { label: 'Sales Report', path: '/super_admin/reports/sales' },
      { label: 'Member Report', path: '/super_admin/reports/members' },
      { label: 'Product Report', path: '/super_admin/reports/products' },
      { label: 'Financial Report', path: '/super_admin/reports/financial' },
    ],
  },
  {
    id: 'products', label: 'Products',
    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>,
    children: [
      { label: 'All Products', path: '/super_admin/products' },
      { label: 'Categories', path: '/super_admin/products/categories' },
      { label: 'Inventory', path: '/super_admin/products/inventory' },
      { label: 'Reviews', path: '/super_admin/products/reviews' },
    ],
  },
  {
    id: 'shipping', label: 'Shipping',
    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0"/></svg>,
    children: [
      { label: 'Shipping Rates', path: '/super_admin/shipping/rates' },
      { label: 'Couriers', path: '/super_admin/shipping/couriers' },
      { label: 'Tracking', path: '/super_admin/shipping/tracking' },
    ],
  },
  {
    id: 'suppliers', label: 'Suppliers', path: '/super_admin/suppliers',
    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>,
  },
  {
    id: 'project', label: 'Project', path: '/super_admin/project',
    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"/></svg>,
  },
  {
    id: 'webpages', label: 'Web Pages',
    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9"/></svg>,
    children: [
      { label: 'Home Page', path: '/super_admin/webpages/home' },
      { label: 'Banners', path: '/super_admin/webpages/banners' },
      { label: 'Announcements', path: '/super_admin/webpages/announcements' },
    ],
  },
  {
    id: 'expenses', label: 'Expenses',
    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/></svg>,
    children: [
      { label: 'All Expenses', path: '/super_admin/expenses' },
      { label: 'Categories', path: '/super_admin/expenses/categories' },
    ],
  },
  {
    id: 'payments', label: "Payment's",
    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/></svg>,
    children: [
      { label: 'Transactions', path: '/super_admin/payments' },
      { label: 'E-Wallet', path: '/super_admin/payments/ewallet' },
      { label: 'Gift Cards', path: '/super_admin/payments/giftcards' },
    ],
  },
  {
    id: 'settings', label: 'Settings',
    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>,
    children: [
      { label: 'General', path: '/super_admin/settings/general' },
      { label: 'Users & Roles', path: '/super_admin/settings/users' },
      { label: 'Security', path: '/super_admin/settings/security' },
      { label: 'Notifications', path: '/super_admin/settings/notifications' },
    ],
  },
]

export default function Sidebar({ isOpen, onClose, isCollapsed, onToggleCollapse }: SidebarProps) {
  const pathname = usePathname()
  const [openMenus, setOpenMenus] = useState<string[]>([])

  const toggleMenu = (id: string) =>
    setOpenMenus(prev => prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id])

  const isActive = (path: string) => pathname === path
  const isChildActive = (children?: SubItem[]) => children?.some(c => pathname === c.path) ?? false

  return (
    <>
      {/* Mobile backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-20 lg:hidden"
          />
        )}
      </AnimatePresence>

      <aside className={`
        fixed top-0 left-0 h-screen z-30 flex flex-col
        bg-slate-900 border-r border-slate-700/50
        transition-all duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        ${isCollapsed ? 'w-16' : 'w-64'}
        lg:translate-x-0 lg:sticky lg:top-0
      `}>
        {/* Logo */}
        <div className={`flex items-center h-16 px-3 border-b border-slate-700/50 shrink-0 ${isCollapsed ? 'justify-center' : 'gap-2'}`}>
          <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-lg">
            <Image
              src="/af_home_logo.png"
              alt="AF Home"
              fill
              className="object-contain"
              priority
            />
          </div>
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-white font-bold text-sm leading-none whitespace-nowrap">AF Home</p>
              <p className="text-teal-400 text-xs mt-0.5">Super Admin</p>
            </div>
          )}
          {!isCollapsed && (
            <button onClick={onToggleCollapse} className="hidden lg:flex items-center justify-center h-7 w-7 rounded-lg text-slate-500 hover:text-white hover:bg-slate-700 transition-colors shrink-0">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7"/></svg>
            </button>
          )}
          {isCollapsed && (
            <button onClick={onToggleCollapse} className="hidden lg:flex items-center justify-center h-7 w-7 rounded-lg text-slate-500 hover:text-white hover:bg-slate-700 transition-colors absolute right-1 top-4">
              <svg className="w-4 h-4 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7"/></svg>
            </button>
          )}
          <button onClick={onClose} className="lg:hidden text-slate-400 hover:text-white ml-auto">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5" style={{ scrollbarWidth: 'none' }}>
          {navItems.map((item) => {
            const hasChildren = !!item.children?.length
            const menuOpen = openMenus.includes(item.id)
            const active = item.path ? isActive(item.path) : isChildActive(item.children)

            return (
              <div key={item.id}>
                {hasChildren ? (
                  <button
                    onClick={() => !isCollapsed && toggleMenu(item.id)}
                    title={isCollapsed ? item.label : undefined}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200 group relative
                      ${active ? 'bg-teal-500/15 text-teal-400' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'}
                      ${isCollapsed ? 'justify-center' : ''}
                    `}
                  >
                    <span className="shrink-0">{item.icon}</span>
                    {!isCollapsed && (
                      <>
                        <span className="flex-1 text-left font-medium">{item.label}</span>
                        {item.badge && <span className="bg-teal-500 text-white text-xs px-1.5 py-0.5 rounded-full font-bold min-w-[20px] text-center">{item.badge}</span>}
                        <svg className={`w-4 h-4 shrink-0 transition-transform duration-200 ${menuOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/></svg>
                      </>
                    )}
                    {isCollapsed && (
                      <span className="absolute left-full ml-3 px-2.5 py-1.5 bg-slate-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 shadow-xl border border-slate-700">{item.label}</span>
                    )}
                  </button>
                ) : (
                  <Link href={item.path ?? '#'} onClick={() => isOpen && onClose()}
                    title={isCollapsed ? item.label : undefined}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200 group relative
                      ${active ? 'bg-teal-500/15 text-teal-400' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'}
                      ${isCollapsed ? 'justify-center' : ''}
                    `}
                  >
                    <span className="shrink-0">{item.icon}</span>
                    {!isCollapsed && <span className="font-medium">{item.label}</span>}
                    {isCollapsed && (
                      <span className="absolute left-full ml-3 px-2.5 py-1.5 bg-slate-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 shadow-xl border border-slate-700">{item.label}</span>
                    )}
                  </Link>
                )}

                {/* Submenu */}
                {hasChildren && !isCollapsed && (
                  <AnimatePresence>
                    {menuOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="ml-4 mt-0.5 pl-3 border-l border-slate-700 py-1 space-y-0.5">
                          {item.children?.map((child) => (
                            <Link key={child.path} href={child.path} onClick={() => isOpen && onClose()}
                              className={`flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs transition-all duration-200
                                ${isActive(child.path) ? 'text-teal-400 font-semibold' : 'text-slate-500 hover:text-slate-200'}
                              `}
                            >
                              <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${isActive(child.path) ? 'bg-teal-400' : 'bg-slate-600'}`} />
                              {child.label}
                            </Link>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}
              </div>
            )
          })}
        </nav>

        {/* Footer */}
        <div className={`shrink-0 p-3 border-t border-slate-700/50`}>
          {!isCollapsed && (
            <div className="flex items-center gap-3 px-3 py-2.5 mb-2 rounded-xl bg-slate-800">
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center shrink-0">
                <span className="text-white font-bold text-xs">SA</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-xs font-semibold truncate">Super Admin</p>
                <p className="text-slate-400 text-xs truncate">admin@afhome.com</p>
              </div>
            </div>
          )}
          <button className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200 w-full ${isCollapsed ? 'justify-center' : ''}`}>
            <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
            {!isCollapsed && <span className="font-medium">Logout</span>}
          </button>
        </div>
      </aside>
    </>
  )
}
