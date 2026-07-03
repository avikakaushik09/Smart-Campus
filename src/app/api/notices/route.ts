import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { connectDB } from '@/lib/mongodb';
import Notice from '@/models/Notice';

function getUser(req: NextRequest) {
  const token = req.cookies.get('token')?.value;
  if (!token) return null;
  return jwt.verify(token, process.env.JWT_SECRET!) as any;
}

export async function GET() {
  try {
    await connectDB();
    const notices = await Notice.find().sort({ createdAt: -1 });
    return NextResponse.json({ notices });
  } catch {
    return NextResponse.json({ error: 'Kuch galat hua' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = getUser(req);
    if (!user) return NextResponse.json({ error: 'Login karo' }, { status: 401 });
    const { title, content } = await req.json();
    await connectDB();
    const notice = await Notice.create({ title, content, postedBy: user.name });
    return NextResponse.json({ notice }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Kuch galat hua' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const user = getUser(req);
    if (!user || user.role !== 'admin') return NextResponse.json({ error: 'Admin only' }, { status: 403 });
    const { id } = await req.json();
    await connectDB();
    await Notice.findByIdAndDelete(id);
    return NextResponse.json({ message: 'Delete ho gaya' });
  } catch {
    return NextResponse.json({ error: 'Kuch galat hua' }, { status: 500 });
  }
}