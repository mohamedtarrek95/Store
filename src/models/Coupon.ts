import mongoose, { Schema, Model } from 'mongoose';

export interface ICoupon {
  code: string;
  description?: string;
  discountPercentage: number;
  minAmount?: number;
  maxUses?: number;
  usedCount: number;
  isActive: boolean;
  expiresAt: Date;
  createdAt: Date;
}

const CouponSchema = new Schema<ICoupon>(
  {
    code: { type: String, required: true, unique: true, uppercase: true },
    description: String,
    discountPercentage: { type: Number, required: true, min: 1, max: 100 },
    minAmount: { type: Number },
    maxUses: { type: Number },
    usedCount: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true }
);

const Coupon: Model<ICoupon> = mongoose.models.Coupon || mongoose.model<ICoupon>('Coupon', CouponSchema);
export default Coupon;
