'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { useCart } from '@/context/CartContext'
import { useAuth } from '@/context/AuthContext'

type NavLink = {
  label: string;
  href: string;
  dropdown?: string[]
  mega?: Record<string, string[]>
}

const navLinks: NavLink[] = [
  { label: 'Home', href: '/' },
  {
    label: 'Shop Category',
    href: '/shop',
    dropdown: [
      'Home & Living',
      'Appliances',
      'AF Properties',
      'Car and Motorcycles',
      'Home Essentials',
      'Services',
    ],
  },
  {
    label: 'Shop By Room',
    href: '/by-room',
    mega: {
      BEDROOM: [
        'Bed',
        'Kids Bed',
        'Easy Space Beds',
        'Upholstered Bed',
        'Mattress',
        'Pillow & Bolster',
        'Bed Rest Cushion',
        'Night Table',
        'Dresser Table',
        'Desk & Tables',
        'Cabinets',
        'Space Saving Cabinet and Shelf',
      ],
      KITCHEN: [
        'Rice Cooker',
        'Coffee Maker',
        'Oven & Toaster',
        'Pressure Cooker',
        'Grills and Surface Cooker',
        'Kettle and Water Dispenser',
        'Pots & Pans',
        'Knives and Accessories',
        'Kitchen Utensil',
        'Glassware',
        'Tea & Coffee Supplies',
      ],
      'LIVING ROOM': [
        'Sofas',
        'Leisure Chair',
        'Lounge Chair',
        'Chairs and Stools',
        'Ottoman',
        'Coffee Table',
        'Center Table',
        'TV Rack',
        'Cabinets',
        'Shelves',
        'Shoe Rack',
        'Desk & Tables',
      ],
      OUTDOOR: [
        'Garden Furniture',
        'Outdoor Lighting',
        'Patio Sets',
        'Storage Cabinets',
      ],
    },
  },
  { label: 'Shop By Brand', href: '/by-brand' },
  { label: 'Assembly Guides', href: '/assembly' },
  { label: 'Interior Services', href: '/interior' },
  {
    label: 'Media',
    href: '/media',
    dropdown: ['Photo Gallery', 'Video Gallery'],
  },
  { label: 'Blogs', href: '/blog' },
]

