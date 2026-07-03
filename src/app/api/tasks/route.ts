import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { connectDB } from '@/lib/mongodb';
import Task from '@/models/Task';

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
    const tasks = await Task.find({ userId }).sort({ createdAt: -1 });
    return NextResponse.json({ tasks });
  } catch {
    return NextResponse.json({ error: 'Kuch galat hua' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const userId = getUserId(req);
    if (!userId) return NextResponse.json({ error: 'Login karo' }, { status: 401 });
    const { title, subject, dueDate } = await req.json();
    await connectDB();
    const task = await Task.create({ userId, title, subject, dueDate });
    return NextResponse.json({ task }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Kuch galat hua' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const userId = getUserId(req);
    if (!userId) return NextResponse.json({ error: 'Login karo' }, { status: 401 });
    const { taskId, completed } = await req.json();
    await connectDB();
    const task = await Task.findOneAndUpdate(
      { _id: taskId, userId },
      { completed },
      { new: true }
    );
    return NextResponse.json({ task });
  } catch {
    return NextResponse.json({ error: 'Kuch galat hua' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const userId = getUserId(req);
    if (!userId) return NextResponse.json({ error: 'Login karo' }, { status: 401 });
    const { taskId } = await req.json();
    await connectDB();
    await Task.findOneAndDelete({ _id: taskId, userId });
    return NextResponse.json({ message: 'Delete ho gaya' });
  } catch {
    return NextResponse.json({ error: 'Kuch galat hua' }, { status: 500 });
  }
}