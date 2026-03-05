import { buildPageMetadata } from '@/app/seo';

export const metadata = buildPageMetadata({ title: 'Admin Accounting Disbursement History', description: 'Browse the Admin Accounting Disbursement History page on AF Home.', path: '/admin/accounting/disbursement-history', noIndex: true });

import AccountingSectionPlaceholder from '@/components/superAdmin/accounting/AccountingSectionPlaceholder'

export default function AccountingDisbursementHistoryPage() {
  return (
    <AccountingSectionPlaceholder
      title="Disbursement History"
      description="Track completed payout releases, references, invoice numbers, and payout channels."
    />
  )
}