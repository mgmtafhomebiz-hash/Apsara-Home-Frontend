import { buildPageMetadata } from '@/app/seo';

export const metadata = buildPageMetadata({ title: 'Admin Accounting Settings', description: 'Browse the Admin Accounting Settings page on AF Home.', path: '/admin/accounting/settings', noIndex: true });

import AccountingSectionPlaceholder from '@/components/superAdmin/accounting/AccountingSectionPlaceholder'

export default function AccountingSettingsPage() {
  return (
    <AccountingSectionPlaceholder
      title="Accounting Settings"
      description="Configure payout thresholds, approval policies, and accounting workflow preferences."
    />
  )
}