const roomIcons: Record<string, React.ReactNode> = {
  BEDROOM: (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 7v11a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V7"/><path d="M21 10H3V7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v3z"/><path d="M6 19v2"/><path d="M18 19v2"/></svg>
  ),
  KITCHEN: (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3zm0 0v7"/></svg>
  ),
  'LIVING ROOM': (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20 9V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v3"/><path d="M2 11v5a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-5a2 2 0 0 0-4 0v2H6v-2a2 2 0 0 0-4 0z"/><path d="M4 18v2"/><path d="M20 18v2"/></svg>
  ),
  OUTDOOR: (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M17 14h.01"/><path d="M7 7h12a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14"/><circle cx="12" cy="12" r="3"/><path d="m16 16 2 2"/></svg>
  ),
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const { cartCount, setIsOpen } = useCart()
  const { isLoggedIn } = useAuth()
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  const open = (label: string) => {
    if (closeTimer.current) clearTimeout(closeTimer.current)
    setActiveDropdown(label)
  }

  const close = () => {
    closeTimer.current = setTimeout(() => setActiveDropdown(null), 150)
  }

  const activeLink = navLinks.find((l) => l.label === activeDropdown)

  return (
    <motion.header
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={`sticky top-0 z-50 bg-white transition-all duration-300 ${scrolled ? 'shadow-lg shadow-black/5' : 'shadow-sm'}`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center shrink-0">
            <Image
              src="/Images/af_home_logo.png"
              alt="AF Home"
              width={120}
              height={40}
              className="h-10 w-auto object-contain"
              priority
            />
          </Link>

          {/* Search */}
          <div className="flex-1 max-w-xl hidden md:block">
            <div className="relative">
              <input
                type="text"
                placeholder="Search furniture, appliances..."
                className="w-full pl-4 pr-11 py-2.5 bg-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:bg-white transition-all duration-300 placeholder:text-gray-400"
              />
              <button className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-orange-500 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>
              </button>
            </div>
          </div>

          {/* Icons */}
          <div className="flex items-center gap-1">
            {/* User icon — always visible, goes to login if not logged in */}
            <Link href="/login" className="p-2 rounded-xl hover:bg-gray-100 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
            </Link>

            {/* Wishlist + Cart — only visible when logged in */}
            {isLoggedIn && (
              <>
                <button className="p-2 rounded-xl hover:bg-gray-100 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>
                </button>

                <button onClick={() => setIsOpen(true)} className="relative p-2 rounded-xl hover:bg-orange-50 transition-colors group">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="group-hover:text-orange-500 transition-colors"><circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" /><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" /></svg>
                  {cartCount > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1 -right-1 bg-orange-500 text-white text-[10px] font-bold min-w-4.5 h-4.5 rounded-full flex items-center justify-center px-1"
                    >
                      {cartCount}
                    </motion.span>
                  )}
                </button>
              </>
            )}

            <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2 rounded-xl hover:bg-gray-100 transition-colors ml-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                {mobileOpen
                  ? <><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></>
                  : <><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" /></>}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile search */}
        <div className="md:hidden pb-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search furniture, appliances..."
              className="w-full pl-4 pr-11 py-2.5 bg-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:bg-white transition-all duration-300 placeholder:text-gray-400"
            />
            <button className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-orange-500 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>
            </button>
          </div>
        </div>
      </div>

      {/* Desktop nav links */}
      <div className="hidden md:block border-t border-gray-100">
        <div className="container mx-auto px-4">
          <nav className="flex items-center h-11">
            {navLinks.map((link) => {
              const hasDropdown = link.dropdown || link.mega
              return (
                <div
                  key={link.label}
                  className="relative h-full"
                  onMouseEnter={() => hasDropdown && open(link.label)}
                  onMouseLeave={close}
                >
                  <Link
                    href={link.href}
                    className={`relative px-4 h-full flex items-center text-sm font-medium transition-colors duration-200 group ${
                      activeDropdown === link.label
                        ? 'text-orange-500'
                        : 'text-gray-600 hover:text-orange-500'
                    }`}
                  >
                    {link.label}
                    {hasDropdown && (
                      <motion.svg
                        animate={{ rotate: activeDropdown === link.label ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                        xmlns="http://www.w3.org/2000/svg"
                        width="11"
                        height="11"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        className="ml-1"
                      >
                        <polyline points="6 9 12 15 18 9" />
                      </motion.svg>
                    )}
                    <span className="absolute bottom-0 left-4 right-4 h-0.5 bg-orange-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                  </Link>
                </div>
              )
            })}
          </nav>
        </div>
      </div>

      {/* Desktop dropdown panels */}
      <AnimatePresence>
        {activeLink?.dropdown && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="absolute left-0 right-0 bg-white border-t border-gray-100 shadow-xl shadow-black/5 hidden md:block"
            onMouseEnter={() => open(activeLink.label)}
            onMouseLeave={close}
          >
            <div className="container mx-auto px-4 py-4">
              <div className="grid grid-cols-3 gap-1">
                {activeLink.dropdown.map((item) => (
                  <Link
                    key={item}
                    href={`${activeLink.href}/${item.toLowerCase().replace(/\s+/g, '-')}`}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-gray-600 hover:bg-orange-50 hover:text-orange-600 transition-all duration-200 group"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-300 group-hover:bg-orange-400 transition-colors" />
                    {item}
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {activeLink?.mega && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="absolute left-0 right-0 bg-white border-t border-gray-100 shadow-xl shadow-black/5 hidden md:block"
            onMouseEnter={() => open(activeLink.label)}
            onMouseLeave={close}
          >
            <div className="container mx-auto px-4 py-6">
              <div className="grid grid-cols-4 gap-8">
                {Object.entries(activeLink.mega).map(([room, items]) => (
                  <div key={room}>
                    <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-100">
                      <span className="text-orange-500">
                        {roomIcons[room]}
                      </span>
                      <h3 className="text-xs font-bold tracking-wider text-gray-800">
                        {room}
                      </h3>
                    </div>
                    <ul className="space-y-0.5">
                      {items.map((item) => (
                        <li key={item}>
                          <Link
                            href={`/by-room/${room.toLowerCase().replace(/\s+/g, '-')}/${item.toLowerCase().replace(/\s+/g, '-')}`}
                            className="block px-2 py-1.5 rounded-lg text-sm text-gray-500 hover:text-orange-600 hover:bg-orange-50/60 transition-all duration-150"
                          >
                            {item}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="md:hidden border-t border-gray-100 bg-white max-h-[70vh] overflow-y-auto"
          >
            <nav className="container mx-auto px-4 py-3 flex flex-col gap-0.5">
              {navLinks.map((link) => {
                const hasChildren = link.dropdown || link.mega
                const isExpanded = mobileExpanded === link.label

                const subItems = link.dropdown
                  ? link.dropdown.map((item) => ({ label: item, href: `${link.href}/${item.toLowerCase().replace(/\s+/g, '-')}` }))
                  : link.mega
                    ? Object.entries(link.mega).flatMap(([room, items]) => [
                        { label: room, href: '', isHeader: true },
                        ...items.map((item) => ({ label: item, href: `/by-room/${room.toLowerCase().replace(/\s+/g, '-')}/${item.toLowerCase().replace(/\s+/g, '-')}` })),
                      ])
                    : []

                return (
                  <div key={link.label}>
                    {hasChildren ? (
                      <button
                        onClick={() =>
                          setMobileExpanded(isExpanded ? null : link.label)
                        }
                        className="w-full flex items-center justify-between px-4 py-2.5 text-sm font-medium text-gray-700 hover:text-orange-500 hover:bg-orange-50 rounded-xl transition-colors"
                      >
                        {link.label}
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          className={`transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                        >
                          <polyline points="6 9 12 15 18 9" />
                        </svg>
                      </button>
                    ) : (
                      <Link
                        href={link.href}
                        className="block px-4 py-2.5 text-sm font-medium text-gray-700 hover:text-orange-500 hover:bg-orange-50 rounded-xl transition-colors"
                        onClick={() => setMobileOpen(false)}
                      >
                        {link.label}
                      </Link>
                    )}

                    {/* Mobile sub-items with grid animation */}
                    <div
                      className="grid transition-[grid-template-rows] duration-300 ease-out"
                      style={{ gridTemplateRows: isExpanded ? '1fr' : '0fr' }}
                    >
                      <div className="overflow-hidden">
                        <div className="ml-4 pl-4 border-l-2 border-orange-200 py-1">
                          {subItems.map((item, i) =>
                            'isHeader' in item && item.isHeader ? (
                              <p
                                key={item.label}
                                className={`px-3 py-1.5 text-xs font-bold tracking-wider text-orange-500 ${i > 0 ? 'mt-2' : ''}`}
                              >
                                {item.label}
                              </p>
                            ) : (
                              <Link
                                key={item.label}
                                href={item.href}
                                className="block px-3 py-1.5 text-sm text-gray-500 hover:text-orange-500 rounded-lg transition-colors"
                                onClick={() => setMobileOpen(false)}
                              >
                                {item.label}
                              </Link>
                            )
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
