'use client';

import { CartItem as CartItemType } from '@/types';
import { useCart } from '@/providers/CartProvider';
import { Button } from '@/components/ui/button';
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
    <div className="flex gap-4 rounded-lg border p-4">
      <Link href={`/products/${item.productId}`} className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md">
        <img
          src={item.image || '/placeholder.svg'}
          alt={item.name}
          className="h-full w-full object-cover"
        />
      </Link>

      <div className="flex flex-1 flex-col justify-between">
        <div className="flex justify-between">
          <div>
            <Link
              href={`/products/${item.productId}`}
              className="font-medium hover:text-primary transition-colors"
            >
              {item.name}
            </Link>
            <div className="mt-0.5 flex gap-2 text-xs text-muted-foreground">
              {item.color && <span>Color: {item.color}</span>}
              {item.size && <span>Size: {item.size}</span>}
            </div>
            <p className="mt-1 text-sm font-medium">{formatPrice(price)}</p>
          </div>
          <p className="text-sm font-medium">{formatPrice(total)}</p>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center rounded-md border">
            <button
              onClick={() => {
                if (item.quantity <= 1) {
                  removeItem(item.productId);
                } else {
                  updateQuantity(item.productId, item.quantity - 1);
                }
              }}
              className="flex h-8 w-8 items-center justify-center transition-colors hover:bg-accent"
            >
              <Minus className="h-3 w-3" />
            </button>
            <span className="flex h-8 w-10 items-center justify-center text-sm font-medium">
              {item.quantity}
            </span>
            <button
              onClick={() => {
                if (item.quantity < item.stock) {
                  updateQuantity(item.productId, item.quantity + 1);
                }
              }}
              className="flex h-8 w-8 items-center justify-center transition-colors hover:bg-accent"
              disabled={item.quantity >= item.stock}
            >
              <Plus className="h-3 w-3" />
            </button>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => removeItem(item.productId)}
            className="h-8 w-8 text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
