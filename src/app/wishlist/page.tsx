'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { ProductType } from '@/types';
import { ProductCard } from '@/components/products/ProductCard';
import Link from 'next/link';
import { Heart, ArrowLeft } from 'lucide-react';

export default function WishlistPage() {
  const { data: session } = useSession();
  const [products, setProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session) {
      setLoading(false);
      return;
    }
    fetch('/api/wishlist')
      .then((res) => res.json())
      .then((data) => setProducts(data.products || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [session]);

  if (!session) {
    return (
      <div className="container mx-auto flex flex-col items-center justify-center px-4 py-24">
        <div className="rounded-full bg-muted p-8">
          <Heart className="h-16 w-16 text-muted-foreground/40" />
        </div>
        <h2 className="mt-4 font-[family-name:var(--font-heading)] text-3xl font-bold">Sign in to view your wishlist</h2>
        <p className="mt-2 text-muted-foreground">Save your favorite items for later.</p>
        <Link href="/login" className="mt-8 inline-flex h-12 items-center rounded-xl bg-foreground px-8 text-sm font-medium text-background transition-all hover:opacity-90">
          Sign In
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="aspect-square animate-pulse rounded-2xl bg-muted" />
          ))}
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="container mx-auto flex flex-col items-center justify-center px-4 py-24">
        <div className="rounded-full bg-muted p-8">
          <Heart className="h-16 w-16 text-muted-foreground/40" />
        </div>
        <h2 className="mt-4 font-[family-name:var(--font-heading)] text-3xl font-bold">Your wishlist is empty</h2>
        <p className="mt-2 text-muted-foreground">Save items you love to your wishlist.</p>
        <Link href="/products" className="mt-8 inline-flex h-12 items-center gap-2 rounded-xl bg-foreground px-8 text-sm font-medium text-background transition-all hover:opacity-90">
          <ArrowLeft className="h-4 w-4" />
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="font-[family-name:var(--font-heading)] text-3xl font-bold tracking-tight sm:text-4xl">
          My Wishlist
        </h1>
        <p className="mt-1 text-muted-foreground">{products.length} item{products.length !== 1 ? 's' : ''} saved</p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
}
