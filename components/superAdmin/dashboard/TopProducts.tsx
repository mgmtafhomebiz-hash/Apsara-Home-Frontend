'use client';

import { motion } from "framer-motion";

const products = [
  { name: 'Modern Sofa Set', category: 'Furniture', sold: 142, revenue: '₱ 284,000', pct: 95 },
  { name: 'Smart TV 55"', category: 'Electronics', sold: 98, revenue: '₱ 196,000', pct: 72 },
  { name: 'Dining Table Oak', category: 'Furniture', sold: 87, revenue: '₱ 130,500', pct: 60 },
  { name: 'Air Conditioner 1.5HP', category: 'Appliances', sold: 74, revenue: '₱ 222,000', pct: 52 },
  { name: 'Bed Frame Queen', category: 'Furniture', sold: 61, revenue: '₱ 91,500', pct: 43 },
]

const quickActions = [
  { label: 'Add Product', color: 'bg-teal-500 hover:bg-teal-600', icon: '＋' },
  { label: 'New Order', color: 'bg-blue-500 hover:bg-blue-600', icon: '📦' },
  { label: 'Add Member', color: 'bg-purple-500 hover:bg-purple-600', icon: '👤' },
  { label: 'View Reports', color: 'bg-orange-500 hover:bg-orange-600', icon: '📊' },
]

const TopProducts = () => {
  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
        <h3 className="text-slate-800 font-semibold text-sm mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 gap-2 ">
            {quickActions.map((action) => (
                <button 
                    key={action.label}
                    className={`${action.color} text-white text-xs font-semibold px-3 py-2.5 rounded-xl flex items-center gap-2 transition-colors duration-200`}
                >
                    <span>{action.icon}</span>
                    {action.label}
                </button>
            ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
        <div className="flex items-center justify-between mb-4">
            <h3 className="text-slate-800 font-semibold text-sm">
                Top Products
            </h3>
            <button className="text-xs text-teal-600 font-medium hover:underline">See all</button>
        </div>
        <div className="space-y-4">
            {products.map((product, index) => (
                <motion.div
                    key={product.name}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.88}}

                >
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                        <div className="flex items-center gap-2 mb-1.5">
                            <span className="text-xs font-bold text-slate-300 w-4 shrink-0">{ index + 1}</span>
                            <div className="min-w-0">
                                <p className="text-slate-700 text-xs font-semibold truncate">{product.name}</p>
                                <p className="text-slate-400 text-xs">{product.category}</p>
                            </div>
                        </div>
                        <div className="text-right shrink-0">
                            <p className="text-slate-700 text-xs font-semibold">{product.revenue}</p>
                            <p className="text-slate-400 text-xs">{product.sold} sold</p>
                        </div>
                    </div>

                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${product.pct}`}}
                            transition={{ delay: index * + 0.3, duration: 0.6, ease: 'easeOut'}}
                            className="h-full bg-gradient-to-r from-teal-400 to-teal-600 rounded-full"
                        >

                        </motion.div>
                    </div>
                </motion.div>
            ))}
        </div>
      </div>
    </div>
  )
}

export default TopProducts
