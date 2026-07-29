'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ProductType } from '@/types';
import { useCart } from '@/providers/CartProvider';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
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
    setAdding(false);
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
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="group relative"
    >
      <Link href={`/products/${product.slug}`} className="block">
        <div className="relative aspect-square overflow-hidden rounded-lg bg-muted">
          {!imgLoaded && <Skeleton className="absolute inset-0" />}
          <img
            src={product.featuredImage || product.images?.[0] || '/placeholder.svg'}
            alt={product.name}
            onLoad={() => setImgLoaded(true)}
            className={`h-full w-full object-cover transition-transform duration-500 group-hover:scale-110 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
          />

          {discount > 0 && (
            <Badge variant="destructive" className="absolute left-2 top-2">
              -{discount}%
            </Badge>
          )}

          {product.stock <= 0 && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/60">
              <span className="rounded-full bg-background px-3 py-1 text-sm font-medium">Out of Stock</span>
            </div>
          )}

          <button
            onClick={handleWishlist}
            className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-background/80 opacity-0 shadow-sm backdrop-blur-sm transition-all hover:bg-background group-hover:opacity-100"
          >
            <Heart
              className={`h-4 w-4 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`}
            />
          </button>

          {product.stock > 0 && (
            <div className="absolute bottom-2 left-2 right-2 opacity-0 transition-all group-hover:opacity-100">
              <Button
                size="sm"
                className="w-full shadow-lg"
                onClick={handleAddToCart}
                disabled={adding}
              >
                <ShoppingBag className="mr-1.5 h-4 w-4" />
                {adding ? 'Adding...' : 'Quick Add'}
              </Button>
            </div>
          )}
        </div>

        <div className="mt-3 space-y-1">
          <p className="text-xs text-muted-foreground">{product.brand}</p>
          <h3 className="truncate text-sm font-medium">{product.name}</h3>

          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`h-3.5 w-3.5 ${
                  i < Math.round(product.rating)
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-muted-foreground/30'
                }`}
              />
            ))}
            <span className="ml-1 text-xs text-muted-foreground">({product.numReviews})</span>
          </div>

          <div className="flex items-center gap-2">
            {product.discountPrice ? (
              <>
                <span className="font-semibold">{formatPrice(product.discountPrice)}</span>
                <span className="text-sm text-muted-foreground line-through">{formatPrice(product.price)}</span>
              </>
            ) : (
              <span className="font-semibold">{formatPrice(product.price)}</span>
            )}
          </div>

          {product.colors && product.colors.length > 0 && (
            <div className="flex items-center gap-1 pt-1">
              {product.colors.slice(0, 4).map((color) => (
                <span
                  key={color}
                  className="h-3.5 w-3.5 rounded-full border"
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
