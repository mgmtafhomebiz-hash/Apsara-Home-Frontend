'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function CustomerServiceButton() {
  const [isOpen, setIsOpen] = useState(false)

  const contactOptions = [
    {
      label: 'WhatsApp',
      href: 'https://wa.me/+639123456789',
      icon: (
        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.67-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421-7.403h-.004a9.87 9.87 0 00-4.781 1.226l-.341.205-3.522-.922.94 3.6-.235.364a9.864 9.864 0 001.516 5.898c.327.459.756.899 1.26 1.296 1.944 1.561 4.518 2.447 7.181 2.447 1.968 0 3.829-.408 5.555-1.221 1.635-.78 3.072-1.988 4.147-3.496 1.148-1.674 1.793-3.635 1.793-5.768 0-4.444-3.545-8.049-7.937-8.049-.968 0-1.9.154-2.79.45" />
        </svg>
      ),
    },
    {
      label: 'Email',
      href: 'mailto:support@afhome.biz',
      icon: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      label: 'Phone',
      href: 'tel:+6328400290',
      icon: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 00.948.684l1.498 7.487a1 1 0 00.502.756l2.048 1.029a11.04 11.04 0 005.514-5.514l1.029-2.048a1 1 0 00.756-.502l7.487-1.498a1 1 0 00.684-.948V5a2 2 0 00-2-2h-2.28a2 2 0 00-1.897 1.368l-1.946 5.838A2 2 0 006.92 15.07l-2.04-1.024a11.04 11.04 0 005.514-5.514l1.029-2.048A1 1 0 0010.28 5H5a2 2 0 00-2 2z" />
        </svg>
      ),
    },
    {
      label: 'Live Chat',
      href: '/contact',
      icon: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      ),
    },
  ]

  const handleContactClick = (href: string, label: string) => {
    setIsOpen(false)
    if (label === 'Live Chat') {
      window.location.href = href
    } else {
      window.open(href, '_blank', 'noopener,noreferrer')
    }
  }

  return (
    <>
      {/* Main Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-[100] flex h-12 w-12 items-center justify-center rounded-full bg-orange-500 dark:bg-orange-600 text-white border border-orange-600 dark:border-orange-700 transition-all duration-200"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        title="Customer Service"
      >
        <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      </motion.button>

      {/* Modal Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[99] bg-black/30 dark:bg-black/50"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-6 z-[99] w-80 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-2xl dark:shadow-black/50 overflow-hidden"
          >
            {/* Header */}
            <div className="border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-orange-50 to-white dark:from-orange-950/20 dark:to-gray-800 px-5 py-4 flex items-start justify-between">
              <div>
                <p className="text-sm font-bold text-gray-900 dark:text-white">How can we help?</p>
                <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">Choose your preferred contact method</p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="ml-4 flex-shrink-0 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                aria-label="Close"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Contact Options */}
            <div className="divide-y divide-gray-100 dark:divide-gray-700">
              {contactOptions.map((option) => (
                <button
                  key={option.label}
                  onClick={() => handleContactClick(option.href, option.label)}
                  className="w-full group flex items-center gap-3 px-5 py-4 transition-colors hover:bg-orange-50 dark:hover:bg-orange-900/20 text-left"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 transition-colors group-hover:bg-orange-200 dark:group-hover:bg-orange-900/50 shrink-0">
                    {option.icon}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      {option.label}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {option.label === 'WhatsApp' && 'Chat with us'}
                      {option.label === 'Email' && 'support@afhome.biz'}
                      {option.label === 'Phone' && '+63 (2) 8400-290'}
                      {option.label === 'Live Chat' && 'Start chatting'}
                    </p>
                  </div>
                  <svg className="h-4 w-4 shrink-0 text-gray-400 dark:text-gray-500 transition-transform group-hover:translate-x-1">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" fill="none" stroke="currentColor" />
                  </svg>
                </button>
              ))}
            </div>

            {/* Footer */}
            <div className="border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 px-5 py-3">
              <p className="text-center text-[11px] text-gray-500 dark:text-gray-500">
                Available 24/7 · Response within 2 hours
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
