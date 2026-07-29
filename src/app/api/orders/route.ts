import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Order from '@/models/Order';
import Product from '@/models/Product';
import Coupon from '@/models/Coupon';
import { getToken } from 'next-auth/jwt';

function generateOrderNumber(): string {
  const prefix = 'ACC';
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
}

export async function GET(req: NextRequest) {
  try {
    const token = await getToken({ req });
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    const query: any = {};
    
    if (!(token as any).isAdmin) {
      query.user = token.id as string;
    }
    if (status) query.status = status;
    if (search) {
      query.$or = [
        { orderNumber: { $regex: search, $options: 'i' } },
      ];
    }

    const orders = await Order.find(query)
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    return NextResponse.json(orders);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = await getToken({ req });
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const body = await req.json();

    let subtotal = 0;
    const items = [];

    for (const item of body.items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return NextResponse.json({ error: `Product ${item.productId} not found` }, { status: 404 });
      }
      if (product.stock < item.quantity) {
        return NextResponse.json({ error: `Insufficient stock for ${product.name}` }, { status: 400 });
      }

      const price = product.discountPrice || product.price;
      subtotal += price * item.quantity;

      items.push({
        product: product._id,
        name: product.name,
        image: product.featuredImage,
        price,
        quantity: item.quantity,
        color: item.color,
        size: item.size,
      });

      product.stock -= item.quantity;
      await product.save();
    }

    let discount = 0;
    if (body.couponCode) {
      const coupon = await Coupon.findOne({ code: body.couponCode.toUpperCase(), isActive: true });
      if (coupon && coupon.expiresAt > new Date() && (coupon.maxUses ? coupon.usedCount < coupon.maxUses : true)) {
        if (!coupon.minAmount || subtotal >= coupon.minAmount) {
          discount = (subtotal * coupon.discountPercentage) / 100;
          coupon.usedCount += 1;
          await coupon.save();
        }
      }
    }

    const shipping = body.shipping || 10;
    const tax = (subtotal - discount) * (body.taxRate || 0.08);
    const total = subtotal + shipping + tax - discount;

    const order = await Order.create({
      orderNumber: generateOrderNumber(),
      user: token.id as string,
      items,
      shippingAddress: body.shippingAddress,
      paymentMethod: 'cod',
      subtotal,
      shipping,
      tax,
      discount,
      total,
      couponCode: body.couponCode,
    });

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}
