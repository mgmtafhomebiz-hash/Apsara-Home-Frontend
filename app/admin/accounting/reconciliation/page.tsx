import { buildPageMetadata } from '@/app/seo';

export const metadata = buildPageMetadata({ title: 'Admin Accounting Reconciliation', description: 'Browse the Admin Accounting Reconciliation page on AF Home.', path: '/admin/accounting/reconciliation', noIndex: true });

import AccountingSectionPlaceholder from '@/components/superAdmin/accounting/AccountingSectionPlaceholder'

export default function AccountingReconciliationPage() {
  return (
    <AccountingSectionPlaceholder
      title="Reconciliation"
      description="Match payout records, invoice totals, and settlement entries for month-end reconciliation."
    />
  )
}