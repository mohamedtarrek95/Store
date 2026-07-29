'use client';

import { motion } from 'framer-motion';
import { ProductCard } from '@/components/products/ProductCard';
import { ProductType } from '@/types';
import { PackageOpen } from 'lucide-react';

interface ProductGridProps {
  products: ProductType[];
  loading?: boolean;
}

const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05, delayChildren: 0.1 },
  },
};

export function ProductGrid({ products, loading }: ProductGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="space-y-4">
            <div className="aspect-square w-full animate-pulse rounded-2xl bg-muted" />
            <div className="space-y-2 px-1">
              <div className="h-3 w-1/4 animate-pulse rounded bg-muted" />
              <div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
              <div className="h-4 w-1/3 animate-pulse rounded bg-muted" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <div className="rounded-full bg-muted p-6">
          <PackageOpen className="h-12 w-12 text-muted-foreground/40" />
        </div>
        <h3 className="mt-6 text-lg font-medium">No products found</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Try adjusting your filters or search terms.
        </p>
      </div>
    );
  }

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
    >
      {products.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </motion.div>
  );
}
