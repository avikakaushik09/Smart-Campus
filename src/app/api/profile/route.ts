import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';

function getUserId(req: NextRequest) {
  const token = req.cookies.get('token')?.value;
  if (!token) return null;
  const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
  return decoded.userId;
}

export async function GET(req: NextRequest) {
  try {
    const userId = getUserId(req);
    if (!userId) return NextResponse.json({ error: 'Login karo' }, { status: 401 });
    await connectDB();
    const user = await User.findById(userId).select('-password');
    return NextResponse.json({ user });
  } catch {
    return NextResponse.json({ error: 'Kuch galat hua' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const userId = getUserId(req);
    if (!userId) return NextResponse.json({ error: 'Login karo' }, { status: 401 });
    const { name, currentPassword, newPassword } = await req.json();
    await connectDB();
    const user = await User.findById(userId);
    if (!user) return NextResponse.json({ error: 'User nahi mila' }, { status: 404 });

    user.name = name;

    if (newPassword) {
      if (!currentPassword) return NextResponse.json({ error: 'Current password daalo' }, { status: 400 });
      const match = await bcrypt.compare(currentPassword, user.password);
      if (!match) return NextResponse.json({ error: 'Current password galat hai' }, { status: 400 });
      user.password = await bcrypt.hash(newPassword, 10);
    }

    await user.save();
    return NextResponse.json({ message: 'Profile update ho gaya!' });
  } catch {
    return NextResponse.json({ error: 'Kuch galat hua' }, { status: 500 });
  }
}