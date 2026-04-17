'use client'

import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'

const products = [
  { name: 'Modern Sofa Set',      category: 'Furniture',   sold: 142, revenue: '₱ 284,000', pct: 95 },
  { name: 'Smart TV 55"',         category: 'Electronics', sold: 98,  revenue: '₱ 196,000', pct: 72 },
  { name: 'Dining Table Oak',     category: 'Furniture',   sold: 87,  revenue: '₱ 130,500', pct: 60 },
  { name: 'Air Conditioner 1.5HP',category: 'Appliances',  sold: 74,  revenue: '₱ 222,000', pct: 52 },
  { name: 'Bed Frame Queen',      category: 'Furniture',   sold: 61,  revenue: '₱ 91,500',  pct: 43 },
]

const quickActions = [
  {
    label: 'Add Product',
    color: 'bg-teal-50 hover:bg-teal-100 text-teal-700 border border-teal-200 dark:bg-teal-500/10 dark:hover:bg-teal-500/15 dark:text-teal-300 dark:border-teal-500/25',
    icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>,
    href: '/admin/products?modal=add-product',
  },
  {
    label: 'New Order',
    color: 'bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 dark:bg-blue-500/10 dark:hover:bg-blue-500/15 dark:text-blue-300 dark:border-blue-500/25',
    icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>,
    href: '/admin/orders',
  },
  {
    label: 'Add Member',
    color: 'bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 dark:bg-purple-500/10 dark:hover:bg-purple-500/15 dark:text-purple-300 dark:border-purple-500/25',
    icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>,
    href: '/admin/members?modal=add-member',
  },
  {
    label: 'View Reports',
    color: 'bg-orange-50 hover:bg-orange-100 text-orange-700 border border-orange-200 dark:bg-orange-500/10 dark:hover:bg-orange-500/15 dark:text-orange-300 dark:border-orange-500/25',
    icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>,
    href: '/admin/reports/sales',
  },
]

const TopProducts = () => {
  const router = useRouter()

  return (
    <div className="space-y-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-200 dark:border-gray-700">
        <h3 className="text-gray-800 dark:text-gray-100 font-semibold text-sm mb-3">Quick Actions</h3>
        <div className="grid grid-cols-2 gap-2">
          {quickActions.map((action) => (
            <button
              key={action.label}
              onClick={() => router.push(action.href)}
              className={`${action.color} text-xs font-semibold px-3 py-2.5 rounded-xl flex items-center gap-2 transition-colors duration-200`}
            >
              {action.icon}
              {action.label}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-gray-800 dark:text-gray-100 font-semibold text-sm">Top Products</h3>
          <button className="text-xs text-teal-600 dark:text-teal-300 font-medium hover:underline">See all</button>
        </div>
        <div className="space-y-4">
          {products.map((product, index) => (
            <motion.div
              key={product.name}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.07 }}
            >
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-gray-300 dark:text-gray-500 w-4 shrink-0">{index + 1}</span>
                  <div className="min-w-0">
                    <p className="text-gray-700 dark:text-gray-100 text-xs font-semibold truncate">{product.name}</p>
                    <p className="text-gray-500 dark:text-gray-400 text-xs">{product.category}</p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-gray-700 dark:text-gray-100 text-xs font-semibold">{product.revenue}</p>
                  <p className="text-gray-500 dark:text-gray-400 text-xs">{product.sold} sold</p>
                </div>
              </div>
              <div className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${product.pct}%` }}
                  transition={{ delay: index * 0.07 + 0.2, duration: 0.6, ease: 'easeOut' }}
                  className="h-full bg-linear-to-r from-teal-400 to-teal-600 rounded-full"
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default TopProducts
