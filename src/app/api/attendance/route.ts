import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { connectDB } from '@/lib/mongodb';
import Attendance from '@/models/Attendance';

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
    const records = await Attendance.find({ userId }).sort({ date: -1 });
    return NextResponse.json({ records });
  } catch {
    return NextResponse.json({ error: 'Kuch galat hua' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const userId = getUserId(req);
    if (!userId) return NextResponse.json({ error: 'Login karo' }, { status: 401 });
    const { subject, date, status } = await req.json();
    await connectDB();
    const existing = await Attendance.findOne({ userId, subject, date });
    if (existing) {
      existing.status = status;
      await existing.save();
      return NextResponse.json({ record: existing });
    }
    const record = await Attendance.create({ userId, subject, date, status });
    return NextResponse.json({ record }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Kuch galat hua' }, { status: 500 });
  }
}