import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import { getToken } from 'next-auth/jwt';

export async function PUT(req: NextRequest) {
  try {
    const token = await getToken({ req });
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const body = await req.json();

    const allowed = ['name', 'phone', 'address', 'city', 'state', 'zip', 'country'];
    const updateData: Record<string, string> = {};
    for (const field of allowed) {
      if (body[field] !== undefined) updateData[field] = body[field];
    }

    const user = await User.findByIdAndUpdate(token.id as string, updateData, { new: true }).select('-password');
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error('PUT /api/user/profile error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update profile' },
      { status: 500 }
    );
  }
}
