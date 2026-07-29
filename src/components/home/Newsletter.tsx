'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Mail, ArrowRight } from 'lucide-react';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error('Please enter a valid email address');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error('Failed to subscribe');
      toast.success('Successfully subscribed to our newsletter!');
      setEmail('');
    } catch {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-20 md:py-28">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] as const }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-foreground/5 via-foreground/[0.02] to-background border p-8 md:p-16"
        >
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-foreground/5 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-foreground/5 blur-3xl" />

          <div className="relative z-10 flex flex-col items-center gap-8 md:flex-row md:justify-between">
            <div className="max-w-md text-center md:text-left">
              <div className="mb-4 inline-flex rounded-full bg-foreground/10 p-3">
                <Mail className="h-6 w-6 text-foreground" />
              </div>
              <h2 className="font-[family-name:var(--font-heading)] text-3xl font-bold tracking-tight sm:text-4xl">
                Stay in the Loop
              </h2>
              <p className="mt-3 text-muted-foreground">
                Subscribe for exclusive offers, new arrivals, and style inspiration delivered to your inbox.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="w-full max-w-md">
              <div className="flex flex-col gap-3 sm:flex-row">
                <div className="relative flex-1">
                  <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-13 w-full rounded-xl border border-input bg-background pl-11 pr-4 text-sm outline-none ring-offset-background transition-all focus-visible:ring-2 focus-visible:ring-ring"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="group inline-flex h-13 items-center gap-2 rounded-xl bg-foreground px-8 text-sm font-medium text-background transition-all duration-300 hover:opacity-90 disabled:opacity-50"
                >
                  {loading ? 'Subscribing...' : 'Subscribe'}
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </button>
              </div>
              <p className="mt-3 text-xs text-muted-foreground">
                No spam, ever. Unsubscribe anytime.
              </p>
            </form>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
