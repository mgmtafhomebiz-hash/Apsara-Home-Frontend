'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import TopBar from '@/components/layout/TopBar'
import Navbar from '@/components/layout/Navbar'
import type { Category } from '@/store/api/categoriesApi'

interface ProductPageWrapperProps {
  children: React.ReactNode
  initialCategories?: Category[]
}

export default function ProductPageWrapper({
  children,
  initialCategories = [],
}: ProductPageWrapperProps) {
  const [showBars, setShowBars] = useState(true)
  const [isAtTop, setIsAtTop] = useState(true)
  const lastScrollYRef = useRef(0)

  useEffect(() => {
    let scrollTimeout: NodeJS.Timeout

    const handleScroll = () => {
      clearTimeout(scrollTimeout)

      const currentScrollY = window.scrollY
      const scrollDirection = currentScrollY > lastScrollYRef.current ? 'down' : 'up'

      // Show bars when at the top or scrolling up
      if (currentScrollY < 100) {
        setShowBars(true)
        setIsAtTop(true)
      } else if (scrollDirection === 'up') {
        setShowBars(true)
        setIsAtTop(false)
      } else {
        setShowBars(false)
        setIsAtTop(false)
      }

      lastScrollYRef.current = currentScrollY

      // Hide bars again after scrolling stops (for down direction)
      scrollTimeout = setTimeout(() => {
        if (currentScrollY > 100 && scrollDirection === 'down') {
          setShowBars(false)
        }
      }, 300)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', handleScroll)
      clearTimeout(scrollTimeout)
    }
  }, [])

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <AnimatePresence mode="popLayout">
        {showBars && (
          <motion.div
            key="topbar-navbar"
            initial={{ opacity: 0, y: -60 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -60 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="relative z-[55]"
          >
            <TopBar />
            <Navbar initialCategories={initialCategories} />
          </motion.div>
        )}
      </AnimatePresence>

      {children}
    </div>
  )
}
