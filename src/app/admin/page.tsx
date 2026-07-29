'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Package, ShoppingCart, Users, DollarSign } from 'lucide-react';
import StatCard from '@/components/admin/StatCard';

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [productsRes, ordersRes, customersRes] = await Promise.all([
        fetch('/api/products?limit=1'),
        fetch('/api/orders'),
        fetch('/api/customers'),
      ]);
      const products = await productsRes.json();
      const orders = await ordersRes.json();
      const customers = await customersRes.json();

      const totalRevenue = orders.reduce((sum: number, o: any) =>
        o.status !== 'cancelled' ? sum + o.total : sum, 0
      );
      const pendingOrders = orders.filter((o: any) => o.status === 'pending').length;

      setStats({
        totalProducts: products.total || 0,
        totalOrders: orders.length,
        totalCustomers: customers.length,
        totalRevenue,
        pendingOrders,
      });
    } catch (error) {
      console.error('Failed to fetch stats', error);
    } finally {
      setLoading(false);
    }
  };

  const cards = [
    { title: 'Total Products', value: stats?.totalProducts || 0, icon: Package, trend: 12, color: 'blue' },
    { title: 'Total Orders', value: stats?.totalOrders || 0, icon: ShoppingCart, trend: 8, color: 'green' },
    { title: 'Total Customers', value: stats?.totalCustomers || 0, icon: Users, trend: 5, color: 'purple' },
    { title: 'Total Revenue', value: `$${(stats?.totalRevenue || 0).toLocaleString()}`, icon: DollarSign, trend: 15, color: 'orange' },
    { title: 'Pending Orders', value: stats?.pendingOrders || 0, icon: ShoppingCart, trend: -3, color: 'red' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {cards.map((card, index) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <StatCard {...card} loading={loading} />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
