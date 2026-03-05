import { buildPageMetadata } from '@/app/seo';

export const metadata = buildPageMetadata({ title: 'Admin Accounting Reports', description: 'Browse the Admin Accounting Reports page on AF Home.', path: '/admin/accounting/reports', noIndex: true });

import AccountingSectionPlaceholder from '@/components/superAdmin/accounting/AccountingSectionPlaceholder'

export default function AccountingReportsPage() {
  return (
    <AccountingSectionPlaceholder
      title="Accounting Reports"
      description="Generate payout summary reports, queue aging reports, and exception analytics."
    />
  )
}