'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ProductCard } from '@/components/products/ProductCard';
import { ProductType } from '@/types';
import { ArrowRight } from 'lucide-react';

const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] as const } },
};

export default function BestSellers() {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch('/api/products?bestSeller=true&limit=4');
        const data = await res.json();
        setProducts(data.products || []);
      } catch (err) {
        console.error('Failed to fetch best sellers:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  return (
    <section className="py-20 md:py-28">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12 flex items-end justify-between"
        >
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Top Rated
            </span>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
              Best Sellers
            </h2>
          </div>
          <Link
            href="/products?bestSeller=true"
            className="group hidden items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground sm:flex"
          >
            View All
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="flex gap-6 overflow-x-auto pb-4 sm:grid sm:grid-cols-2 lg:grid-cols-4 sm:overflow-x-visible scrollbar-none"
        >
          {loading
            ? Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="min-w-[280px] flex-shrink-0 space-y-4 sm:min-w-0">
                  <div className="aspect-square w-full animate-pulse rounded-xl bg-muted" />
                  <div className="space-y-2">
                    <div className="h-3 w-1/3 animate-pulse rounded bg-muted" />
                    <div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
                    <div className="h-4 w-1/2 animate-pulse rounded bg-muted" />
                  </div>
                </div>
              ))
            : products.map((product) => (
                <motion.div key={product._id} variants={item} className="min-w-[280px] flex-shrink-0 sm:min-w-0">
                  <ProductCard product={product} />
                </motion.div>
              ))}
        </motion.div>

        <div className="mt-8 text-center sm:hidden">
          <Link
            href="/products?bestSeller=true"
            className="group inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            View All Best Sellers
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}
