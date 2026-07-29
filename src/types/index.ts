export interface ProductType {
  _id: string;
  name: string;
  slug: string;
  description: string;
  category: CategoryType | string;
  price: number;
  discountPrice?: number;
  sku: string;
  stock: number;
  images: string[];
  featuredImage: string;
  colors: string[];
  sizes?: string[];
  brand: string;
  rating: number;
  numReviews: number;
  featured: boolean;
  bestSeller: boolean;
  newArrival: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CategoryType {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  createdAt: string;
}

export interface OrderType {
  _id: string;
  orderNumber: string;
  user: string | { _id: string; name: string; email: string };
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  paymentMethod: string;
  paymentStatus: 'pending' | 'paid' | 'failed';
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  subtotal: number;
  shipping: number;
  tax: number;
  discount: number;
  total: number;
  couponCode?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  product: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  color?: string;
  size?: string;
}

export interface ShippingAddress {
  fullName: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  phone: string;
}

export interface UserType {
  _id: string;
  name: string;
  email: string;
  password: string;
  image?: string;
  phone?: string;
  address?: ShippingAddress;
  isAdmin: boolean;
  wishlist?: string[];
  createdAt: string;
}

export interface ReviewType {
  _id: string;
  product: string;
  user: { _id: string; name: string; image?: string };
  rating: number;
  title: string;
  comment: string;
  createdAt: string;
}

export interface CouponType {
  _id: string;
  code: string;
  description?: string;
  discountPercentage: number;
  minAmount?: number;
  maxUses?: number;
  usedCount: number;
  isActive: boolean;
  expiresAt: string;
  createdAt: string;
}

export interface SettingsType {
  storeName: string;
  logo?: string;
  contactEmail: string;
  phone: string;
  address: string;
  socialLinks: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    youtube?: string;
  };
  shippingCost: number;
  taxRate: number;
  currency: string;
  banner?: string;
  bannerText?: string;
}

export interface CartItem {
  productId: string;
  name: string;
  image: string;
  price: number;
  discountPrice?: number;
  quantity: number;
  color?: string;
  size?: string;
  stock: number;
}
