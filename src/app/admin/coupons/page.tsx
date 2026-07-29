'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, Check, X, Percent } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { CouponType } from '@/types';

interface CouponForm {
  code: string;
  description: string;
  discountPercentage: string;
  minAmount: string;
  maxUses: string;
  expiresAt: string;
  isActive: boolean;
}

const emptyForm: CouponForm = {
  code: '',
  description: '',
  discountPercentage: '',
  minAmount: '',
  maxUses: '',
  expiresAt: '',
  isActive: true,
};

const stagger = {
  animate: { transition: { staggerChildren: 0.05 } },
};

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<CouponType[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<CouponType | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState<CouponForm>(emptyForm);

  useEffect(() => { fetchCoupons(); }, []);

  const fetchCoupons = async () => {
    try {
      const res = await fetch('/api/coupons');
      const data = await res.json();
      setCoupons(data);
    } catch {
      console.error('Failed to fetch coupons');
    } finally {
      setLoading(false);
    }
  };

  const openAdd = () => {
    setEditing(null);
    setForm(emptyForm);
    setError('');
    setShowModal(true);
  };

  const openEdit = (coupon: CouponType) => {
    setEditing(coupon);
    setForm({
      code: coupon.code,
      description: coupon.description || '',
      discountPercentage: String(coupon.discountPercentage),
      minAmount: coupon.minAmount ? String(coupon.minAmount) : '',
      maxUses: coupon.maxUses ? String(coupon.maxUses) : '',
      expiresAt: new Date(coupon.expiresAt).toISOString().split('T')[0],
      isActive: coupon.isActive,
    });
    setError('');
    setShowModal(true);
  };

  const handleSave = async () => {
    setError('');
    if (!form.code.trim()) { setError('Code is required'); return; }
    if (!form.discountPercentage || isNaN(Number(form.discountPercentage)) || Number(form.discountPercentage) < 1 || Number(form.discountPercentage) > 100) {
      setError('Discount percentage must be between 1 and 100'); return;
    }
    if (!form.expiresAt) { setError('Expiry date is required'); return; }

    setSaving(true);
    try {
      const payload: any = {
        code: form.code.toUpperCase(),
        description: form.description || undefined,
        discountPercentage: Number(form.discountPercentage),
        minAmount: form.minAmount ? Number(form.minAmount) : undefined,
        maxUses: form.maxUses ? Number(form.maxUses) : undefined,
        expiresAt: form.expiresAt,
        isActive: form.isActive,
      };
      if (editing) payload._id = editing._id;

      const res = await fetch('/api/coupons', {
        method: editing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to save coupon');
      }

      await fetchCoupons();
      setShowModal(false);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/coupons?id=${deleteId}`, { method: 'DELETE' });
      if (res.ok) {
        setCoupons((prev) => prev.filter((c) => c._id !== deleteId));
        setDeleteId(null);
      }
    } catch {
      console.error('Failed to delete');
    } finally {
      setDeleting(false);
    }
  };

  const toggleActive = async (coupon: CouponType) => {
    try {
      const res = await fetch('/api/coupons', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ _id: coupon._id, isActive: !coupon.isActive }),
      });
      if (res.ok) {
        setCoupons((prev) =>
          prev.map((c) => (c._id === coupon._id ? { ...c, isActive: !c.isActive } : c))
        );
      }
    } catch {
      console.error('Failed to toggle coupon');
    }
  };

  const isExpired = (date: string) => new Date(date) < new Date();

  return (
    <motion.div initial="initial" animate="animate" variants={stagger} className="space-y-6">
      <motion.div variants={fadeUp} className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Coupons</h1>
          <p className="text-muted-foreground mt-1">Manage discount coupons</p>
        </div>
        <Button onClick={openAdd}>
          <Plus className="h-4 w-4 mr-2" /> Add Coupon
        </Button>
      </motion.div>

      <motion.div
        variants={fadeUp}
        className="rounded-xl border bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl shadow-sm overflow-hidden"
      >
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Discount</TableHead>
                <TableHead className="hidden sm:table-cell">Min. Amount</TableHead>
                <TableHead className="hidden sm:table-cell">Uses</TableHead>
                <TableHead>Expires</TableHead>
                <TableHead>Active</TableHead>
                <TableHead className="w-24 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <TableRow key={i}>
                    {Array.from({ length: 7 }).map((_, j) => (
                      <TableCell key={j}><Skeleton className="h-6 w-full" /></TableCell>
                    ))}
                  </TableRow>
                ))
              ) : coupons.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7}>
                    <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                      <Percent className="h-12 w-12 mb-4 opacity-30" />
                      <p className="text-base font-medium">No coupons found</p>
                      <p className="text-sm mt-1">Create your first coupon to offer discounts</p>
                      <Button onClick={openAdd} className="mt-4" size="sm">
                        <Plus className="h-4 w-4 mr-2" /> Add Coupon
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                <AnimatePresence>
                  {coupons.map((coupon, i) => (
                    <motion.tr
                      key={coupon._id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ delay: i * 0.03 }}
                      className="border-b transition-colors hover:bg-muted/50"
                    >
                      <TableCell>
                        <span className="font-mono font-semibold">{coupon.code}</span>
                      </TableCell>
                      <TableCell className="font-semibold text-green-600 dark:text-green-400">
                        {coupon.discountPercentage}%
                      </TableCell>
                      <TableCell className="hidden sm:table-cell text-muted-foreground">
                        {coupon.minAmount ? `$${coupon.minAmount}` : '—'}
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        {coupon.usedCount}
                        {coupon.maxUses ? ` / ${coupon.maxUses}` : ''}
                      </TableCell>
                      <TableCell>
                        <span
                          className={cn(
                            'text-sm',
                            isExpired(coupon.expiresAt)
                              ? 'text-red-600 dark:text-red-400'
                              : 'text-muted-foreground'
                          )}
                        >
                          {new Date(coupon.expiresAt).toLocaleDateString()}
                        </span>
                        {isExpired(coupon.expiresAt) && (
                          <Badge variant="destructive" className="ml-2 text-[10px]">
                            Expired
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => toggleActive(coupon)}
                        >
                          {coupon.isActive ? (
                            <Check className="h-4 w-4 text-green-500" />
                          ) : (
                            <X className="h-4 w-4 text-red-500" />
                          )}
                        </Button>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="ghost" size="icon" onClick={() => openEdit(coupon)}>
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => setDeleteId(coupon._id)}>
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

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit Coupon' : 'Add Coupon'}</DialogTitle>
            <DialogDescription>
              {editing ? 'Update the coupon details below.' : 'Create a new discount coupon.'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {error && (
              <div className="rounded-lg bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 p-3 text-sm text-red-600 dark:text-red-400">
                {error}
              </div>
            )}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="code">Coupon Code</Label>
                <Input
                  id="code"
                  value={form.code}
                  onChange={(e) => setForm((prev) => ({ ...prev, code: e.target.value }))}
                  placeholder="SUMMER20"
                  className="uppercase font-mono"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="discount">Discount (%)</Label>
                <Input
                  id="discount"
                  type="number"
                  min="1"
                  max="100"
                  value={form.discountPercentage}
                  onChange={(e) => setForm((prev) => ({ ...prev, discountPercentage: e.target.value }))}
                  placeholder="20"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="desc">Description</Label>
              <Textarea
                id="desc"
                value={form.description}
                onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                placeholder="Optional description"
                rows={2}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="minAmount">Min. Amount ($)</Label>
                <Input
                  id="minAmount"
                  type="number"
                  value={form.minAmount}
                  onChange={(e) => setForm((prev) => ({ ...prev, minAmount: e.target.value }))}
                  placeholder="50"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxUses">Max Uses</Label>
                <Input
                  id="maxUses"
                  type="number"
                  value={form.maxUses}
                  onChange={(e) => setForm((prev) => ({ ...prev, maxUses: e.target.value }))}
                  placeholder="100"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="expiresAt">Expiry Date</Label>
              <Input
                id="expiresAt"
                type="date"
                value={form.expiresAt}
                onChange={(e) => setForm((prev) => ({ ...prev, expiresAt: e.target.value }))}
              />
            </div>
            <div className="flex items-center justify-between rounded-lg border p-3">
              <div>
                <Label htmlFor="isActive" className="font-medium">Active</Label>
                <p className="text-xs text-muted-foreground">Customers can use this coupon</p>
              </div>
              <Switch
                id="isActive"
                checked={form.isActive}
                onCheckedChange={(v) => setForm((prev) => ({ ...prev, isActive: v }))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? 'Saving...' : editing ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Coupon</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this coupon? This action cannot be undone.
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
