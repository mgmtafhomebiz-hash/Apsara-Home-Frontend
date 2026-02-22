'use client';

import { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const data = [
    { name: 'Completed', value: 400, color: '#14b8a6' },
    { name: 'Pending', value: 120, color: '#f59e0b' },
    { name: 'Unpaid', value: 80, color: '#3b82f6' },
    { name: 'Cancelled', value: 45, color: '#f97316' },
    { name: 'Returned', value: 30, color: '#ef4444' },
    { name: 'Broken', value: 15, color: '#8b5cf6' },
]

const total = data.reduce((acc, d) => acc + d.value, 0)
const OrdersChart = () => {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) return <div className='bg-white rounded-2xl p-6 h-[380px] animate-pulse border border-slate-100' />
    return (
       <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-slate-800 font-semibold text-base">Orders Overview</h3>
          <p className="text-slate-400 text-xs mt-0.5">Total: {total} orders</p>
        </div>
        <button className="flex items-center gap-1.5 text-xs text-teal-600 font-medium hover:underline">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
          Download
        </button>
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie data={data} cx="50%" cy="50%" innerRadius={60} outerRadius={90} dataKey="value" paddingAngle={3}>
            {data.map((entry, i) => <Cell key={i} fill={entry.color} />)}
          </Pie>
          <Tooltip formatter={(value) => [`${value} orders`]} contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '12px' }} />
        </PieChart>
      </ResponsiveContainer>
      <div className="grid grid-cols-2 gap-2 mt-4">
        {data.map((item) => (
          <div key={item.name} className="flex items-center gap-2">
            <div className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
            <span className="text-xs text-slate-500 truncate">{item.name}</span>
            <span className="text-xs font-semibold text-slate-700 ml-auto">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
    )
}

export default OrdersChart
