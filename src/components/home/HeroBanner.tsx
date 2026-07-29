'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2, delayChildren: 0.1 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.25, 0.1, 0.25, 1] as const } },
};

export default function HeroBanner() {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1445205170230-053b83016050?w=1920&q=80"
          alt="Luxury lifestyle"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-black/70" />
      </div>

      <div className="absolute left-1/4 top-1/4 h-64 w-64 rounded-full bg-white/5 blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 h-48 w-48 rounded-full bg-white/5 blur-3xl" />

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="relative z-10 mx-auto max-w-4xl px-4 text-center"
      >
        <motion.span
          variants={fadeUp}
          className="mb-6 inline-block rounded-full border border-white/20 bg-white/10 px-5 py-2 text-xs font-medium uppercase tracking-widest text-white/80 backdrop-blur-sm"
        >
          New Collection 2024
        </motion.span>

        <motion.h1
          variants={fadeUp}
          className="font-[family-name:var(--font-heading)] text-5xl font-bold leading-tight text-white sm:text-6xl md:text-7xl lg:text-8xl"
        >
          Timeless
          <br />
          <span className="text-white/80">Elegance</span>
        </motion.h1>

        <motion.p
          variants={fadeUp}
          className="mx-auto mt-6 max-w-2xl text-base text-white/70 sm:text-lg md:text-xl"
        >
          Discover our curated collection of premium accessories — from timeless watches to elegant bracelets and necklaces, crafted for those who appreciate the finer things.
        </motion.p>

        <motion.div
          variants={fadeUp}
          className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <Link
            href="/products"
            className="group inline-flex h-14 items-center gap-2 rounded-full bg-white px-10 text-base font-medium text-black transition-all duration-300 hover:bg-white/90 hover:shadow-xl"
          >
            Shop Now
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
          <Link
            href="/products?category=watches"
            className="inline-flex h-14 items-center rounded-full border border-white/30 px-10 text-base font-medium text-white backdrop-blur-sm transition-all duration-300 hover:bg-white/10 hover:border-white/50"
          >
            Explore Collections
          </Link>
        </motion.div>
      </motion.div>

      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}
