'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ProductType } from '@/types';
import { useCart } from '@/providers/CartProvider';
import { useSession } from 'next-auth/react';
import { Heart, ShoppingBag, Star, Minus, Plus, Check, ShieldCheck, Truck } from 'lucide-react';
import { toast } from 'sonner';
import { formatPrice, getDiscountPercentage } from '@/lib/utils';
import Link from 'next/link';

interface ProductInfoProps {
  product: ProductType;
}

export function ProductInfo({ product }: ProductInfoProps) {
  const router = useRouter();
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
    setTimeout(() => setAdding(false), 500);
  };

  const handleWishlist = async () => {
    if (!session) {
      toast.error('Please sign in to add items to your wishlist');
      return;
    }
    try {
      const res = await fetch('/api/wishlist', {
        method: 'POST',
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

  const handleBuyNow = () => {
    if (product.stock <= 0) return;
    if (!session) {
      toast.error('Please sign in to purchase');
      router.push('/login');
      return;
    }
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
    router.push('/checkout');
  };

  return (
    <div className="space-y-6">
      {product.brand && (
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
          {product.brand}
        </p>
      )}

      <h1 className="font-[family-name:var(--font-heading)] text-3xl font-bold tracking-tight sm:text-4xl">
        {product.name}
      </h1>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`h-4 w-4 ${
                i < Math.round(product.rating)
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-muted-foreground/20'
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
            <span className="rounded-full bg-destructive/10 px-3 py-1 text-xs font-bold text-destructive">
              -{discount}% OFF
            </span>
          </>
        ) : (
          <span className="text-3xl font-bold">{formatPrice(product.price)}</span>
        )}
      </div>

      <p className="leading-relaxed text-muted-foreground">{product.description}</p>

      <div className="h-px bg-border" />

      {product.colors && product.colors.length > 0 && (
        <div>
          <p className="mb-3 text-sm font-medium">
            Color: <span className="text-muted-foreground">{selectedColor}</span>
          </p>
          <div className="flex flex-wrap gap-3">
            {product.colors.map((color) => (
              <button
                key={color}
                onClick={() => setSelectedColor(color)}
                className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all duration-200 ${
                  selectedColor === color
                    ? 'border-foreground ring-2 ring-foreground/20 scale-110'
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
          <p className="mb-3 text-sm font-medium">
            Size: <span className="text-muted-foreground">{selectedSize}</span>
          </p>
          <div className="flex flex-wrap gap-2">
            {product.sizes.map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`rounded-xl border px-5 py-2.5 text-sm font-medium transition-all duration-200 ${
                  selectedSize === size
                    ? 'border-foreground bg-foreground text-background'
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
        <p className="mb-3 text-sm font-medium">Quantity</p>
        <div className="inline-flex items-center rounded-xl border">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="flex h-11 w-11 items-center justify-center transition-colors hover:bg-accent rounded-l-xl"
          >
            <Minus className="h-3.5 w-3.5" />
          </button>
          <span className="flex h-11 w-14 items-center justify-center text-sm font-medium border-x">
            {quantity}
          </span>
          <button
            onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
            className="flex h-11 w-11 items-center justify-center transition-colors hover:bg-accent rounded-r-xl"
            disabled={quantity >= product.stock}
          >
            <Plus className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {product.stock > 0 ? (
          product.stock <= 5 ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-warning/10 px-3 py-1 text-xs font-medium text-amber-600">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-600 animate-pulse" />
              Only {product.stock} left
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-600">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
              In Stock
            </span>
          )
        ) : (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-destructive/10 px-3 py-1 text-xs font-medium text-destructive">
            <span className="h-1.5 w-1.5 rounded-full bg-destructive" />
            Out of Stock
          </span>
        )}
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex gap-3">
          <button
            onClick={handleAddToCart}
            disabled={product.stock <= 0 || adding}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-foreground py-4 text-base font-medium text-background transition-all duration-200 hover:opacity-90 disabled:opacity-50 shadow-sm"
          >
            <ShoppingBag className="h-5 w-5" />
            {adding ? 'Adding...' : 'Add to Cart'}
          </button>
          <button
            onClick={handleWishlist}
            className="flex h-[56px] w-[56px] items-center justify-center rounded-xl border border-input transition-all duration-200 hover:border-foreground/50 hover:bg-accent"
          >
            <Heart className={`h-5 w-5 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} />
          </button>
        </div>
        <button
          onClick={handleBuyNow}
          disabled={product.stock <= 0}
          className="w-full rounded-xl border border-foreground/20 py-4 text-base font-medium transition-all duration-200 hover:bg-accent disabled:opacity-50"
        >
          Buy Now
        </button>
      </div>

      <div className="space-y-3 rounded-2xl bg-muted/30 p-5">
        <div className="flex items-center gap-3 text-sm">
          <Truck className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground">Free shipping on orders over $100</span>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <ShieldCheck className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground">30-day return guarantee</span>
        </div>
      </div>

      <div className="h-px bg-border" />

      <div className="space-y-1.5 text-sm text-muted-foreground">
        <p>
          <span className="font-medium text-foreground">SKU:</span> {product.sku}
        </p>
        <p>
          <span className="font-medium text-foreground">Category:</span>{' '}
          <Link
            href={`/products?category=${typeof product.category === 'string' ? product.category : product.category.slug}`}
            className="hover:text-foreground transition-colors"
          >
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
