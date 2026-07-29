'use client';

import { useState } from 'react';
import { useCart } from '@/providers/CartProvider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tag, X, CheckCircle2, AlertCircle } from 'lucide-react';
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
      <div className="flex items-center justify-between rounded-lg border bg-primary/5 p-3">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <div>
            <p className="text-sm font-medium">{coupon.code}</p>
            <p className="text-xs text-muted-foreground">{coupon.discountPercentage}% discount applied</p>
          </div>
        </div>
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={handleRemove}>
          <X className="h-3.5 w-3.5" />
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Coupon Code</label>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Tag className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Enter coupon code"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            className="pl-10"
          />
        </div>
        <Button variant="outline" onClick={handleApply} disabled={loading || !code.trim()}>
          {loading ? 'Checking...' : 'Apply'}
        </Button>
      </div>
    </div>
  );
}
