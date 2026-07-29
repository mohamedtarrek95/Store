import mongoose, { Schema, Model } from 'mongoose';

export interface IUser {
  name: string;
  email: string;
  password: string;
  image?: string;
  phone?: string;
  address?: {
    address: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  isAdmin: boolean;
  wishlist?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    image: { type: String },
    phone: { type: String },
    address: {
      address: String,
      city: String,
      state: String,
      zip: String,
      country: String,
    },
    isAdmin: { type: Boolean, default: false },
    wishlist: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
  },
  { timestamps: true }
);

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
export default User;
