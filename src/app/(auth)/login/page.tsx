'use client';

import { Suspense, useState } from 'react';
import { motion } from 'framer-motion';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff, LogIn } from 'lucide-react';
import { toast } from 'sonner';
import { loginSchema } from '@/lib/validations';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = loginSchema.safeParse({ email, password });
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        fieldErrors[err.path[0] as string] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setLoading(true);
    try {
      console.log('[LOGIN] signIn starting, callbackUrl:', callbackUrl);
      const res = await signIn('credentials', { email, password, redirect: false });
      console.log('[LOGIN] signIn result:', JSON.stringify(res));

      if (res?.error) {
        console.log('[LOGIN] signIn error:', res.error);
        toast.error(res.error === 'CredentialsSignin' ? 'Invalid email or password' : res.error);
        return;
      }

      if (res?.ok) {
        console.log('[LOGIN] signIn ok, pushing to:', callbackUrl);
        toast.success('Welcome back!');
        router.push(callbackUrl);
      } else {
        console.log('[LOGIN] signIn returned but not ok:', res);
      }
    } catch {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] as const }}
        className="w-full max-w-md"
      >
        <div className="relative overflow-hidden rounded-3xl border bg-card/50 backdrop-blur-xl p-8 shadow-xl sm:p-10">
          <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-foreground/5 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-40 w-40 rounded-full bg-foreground/5 blur-3xl" />

          <div className="relative z-10">
            <div className="text-center">
              <Link href="/" className="inline-block">
                <span className="text-2xl font-bold tracking-tight font-[family-name:var(--font-heading)]">LUXE</span>
                <span className="block text-sm text-muted-foreground">Accessories</span>
              </Link>
              <h1 className="mt-6 text-2xl font-bold tracking-tight">Welcome back</h1>
              <p className="mt-1 text-sm text-muted-foreground">Sign in to your account</p>
            </div>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">Email</label>
                <input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex h-12 w-full rounded-xl border border-input bg-background px-4 text-sm outline-none ring-offset-background transition-all focus-visible:ring-2 focus-visible:ring-ring"
                />
                {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="text-sm font-medium">Password</label>
                  <Link href="/forgot-password" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="flex h-12 w-full rounded-xl border border-input bg-background px-4 pr-11 text-sm outline-none ring-offset-background transition-all focus-visible:ring-2 focus-visible:ring-ring"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password && <p className="text-xs text-destructive">{errors.password}</p>}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-foreground py-3.5 text-sm font-medium text-background transition-all duration-200 hover:opacity-90 disabled:opacity-50"
              >
                <LogIn className="h-4 w-4" />
                {loading ? 'Signing in...' : 'Sign In'}
              </button>

              <p className="text-center text-sm text-muted-foreground">
                Don&apos;t have an account?{' '}
                <Link href="/register" className="font-medium text-foreground hover:underline">
                  Create one
                </Link>
              </p>
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center px-4 py-12">
        <div className="w-full max-w-md animate-pulse space-y-4">
          <div className="mx-auto h-8 w-32 rounded bg-muted" />
          <div className="h-12 w-full rounded-xl bg-muted" />
          <div className="h-12 w-full rounded-xl bg-muted" />
          <div className="h-12 w-full rounded-xl bg-muted" />
        </div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
