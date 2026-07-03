'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function ProfilePage() {
  const [user, setUser] = useState({ name: '', email: '' });
  const [form, setForm] = useState({ name: '', currentPassword: '', newPassword: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => { fetchProfile(); }, []);

  const fetchProfile = async () => {
    const res = await fetch('/api/profile');
    const data = await res.json();
    if (data.user) {
      setUser(data.user);
      setForm(f => ({ ...f, name: data.user.name }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    const res = await fetch('/api/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) { setError(data.error); return; }
    setMessage('Profile update ho gaya!');
    fetchProfile();
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Profile</h1>
        <p className="text-blue-400 mt-1">Apni details update karo</p>
      </div>

      {/* Profile Card */}
      <div className="flex items-center gap-4 mb-8">
        <div className="w-20 h-20 rounded-full bg-blue-600 flex items-center justify-center text-white text-3xl font-bold">
          {user.name?.[0]?.toUpperCase() || '?'}
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">{user.name}</h2>
          <p className="text-blue-400">{user.email}</p>
          <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full mt-1 inline-block">Student</span>
        </div>
      </div>

      <Card className="border border-blue-200 max-w-lg"
        style={{ boxShadow: '0 0 20px rgba(37,99,235,0.15)' }}>
        <CardHeader>
          <CardTitle className="text-white">Profile Update Karo</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label className="text-white">Naam</Label>
              <Input placeholder="Apna naam"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                className="border-blue-200" required />
            </div>
            <div>
              <Label className="text-white">Current Password</Label>
              <Input type="password" placeholder="Purana password"
                value={form.currentPassword}
                onChange={e => setForm({ ...form, currentPassword: e.target.value })}
                className="border-blue-200" />
            </div>
            <div>
              <Label className="text-white">New Password (optional)</Label>
              <Input type="password" placeholder="Naya password (khali chhod sakte ho)"
                value={form.newPassword}
                onChange={e => setForm({ ...form, newPassword: e.target.value })}
                className="border-blue-200" />
            </div>
            {message && <p className="text-green-600 text-sm bg-green-50 p-2 rounded">{message}</p>}
            {error && <p className="text-red-500 text-sm bg-red-50 p-2 rounded">{error}</p>}
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white w-full" disabled={loading}>
              {loading ? 'Update ho raha hai...' : 'Update Karo'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}