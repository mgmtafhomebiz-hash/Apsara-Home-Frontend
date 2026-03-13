import DashboardPageRouter from "@/components/superAdmin/dashboard/DashboardPageRouter";
import { buildPageMetadata } from '@/app/seo';

export const metadata = buildPageMetadata({ title: 'Admin Dashboard', description: 'Browse the Admin Dashboard page on AF Home.', path: '/admin/dashboard', noIndex: true });

const AdminDashboardPage = () => {
  return <DashboardPageRouter />;
};

export default AdminDashboardPage;
