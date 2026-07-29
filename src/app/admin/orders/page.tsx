'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ChevronDown, ChevronUp, ShoppingBag, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { formatPrice, cn } from '@/lib/utils';
import { OrderType } from '@/types';

const statusColors: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300',
  processing: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  shipped: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
  delivered: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  cancelled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
};

const paymentColors: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300',
  paid: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  failed: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
};

const stagger = {
  animate: { transition: { staggerChildren: 0.04 } },
};

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<OrderType[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => { fetchOrders(); }, [statusFilter]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter) params.set('status', statusFilter);
      if (search) params.set('search', search);
      const res = await fetch(`/api/orders?${params}`);
      const data = await res.json();
      setOrders(data);
    } catch (error) {
      console.error('Failed to fetch orders', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchOrders();
  };

  const updateStatus = async (orderId: string, status: string) => {
    setUpdatingId(orderId);
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        setOrders((prev) =>
          prev.map((o) => (o._id === orderId ? { ...o, status: status as any } : o))
        );
      }
    } catch (error) {
      console.error('Failed to update order', error);
    } finally {
      setUpdatingId(null);
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <motion.div initial="initial" animate="animate" variants={stagger} className="space-y-6">
      <motion.div variants={fadeUp}>
        <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
        <p className="text-muted-foreground mt-1">Manage and track customer orders</p>
      </motion.div>

      <motion.div
        variants={fadeUp}
        className="rounded-xl border bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl shadow-sm"
      >
        <div className="p-6 pb-4 border-b">
          <div className="flex flex-col sm:flex-row gap-3">
            <form onSubmit={handleSearch} className="flex gap-2 flex-1">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by order number..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Button type="submit" variant="secondary" size="sm">
                Search
              </Button>
            </form>
            <Select
              value={statusFilter}
              onValueChange={(v) => setStatusFilter(v === 'all' ? '' : v)}
            >
              <SelectTrigger className="w-40">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="shipped">Shipped</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-8"></TableHead>
                <TableHead>Order</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead className="hidden sm:table-cell">Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden md:table-cell">Payment</TableHead>
                <TableHead>Total</TableHead>
                <TableHead className="w-40">Update</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    {Array.from({ length: 8 }).map((_, j) => (
                      <TableCell key={j}><Skeleton className="h-6 w-full" /></TableCell>
                    ))}
                  </TableRow>
                ))
              ) : orders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8}>
                    <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                      <ShoppingBag className="h-12 w-12 mb-4 opacity-30" />
                      <p className="text-base font-medium">No orders found</p>
                      <p className="text-sm mt-1">
                        {search ? 'Try a different search term' : 'No orders have been placed yet'}
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                orders.map((order, i) => (
                  <AnimatePresence key={order._id}>
                    <motion.tr
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.03 }}
                      className="border-b transition-colors hover:bg-muted/50 cursor-pointer"
                      onClick={() => toggleExpand(order._id)}
                    >
                      <TableCell>
                        {expandedId === order._id ? (
                          <ChevronUp className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <ChevronDown className="h-4 w-4 text-muted-foreground" />
                        )}
                      </TableCell>
                      <TableCell className="font-mono text-sm font-medium">
                        {order.orderNumber}
                      </TableCell>
                      <TableCell>{(order.user as any)?.name || 'N/A'}</TableCell>
                      <TableCell className="hidden sm:table-cell text-muted-foreground text-sm">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <span
                          className={cn(
                            'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
                            statusColors[order.status]
                          )}
                        >
                          {order.status}
                        </span>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <span
                          className={cn(
                            'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
                            paymentColors[order.paymentStatus]
                          )}
                        >
                          {order.paymentStatus}
                        </span>
                      </TableCell>
                      <TableCell className="font-semibold">{formatPrice(order.total)}</TableCell>
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <Select
                          value={order.status}
                          onValueChange={(v) => updateStatus(order._id, v)}
                          disabled={updatingId === order._id}
                        >
                          <SelectTrigger className="h-8 text-xs">
                            {updatingId === order._id ? (
                              <Loader2 className="h-3 w-3 animate-spin mx-auto" />
                            ) : (
                              <SelectValue />
                            )}
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="processing">Processing</SelectItem>
                            <SelectItem value="shipped">Shipped</SelectItem>
                            <SelectItem value="delivered">Delivered</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                    </motion.tr>
                    {expandedId === order._id && (
                      <motion.tr
                        key={`${order._id}-details`}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                      >
                        <TableCell colSpan={8} className="bg-muted/30 p-0">
                          <div className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div className="space-y-3">
                                <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                                  Shipping Address
                                </h4>
                                <div className="text-sm space-y-1">
                                  <p className="font-medium">{order.shippingAddress.fullName}</p>
                                  <p className="text-muted-foreground">{order.shippingAddress.address}</p>
                                  <p className="text-muted-foreground">
                                    {order.shippingAddress.city}, {order.shippingAddress.state}{' '}
                                    {order.shippingAddress.zip}
                                  </p>
                                  <p className="text-muted-foreground">{order.shippingAddress.country}</p>
                                  <p className="text-muted-foreground">{order.shippingAddress.phone}</p>
                                </div>
                              </div>
                              <div className="space-y-3">
                                <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                                  Order Items
                                </h4>
                                <div className="space-y-3">
                                  {order.items.map((item, idx) => (
                                    <div key={idx} className="flex items-center gap-3 text-sm">
                                      <img
                                        src={item.image}
                                        alt={item.name}
                                        className="w-10 h-10 rounded-lg object-cover border"
                                        onError={(e) => {
                                          (e.target as HTMLImageElement).style.display = 'none';
                                        }}
                                      />
                                      <div className="flex-1 min-w-0">
                                        <p className="font-medium truncate">{item.name}</p>
                                        <p className="text-muted-foreground text-xs">
                                          Qty: {item.quantity} &times; {formatPrice(item.price)}
                                        </p>
                                      </div>
                                      <p className="font-medium">
                                        {formatPrice(item.price * item.quantity)}
                                      </p>
                                    </div>
                                  ))}
                                </div>
                                <div className="pt-3 border-t space-y-1.5 text-sm">
                                  <div className="flex justify-between">
                                    <span className="text-muted-foreground">Subtotal</span>
                                    <span>{formatPrice(order.subtotal)}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-muted-foreground">Shipping</span>
                                    <span>{formatPrice(order.shipping)}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-muted-foreground">Tax</span>
                                    <span>{formatPrice(order.tax)}</span>
                                  </div>
                                  {order.discount > 0 && (
                                    <div className="flex justify-between text-green-600">
                                      <span>Discount</span>
                                      <span>-{formatPrice(order.discount)}</span>
                                    </div>
                                  )}
                                  <div className="flex justify-between font-bold pt-2 border-t">
                                    <span>Total</span>
                                    <span>{formatPrice(order.total)}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </TableCell>
                      </motion.tr>
                    )}
                  </AnimatePresence>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </motion.div>
    </motion.div>
  );
}
