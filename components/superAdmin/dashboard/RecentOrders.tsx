'use client'

import { motion } from 'framer-motion'

const orders = [
  { id: '#ORD-0001', customer: 'Juan dela Cruz', date: 'Jan 10, 2026', amount: '₱ 2,500.00', status: 'Completed', method: 'E-Wallet' },
  { id: '#ORD-0002', customer: 'Maria Santos', date: 'Jan 10, 2026', amount: '₱ 1,200.00', status: 'Pending', method: 'GC' },
  { id: '#ORD-0003', customer: 'Pedro Reyes', date: 'Jan 9, 2026', amount: '₱ 4,800.00', status: 'Processing', method: 'E-Wallet' },
  { id: '#ORD-0004', customer: 'Ana Gomez', date: 'Jan 9, 2026', amount: '₱ 900.00', status: 'Cancelled', method: 'COD' },
  { id: '#ORD-0005', customer: 'Carlos Tan', date: 'Jan 8, 2026', amount: '₱ 3,150.00', status: 'Completed', method: 'GC' },
  { id: '#ORD-0006', customer: 'Linda Cruz', date: 'Jan 8, 2026', amount: '₱ 780.00', status: 'Unpaid', method: 'E-Wallet' },
]

const statusConfig: Record<string, { bg: string; text: string; dot: string }> = {
  Completed:  { bg: 'bg-teal-50 dark:bg-teal-500/10 border-teal-200 dark:border-teal-500/30',     text: 'text-teal-700 dark:text-teal-300',   dot: 'bg-teal-500' },
  Pending:    { bg: 'bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/30',  text: 'text-amber-700 dark:text-amber-300',  dot: 'bg-amber-400' },
  Processing: { bg: 'bg-blue-50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/30',     text: 'text-blue-700 dark:text-blue-300',   dot: 'bg-blue-500' },
  Cancelled:  { bg: 'bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/30',         text: 'text-red-600 dark:text-red-300',    dot: 'bg-red-500' },
  Unpaid:     { bg: 'bg-orange-50 dark:bg-orange-500/10 border-orange-200 dark:border-orange-500/30', text: 'text-orange-700 dark:text-orange-300', dot: 'bg-orange-400' },
  Returned:   { bg: 'bg-purple-50 dark:bg-purple-500/10 border-purple-200 dark:border-purple-500/30', text: 'text-purple-700 dark:text-purple-300', dot: 'bg-purple-500' },
  default:    { bg: 'bg-gray-50 dark:bg-gray-800/40 border-gray-200 dark:border-gray-700', text: 'text-gray-600 dark:text-gray-300', dot: 'bg-gray-400' },
}

function avatarColor(name: string) {
  const colors = [
    'from-teal-400 to-teal-600',
    'from-blue-400 to-blue-600',
    'from-purple-400 to-purple-600',
    'from-rose-400 to-rose-600',
    'from-amber-400 to-amber-600',
    'from-indigo-400 to-indigo-600',
  ]
  return colors[name.charCodeAt(0) % colors.length]
}

const RecentOrders = () => {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
      <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 px-6 py-4">
        <div>
          <h3 className="text-base font-semibold text-gray-800 dark:text-gray-100">Recent Orders</h3>
          <p className="mt-0.5 text-xs text-gray-400 dark:text-gray-500">Latest transactions</p>
        </div>
        <button className="text-xs font-semibold text-teal-500 hover:underline dark:text-teal-300">View all</button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-800/60">
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Order ID</th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Customer</th>
              <th className="hidden px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 md:table-cell">Date</th>
              <th className="hidden px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 sm:table-cell">Method</th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {orders.map((order, index) => {
              const cfg = statusConfig[order.status] ?? statusConfig['default']
              return (
                <motion.tr
                  key={order.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="cursor-pointer transition-colors hover:bg-gray-50/60 dark:hover:bg-gray-800/40"
                >
                  <td className="px-6 py-3.5">
                    <span className="font-mono text-xs font-semibold text-teal-600 dark:text-teal-300">{order.id}</span>
                  </td>
                  <td className="px-6 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <div className={`h-7 w-7 rounded-full bg-linear-to-br ${avatarColor(order.customer)} flex items-center justify-center shrink-0`}>
                        <span className="text-white text-[10px] font-bold">{order.customer[0]}</span>
                      </div>
                      <span className="whitespace-nowrap text-xs font-medium text-gray-700 dark:text-gray-200">{order.customer}</span>
                    </div>
                  </td>
                  <td className="px-6 py-3.5 hidden md:table-cell">
                    <span className="text-xs text-gray-500 dark:text-gray-400">{order.date}</span>
                  </td>
                  <td className="px-6 py-3.5 hidden sm:table-cell">
                    <span className="text-xs text-gray-500 dark:text-gray-400">{order.method}</span>
                  </td>
                  <td className="px-6 py-3.5">
                    <span className="text-xs font-semibold text-gray-800 dark:text-gray-100">{order.amount}</span>
                  </td>
                  <td className="px-6 py-3.5">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${cfg.bg} ${cfg.text}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot} shrink-0`} />
                      {order.status}
                    </span>
                  </td>
                </motion.tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default RecentOrders
