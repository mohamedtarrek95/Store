'use client';

import { useState } from 'react';
import { ProductType } from '@/types';
import { useCart } from '@/providers/CartProvider';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Heart, ShoppingBag, Star, Minus, Plus, Check, ShieldCheck, Truck } from 'lucide-react';
import { toast } from 'sonner';
import { formatPrice, getDiscountPercentage } from '@/lib/utils';
import Link from 'next/link';

interface ProductInfoProps {
  product: ProductType;
}

export function ProductInfo({ product }: ProductInfoProps) {
  const { addItem } = useCart();
  const { data: session } = useSession();
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0] || '');
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || '');
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [adding, setAdding] = useState(false);

  const discount = getDiscountPercentage(product.price, product.discountPrice);

  const handleAddToCart = async () => {
    if (product.stock <= 0) return;
    setAdding(true);
    addItem({
      productId: product._id,
      name: product.name,
      image: product.featuredImage || product.images[0],
      price: product.price,
      discountPrice: product.discountPrice,
      quantity,
      color: selectedColor,
      size: selectedSize,
      stock: product.stock,
    });
    toast.success(`${product.name} added to cart`);
    setAdding(false);
  };

  const handleWishlist = async () => {
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
    <div className="space-y-6">
      {product.brand && (
        <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
          {product.brand}
        </p>
      )}

      <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{product.name}</h1>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`h-4 w-4 ${
                i < Math.round(product.rating)
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-muted-foreground/30'
              }`}
            />
          ))}
        </div>
        <span className="text-sm text-muted-foreground">
          {product.rating.toFixed(1)} ({product.numReviews} reviews)
        </span>
      </div>

      <div className="flex items-baseline gap-3">
        {product.discountPrice ? (
          <>
            <span className="text-3xl font-bold">{formatPrice(product.discountPrice)}</span>
            <span className="text-lg text-muted-foreground line-through">{formatPrice(product.price)}</span>
            <Badge variant="destructive">-{discount}% OFF</Badge>
          </>
        ) : (
          <span className="text-3xl font-bold">{formatPrice(product.price)}</span>
        )}
      </div>

      <p className="leading-relaxed text-muted-foreground">{product.description}</p>

      <Separator />

      {product.colors && product.colors.length > 0 && (
        <div>
          <p className="mb-2 text-sm font-medium">
            Color: <span className="text-muted-foreground">{selectedColor}</span>
          </p>
          <div className="flex flex-wrap gap-2">
            {product.colors.map((color) => (
              <button
                key={color}
                onClick={() => setSelectedColor(color)}
                className={`flex h-9 w-9 items-center justify-center rounded-full border-2 transition-all ${
                  selectedColor === color
                    ? 'border-primary ring-1 ring-primary'
                    : 'border-muted-foreground/30 hover:border-muted-foreground/60'
                }`}
                style={{ backgroundColor: color.toLowerCase() }}
                title={color}
              >
                {selectedColor === color && (
                  <Check className={`h-4 w-4 ${['white', 'silver'].includes(color.toLowerCase()) ? 'text-black' : 'text-white'}`} />
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {product.sizes && product.sizes.length > 0 && (
        <div>
          <p className="mb-2 text-sm font-medium">
            Size: <span className="text-muted-foreground">{selectedSize}</span>
          </p>
          <div className="flex flex-wrap gap-2">
            {product.sizes.map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`rounded-md border px-4 py-2 text-sm font-medium transition-all ${
                  selectedSize === size
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-input hover:border-foreground/50'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      )}

      <div>
        <p className="mb-2 text-sm font-medium">Quantity</p>
        <div className="flex w-32 items-center rounded-md border">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="flex h-10 w-10 items-center justify-center transition-colors hover:bg-accent"
          >
            <Minus className="h-3.5 w-3.5" />
          </button>
          <span className="flex flex-1 items-center justify-center text-sm font-medium">{quantity}</span>
          <button
            onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
            className="flex h-10 w-10 items-center justify-center transition-colors hover:bg-accent"
          >
            <Plus className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {product.stock > 0 ? (
          product.stock <= 5 ? (
            <Badge variant="warning" className="text-xs">
              Only {product.stock} left
            </Badge>
          ) : (
            <Badge variant="success" className="text-xs">
              In Stock
            </Badge>
          )
        ) : (
          <Badge variant="destructive" className="text-xs">
            Out of Stock
          </Badge>
        )}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Button
          size="lg"
          className="flex-1 h-12 text-base"
          onClick={handleAddToCart}
          disabled={product.stock <= 0 || adding}
        >
          <ShoppingBag className="mr-2 h-5 w-5" />
          {adding ? 'Adding...' : 'Add to Cart'}
        </Button>
        <Button size="lg" variant="outline" onClick={handleWishlist} className="h-12 px-4">
          <Heart className={`h-5 w-5 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} />
        </Button>
      </div>

      <div className="space-y-3 rounded-lg border bg-muted/30 p-4">
        <div className="flex items-center gap-3 text-sm">
          <Truck className="h-4 w-4 text-muted-foreground" />
          <span>Free shipping on orders over $100</span>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <ShieldCheck className="h-4 w-4 text-muted-foreground" />
          <span>30-day return guarantee</span>
        </div>
      </div>

      <Separator />

      <div className="space-y-1 text-sm text-muted-foreground">
        <p>
          <span className="font-medium text-foreground">SKU:</span> {product.sku}
        </p>
        <p>
          <span className="font-medium text-foreground">Category:</span>{' '}
          <Link href={`/products?category=${typeof product.category === 'string' ? product.category : product.category.slug}`} className="hover:text-primary">
            {typeof product.category === 'string' ? product.category : product.category.name}
          </Link>
        </p>
        {product.brand && (
          <p>
            <span className="font-medium text-foreground">Brand:</span> {product.brand}
          </p>
        )}
      </div>
    </div>
  );
}
