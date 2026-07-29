'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ProductType, ReviewType } from '@/types';
import { ProductGallery } from '@/components/products/ProductGallery';
import { ProductInfo } from '@/components/products/ProductInfo';
import { ReviewList } from '@/components/products/ReviewList';
import { ReviewForm } from '@/components/products/ReviewForm';
import { ProductCard } from '@/components/products/ProductCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
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
        <Skeleton className="mb-6 h-4 w-64" />
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <Skeleton className="aspect-square w-full rounded-xl" />
          <div className="space-y-4">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto flex flex-col items-center justify-center px-4 py-20">
        <h2 className="text-2xl font-bold">Product Not Found</h2>
        <p className="mt-2 text-muted-foreground">The product you&apos;re looking for doesn&apos;t exist or has been removed.</p>
        <Link href="/products" className="mt-4 text-primary hover:underline">
          Browse all products
        </Link>
      </div>
    );
  }

  const categoryName = typeof product.category === 'string' ? product.category : product.category.name;
  const categorySlug = typeof product.category === 'string' ? product.category : product.category.slug;

  return (
    <div className="container mx-auto px-4 py-8">
      <nav className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-foreground">Home</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <Link href="/products" className="hover:text-foreground">Products</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <Link href={`/products?category=${categorySlug}`} className="hover:text-foreground">
          {categoryName}
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-foreground">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <ProductGallery images={product.images} name={product.name} />
        <ProductInfo product={product} />
      </div>

      <Separator className="my-12" />

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
        <ReviewList productId={product._id} key={reviewKey} />
        <ReviewForm
          productId={product._id}
          onReviewSubmitted={() => setReviewKey((k) => k + 1)}
        />
      </div>

      {similarProducts.length > 0 && (
        <>
          <Separator className="my-12" />
          <section>
            <h2 className="mb-6 text-2xl font-bold tracking-tight">Similar Products</h2>
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
