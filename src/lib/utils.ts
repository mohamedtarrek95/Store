import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(price);
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.slice(0, length) + '...';
}

export function getDiscountedPrice(price: number, discountPrice?: number): number {
  if (discountPrice && discountPrice < price) return discountPrice;
  return price;
}

export function getDiscountPercentage(price: number, discountPrice?: number): number {
  if (discountPrice && discountPrice < price) {
    return Math.round(((price - discountPrice) / price) * 100);
  }
  return 0;
}

export function generateOrderNumber(): string {
  const prefix = 'ACC';
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
}
