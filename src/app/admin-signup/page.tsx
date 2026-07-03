'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function AdminSignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', password: '', adminSecret: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const res = await fetch('/api/auth/admin-signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) { setError(data.error); return; }
    router.push('/login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'var(--background)' }}>
      <Card className="w-full max-w-md shadow-xl border border-blue-200">
        <CardHeader className="text-center pb-2">
          <div className="text-3xl mb-2">🔐</div>
          <CardTitle className="text-2xl font-bold text-white">Admin Account</CardTitle>
          <p className="text-sm text-blue-500">Admin account banao</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label className="text-white">Naam</Label>
              <Input placeholder="Admin naam"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                className="border-blue-200" required />
            </div>
            <div>
              <Label className="text-white">Email</Label>
              <Input type="email" placeholder="admin@college.com"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                className="border-blue-200" required />
            </div>
            <div>
              <Label className="text-white">Password</Label>
              <Input type="password" placeholder="6+ characters"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                className="border-blue-200" required />
            </div>
            <div>
              <Label className="text-white">Admin Secret Key</Label>
              <Input type="password" placeholder="Secret key daalo"
                value={form.adminSecret}
                onChange={e => setForm({ ...form, adminSecret: e.target.value })}
                className="border-blue-200" required />
            </div>
            {error && <p className="text-red-500 text-sm bg-red-50 p-2 rounded">{error}</p>}
            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white" disabled={loading}>
              {loading ? 'Ban raha hai...' : 'Admin Account Banao'}
            </Button>
            <p className="text-center text-sm text-blue-400">
              Student ho? <a href="/signup" className="text-blue-600 hover:underline">Student signup</a>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}