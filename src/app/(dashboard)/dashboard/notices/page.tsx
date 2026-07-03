'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface Notice {
  _id: string;
  title: string;
  content: string;
  postedBy: string;
  createdAt: string;
}

export default function NoticesPage() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', content: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => { fetchNotices(); }, []);

  const fetchNotices = async () => {
    const res = await fetch('/api/notices');
    const data = await res.json();
    if (data.notices) setNotices(data.notices);
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await fetch('/api/notices', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    setForm({ title: '', content: '' });
    setShowForm(false);
    setLoading(false);
    fetchNotices();
  };

  const timeAgo = (date: string) => {
    const diff = Date.now() - new Date(date).getTime();
    const mins = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    if (mins < 60) return `${mins} min ago`;
    if (hours < 24) return `${hours} hr ago`;
    return `${days} days ago`;
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Notice Board</h1>
          <p className="text-blue-400 mt-1">Important notices dekho</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 hover:bg-blue-700 text-white">
          {showForm ? 'Cancel' : '+ Post Notice'}
        </Button>
      </div>

      {showForm && (
        <Card className="mb-6 border border-blue-200"
          style={{ boxShadow: '0 0 20px rgba(37,99,235,0.15)' }}>
          <CardHeader>
            <CardTitle className="text-white">Naya Notice Post Karo</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <Label className="text-white">Title</Label>
                <Input placeholder="Notice ka title"
                  value={form.title}
                  onChange={e => setForm({ ...form, title: e.target.value })}
                  className="border-blue-200" required />
              </div>
              <div>
                <Label className="text-white">Content</Label>
                <textarea placeholder="Notice ka content..."
                  value={form.content}
                  onChange={e => setForm({ ...form, content: e.target.value })}
                  className="w-full border border-blue-200 rounded-lg px-3 py-2 text-white min-h-24 resize-none"
                  required />
              </div>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white w-full" disabled={loading}>
                {loading ? 'Post ho raha hai...' : 'Notice Post Karo'}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {notices.length === 0 ? (
        <div className="text-center py-16 text-blue-300">
          <div className="text-5xl mb-4">📢</div>
          <p>Koi notice nahi abhi</p>
        </div>
      ) : (
        <div className="space-y-4">
          {notices.map((notice, index) => (
            <Card key={notice._id} className="border border-blue-100 bg-white">
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div className="flex gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold shrink-0">
                      {notice.postedBy?.[0]?.toUpperCase() || 'A'}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-white">{notice.title}</h3>
                        {index === 0 && (
                          <span className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded-full">New</span>
                        )}
                      </div>
                      <p className="text-blue-400 text-xs mt-0.5">
                        {notice.postedBy} • {timeAgo(notice.createdAt)}
                      </p>
                      <p className="text-blue-700 mt-2 text-sm leading-relaxed">{notice.content}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}