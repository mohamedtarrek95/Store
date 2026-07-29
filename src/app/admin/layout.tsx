import { AuthProvider } from '@/providers/AuthProvider';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';

export const metadata = {
  title: 'Admin Dashboard - Luxe Accessories',
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <AdminSidebar />
      <div className="lg:pl-72">
        <AdminHeader />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
