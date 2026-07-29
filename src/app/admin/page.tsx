'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Package, ShoppingCart, Users, DollarSign, Clock, AlertTriangle,
  PlusCircle, ListOrdered, Tags, Settings, TrendingUp, TrendingDown,
} from 'lucide-react';
import StatCard from '@/components/admin/StatCard';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { formatPrice } from '@/lib/utils';

interface DashboardStats {
  totalProducts: number;
  totalOrders: number;
  totalCustomers: number;
  totalRevenue: number;
  pendingOrders: number;
}

interface RecentOrder {
  _id: string;
  orderNumber: string;
  user: { name: string; email: string };
  status: string;
  total: number;
  createdAt: string;
}

interface LowStockProduct {
  _id: string;
  name: string;
  sku: string;
  stock: number;
  featuredImage: string;
}

const stagger = {
  animate: {
    transition: { staggerChildren: 0.08 },
  },
};

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] as const } },
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [lowStock, setLowStock] = useState<LowStockProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [productsRes, ordersRes, customersRes] = await Promise.all([
        fetch('/api/products?limit=100'),
        fetch('/api/orders'),
        fetch('/api/customers'),
      ]);
      const productsData = await productsRes.json();
      const orders = await ordersRes.json();
      const customers = await customersRes.json();

      const products = productsData.products || productsData || [];
      const totalRevenue = orders.reduce(
        (sum: number, o: any) => (o.status !== 'cancelled' ? sum + o.total : sum),
        0
      );
      const pendingOrders = orders.filter((o: any) => o.status === 'pending').length;
      const lowStockItems = products.filter((p: any) => p.stock < 10);
      const sortedOrders = [...orders]
        .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5);

      setStats({
        totalProducts: products.length,
        totalOrders: orders.length,
        totalCustomers: customers.length,
        totalRevenue,
        pendingOrders,
      });
      setRecentOrders(sortedOrders);
      setLowStock(lowStockItems);
    } catch (error) {
      console.error('Failed to fetch dashboard data', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { title: 'Total Products', value: stats?.totalProducts ?? 0, icon: Package, trend: 12, color: 'blue' },
    { title: 'Total Orders', value: stats?.totalOrders ?? 0, icon: ShoppingCart, trend: 8, color: 'green' },
    { title: 'Total Customers', value: stats?.totalCustomers ?? 0, icon: Users, trend: 5, color: 'purple' },
    { title: 'Total Revenue', value: `$${(stats?.totalRevenue ?? 0).toLocaleString()}`, icon: DollarSign, trend: 15, color: 'orange' },
    { title: 'Pending Orders', value: stats?.pendingOrders ?? 0, icon: Clock, trend: -3, color: 'red' },
  ];

  const statusColor: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    processing: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    shipped: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
    delivered: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    cancelled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
  };

  const quickActions = [
    { label: 'Add Product', href: '/admin/products/new', icon: PlusCircle, color: 'text-blue-600 dark:text-blue-400' },
    { label: 'View Orders', href: '/admin/orders', icon: ListOrdered, color: 'text-green-600 dark:text-green-400' },
    { label: 'Manage Categories', href: '/admin/categories', icon: Tags, color: 'text-purple-600 dark:text-purple-400' },
    { label: 'Settings', href: '/admin/settings', icon: Settings, color: 'text-gray-600 dark:text-gray-400' },
  ];

  const SkeletonRow = () => (
    <div className="flex items-center gap-3 py-3">
      <Skeleton className="h-8 w-8 rounded" />
      <div className="flex-1 space-y-1.5">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-3 w-20" />
      </div>
      <Skeleton className="h-5 w-16 rounded-full" />
      <Skeleton className="h-4 w-20" />
    </div>
  );

  return (
    <motion.div initial="initial" animate="animate" variants={stagger} className="space-y-6">
      <div>
        <motion.h1 variants={fadeUp} className="text-3xl font-bold tracking-tight">
          Dashboard
        </motion.h1>
        <motion.p variants={fadeUp} className="text-muted-foreground mt-1">
          Overview of your store performance
        </motion.p>
      </div>

      <motion.div
        variants={fadeUp}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4"
      >
        {statCards.map((card, i) => (
          <motion.div
            key={card.title}
            variants={fadeUp}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
          >
            <StatCard {...card} loading={loading} />
          </motion.div>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div variants={fadeUp} className="lg:col-span-2">
          <div className="rounded-xl border bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl shadow-sm">
            <div className="flex items-center justify-between p-6 pb-4 border-b">
              <div>
                <h2 className="text-lg font-semibold">Recent Orders</h2>
                <p className="text-sm text-muted-foreground">Latest 5 orders</p>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link href="/admin/orders">View All</Link>
              </Button>
            </div>
            <div className="p-6">
              {loading ? (
                <div className="space-y-1">
                  {Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)}
                </div>
              ) : recentOrders.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
                  <ShoppingCart className="h-10 w-10 mb-3 opacity-40" />
                  <p className="text-sm">No orders yet</p>
                </div>
              ) : (
                <div className="divide-y">
                  {recentOrders.map((order, i) => (
                    <motion.div
                      key={order._id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="flex items-center gap-3 py-3 first:pt-0 last:pb-0"
                    >
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary text-xs font-bold">
                        {order.orderNumber?.slice(-3)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {order.orderNumber}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {order.user?.name || 'Unknown'} &middot;{' '}
                          {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColor[order.status] || 'bg-gray-100 text-gray-800'}`}
                      >
                        {order.status}
                      </span>
                      <span className="text-sm font-semibold min-w-[70px] text-right">
                        {formatPrice(order.total)}
                      </span>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </motion.div>

        <motion.div variants={fadeUp} className="space-y-6">
          <div className="rounded-xl border bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl shadow-sm">
            <div className="flex items-center justify-between p-6 pb-4 border-b">
              <div>
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-amber-500" />
                  Low Stock
                </h2>
                <p className="text-sm text-muted-foreground">Stock below 10</p>
              </div>
            </div>
            <div className="p-6">
              {loading ? (
                <div className="space-y-1">
                  {Array.from({ length: 4 }).map((_, i) => <SkeletonRow key={i} />)}
                </div>
              ) : lowStock.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
                  <Package className="h-10 w-10 mb-3 opacity-40" />
                  <p className="text-sm">All products well stocked</p>
                </div>
              ) : (
                <div className="divide-y">
                  {lowStock.slice(0, 5).map((product, i) => (
                    <motion.div
                      key={product._id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="flex items-center gap-3 py-3 first:pt-0 last:pb-0"
                    >
                      <img
                        src={product.featuredImage}
                        alt={product.name}
                        className="h-9 w-9 rounded-lg object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            'https://placehold.co/36x36?text=N/A';
                        }}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{product.name}</p>
                        <p className="text-xs text-muted-foreground">SKU: {product.sku}</p>
                      </div>
                      <span
                        className={`text-sm font-bold ${
                          product.stock <= 3
                            ? 'text-red-600 dark:text-red-400'
                            : 'text-amber-600 dark:text-amber-400'
                        }`}
                      >
                        {product.stock}
                      </span>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="rounded-xl border bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-3">
              {quickActions.map((action) => (
                <Link key={action.label} href={action.href}>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center gap-3 rounded-lg border p-3 transition-colors hover:bg-accent cursor-pointer"
                  >
                    <action.icon className={`h-5 w-5 ${action.color}`} />
                    <span className="text-sm font-medium">{action.label}</span>
                  </motion.div>
                </Link>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
