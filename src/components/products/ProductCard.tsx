'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ProductType } from '@/types';
import { useCart } from '@/providers/CartProvider';
import { useSession } from 'next-auth/react';
import { Heart, ShoppingBag, Star } from 'lucide-react';
import { toast } from 'sonner';
import { formatPrice, getDiscountPercentage } from '@/lib/utils';

interface ProductCardProps {
  product: ProductType;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const { data: session } = useSession();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [adding, setAdding] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);

  const discount = getDiscountPercentage(product.price, product.discountPrice);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setAdding(true);
    addItem({
      productId: product._id,
      name: product.name,
      image: product.featuredImage || product.images[0],
      price: product.price,
      discountPrice: product.discountPrice,
      quantity: 1,
      color: product.colors?.[0],
      size: product.sizes?.[0],
      stock: product.stock,
    });
    toast.success(`${product.name} added to cart`);
    setTimeout(() => setAdding(false), 500);
  };

  const handleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!session) {
      toast.error('Please sign in to add items to your wishlist');
      return;
    }
    try {
      const res = await fetch('/api/wishlist', {
        method: isWishlisted ? 'DELETE' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: product._id }),
      });
      if (res.ok) {
        setIsWishlisted(!isWishlisted);
        toast.success(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist');
      }
    } catch {
      toast.error('Something went wrong');
    }
  };

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="group relative"
    >
      <Link href={`/products/${product.slug}`} className="block">
        <div className="relative aspect-square overflow-hidden rounded-2xl bg-muted shadow-sm transition-shadow duration-300 group-hover:shadow-xl">
          {!imgLoaded && (
            <div className="absolute inset-0 animate-pulse bg-muted" />
          )}
          <img
            src={product.featuredImage || product.images?.[0] || '/placeholder.svg'}
            alt={product.name}
            onLoad={() => setImgLoaded(true)}
            className={`h-full w-full object-cover transition-all duration-700 group-hover:scale-105 ${
              imgLoaded ? 'opacity-100' : 'opacity-0'
            }`}
          />

          {discount > 0 && (
            <div className="absolute left-3 top-3 rounded-full bg-destructive px-3 py-1 text-xs font-bold text-destructive-foreground shadow-lg">
              -{discount}%
            </div>
          )}

          {product.stock <= 0 && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/60 backdrop-blur-sm">
              <span className="rounded-full bg-background/90 px-4 py-1.5 text-sm font-medium shadow-sm">
                Out of Stock
              </span>
            </div>
          )}

          <button
            onClick={handleWishlist}
            className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-background/80 opacity-0 shadow-sm backdrop-blur-sm transition-all duration-300 hover:bg-background group-hover:opacity-100"
          >
            <Heart
              className={`h-4 w-4 transition-colors ${
                isWishlisted ? 'fill-red-500 text-red-500' : ''
              }`}
            />
          </button>

          {product.stock > 0 && (
            <div className="absolute bottom-3 left-3 right-3 opacity-0 translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
              <button
                onClick={handleAddToCart}
                disabled={adding}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-foreground py-3 text-sm font-medium text-background shadow-lg transition-all duration-200 hover:opacity-90 disabled:opacity-50"
              >
                <ShoppingBag className="h-4 w-4" />
                {adding ? 'Adding...' : 'Quick Add'}
              </button>
            </div>
          )}
        </div>

        <div className="mt-4 space-y-2 px-1">
          {product.brand && (
            <p className="text-[11px] font-medium uppercase tracking-widest text-muted-foreground">
              {product.brand}
            </p>
          )}
          <h3 className="line-clamp-2 text-sm font-medium leading-snug">{product.name}</h3>

          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`h-3.5 w-3.5 ${
                  i < Math.round(product.rating)
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-muted-foreground/20'
                }`}
              />
            ))}
            <span className="ml-1 text-xs text-muted-foreground">({product.numReviews})</span>
          </div>

          <div className="flex items-center gap-2">
            {product.discountPrice ? (
              <>
                <span className="text-base font-semibold">{formatPrice(product.discountPrice)}</span>
                <span className="text-sm text-muted-foreground line-through">
                  {formatPrice(product.price)}
                </span>
              </>
            ) : (
              <span className="text-base font-semibold">{formatPrice(product.price)}</span>
            )}
          </div>

          {product.colors && product.colors.length > 0 && (
            <div className="flex items-center gap-1.5 pt-1">
              {product.colors.slice(0, 4).map((color) => (
                <span
                  key={color}
                  className="h-3 w-3 rounded-full border border-border"
                  style={{ backgroundColor: color.toLowerCase() }}
                  title={color}
                />
              ))}
              {product.colors.length > 4 && (
                <span className="text-xs text-muted-foreground">+{product.colors.length - 4}</span>
              )}
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  );
}
