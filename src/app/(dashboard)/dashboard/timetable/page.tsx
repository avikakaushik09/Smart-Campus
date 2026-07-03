'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ClassEntry {
  _id: string;
  subject: string;
  day: string;
  startTime: string;
  endTime: string;
  room: string;
}

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export default function TimetablePage() {
  const [classes, setClasses] = useState<ClassEntry[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ subject: '', day: 'Monday', startTime: '', endTime: '', room: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => { fetchClasses(); }, []);

  const fetchClasses = async () => {
    const res = await fetch('/api/timetable');
    const data = await res.json();
    if (data.classes) setClasses(data.classes);
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await fetch('/api/timetable', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    setForm({ subject: '', day: 'Monday', startTime: '', endTime: '', room: '' });
    setShowForm(false);
    setLoading(false);
    fetchClasses();
  };

  const handleDelete = async (id: string) => {
    await fetch('/api/timetable', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    fetchClasses();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Timetable</h1>
          <p className="text-blue-400 mt-1">Manage your class schedule</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 hover:bg-blue-700 text-white">
          {showForm ? 'Cancel' : '+ Add Class'}
        </Button>
      </div>

      {showForm && (
        <Card className="mb-6 border border-blue-200"
          style={{ boxShadow: '0 0 20px rgba(37,99,235,0.15)' }}>
          <CardHeader>
            <CardTitle className="text-white">Add new class</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <Label className="text-blue-900">Subject</Label>
                <Input placeholder="Subject name"
                  value={form.subject}
                  onChange={e => setForm({ ...form, subject: e.target.value })}
                  className="border-blue-200" required />
              </div>
              <div>
                <Label className="text-white">Day</Label>
                <select value={form.day}
                  onChange={e => setForm({ ...form, day: e.target.value })}
                  className="w-full border border-blue-200 rounded-lg px-3 py-2 text-white">
                  {DAYS.map(d => <option key={d}>{d}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-white">Start Time</Label>
                  <Input type="time" value={form.startTime}
                    onChange={e => setForm({ ...form, startTime: e.target.value })}
                    className="border-blue-200" required />
                </div>
                <div>
                  <Label className="text-white">End Time</Label>
                  <Input type="time" value={form.endTime}
                    onChange={e => setForm({ ...form, endTime: e.target.value })}
                    className="border-blue-200" required />
                </div>
              </div>
              <div>
                <Label className="text-white">Room (Optional)</Label>
                <Input placeholder="Room number"
                  value={form.room}
                  onChange={e => setForm({ ...form, room: e.target.value })}
                  className="border-blue-200" />
              </div>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white w-full" disabled={loading}>
                {loading ? 'Add ho raha hai...' : 'Class Add Karo'}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {DAYS.map(day => {
          const dayClasses = classes
            .filter(c => c.day === day)
            .sort((a, b) => a.startTime.localeCompare(b.startTime));
          return (
            <Card key={day} className="border border-blue-100 bg-white">
              <CardHeader className="pb-2">
                <CardTitle className="text-blue-900 text-base">{day}</CardTitle>
              </CardHeader>
              <CardContent>
                {dayClasses.length === 0 ? (
                  <p className="text-blue-900 text-sm">No classes scheduled for this day.</p>
                ) : (
                  <div className="space-y-2">
                    {dayClasses.map(c => (
                      <div key={c._id} className="flex items-center justify-between bg-blue-50 rounded-lg px-4 py-2">
                        <div>
                          <span className="font-medium text-blue-900">{c.subject}</span>
                          <span className="text-blue-400 text-sm ml-3">{c.startTime} - {c.endTime}</span>
                          {c.room && <span className="text-blue-300 text-sm ml-2">• Room {c.room}</span>}
                        </div>
                        <button onClick={() => handleDelete(c._id)} className="text-red-400 hover:text-red-600">🗑️</button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}