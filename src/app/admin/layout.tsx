import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';

export const metadata = {
  title: 'Admin Dashboard - Luxe Accessories',
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  if (!session?.user) {
    redirect('/login');
  }

  if (!(session.user as any).isAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-muted-foreground">403</h1>
          <p className="mt-2 text-lg">Admin access required</p>
          <p className="text-sm text-muted-foreground mt-1">You do not have permission to access this area.</p>
        </div>
      </div>
    );
  }

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
