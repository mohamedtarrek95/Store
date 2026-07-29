'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { profileSchema } from '@/lib/validations';
import { User, Mail, Phone, MapPin, Save, Package, Heart } from 'lucide-react';
import { toast } from 'sonner';

export default function ProfilePage() {
  const { data: session, update } = useSession();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    country: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (session?.user) {
      setFormData((prev) => ({
        ...prev,
        name: (session.user as any).name || '',
        phone: (session.user as any).phone || '',
        address: (session.user as any).address || '',
        city: (session.user as any).city || '',
        state: (session.user as any).state || '',
        zip: (session.user as any).zip || '',
        country: (session.user as any).country || '',
      }));
    }
  }, [session]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = profileSchema.safeParse(formData);
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
      const res = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to update profile');
      }

      await update();
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  if (!session) {
    return (
      <div className="container mx-auto flex flex-col items-center justify-center px-4 py-24">
        <div className="rounded-full bg-muted p-8">
          <User className="h-16 w-16 text-muted-foreground/40" />
        </div>
        <h2 className="mt-4 font-[family-name:var(--font-heading)] text-3xl font-bold">Sign in to manage your profile</h2>
        <Link href="/login" className="mt-8 inline-flex h-12 items-center rounded-xl bg-foreground px-8 text-sm font-medium text-background transition-all hover:opacity-90">
          Sign In
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="font-[family-name:var(--font-heading)] text-3xl font-bold tracking-tight sm:text-4xl">
          My Profile
        </h1>
        <p className="mt-1 text-muted-foreground">Manage your account information</p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="rounded-2xl border p-6 sm:p-8">
            <div className="mb-6">
              <h2 className="text-lg font-semibold">Personal Information</h2>
              <p className="text-sm text-muted-foreground">Update your name and contact details</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Email</label>
                  <div className="mt-1.5 flex items-center gap-2 rounded-xl border bg-muted/30 px-4 py-3 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{session.user?.email}</span>
                  </div>
                </div>

                <div>
                  <label htmlFor="name" className="text-sm font-medium">Full Name</label>
                  <div className="relative mt-1.5">
                    <User className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input id="name" value={formData.name} onChange={handleChange} className="flex h-11 w-full rounded-xl border border-input bg-background pl-11 pr-4 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring" />
                  </div>
                  {errors.name && <p className="mt-1 text-xs text-destructive">{errors.name}</p>}
                </div>

                <div>
                  <label htmlFor="phone" className="text-sm font-medium">Phone</label>
                  <div className="relative mt-1.5">
                    <Phone className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input id="phone" type="tel" value={formData.phone} onChange={handleChange} className="flex h-11 w-full rounded-xl border border-input bg-background pl-11 pr-4 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring" />
                  </div>
                </div>
              </div>

              <div className="h-px bg-border" />

              <div>
                <h3 className="mb-4 text-sm font-semibold">Shipping Address</h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label htmlFor="address" className="text-sm font-medium">Address</label>
                    <div className="relative mt-1.5">
                      <MapPin className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <input id="address" value={formData.address} onChange={handleChange} className="flex h-11 w-full rounded-xl border border-input bg-background pl-11 pr-4 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring" />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="city" className="text-sm font-medium">City</label>
                    <input id="city" value={formData.city} onChange={handleChange} className="mt-1.5 flex h-11 w-full rounded-xl border border-input bg-background px-4 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring" />
                  </div>
                  <div>
                    <label htmlFor="state" className="text-sm font-medium">State</label>
                    <input id="state" value={formData.state} onChange={handleChange} className="mt-1.5 flex h-11 w-full rounded-xl border border-input bg-background px-4 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring" />
                  </div>
                  <div>
                    <label htmlFor="zip" className="text-sm font-medium">ZIP Code</label>
                    <input id="zip" value={formData.zip} onChange={handleChange} className="mt-1.5 flex h-11 w-full rounded-xl border border-input bg-background px-4 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring" />
                  </div>
                  <div>
                    <label htmlFor="country" className="text-sm font-medium">Country</label>
                    <input id="country" value={formData.country} onChange={handleChange} className="mt-1.5 flex h-11 w-full rounded-xl border border-input bg-background px-4 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring" />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="inline-flex h-11 items-center gap-2 rounded-xl bg-foreground px-8 text-sm font-medium text-background transition-all duration-200 hover:opacity-90 disabled:opacity-50"
              >
                <Save className="h-4 w-4" />
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border p-6">
            <h2 className="mb-4 text-sm font-semibold">Account</h2>
            <div className="space-y-2">
              <Link
                href="/orders"
                className="flex items-center gap-3 rounded-xl border border-input px-4 py-3 text-sm font-medium transition-colors hover:bg-accent"
              >
                <Package className="h-4 w-4 text-muted-foreground" />
                My Orders
              </Link>
              <Link
                href="/wishlist"
                className="flex items-center gap-3 rounded-xl border border-input px-4 py-3 text-sm font-medium transition-colors hover:bg-accent"
              >
                <Heart className="h-4 w-4 text-muted-foreground" />
                Wishlist
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
