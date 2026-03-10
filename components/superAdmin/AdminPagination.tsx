interface AdminPaginationProps {
  currentPage: number
  totalPages: number
  from?: number | null
  to?: number | null
  totalRecords: number
  onPageChange: (page: number) => void
}

export default function AdminPagination({
  currentPage,
  totalPages,
  from,
  to,
  totalRecords,
  onPageChange,
}: AdminPaginationProps) {
  if (totalPages <= 1) return null

  const canGoPrev = currentPage > 1
  const canGoNext = currentPage < totalPages

  return (
    <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100 bg-slate-50/40">
      {/* Record range */}
      <p className="text-xs text-slate-500">
        Showing{' '}
        <span className="font-semibold text-slate-700">{(from ?? 0).toLocaleString()}</span>
        {' '}–{' '}
        <span className="font-semibold text-slate-700">{(to ?? 0).toLocaleString()}</span>
        {' '}of{' '}
        <span className="font-semibold text-slate-700">{totalRecords.toLocaleString()}</span>
      </p>

      {/* Controls */}
      <div className="flex items-center gap-1.5">
        {/* Prev */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={!canGoPrev}
          className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:border-slate-300 disabled:opacity-35 disabled:cursor-not-allowed transition-colors"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/>
          </svg>
          Prev
        </button>

        {/* Page indicator */}
        <span className="inline-flex items-center h-8 px-3 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-slate-700 select-none">
          {currentPage} <span className="mx-1.5 text-slate-300">/</span> {totalPages}
        </span>

        {/* Next */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={!canGoNext}
          className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg border border-teal-200 bg-white text-xs font-semibold text-teal-700 hover:bg-teal-50 hover:border-teal-300 disabled:opacity-35 disabled:cursor-not-allowed transition-colors"
        >
          Next
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
          </svg>
        </button>
      </div>
    </div>
  )
}
