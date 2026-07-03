'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function SignupPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student',
    secretKey: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setError('');

    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    setLoading(false);

    if (!res.ok) {
      setError(data.error);
      return;
    }

    router.push('/login');
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ background: 'var(--background)' }}
    >
      <Card className="w-full max-w-md shadow-xl border border-blue-200">
        <CardHeader className="text-center pb-2">
          <div className="text-3xl mb-2">🎓</div>

          <CardTitle className="text-2xl font-bold text-white">
            Smart Campus
          </CardTitle>

          <p className="text-sm text-blue-500">
            Create new account to manage your campus life
          </p>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Name */}

            <div>
              <Label htmlFor="name" className="text-white">
                Naam
              </Label>

              <Input
                id="name"
                placeholder="Write your name"
                value={form.name}
                onChange={(e) =>
                  setForm({
                    ...form,
                    name: e.target.value,
                  })
                }
                className="border-blue-200 focus:border-blue-500"
                required
              />
            </div>

            {/* Email */}

            <div>
              <Label htmlFor="email" className="text-white">
                Email
              </Label>

              <Input
                id="email"
                type="email"
                placeholder="email@college.com"
                value={form.email}
                onChange={(e) =>
                  setForm({
                    ...form,
                    email: e.target.value,
                  })
                }
                className="border-blue-200 focus:border-blue-500"
                required
              />
            </div>

            {/* Account Type */}

            <div>
              <Label className="text-white">
                Account Type
              </Label>

              <div className="grid grid-cols-2 gap-3 mt-2">
                <Button
                  type="button"
                  variant={
                    form.role === 'student'
                      ? 'default'
                      : 'outline'
                  }
                  onClick={() =>
                    setForm({
                      ...form,
                      role: 'student',
                    })
                  }
                >
                  👨‍🎓 Student
                </Button>

                <Button
                  type="button"
                  variant={
                    form.role === 'admin'
                      ? 'default'
                      : 'outline'
                  }
                  onClick={() =>
                    setForm({
                      ...form,
                      role: 'admin',
                    })
                  }
                >
                  👨‍💼 Admin
                </Button>
              </div>
            </div>

            {/* Password */}

            <div>
              <Label htmlFor="password" className="text-white">
                Password
              </Label>

              <Input
                id="password"
                type="password"
                placeholder="6+ characters"
                value={form.password}
                onChange={(e) =>
                  setForm({
                    ...form,
                    password: e.target.value,
                  })
                }
                className="border-blue-200 focus:border-blue-500"
                required
              />
            </div>

            {/* Secret Key */}

            {form.role === 'admin' && (
              <div>
                <Label className="text-white">
                  Admin Secret Key
                </Label>

                <Input
                  type="password"
                  placeholder="Enter Secret Key"
                  value={form.secretKey}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      secretKey: e.target.value,
                    })
                  }
                  className="border-blue-200 focus:border-blue-500"
                  required={form.role === 'admin'}
                />
              </div>
            )}

            {error && (
              <p className="text-red-500 text-sm bg-red-50 p-2 rounded">
                {error}
              </p>
            )}

            <Button
              type="submit"
              className="w-full bg-violet-600 hover:bg-violet-700 text-white"
              disabled={loading}
            >
              {loading ? 'Creating ...' : 'Create Account'}
            </Button>

            <p className="text-center text-sm text-blue-400">
              Already have account?{' '}
              <a
                href="/login"
                className="text-blue-600 font-medium hover:underline"
              >
                Login 
              </a>
            </p>

          </form>
        </CardContent>
      </Card>
    </div>
  );
}