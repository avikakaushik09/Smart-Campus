'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface AttendanceRecord {
  _id: string;
  subject: string;
  date: string;
  status: 'present' | 'absent';
}

export default function AttendancePage() {
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ subject: '', date: '', status: 'present' });
  const [loading, setLoading] = useState(false);

  useEffect(() => { fetchRecords(); }, []);

  const fetchRecords = async () => {
    const res = await fetch('/api/attendance');
    const data = await res.json();
    if (data.records) setRecords(data.records);
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await fetch('/api/attendance', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    setForm({ subject: '', date: '', status: 'present' });
    setShowForm(false);
    setLoading(false);
    fetchRecords();
  };

  // Subject wise stats
  const subjects = [...new Set(records.map(r => r.subject))];
  const getStats = (subject: string) => {
    const subRecords = records.filter(r => r.subject === subject);
    const present = subRecords.filter(r => r.status === 'present').length;
    const total = subRecords.length;
    const percentage = total === 0 ? 0 : Math.round((present / total) * 100);
    return { present, total, percentage };
  };

  const overallPresent = records.filter(r => r.status === 'present').length;
  const overallTotal = records.length;
  const overallPercentage = overallTotal === 0 ? 0 : Math.round((overallPresent / overallTotal) * 100);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Attendance</h1>
          <p className="text-blue-400 mt-1">Track your attendance records</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 hover:bg-blue-700 text-white">
          {showForm ? 'Cancel' : '+ Mark Attendance'}
        </Button>
      </div>

      {/* Overall Stats */}
      <Card className="mb-6 border border-blue-200"
        style={{ boxShadow: '0 0 20px rgba(37,99,235,0.15)' }}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-400 text-sm">Overall Attendance</p>
              <p className="text-5xl font-bold mt-1"
                style={{ color: overallPercentage >= 75 ? '#16a34a' : '#dc2626' }}>
                {overallPercentage}%
              </p>
              <p className="text-blue-300 text-sm mt-1">{overallPresent} / {overallTotal} classes</p>
            </div>
            <div className="text-6xl">
              {overallPercentage >= 75 ? '✅' : '⚠️'}
            </div>
          </div>
          {overallPercentage < 75 && (
            <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-3 text-red-600 text-sm">
              ⚠️ Warning! Attendance 75% se kam hai!
            </div>
          )}
        </CardContent>
      </Card>

      {/* Mark Attendance Form */}
      {showForm && (
        <Card className="mb-6 border border-blue-200"
          style={{ boxShadow: '0 0 20px rgba(37,99,235,0.15)' }}>
          <CardHeader>
            <CardTitle className="text-white">Attendance Mark Karo</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <Label className="text-white">Subject</Label>
                <Input placeholder="Subject naam"
                  value={form.subject}
                  onChange={e => setForm({ ...form, subject: e.target.value })}
                  className="border-blue-200" required />
              </div>
              <div>
                <Label className="text-white">Date</Label>
                <Input type="date"
                  value={form.date}
                  onChange={e => setForm({ ...form, date: e.target.value })}
                  className="border-blue-200" required />
              </div>
              <div>
                <Label className="text-white">Status</Label>
                <div className="flex gap-4 mt-2">
                  <button type="button"
                    onClick={() => setForm({ ...form, status: 'present' })}
                    className={`flex-1 py-2 rounded-lg border-2 font-medium transition-all ${form.status === 'present' ? 'bg-green-500 border-green-500 text-white' : 'border-green-200 text-green-600'}`}>
                    ✓ Present
                  </button>
                  <button type="button"
                    onClick={() => setForm({ ...form, status: 'absent' })}
                    className={`flex-1 py-2 rounded-lg border-2 font-medium transition-all ${form.status === 'absent' ? 'bg-red-500 border-red-500 text-white' : 'border-red-200 text-red-600'}`}>
                    ✗ Absent
                  </button>
                </div>
              </div>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white w-full" disabled={loading}>
                {loading ? 'Save ho raha hai...' : 'Save Karo'}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Subject wise */}
      <h2 className="text-lg font-semibold text-blue-100 mb-3">Subject-wise Attendance</h2>
      {subjects.length === 0 ? (
        <div className="text-center py-8 text-blue-300">Koi record nahi — attendance mark karo!</div>
      ) : (
        <div className="space-y-3">
          {subjects.map(subject => {
            const { present, total, percentage } = getStats(subject);
            return (
              <Card key={subject} className="border border-blue-100 bg-white">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-white">{subject}</span>
                    <span className="font-bold text-lg"
                      style={{ color: percentage >= 75 ? '#16a34a' : '#dc2626' }}>
                      {percentage}%
                    </span>
                  </div>
                  <div className="w-full bg-blue-50 rounded-full h-2">
                    <div className="h-2 rounded-full transition-all"
                      style={{
                        width: `${percentage}%`,
                        background: percentage >= 75 ? '#16a34a' : '#dc2626'
                      }} />
                  </div>
                  <p className="text-blue-300 text-xs mt-1">{present} present / {total} total</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}