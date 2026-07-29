'use client';

import { useCart } from '@/providers/CartProvider';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
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
    <div className="rounded-lg border p-6">
      <h2 className="text-lg font-semibold">Order Summary</h2>

      <div className="mt-4 space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Subtotal ({items.length} items)</span>
          <span>{formatPrice(subtotal)}</span>
        </div>

        {discount > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-green-600">Discount ({coupon?.code})</span>
            <span className="text-green-600">-{formatPrice(discount)}</span>
          </div>
        )}

        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Shipping</span>
          <span>
            {shipping === 0 ? (
              <span className="text-green-600">Free</span>
            ) : (
              formatPrice(shipping)
            )}
          </span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Tax (8%)</span>
          <span>{formatPrice(tax)}</span>
        </div>

        <Separator />

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

      <Button asChild className="mt-6 w-full h-12 text-base">
        <Link href="/checkout">
          <ShoppingBag className="mr-2 h-5 w-5" />
          Proceed to Checkout
        </Link>
      </Button>
    </div>
  );
}
