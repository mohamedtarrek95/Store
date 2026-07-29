'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Trash2, Users, UserCheck, UserX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { formatPrice } from '@/lib/utils';

interface Customer {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  image?: string;
  orderCount: number;
  totalSpent: number;
  isActive?: boolean;
  createdAt: string;
}

const stagger = {
  animate: { transition: { staggerChildren: 0.05 } },
};

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteName, setDeleteName] = useState('');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => { fetchCustomers(); }, []);

  const fetchCustomers = async (query?: string) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (query) params.set('search', query);
      const res = await fetch(`/api/customers?${params}`);
      const data = await res.json();
      setCustomers(data);
    } catch (error) {
      console.error('Failed to fetch customers', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchCustomers(search);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/customers?id=${deleteId}`, { method: 'DELETE' });
      if (res.ok) {
        setCustomers((prev) => prev.filter((c) => c._id !== deleteId));
        setDeleteId(null);
      }
    } catch (error) {
      console.error('Failed to delete customer', error);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <motion.div initial="initial" animate="animate" variants={stagger} className="space-y-6">
      <motion.div variants={fadeUp}>
        <h1 className="text-3xl font-bold tracking-tight">Customers</h1>
        <p className="text-muted-foreground mt-1">View and manage your customers</p>
      </motion.div>

      <motion.div
        variants={fadeUp}
        className="rounded-xl border bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl shadow-sm"
      >
        <div className="p-6 pb-4 border-b">
          <form onSubmit={handleSearch} className="flex gap-2 max-w-md">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Button type="submit" variant="secondary" size="sm">
              Search
            </Button>
          </form>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Email</TableHead>
                <TableHead className="hidden sm:table-cell">Orders</TableHead>
                <TableHead className="hidden sm:table-cell">Total Spent</TableHead>
                <TableHead className="hidden md:table-cell">Joined</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-20 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    {Array.from({ length: 7 }).map((_, j) => (
                      <TableCell key={j}><Skeleton className="h-6 w-full" /></TableCell>
                    ))}
                  </TableRow>
                ))
              ) : customers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7}>
                    <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                      <Users className="h-12 w-12 mb-4 opacity-30" />
                      <p className="text-base font-medium">No customers found</p>
                      <p className="text-sm mt-1">
                        {search ? 'Try a different search term' : 'No customers have registered yet'}
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                <AnimatePresence>
                  {customers.map((customer, i) => (
                    <motion.tr
                      key={customer._id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ delay: i * 0.03 }}
                      className="border-b transition-colors hover:bg-muted/50"
                    >
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary">
                            {customer.name?.charAt(0)?.toUpperCase() || '?'}
                          </div>
                          <span className="font-medium">{customer.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">{customer.email}</TableCell>
                      <TableCell className="hidden sm:table-cell">{customer.orderCount}</TableCell>
                      <TableCell className="hidden sm:table-cell font-medium">
                        {formatPrice(customer.totalSpent)}
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-muted-foreground text-sm">
                        {new Date(customer.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {customer.isActive !== false ? (
                          <Badge variant="success" className="text-[10px] px-1.5 py-0">
                            <UserCheck className="h-3 w-3 mr-1" /> Active
                          </Badge>
                        ) : (
                          <Badge variant="destructive" className="text-[10px] px-1.5 py-0">
                            <UserX className="h-3 w-3 mr-1" /> Disabled
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-end">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setDeleteId(customer._id);
                              setDeleteName(customer.name);
                            }}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </TableCell>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              )}
            </TableBody>
          </Table>
        </div>
      </motion.div>

      <Dialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Customer</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &ldquo;{deleteName}&rdquo;? This will permanently remove
              the customer and cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete} disabled={deleting}>
              {deleting ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
