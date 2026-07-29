'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/providers/CartProvider';
import { useSession } from 'next-auth/react';
import { checkoutSchema } from '@/lib/validations';
import { formatPrice } from '@/lib/utils';
import Link from 'next/link';
import { ShoppingBag, ArrowLeft, ShieldCheck, Truck, CreditCard } from 'lucide-react';
import { toast } from 'sonner';

export default function CheckoutPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const { items, coupon, getSubtotal, clearCart } = useCart();

  const [formData, setFormData] = useState({
    fullName: session?.user?.name || '',
    email: session?.user?.email || '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    country: 'US',
    notes: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const subtotal = getSubtotal();
  const discount = coupon ? Math.round(subtotal * (coupon.discountPercentage / 100)) : 0;
  const shipping = subtotal >= 100 ? 0 : 9.99;
  const tax = Math.round((subtotal - discount) * 0.08 * 100) / 100;
  const total = subtotal - discount + shipping + tax;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = checkoutSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        fieldErrors[err.path[0] as string] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    if (!session) {
      toast.error('Please sign in to place an order');
      router.push('/login');
      return;
    }

    if (items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map((item) => ({
            product: item.productId,
            name: item.name,
            image: item.image,
            price: item.discountPrice || item.price,
            quantity: item.quantity,
            color: item.color,
            size: item.size,
          })),
          shippingAddress: {
            fullName: formData.fullName,
            address: formData.address,
            city: formData.city,
            state: formData.state,
            zip: formData.zip,
            country: formData.country,
            phone: formData.phone,
          },
          paymentMethod: 'cod',
          subtotal,
          shipping,
          tax,
          discount,
          total,
          couponCode: coupon?.code,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to place order');
      }

      clearCart();
      toast.success('Order placed successfully!');
      router.push(`/orders/${data._id}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to place order');
    } finally {
      setSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto flex flex-col items-center justify-center px-4 py-24">
        <ShoppingBag className="h-16 w-16 text-muted-foreground/40" />
        <h2 className="mt-4 font-[family-name:var(--font-heading)] text-3xl font-bold">Your cart is empty</h2>
        <Link href="/products" className="mt-6 inline-flex h-12 items-center rounded-xl bg-foreground px-8 text-sm font-medium text-background transition-all hover:opacity-90">
          Shop Now
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/cart" className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground">
          <ArrowLeft className="h-4 w-4" />
          Back to Cart
        </Link>
      </div>

      <h1 className="mb-8 font-[family-name:var(--font-heading)] text-3xl font-bold tracking-tight sm:text-4xl">
        Checkout
      </h1>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="space-y-8 lg:col-span-2">
            <div className="rounded-2xl border p-6">
              <h2 className="mb-5 text-lg font-semibold">Shipping Address</h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label htmlFor="fullName" className="text-sm font-medium">Full Name</label>
                  <input id="fullName" value={formData.fullName} onChange={handleChange} className="mt-1.5 flex h-11 w-full rounded-xl border border-input bg-background px-4 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring" />
                  {errors.fullName && <p className="mt-1 text-xs text-destructive">{errors.fullName}</p>}
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="email" className="text-sm font-medium">Email</label>
                  <input id="email" type="email" value={formData.email} onChange={handleChange} className="mt-1.5 flex h-11 w-full rounded-xl border border-input bg-background px-4 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring" />
                  {errors.email && <p className="mt-1 text-xs text-destructive">{errors.email}</p>}
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="phone" className="text-sm font-medium">Phone</label>
                  <input id="phone" type="tel" value={formData.phone} onChange={handleChange} className="mt-1.5 flex h-11 w-full rounded-xl border border-input bg-background px-4 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring" />
                  {errors.phone && <p className="mt-1 text-xs text-destructive">{errors.phone}</p>}
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="address" className="text-sm font-medium">Address</label>
                  <input id="address" value={formData.address} onChange={handleChange} className="mt-1.5 flex h-11 w-full rounded-xl border border-input bg-background px-4 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring" />
                  {errors.address && <p className="mt-1 text-xs text-destructive">{errors.address}</p>}
                </div>
                <div>
                  <label htmlFor="city" className="text-sm font-medium">City</label>
                  <input id="city" value={formData.city} onChange={handleChange} className="mt-1.5 flex h-11 w-full rounded-xl border border-input bg-background px-4 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring" />
                  {errors.city && <p className="mt-1 text-xs text-destructive">{errors.city}</p>}
                </div>
                <div>
                  <label htmlFor="state" className="text-sm font-medium">State</label>
                  <input id="state" value={formData.state} onChange={handleChange} className="mt-1.5 flex h-11 w-full rounded-xl border border-input bg-background px-4 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring" />
                  {errors.state && <p className="mt-1 text-xs text-destructive">{errors.state}</p>}
                </div>
                <div>
                  <label htmlFor="zip" className="text-sm font-medium">ZIP Code</label>
                  <input id="zip" value={formData.zip} onChange={handleChange} className="mt-1.5 flex h-11 w-full rounded-xl border border-input bg-background px-4 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring" />
                  {errors.zip && <p className="mt-1 text-xs text-destructive">{errors.zip}</p>}
                </div>
                <div>
                  <label htmlFor="country" className="text-sm font-medium">Country</label>
                  <input id="country" value={formData.country} onChange={handleChange} className="mt-1.5 flex h-11 w-full rounded-xl border border-input bg-background px-4 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring" />
                  {errors.country && <p className="mt-1 text-xs text-destructive">{errors.country}</p>}
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="notes" className="text-sm font-medium">Order Notes (Optional)</label>
                  <textarea id="notes" value={formData.notes} onChange={handleChange} placeholder="Special instructions..." rows={3} className="mt-1.5 flex w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring resize-none" />
                </div>
              </div>
            </div>

            <div className="rounded-2xl border p-6">
              <h2 className="mb-4 text-lg font-semibold">Payment Method</h2>
              <div className="flex items-center gap-4 rounded-2xl bg-muted/30 p-5 border">
                <CreditCard className="h-6 w-6 text-muted-foreground" />
                <div>
                  <p className="font-medium">Cash on Delivery (COD)</p>
                  <p className="text-sm text-muted-foreground">Pay when your order arrives</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-2xl border p-6">
              <h2 className="mb-4 text-lg font-semibold">Order Summary</h2>
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={`${item.productId}-${item.color}-${item.size}`} className="flex gap-3">
                    <img src={item.image || '/placeholder.svg'} alt={item.name} className="h-14 w-14 flex-shrink-0 rounded-xl object-cover bg-muted" />
                    <div className="flex-1 min-w-0">
                      <p className="truncate text-sm font-medium">{item.name}</p>
                      <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                      <p className="text-sm font-medium">{formatPrice((item.discountPrice || item.price) * item.quantity)}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="my-4 h-px bg-border" />

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">{formatPrice(subtotal)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-600">
                    <span>Discount ({coupon?.code})</span>
                    <span className="font-medium">-{formatPrice(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="font-medium">{shipping === 0 ? <span className="text-emerald-600">Free</span> : formatPrice(shipping)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tax</span>
                  <span className="font-medium">{formatPrice(tax)}</span>
                </div>
                <div className="h-px bg-border" />
                <div className="flex justify-between text-base font-semibold">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>

              <div className="mt-4 space-y-2 rounded-2xl bg-muted/30 p-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Truck className="h-3.5 w-3.5" />
                  <span>Free shipping on orders over $100</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  <span>30-day return guarantee</span>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-foreground py-4 text-base font-medium text-background transition-all duration-200 hover:opacity-90 disabled:opacity-50 shadow-sm"
            >
              {submitting ? 'Placing Order...' : `Place Order - ${formatPrice(total)}`}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
