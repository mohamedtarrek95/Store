'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    name: 'Sarah Johnson',
    avatar: 'https://i.pravatar.cc/150?u=sarah',
    rating: 5,
    text: 'Absolutely stunning quality! The watch I ordered exceeded my expectations. The craftsmanship is remarkable and it arrived in beautiful packaging.',
  },
  {
    id: 2,
    name: 'Michael Chen',
    avatar: 'https://i.pravatar.cc/150?u=michael',
    rating: 5,
    text: 'I have purchased several items from Luxe and each one has been perfect. The bracelet I bought last month is my new favorite accessory.',
  },
  {
    id: 3,
    name: 'Emily Davis',
    avatar: 'https://i.pravatar.cc/150?u=emily',
    rating: 4,
    text: 'Excellent customer service and fast shipping. The necklace is even more beautiful in person. Will definitely be ordering again!',
  },
  {
    id: 4,
    name: 'James Wilson',
    avatar: 'https://i.pravatar.cc/150?u=james',
    rating: 5,
    text: 'Bought a ring for my wife anniversary and she absolutely loves it. The quality is outstanding and the price was very reasonable.',
  },
];

export default function Testimonials() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);

  const slideVariants = {
    enter: (dir: number) => ({ x: dir > 0 ? 200 : -200, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -200 : 200, opacity: 0 }),
  };

  const next = () => {
    setDirection(1);
    setCurrent((prev) => (prev + 1) % testimonials.length);
  };

  const prev = () => {
    setDirection(-1);
    setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-10 text-center"
        >
          <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Testimonials
          </span>
          <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">What Our Customers Say</h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative mx-auto max-w-2xl"
        >
          <div className="relative min-h-[280px] overflow-hidden rounded-2xl border bg-card p-8 shadow-sm md:p-12">
            <Quote className="absolute right-6 top-6 h-12 w-12 text-muted-foreground/10" />

            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={current}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="flex flex-col items-center text-center"
              >
                <div className="mb-4 flex gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < testimonials[current].rating
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-muted-foreground/30'
                      }`}
                    />
                  ))}
                </div>
                <p className="text-lg leading-relaxed text-muted-foreground">
                  &ldquo;{testimonials[current].text}&rdquo;
                </p>
                <div className="mt-6 flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={testimonials[current].avatar} />
                    <AvatarFallback>{testimonials[current].name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="text-left">
                    <p className="font-semibold">{testimonials[current].name}</p>
                    <p className="text-sm text-muted-foreground">Verified Buyer</p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="mt-6 flex items-center justify-center gap-4">
            <button
              onClick={prev}
              className="flex h-10 w-10 items-center justify-center rounded-full border transition-colors hover:bg-accent"
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
                  className={`h-2 w-2 rounded-full transition-all ${
                    i === current ? 'w-6 bg-primary' : 'bg-muted-foreground/30'
                  }`}
                />
              ))}
            </div>
            <button
              onClick={next}
              className="flex h-10 w-10 items-center justify-center rounded-full border transition-colors hover:bg-accent"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
