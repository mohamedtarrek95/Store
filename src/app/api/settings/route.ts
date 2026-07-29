import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Settings from '@/models/Settings';
import { getToken } from 'next-auth/jwt';

export async function GET() {
  try {
    await dbConnect();
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create({ storeName: 'Luxe Accessories' });
    }
    return NextResponse.json(settings);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const token = await getToken({ req });
    if (!token || !(token as any).isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const body = await req.json();

    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create(body);
    } else {
      const updateData: any = {};
      const fields = ['storeName', 'logo', 'contactEmail', 'phone', 'address', 'shippingCost', 'taxRate', 'currency', 'banner', 'bannerText'];
      const socialFields = ['facebook', 'instagram', 'twitter', 'youtube'];

      fields.forEach(f => {
        if (body[f] !== undefined) updateData[f] = body[f];
      });

      if (socialFields.some(f => body[f] !== undefined)) {
        updateData.socialLinks = {};
        socialFields.forEach(f => {
          if (body[f] !== undefined) updateData.socialLinks[f] = body[f];
        });
      }

      settings = await Settings.findByIdAndUpdate(settings._id, updateData, { new: true });
    }

    return NextResponse.json(settings);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
  }
}
