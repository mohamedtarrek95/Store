'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { OrderType } from '@/types';
import { formatPrice } from '@/lib/utils';
import { ArrowLeft, Package, CheckCircle2, Truck, Clock, XCircle } from 'lucide-react';

const statusSteps = [
  { key: 'pending', label: 'Order Placed', icon: Clock },
  { key: 'processing', label: 'Processing', icon: Package },
  { key: 'shipped', label: 'Shipped', icon: Truck },
  { key: 'delivered', label: 'Delivered', icon: CheckCircle2 },
  { key: 'cancelled', label: 'Cancelled', icon: XCircle },
];

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data: session } = useSession();
  const [order, setOrder] = useState<OrderType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session) {
      setLoading(false);
      return;
    }
    fetch(`/api/orders/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error('Order not found');
        return res.json();
      })
      .then((data) => setOrder(data.order))
      .catch(() => router.push('/orders'))
      .finally(() => setLoading(false));
  }, [id, session, router]);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (!session) {
    return (
      <div className="container mx-auto flex flex-col items-center justify-center px-4 py-24">
        <h2 className="font-[family-name:var(--font-heading)] text-3xl font-bold">Sign in to view order details</h2>
        <Link href="/login" className="mt-6 inline-flex h-12 items-center rounded-xl bg-foreground px-8 text-sm font-medium text-background transition-all hover:opacity-90">
          Sign In
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 space-y-6">
        <div className="h-8 w-64 animate-pulse rounded bg-muted" />
        <div className="h-48 w-full animate-pulse rounded-2xl bg-muted" />
        <div className="h-32 w-full animate-pulse rounded-2xl bg-muted" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container mx-auto flex flex-col items-center justify-center px-4 py-24">
        <h2 className="font-[family-name:var(--font-heading)] text-3xl font-bold">Order Not Found</h2>
        <Link href="/orders" className="mt-6 inline-flex h-12 items-center rounded-xl bg-foreground px-8 text-sm font-medium text-background transition-all hover:opacity-90">
          View All Orders
        </Link>
      </div>
    );
  }

  const currentStepIndex = order.status === 'cancelled'
    ? statusSteps.findIndex((s) => s.key === 'cancelled')
    : statusSteps.findIndex((s) => s.key === order.status);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/orders" className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground">
          <ArrowLeft className="h-4 w-4" />
          Back to Orders
        </Link>
      </div>

      <div className="mb-8">
        <div className="flex items-center gap-3">
          <h1 className="font-[family-name:var(--font-heading)] text-3xl font-bold tracking-tight">
            Order #{order._id.slice(-8).toUpperCase()}
          </h1>
          <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium ${
            order.status === 'delivered' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
            order.status === 'cancelled' ? 'bg-red-50 text-red-700 border-red-200' :
            'bg-amber-50 text-amber-700 border-amber-200'
          }`}>
            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
          </span>
        </div>
        <p className="mt-1 text-muted-foreground">Placed on {formatDate(order.createdAt)}</p>
      </div>

      <div className="mb-8">
        <div className="flex items-center justify-between rounded-2xl border bg-muted/30 p-6 overflow-x-auto">
          {statusSteps.map((step, index) => {
            const Icon = step.icon;
            const isActive = order.status === 'cancelled'
              ? index === currentStepIndex
              : index <= currentStepIndex;
            const isCancelled = order.status === 'cancelled';

            return (
              <div key={step.key} className="flex flex-col items-center gap-2 min-w-[80px]">
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-full transition-all ${
                    isActive
                      ? isCancelled && step.key === 'cancelled'
                        ? 'bg-destructive text-destructive-foreground shadow-md'
                        : 'bg-foreground text-background shadow-md'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <span
                  className={`text-xs font-medium whitespace-nowrap ${
                    isActive ? 'text-foreground' : 'text-muted-foreground'
                  }`}
                >
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="rounded-2xl border p-6">
            <h2 className="mb-5 text-lg font-semibold">Order Items</h2>
            <div className="space-y-4">
              {order.items.map((item, index) => (
                <div key={index} className="flex gap-4">
                  <img
                    src={item.image || '/placeholder.svg'}
                    alt={item.name}
                    className="h-20 w-20 flex-shrink-0 rounded-xl object-cover bg-muted"
                  />
                  <div className="flex-1">
                    <p className="font-medium">{item.name}</p>
                    <div className="mt-1 flex gap-3 text-sm text-muted-foreground">
                      {item.color && <span>Color: {item.color}</span>}
                      {item.size && <span>Size: {item.size}</span>}
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Qty: {item.quantity}</span>
                      <span className="font-medium">{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border p-6">
            <h2 className="mb-4 text-lg font-semibold">Shipping Address</h2>
            <div className="space-y-1 text-sm">
              <p className="font-medium">{order.shippingAddress.fullName}</p>
              <p className="text-muted-foreground">{order.shippingAddress.address}</p>
              <p className="text-muted-foreground">
                {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}
              </p>
              <p className="text-muted-foreground">{order.shippingAddress.country}</p>
              {order.shippingAddress.phone && (
                <p className="text-muted-foreground">Phone: {order.shippingAddress.phone}</p>
              )}
            </div>
          </div>

          <div className="rounded-2xl border p-6">
            <h2 className="mb-4 text-lg font-semibold">Order Summary</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium">{formatPrice(order.subtotal)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-emerald-600">
                  <span>Discount {order.couponCode ? `(${order.couponCode})` : ''}</span>
                  <span className="font-medium">-{formatPrice(order.discount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span className="font-medium">{order.shipping === 0 ? <span className="text-emerald-600">Free</span> : formatPrice(order.shipping)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tax</span>
                <span className="font-medium">{formatPrice(order.tax)}</span>
              </div>
              <div className="h-px bg-border" />
              <div className="flex justify-between text-base font-semibold">
                <span>Total</span>
                <span>{formatPrice(order.total)}</span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border p-6">
            <h2 className="mb-4 text-lg font-semibold">Payment</h2>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{order.paymentMethod === 'cod' ? 'Cash on Delivery' : order.paymentMethod}</span>
              <span className={`inline-flex rounded-full border px-3 py-0.5 text-xs font-medium ${
                order.paymentStatus === 'paid' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                order.paymentStatus === 'pending' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                'bg-red-50 text-red-700 border-red-200'
              }`}>
                {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
