import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Coupon from '@/models/Coupon';

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const { code, subtotal } = await req.json();

    const coupon = await Coupon.findOne({ code: code.toUpperCase(), isActive: true });
    
    if (!coupon) {
      return NextResponse.json({ valid: false, message: 'Invalid coupon code' });
    }

    if (coupon.expiresAt < new Date()) {
      return NextResponse.json({ valid: false, message: 'Coupon has expired' });
    }

    if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) {
      return NextResponse.json({ valid: false, message: 'Coupon has reached maximum uses' });
    }

    if (coupon.minAmount && subtotal < coupon.minAmount) {
      return NextResponse.json({ valid: false, message: `Minimum order amount is $${coupon.minAmount}` });
    }

    const discount = (subtotal * coupon.discountPercentage) / 100;

    return NextResponse.json({
      valid: true,
      discount,
      discountPercentage: coupon.discountPercentage,
      code: coupon.code,
    });
  } catch (error) {
    return NextResponse.json({ valid: false, message: 'Failed to validate coupon' });
  }
}
