import mongoose, { Schema, Model } from 'mongoose';

export interface IProduct {
  name: string;
  slug: string;
  description: string;
  category: mongoose.Types.ObjectId;
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
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    price: { type: Number, required: true },
    discountPrice: { type: Number },
    sku: { type: String, required: true, unique: true },
    stock: { type: Number, required: true, default: 0 },
    images: [{ type: String }],
    featuredImage: { type: String, required: true },
    colors: [{ type: String }],
    sizes: [{ type: String }],
    brand: { type: String, required: true },
    rating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
    featured: { type: Boolean, default: false },
    bestSeller: { type: Boolean, default: false },
    newArrival: { type: Boolean, default: false },
  },
  { timestamps: true }
);

ProductSchema.index({ name: 'text', description: 'text', brand: 'text' });
ProductSchema.index({ category: 1 });
ProductSchema.index({ price: 1 });
ProductSchema.index({ featured: 1 });
ProductSchema.index({ bestSeller: 1 });
ProductSchema.index({ newArrival: 1 });

const Product: Model<IProduct> = mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);
export default Product;
