'use client';

import { useCart } from '@/providers/CartProvider';
import { formatPrice } from '@/lib/utils';
import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';

export function CartSummary() {
  const { items, coupon, getSubtotal } = useCart();

  const subtotal = getSubtotal();
  const discount = coupon ? Math.round(subtotal * (coupon.discountPercentage / 100)) : 0;
  const shipping = subtotal >= 100 ? 0 : 9.99;
  const tax = Math.round((subtotal - discount) * 0.08 * 100) / 100;
  const total = subtotal - discount + shipping + tax;

  return (
    <div className="rounded-2xl border p-6">
      <h2 className="text-lg font-semibold">Order Summary</h2>

      <div className="mt-5 space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Subtotal ({items.length} items)</span>
          <span className="font-medium">{formatPrice(subtotal)}</span>
        </div>

        {discount > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-emerald-600">Discount ({coupon?.code})</span>
            <span className="text-emerald-600 font-medium">-{formatPrice(discount)}</span>
          </div>
        )}

        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Shipping</span>
          <span className="font-medium">
            {shipping === 0 ? (
              <span className="text-emerald-600">Free</span>
            ) : (
              formatPrice(shipping)
            )}
          </span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Tax (8%)</span>
          <span className="font-medium">{formatPrice(tax)}</span>
        </div>

        <div className="h-px bg-border" />

        <div className="flex justify-between text-base font-semibold">
          <span>Total</span>
          <span>{formatPrice(total)}</span>
        </div>

        {subtotal < 100 && subtotal > 0 && (
          <p className="text-xs text-muted-foreground">
            Add {formatPrice(100 - subtotal)} more for free shipping
          </p>
        )}
      </div>

      <Link
        href="/checkout"
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-foreground py-4 text-base font-medium text-background transition-all duration-200 hover:opacity-90 shadow-sm"
      >
        <ShoppingBag className="h-5 w-5" />
        Proceed to Checkout
      </Link>
    </div>
  );
}
