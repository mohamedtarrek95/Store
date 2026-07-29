'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

function useCountdown(targetDate: Date) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    function calculate() {
      const diff = targetDate.getTime() - Date.now();
      if (diff <= 0) return;
      setTimeLeft({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      });
    }

    calculate();
    const interval = setInterval(calculate, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  return timeLeft;
}

function TimerBlock({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <span className="text-2xl font-bold sm:text-3xl md:text-4xl">{String(value).padStart(2, '0')}</span>
      <span className="text-xs uppercase tracking-wider text-white/60">{label}</span>
    </div>
  );
}

export default function PromotionalBanner() {
  const targetDate = new Date(Date.now() + 7 * 86400000);
  const countdown = useCountdown(targetDate);

  return (
    <section className="relative overflow-hidden py-24 md:py-36">
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1920&q=80"
          alt="Summer Collection"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/80" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] as const }}
        className="container relative z-10 mx-auto px-4 text-center"
      >
        <span className="inline-block rounded-full border border-white/20 bg-white/10 px-5 py-1.5 text-xs font-medium uppercase tracking-widest text-white/80 backdrop-blur-sm">
          Limited Time Offer
        </span>

        <h2 className="mt-6 font-[family-name:var(--font-heading)] text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
          Summer Collection
        </h2>
        <p className="mt-3 text-2xl font-light text-white/80 sm:text-3xl">
          Up to 40% Off
        </p>

        <div className="mt-8 flex items-center justify-center gap-6 text-white">
          <TimerBlock value={countdown.days} label="Days" />
          <span className="text-3xl font-light text-white/40">:</span>
          <TimerBlock value={countdown.hours} label="Hours" />
          <span className="text-3xl font-light text-white/40">:</span>
          <TimerBlock value={countdown.minutes} label="Mins" />
          <span className="text-3xl font-light text-white/40">:</span>
          <TimerBlock value={countdown.seconds} label="Secs" />
        </div>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/products?category=watches"
            className="group inline-flex h-14 items-center gap-2 rounded-full bg-white px-10 text-base font-medium text-black transition-all duration-300 hover:bg-white/90 hover:shadow-xl"
          >
            Shop Sale
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
          <Link
            href="/products"
            className="inline-flex h-14 items-center rounded-full border border-white/30 px-10 text-base font-medium text-white backdrop-blur-sm transition-all duration-300 hover:bg-white/10"
          >
            View Collection
          </Link>
        </div>
      </motion.div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}
