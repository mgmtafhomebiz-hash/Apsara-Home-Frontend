import { buildPageMetadata } from '@/app/seo';

export const metadata = buildPageMetadata({ title: 'Admin Accounting Invoices', description: 'Browse the Admin Accounting Invoices page on AF Home.', path: '/admin/accounting/invoices', noIndex: true });

import InvoicesPageMain from '@/components/superAdmin/accounting/InvoicesPageMain'

export default function AccountingInvoicesPage() {
  return <InvoicesPageMain />
}