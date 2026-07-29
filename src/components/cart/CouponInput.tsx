'use client';

import { useState } from 'react';
import { useCart } from '@/providers/CartProvider';
import { Tag, X, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

export function CouponInput() {
  const { coupon, setCoupon } = useCart();
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);

  const handleApply = async () => {
    if (!code.trim()) return;

    setLoading(true);
    try {
      const res = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: code.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || 'Invalid coupon code');
        return;
      }

      setCoupon({
        code: data.code,
        discount: data.discount,
        discountPercentage: data.discountPercentage,
      });
      toast.success(`Coupon "${data.code}" applied! ${data.discountPercentage}% off`);
      setCode('');
    } catch {
      toast.error('Failed to validate coupon. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = () => {
    setCoupon(null);
    toast.success('Coupon removed');
  };

  if (coupon) {
    return (
      <div className="flex items-center justify-between rounded-2xl border bg-emerald-50/50 p-4">
        <div className="flex items-center gap-3">
          <CheckCircle2 className="h-5 w-5 text-emerald-600" />
          <div>
            <p className="text-sm font-medium">{coupon.code}</p>
            <p className="text-xs text-muted-foreground">{coupon.discountPercentage}% discount applied</p>
          </div>
        </div>
        <button
          onClick={handleRemove}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-background hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium">Coupon Code</label>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Tag className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Enter coupon code"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            className="h-11 w-full rounded-xl border border-input bg-background pl-11 pr-4 text-sm outline-none ring-offset-background transition-all focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>
        <button
          onClick={handleApply}
          disabled={loading || !code.trim()}
          className="inline-flex h-11 items-center justify-center rounded-xl border border-input px-5 text-sm font-medium transition-all duration-200 hover:bg-accent disabled:opacity-50"
        >
          {loading ? '...' : 'Apply'}
        </button>
      </div>
    </div>
  );
}
