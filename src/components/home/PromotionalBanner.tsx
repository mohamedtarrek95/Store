'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function PromotionalBanner() {
  return (
    <section className="relative overflow-hidden py-20 md:py-32">
      <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/80 to-primary/60" />
      <div
        className="absolute inset-0 bg-[url('/promo-pattern.svg')] bg-cover bg-center opacity-10"
        style={{ backgroundAttachment: 'fixed' }}
      />

      <div className="container relative z-10 mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-4 flex items-center justify-center gap-2">
            <Sparkles className="h-5 w-5 text-primary-foreground/80" />
            <span className="text-sm font-medium uppercase tracking-widest text-primary-foreground/80">
              Limited Time Offer
            </span>
            <Sparkles className="h-5 w-5 text-primary-foreground/80" />
          </div>

          <h2 className="text-4xl font-bold tracking-tight text-primary-foreground sm:text-5xl md:text-6xl">
            Up to 40% Off
            <br />
            <span className="text-primary-foreground/80">Spring Collection</span>
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-lg text-primary-foreground/70">
            Elevate your style with our premium accessories at unbeatable prices. Offer ends soon!
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button
              size="lg"
              variant="secondary"
              asChild
              className="h-12 px-8 text-base font-semibold"
            >
              <Link href="/products?category=watches">
                Shop Sale
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="h-12 border-primary-foreground/30 px-8 text-base text-primary-foreground hover:bg-primary-foreground/10"
            >
              <Link href="/products">View Collection</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
