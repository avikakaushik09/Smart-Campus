import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { connectDB } from '@/lib/mongodb';
import Timetable from '@/models/Timetable';

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
    const classes = await Timetable.find({ userId });
    return NextResponse.json({ classes });
  } catch {
    return NextResponse.json({ error: 'Kuch galat hua' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const userId = getUserId(req);
    if (!userId) return NextResponse.json({ error: 'Login karo' }, { status: 401 });
    const { subject, day, startTime, endTime, room } = await req.json();
    await connectDB();
    const entry = await Timetable.create({ userId, subject, day, startTime, endTime, room });
    return NextResponse.json({ entry }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Kuch galat hua' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const userId = getUserId(req);
    if (!userId) return NextResponse.json({ error: 'Login karo' }, { status: 401 });
    const { id } = await req.json();
    await connectDB();
    await Timetable.findOneAndDelete({ _id: id, userId });
    return NextResponse.json({ message: 'Delete ho gaya' });
  } catch {
    return NextResponse.json({ error: 'Kuch galat hua' }, { status: 500 });
  }
}