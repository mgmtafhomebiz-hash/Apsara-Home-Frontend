import { Fragment } from 'react'
import { Pagination } from '@heroui/react'

interface AdminPaginationProps {
  currentPage: number
  totalPages: number
  from?: number | null
  to?: number | null
  totalRecords: number
  onPageChange: (page: number) => void
}

const getPaginationPages = (currentPage: number, totalPages: number) => {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1)
  }

  const pages = new Set<number>([1, totalPages, currentPage, currentPage - 1, currentPage + 1])

  return Array.from(pages)
    .filter((page) => page >= 1 && page <= totalPages)
    .sort((first, second) => first - second)
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

  const paginationPages = getPaginationPages(currentPage, totalPages)

  return (
    <div className="border-t border-slate-100 bg-slate-50/40 dark:border-slate-800 dark:bg-slate-800/40">
      <Pagination size="sm" className="w-full justify-between gap-3 px-4 py-3">
        <Pagination.Summary>
          {(from ?? 0).toLocaleString()} to {(to ?? 0).toLocaleString()} of {totalRecords.toLocaleString()} results
        </Pagination.Summary>
        <Pagination.Content>
          <Pagination.Item>
            <Pagination.Previous
              isDisabled={currentPage === 1}
              onPress={() => onPageChange(Math.max(1, currentPage - 1))}
            >
              <Pagination.PreviousIcon />
              Prev
            </Pagination.Previous>
          </Pagination.Item>

          {paginationPages.map((page, index) => {
            const previousPage = paginationPages[index - 1]
            const shouldShowEllipsis = typeof previousPage === 'number' && page - previousPage > 1

            return (
              <Fragment key={`admin-pagination-${page}`}>
                {shouldShowEllipsis ? (
                  <Pagination.Item>
                    <Pagination.Ellipsis />
                  </Pagination.Item>
                ) : null}
                <Pagination.Item>
                  <Pagination.Link isActive={page === currentPage} onPress={() => onPageChange(page)}>
                    {page}
                  </Pagination.Link>
                </Pagination.Item>
              </Fragment>
            )
          })}

          <Pagination.Item>
            <Pagination.Next
              isDisabled={currentPage === totalPages}
              onPress={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            >
              Next
              <Pagination.NextIcon />
            </Pagination.Next>
          </Pagination.Item>
        </Pagination.Content>
      </Pagination>
    </div>
  )
}
