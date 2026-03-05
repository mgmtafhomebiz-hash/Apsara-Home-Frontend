import { buildPageMetadata } from '@/app/seo';

export const metadata = buildPageMetadata({ title: 'Admin Accounting Audit', description: 'Browse the Admin Accounting Audit page on AF Home.', path: '/admin/accounting/audit', noIndex: true });

import AccountingSectionPlaceholder from '@/components/superAdmin/accounting/AccountingSectionPlaceholder'

export default function AccountingAuditTrailPage() {
  return (
    <AccountingSectionPlaceholder
      title="Audit Trail"
      description="Review approval, rejection, and release activity logs for governance and compliance."
    />
  )
}