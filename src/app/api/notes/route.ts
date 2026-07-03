import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { connectDB } from '@/lib/mongodb';
import Note from '@/models/Note';

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
    const notes = await Note.find({ userId }).sort({ createdAt: -1 });
    return NextResponse.json({ notes });
  } catch {
    return NextResponse.json({ error: 'Kuch galat hua' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const userId = getUserId(req);
    if (!userId) return NextResponse.json({ error: 'Login karo' }, { status: 401 });
    const { title, content } = await req.json();
    await connectDB();
    const note = await Note.create({ userId, title, content });
    return NextResponse.json({ note }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Kuch galat hua' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const userId = getUserId(req);
    if (!userId) return NextResponse.json({ error: 'Login karo' }, { status: 401 });
    const { id, title, content } = await req.json();
    await connectDB();
    const note = await Note.findOneAndUpdate(
      { _id: id, userId },
      { title, content },
      { new: true }
    );
    return NextResponse.json({ note });
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
    await Note.findOneAndDelete({ _id: id, userId });
    return NextResponse.json({ message: 'Delete ho gaya' });
  } catch {
    return NextResponse.json({ error: 'Kuch galat hua' }, { status: 500 });
  }
}