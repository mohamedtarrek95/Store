import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import Order from '@/models/Order';
import { getToken } from 'next-auth/jwt';

export async function GET(req: NextRequest) {
  try {
    const token = await getToken({ req });
    if (!token || !(token as any).isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search');

    const query: any = { isAdmin: { $ne: true } };
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const customers = await User.find(query).select('-password').sort({ createdAt: -1 });

    const customersWithOrders = await Promise.all(
      customers.map(async (customer) => {
        const orderCount = await Order.countDocuments({ user: customer._id });
        const totalSpent = await Order.aggregate([
          { $match: { user: customer._id, status: { $ne: 'cancelled' } } },
          { $group: { _id: null, total: { $sum: '$total' } } },
        ]);
        return {
          ...customer.toObject(),
          orderCount,
          totalSpent: totalSpent[0]?.total || 0,
        };
      })
    );

    return NextResponse.json(customersWithOrders);
  } catch (error) {
    console.error('GET /api/customers error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch customers' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const token = await getToken({ req });
    if (!token || !(token as any).isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Customer ID required' }, { status: 400 });
    }

    await User.findByIdAndDelete(id);
    return NextResponse.json({ message: 'Customer deleted' });
  } catch (error) {
    console.error('DELETE /api/customers error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to delete customer' },
      { status: 500 }
    );
  }
}
