'use client';

import { CartItem as CartItemType } from '@/types';
import { useCart } from '@/providers/CartProvider';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import Link from 'next/link';

interface CartItemProps {
  item: CartItemType;
}

export function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeItem } = useCart();

  const price = item.discountPrice || item.price;
  const total = price * item.quantity;

  return (
    <div className="flex gap-5 rounded-2xl border p-4 transition-colors hover:bg-accent/20 sm:p-5">
      <Link href={`/products/${item.productId}`} className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-xl bg-muted sm:h-28 sm:w-28">
        <img
          src={item.image || '/placeholder.svg'}
          alt={item.name}
          className="h-full w-full object-cover"
        />
      </Link>

      <div className="flex flex-1 flex-col justify-between">
        <div className="flex justify-between gap-4">
          <div className="min-w-0">
            <Link
              href={`/products/${item.productId}`}
              className="text-sm font-medium hover:text-foreground/70 transition-colors line-clamp-1"
            >
              {item.name}
            </Link>
            <div className="mt-1 flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-muted-foreground">
              {item.color && <span>Color: {item.color}</span>}
              {item.size && <span>Size: {item.size}</span>}
            </div>
            <p className="mt-2 text-sm font-semibold">{formatPrice(price)}</p>
          </div>
          <p className="hidden text-sm font-semibold sm:block">{formatPrice(total)}</p>
        </div>

        <div className="mt-3 flex items-center justify-between">
          <div className="inline-flex items-center rounded-xl border">
            <button
              onClick={() => {
                if (item.quantity <= 1) {
                  removeItem(item.productId);
                } else {
                  updateQuantity(item.productId, item.quantity - 1);
                }
              }}
              className="flex h-9 w-9 items-center justify-center transition-colors hover:bg-accent rounded-l-xl"
            >
              <Minus className="h-3 w-3" />
            </button>
            <span className="flex h-9 w-10 items-center justify-center text-sm font-medium border-x">
              {item.quantity}
            </span>
            <button
              onClick={() => {
                if (item.quantity < item.stock) {
                  updateQuantity(item.productId, item.quantity + 1);
                }
              }}
              className="flex h-9 w-9 items-center justify-center transition-colors hover:bg-accent rounded-r-xl"
              disabled={item.quantity >= item.stock}
            >
              <Plus className="h-3 w-3" />
            </button>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold sm:hidden">{formatPrice(total)}</span>
            <button
              onClick={() => removeItem(item.productId)}
              className="flex h-9 w-9 items-center justify-center rounded-xl text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
