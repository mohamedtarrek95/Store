import mongoose, { Schema, Model } from 'mongoose';

export interface ISettings {
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

const SettingsSchema = new Schema<ISettings>(
  {
    storeName: { type: String, default: 'Luxe Accessories' },
    logo: String,
    contactEmail: { type: String, default: '' },
    phone: { type: String, default: '' },
    address: { type: String, default: '' },
    socialLinks: {
      facebook: String,
      instagram: String,
      twitter: String,
      youtube: String,
    },
    shippingCost: { type: Number, default: 0 },
    taxRate: { type: Number, default: 0 },
    currency: { type: String, default: 'USD' },
    banner: String,
    bannerText: String,
  },
  { timestamps: true }
);

const Settings: Model<ISettings> = mongoose.models.Settings || mongoose.model<ISettings>('Settings', SettingsSchema);
export default Settings;
