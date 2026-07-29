'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { OrderType } from '@/types';
import { formatPrice } from '@/lib/utils';
import { Package, ArrowLeft } from 'lucide-react';

const statusColors: Record<string, string> = {
  pending: 'bg-amber-50 text-amber-700 border-amber-200',
  processing: 'bg-blue-50 text-blue-700 border-blue-200',
  shipped: 'bg-purple-50 text-purple-700 border-purple-200',
  delivered: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  cancelled: 'bg-red-50 text-red-700 border-red-200',
};

export default function OrdersPage() {
  const { data: session } = useSession();
  const [orders, setOrders] = useState<OrderType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session) {
      setLoading(false);
      return;
    }
    fetch('/api/orders')
      .then((res) => res.json())
      .then((data) => setOrders(data.orders || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [session]);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (!session) {
    return (
      <div className="container mx-auto flex flex-col items-center justify-center px-4 py-24">
        <div className="rounded-full bg-muted p-8">
          <Package className="h-16 w-16 text-muted-foreground/40" />
        </div>
        <h2 className="mt-4 font-[family-name:var(--font-heading)] text-3xl font-bold">Sign in to view your orders</h2>
        <Link href="/login" className="mt-8 inline-flex h-12 items-center rounded-xl bg-foreground px-8 text-sm font-medium text-background transition-all hover:opacity-90">
          Sign In
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 space-y-4">
        <div className="h-8 w-48 animate-pulse rounded bg-muted" />
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-28 w-full animate-pulse rounded-2xl bg-muted" />
        ))}
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="container mx-auto flex flex-col items-center justify-center px-4 py-24">
        <div className="rounded-full bg-muted p-8">
          <Package className="h-16 w-16 text-muted-foreground/40" />
        </div>
        <h2 className="mt-4 font-[family-name:var(--font-heading)] text-3xl font-bold">No orders yet</h2>
        <p className="mt-2 text-muted-foreground">When you place an order, it will appear here.</p>
        <Link href="/products" className="mt-8 inline-flex h-12 items-center gap-2 rounded-xl bg-foreground px-8 text-sm font-medium text-background transition-all hover:opacity-90">
          <ArrowLeft className="h-4 w-4" />
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="font-[family-name:var(--font-heading)] text-3xl font-bold tracking-tight sm:text-4xl">
          My Orders
        </h1>
        <p className="mt-1 text-muted-foreground">Manage and track your orders</p>
      </div>

      <div className="space-y-4">
        {orders.map((order) => (
          <Link
            key={order._id}
            href={`/orders/${order._id}`}
            className="block rounded-2xl border p-5 transition-all duration-200 hover:bg-accent/30 hover:shadow-sm sm:p-6"
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-1.5">
                <div className="flex items-center gap-3">
                  <span className="font-semibold">#{order._id.slice(-8).toUpperCase()}</span>
                  <span className={`inline-flex rounded-full border px-3 py-0.5 text-xs font-medium ${statusColors[order.status] || 'bg-muted text-muted-foreground border-border'}`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Placed on {formatDate(order.createdAt)}
                </p>
                <p className="text-sm text-muted-foreground">
                  {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-xl font-bold">{formatPrice(order.total)}</span>
                <span className={`inline-flex rounded-full border px-3 py-0.5 text-xs font-medium ${
                  order.paymentStatus === 'paid' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                  order.paymentStatus === 'pending' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                  'bg-red-50 text-red-700 border-red-200'
                }`}>
                  {order.paymentStatus === 'paid' ? 'Paid' : order.paymentStatus === 'pending' ? 'Pending' : 'Failed'}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
