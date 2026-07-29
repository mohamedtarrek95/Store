'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ProductType } from '@/types';
import { ProductGallery } from '@/components/products/ProductGallery';
import { ProductInfo } from '@/components/products/ProductInfo';
import { ReviewList } from '@/components/products/ReviewList';
import { ReviewForm } from '@/components/products/ReviewForm';
import { ProductCard } from '@/components/products/ProductCard';
import { ChevronRight } from 'lucide-react';

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = useState<ProductType | null>(null);
  const [similarProducts, setSimilarProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(true);
  const [reviewKey, setReviewKey] = useState(0);

  useEffect(() => {
    async function fetchProduct() {
      setLoading(true);
      try {
        const res = await fetch(`/api/products/${slug}`);
        if (!res.ok) throw new Error('Product not found');
        const data = await res.json();
        setProduct(data.product);

        if (data.product.category) {
          const catSlug = typeof data.product.category === 'string' ? data.product.category : data.product.category.slug;
          const similarRes = await fetch(`/api/products?category=${catSlug}&limit=4&exclude=${data.product._id}`);
          const similarData = await similarRes.json();
          setSimilarProducts(similarData.products || []);
        }
      } catch (err) {
        console.error('Failed to fetch product:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [slug]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6 h-4 w-64 animate-pulse rounded bg-muted" />
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <div className="aspect-square w-full animate-pulse rounded-2xl bg-muted" />
          <div className="space-y-4">
            <div className="h-4 w-24 animate-pulse rounded bg-muted" />
            <div className="h-8 w-3/4 animate-pulse rounded bg-muted" />
            <div className="h-6 w-32 animate-pulse rounded bg-muted" />
            <div className="h-20 w-full animate-pulse rounded bg-muted" />
            <div className="h-12 w-full animate-pulse rounded-xl bg-muted" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto flex flex-col items-center justify-center px-4 py-20">
        <h2 className="font-[family-name:var(--font-heading)] text-3xl font-bold">Product Not Found</h2>
        <p className="mt-2 text-muted-foreground">The product you&apos;re looking for doesn&apos;t exist or has been removed.</p>
        <Link href="/products" className="mt-6 inline-flex h-12 items-center rounded-xl bg-foreground px-8 text-sm font-medium text-background transition-all hover:opacity-90">
          Browse all products
        </Link>
      </div>
    );
  }

  const categoryName = typeof product.category === 'string' ? product.category : product.category.name;
  const categorySlug = typeof product.category === 'string' ? product.category : product.category.slug;

  return (
    <div className="container mx-auto px-4 py-8">
      <nav className="mb-8 flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <Link href="/products" className="hover:text-foreground transition-colors">Products</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <Link href={`/products?category=${categorySlug}`} className="hover:text-foreground transition-colors">
          {categoryName}
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-foreground font-medium">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
        <ProductGallery images={product.images} name={product.name} />
        <ProductInfo product={product} />
      </div>

      <div className="my-16 h-px bg-border" />

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
        <ReviewList productId={product._id} key={reviewKey} />
        <ReviewForm
          productId={product._id}
          onReviewSubmitted={() => setReviewKey((k) => k + 1)}
        />
      </div>

      {similarProducts.length > 0 && (
        <>
          <div className="my-16 h-px bg-border" />
          <section>
            <h2 className="mb-8 font-[family-name:var(--font-heading)] text-2xl font-bold tracking-tight sm:text-3xl">
              Similar Products
            </h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {similarProducts.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
}
