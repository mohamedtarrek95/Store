'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    name: 'Sarah Johnson',
    location: 'New York, NY',
    avatar: 'https://i.pravatar.cc/150?u=sarah',
    rating: 5,
    text: 'Absolutely stunning quality! The watch I ordered exceeded my expectations. The craftsmanship is remarkable and it arrived in beautiful packaging.',
  },
  {
    id: 2,
    name: 'Michael Chen',
    location: 'San Francisco, CA',
    avatar: 'https://i.pravatar.cc/150?u=michael',
    rating: 5,
    text: 'I have purchased several items from Luxe and each one has been perfect. The bracelet I bought last month is my new favorite accessory.',
  },
  {
    id: 3,
    name: 'Emily Davis',
    location: 'London, UK',
    avatar: 'https://i.pravatar.cc/150?u=emily',
    rating: 4,
    text: 'Excellent customer service and fast shipping. The necklace is even more beautiful in person. Will definitely be ordering again!',
  },
  {
    id: 4,
    name: 'James Wilson',
    location: 'Sydney, AU',
    avatar: 'https://i.pravatar.cc/150?u=james',
    rating: 5,
    text: 'Bought a ring for my wife anniversary and she absolutely loves it. The quality is outstanding and the price was very reasonable.',
  },
];

export default function Testimonials() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const next = useCallback(() => {
    setDirection(1);
    setCurrent((prev) => (prev + 1) % testimonials.length);
  }, []);

  const prev = useCallback(() => {
    setDirection(-1);
    setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  }, []);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(next, 5000);
    return () => clearInterval(interval);
  }, [next, isPaused]);

  const slideVariants = {
    enter: (dir: number) => ({ x: dir > 0 ? 200 : -200, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -200 : 200, opacity: 0 }),
  };

  return (
    <section className="bg-muted/30 py-20 md:py-28">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Testimonials
          </span>
          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            What Our Customers Say
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative mx-auto max-w-3xl"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div className="relative min-h-[320px] overflow-hidden rounded-2xl border bg-card p-8 shadow-sm md:p-12">
            <Quote className="absolute right-6 top-6 h-16 w-16 text-muted-foreground/5" />

            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={current}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.4, ease: 'easeInOut' }}
                className="flex flex-col items-center text-center"
              >
                <div className="mb-6 flex gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < testimonials[current].rating
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-muted-foreground/20'
                      }`}
                    />
                  ))}
                </div>
                <p className="text-lg leading-relaxed text-muted-foreground italic md:text-xl">
                  &ldquo;{testimonials[current].text}&rdquo;
                </p>
                <div className="mt-8 flex items-center gap-4">
                  <div className="h-12 w-12 overflow-hidden rounded-full border-2 border-border">
                    <img
                      src={testimonials[current].avatar}
                      alt={testimonials[current].name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="text-left">
                    <p className="font-semibold">{testimonials[current].name}</p>
                    <p className="text-sm text-muted-foreground">{testimonials[current].location}</p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="mt-8 flex items-center justify-center gap-4">
            <button
              onClick={prev}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-border transition-all duration-200 hover:border-foreground hover:bg-accent"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setDirection(i > current ? 1 : -1);
                    setCurrent(i);
                  }}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    i === current ? 'w-8 bg-foreground' : 'w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50'
                  }`}
                />
              ))}
            </div>
            <button
              onClick={next}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-border transition-all duration-200 hover:border-foreground hover:bg-accent"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
