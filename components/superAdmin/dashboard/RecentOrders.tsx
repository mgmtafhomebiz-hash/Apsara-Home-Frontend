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
  Completed:  { bg: 'bg-teal-50',   text: 'text-teal-700',   dot: 'bg-teal-500' },
  Pending:    { bg: 'bg-amber-50',  text: 'text-amber-700',  dot: 'bg-amber-400' },
  Processing: { bg: 'bg-blue-50',   text: 'text-blue-700',   dot: 'bg-blue-500' },
  Cancelled:  { bg: 'bg-red-50',    text: 'text-red-600',    dot: 'bg-red-500' },
  Unpaid:     { bg: 'bg-orange-50', text: 'text-orange-700', dot: 'bg-orange-400' },
  Returned:   { bg: 'bg-purple-50', text: 'text-purple-700', dot: 'bg-purple-500' },
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
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
        <div>
          <h3 className="text-slate-800 font-semibold text-base">Recent Orders</h3>
          <p className="text-slate-400 text-xs mt-0.5">Latest transactions</p>
        </div>
        <button className="text-xs text-teal-500 font-semibold hover:underline">View all</button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50">
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Order ID</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Customer</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider hidden md:table-cell">Date</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider hidden sm:table-cell">Method</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {orders.map((order, index) => {
              const cfg = statusConfig[order.status] ?? { bg: 'bg-slate-50', text: 'text-slate-600', dot: 'bg-slate-400' }
              return (
                <motion.tr
                  key={order.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-slate-50/60 transition-colors cursor-pointer"
                >
                  <td className="px-6 py-3.5">
                    <span className="font-mono text-xs font-semibold text-teal-600">{order.id}</span>
                  </td>
                  <td className="px-6 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <div className={`h-7 w-7 rounded-full bg-linear-to-br ${avatarColor(order.customer)} flex items-center justify-center shrink-0`}>
                        <span className="text-white text-[10px] font-bold">{order.customer[0]}</span>
                      </div>
                      <span className="text-slate-700 font-medium text-xs whitespace-nowrap">{order.customer}</span>
                    </div>
                  </td>
                  <td className="px-6 py-3.5 hidden md:table-cell">
                    <span className="text-slate-500 text-xs">{order.date}</span>
                  </td>
                  <td className="px-6 py-3.5 hidden sm:table-cell">
                    <span className="text-slate-500 text-xs">{order.method}</span>
                  </td>
                  <td className="px-6 py-3.5">
                    <span className="text-slate-800 font-semibold text-xs">{order.amount}</span>
                  </td>
                  <td className="px-6 py-3.5">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${cfg.bg} ${cfg.text} border-transparent`}>
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
