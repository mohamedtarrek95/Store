import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Review from '@/models/Review';
import Product from '@/models/Product';
import { getToken } from 'next-auth/jwt';

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get('productId');

    const query: any = {};
    if (productId) query.product = productId;

    const reviews = await Review.find(query)
      .populate('user', 'name image')
      .sort({ createdAt: -1 });

    return NextResponse.json(reviews);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 });
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

    const existing = await Review.findOne({ product: body.productId, user: token.id as string });
    if (existing) {
      return NextResponse.json({ error: 'You have already reviewed this product' }, { status: 400 });
    }

    const review = await Review.create({
      product: body.productId,
      user: token.id as string,
      rating: body.rating,
      title: body.title,
      comment: body.comment,
    });

    const reviews = await Review.find({ product: body.productId });
    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    await Product.findByIdAndUpdate(body.productId, {
      rating: Math.round(avgRating * 10) / 10,
      numReviews: reviews.length,
    });

    const populated = await Review.findById(review._id).populate('user', 'name image');

    return NextResponse.json(populated, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create review' }, { status: 500 });
  }
}
