'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { CategoryType } from '@/types';

const categoryImages: Record<string, string> = {
  watches: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=600&q=80',
  bracelets: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=600&q=80',
  necklaces: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&q=80',
  rings: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&q=80',
  earrings: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&q=80',
};

const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.25, 0.1, 0.25, 1] as const } },
};

export default function CategoryShowcase() {
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch('/api/categories');
        const data = await res.json();
        setCategories(data.categories || []);
      } catch (err) {
        console.error('Failed to fetch categories:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchCategories();
  }, []);

  return (
    <section className="py-20 md:py-28">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Categories
          </span>
          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            Shop by Category
          </h2>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4"
        >
          {loading
            ? Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="aspect-[4/5] w-full animate-pulse rounded-2xl bg-muted" />
              ))
            : categories.map((category) => (
                <motion.div key={category._id} variants={item}>
                  <Link
                    href={`/products?category=${category.slug}`}
                    className="group relative block overflow-hidden rounded-2xl"
                  >
                    <div className="aspect-[4/5] overflow-hidden">
                      <img
                        src={category.image || categoryImages[category.slug] || categoryImages.watches}
                        alt={category.name}
                        className="h-full w-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-110"
                      />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-5 md:p-7">
                      <div className="backdrop-blur-md bg-white/10 rounded-xl p-4 border border-white/20">
                        <h3 className="font-[family-name:var(--font-heading)] text-xl font-bold text-white md:text-2xl">
                          {category.name}
                        </h3>
                        <p className="mt-1 text-sm text-white/70">Explore Now &rarr;</p>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
        </motion.div>
      </div>
    </section>
  );
}
