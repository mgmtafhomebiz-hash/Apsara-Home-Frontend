'use client'

interface ProductsToolbarProps {
  search: string
  onSearch: (v: string) => void
  status: string
  onStatus: (v: string) => void
  resultCount: number
}

export default function ProductsToolbar({
  search, onSearch, status, onStatus, resultCount,
}: ProductsToolbarProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-4 flex flex-col sm:flex-row gap-3">
      {/* Search */}
      <div className="relative flex-1">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 105 11a6 6 0 0012 0z"/>
        </svg>
        <input
          type="text"
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          placeholder="Search by name or SKU..."
          className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-400 transition-all"
        />
      </div>

      {/* Status filter */}
      <select
        value={status}
        onChange={(e) => onStatus(e.target.value)}
        className="px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-400 transition-all cursor-pointer"
      >
        <option value="">All Status</option>
        <option value="1">Active</option>
        <option value="0">Inactive</option>
      </select>

      {/* Count */}
      <div className="flex items-center px-3 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-sm text-slate-500 whitespace-nowrap">
        <span className="font-semibold text-slate-700 mr-1">{resultCount.toLocaleString()}</span> products
      </div>
    </div>
  )
}
