'use client'

import { ReactNode } from 'react'

interface DataTableShellProps {
  title?: string
  subtitle?: string
  badge?: ReactNode
  actions?: ReactNode
  footer?: ReactNode
  children: ReactNode
  className?: string
}

export default function DataTableShell({
  title,
  subtitle,
  badge,
  actions,
  footer,
  children,
  className = '',
}: DataTableShellProps) {
  return (
    <section className={`overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 ${className}`}>
      {(title || subtitle || badge || actions) && (
        <div className="flex flex-col gap-3 border-b border-slate-200 bg-slate-50 px-5 py-4 dark:border-slate-800 dark:bg-slate-900 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            {badge ? (
              <div className="mb-2">{badge}</div>
            ) : null}
            {title ? <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">{title}</h3> : null}
            {subtitle ? <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{subtitle}</p> : null}
          </div>
          {actions ? <div className="flex shrink-0 items-center gap-2">{actions}</div> : null}
        </div>
      )}

      <div className="overflow-x-auto">
        {children}
      </div>

      {footer ? (
        <div className="border-t border-slate-100 px-5 py-3.5 text-xs text-slate-400 dark:border-slate-800 dark:text-slate-500">
          {footer}
        </div>
      ) : null}
    </section>
  )
}
