import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export const productSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  category: z.string().min(1, 'Category is required'),
  price: z.coerce.number().positive('Price must be positive'),
  discountPrice: z.coerce.number().optional(),
  sku: z.string().min(1, 'SKU is required'),
  stock: z.coerce.number().int().positive('Stock must be positive'),
  images: z.array(z.string()).min(1, 'At least one image is required'),
  featuredImage: z.string().min(1, 'Featured image is required'),
  colors: z.string().optional(),
  sizes: z.string().optional(),
  brand: z.string().min(1, 'Brand is required'),
  featured: z.boolean().default(false),
  bestSeller: z.boolean().default(false),
  newArrival: z.boolean().default(false),
});

export const categorySchema = z.object({
  name: z.string().min(2, 'Name is required'),
  description: z.string().optional(),
  image: z.string().optional(),
});

export const couponSchema = z.object({
  code: z.string().min(3, 'Code must be at least 3 characters'),
  description: z.string().optional(),
  discountPercentage: z.coerce.number().min(1).max(100),
  minAmount: z.coerce.number().optional(),
  maxUses: z.coerce.number().optional(),
  expiresAt: z.string().min(1, 'Expiration date is required'),
  isActive: z.boolean().default(true),
});

export const settingsSchema = z.object({
  storeName: z.string().min(1, 'Store name is required'),
  logo: z.string().optional(),
  contactEmail: z.string().email().optional().or(z.literal('')),
  phone: z.string().optional(),
  address: z.string().optional(),
  facebook: z.string().optional(),
  instagram: z.string().optional(),
  twitter: z.string().optional(),
  youtube: z.string().optional(),
  shippingCost: z.coerce.number().min(0),
  taxRate: z.coerce.number().min(0).max(100),
  currency: z.string().min(1),
  banner: z.string().optional(),
  bannerText: z.string().optional(),
});

export const checkoutSchema = z.object({
  fullName: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email'),
  phone: z.string().min(6, 'Phone is required'),
  address: z.string().min(5, 'Address is required'),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  zip: z.string().min(3, 'ZIP is required'),
  country: z.string().min(2, 'Country is required'),
  notes: z.string().optional(),
});

export const reviewSchema = z.object({
  rating: z.number().min(1).max(5),
  title: z.string().min(2, 'Title is required'),
  comment: z.string().min(10, 'Comment must be at least 10 characters'),
});

export const profileSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  phone: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zip: z.string().optional(),
  country: z.string().optional(),
});
