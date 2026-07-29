'use client';

import { useCart } from '@/providers/CartProvider';
import { CartItem } from '@/components/cart/CartItem';
import { CartSummary } from '@/components/cart/CartSummary';
import { CouponInput } from '@/components/cart/CouponInput';
import Link from 'next/link';
import { ShoppingBag, ArrowLeft } from 'lucide-react';

export default function CartPage() {
  const { items, getItemCount } = useCart();

  if (items.length === 0) {
    return (
      <div className="container mx-auto flex flex-col items-center justify-center px-4 py-24">
        <div className="mb-6 rounded-full bg-muted p-8">
          <ShoppingBag className="h-16 w-16 text-muted-foreground/40" />
        </div>
        <h2 className="font-[family-name:var(--font-heading)] text-3xl font-bold">Your cart is empty</h2>
        <p className="mt-2 text-muted-foreground">Looks like you haven&apos;t added anything yet.</p>
        <Link
          href="/products"
          className="mt-8 inline-flex h-12 items-center gap-2 rounded-xl bg-foreground px-8 text-sm font-medium text-background transition-all duration-200 hover:opacity-90"
        >
          <ArrowLeft className="h-4 w-4" />
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-[family-name:var(--font-heading)] text-3xl font-bold tracking-tight sm:text-4xl">
            Shopping Cart
          </h1>
          <p className="mt-1 text-muted-foreground">{getItemCount()} item{getItemCount() !== 1 ? 's' : ''} in your cart</p>
        </div>
        <Link
          href="/products"
          className="hidden items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground sm:inline-flex"
        >
          <ArrowLeft className="h-4 w-4" />
          Continue Shopping
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          {items.map((item) => (
            <CartItem key={`${item.productId}-${item.color}-${item.size}`} item={item} />
          ))}
        </div>

        <div className="space-y-6">
          <CouponInput />
          <CartSummary />
        </div>
      </div>

      <div className="mt-8 text-center sm:hidden">
        <Link
          href="/products"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
