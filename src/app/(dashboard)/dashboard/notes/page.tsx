'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Note {
  _id: string;
  title: string;
  content: string;
  createdAt: string;
}

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Note | null>(null);
  const [form, setForm] = useState({ title: '', content: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => { fetchNotes(); }, []);

  const fetchNotes = async () => {
    const res = await fetch('/api/notes');
    const data = await res.json();
    if (data.notes) setNotes(data.notes);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (editing) {
      await fetch('/api/notes', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: editing._id, ...form }),
      });
    } else {
      await fetch('/api/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
    }
    setForm({ title: '', content: '' });
    setShowForm(false);
    setEditing(null);
    setLoading(false);
    fetchNotes();
  };

  const handleEdit = (note: Note) => {
    setEditing(note);
    setForm({ title: note.title, content: note.content });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    await fetch('/api/notes', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    fetchNotes();
  };

  const colors = ['bg-yellow-50', 'bg-blue-50', 'bg-green-50', 'bg-pink-50', 'bg-purple-50'];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Notes</h1>
          <p className="text-blue-400 mt-1">Apne notes likho aur save karo</p>
        </div>
        <Button onClick={() => { setShowForm(!showForm); setEditing(null); setForm({ title: '', content: '' }); }}
          className="bg-blue-600 hover:bg-blue-700 text-white">
          {showForm ? 'Cancel' : '+ New Note'}
        </Button>
      </div>

      {showForm && (
        <div className="mb-6 bg-white border border-blue-200 rounded-2xl p-6"
          style={{ boxShadow: '0 0 20px rgba(37,99,235,0.15)' }}>
          <h2 className="text-white font-semibold mb-4">{editing ? 'Note Edit Karo' : 'Naya Note Likho'}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input placeholder="Note ka title"
              value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
              className="border-blue-200 text-white" required />
            <textarea placeholder="Yahan likho..."
              value={form.content}
              onChange={e => setForm({ ...form, content: e.target.value })}
              className="w-full border border-blue-200 rounded-lg px-3 py-2 text-white min-h-32 resize-none"
              required />
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white w-full" disabled={loading}>
              {loading ? 'Save ho raha hai...' : editing ? 'Update Karo' : 'Save Karo'}
            </Button>
          </form>
        </div>
      )}

      {notes.length === 0 ? (
        <div className="text-center py-16 text-blue-300">
          <div className="text-5xl mb-4">📝</div>
          <p>Koi note nahi — naya note likho!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {notes.map((note, i) => (
            <Card key={note._id} className={`${colors[i % colors.length]} border border-blue-100`}>
              <CardContent className="p-4">
                <h3 className="font-semibold text-white mb-2">{note.title}</h3>
                <p className="text-blue-700 text-sm leading-relaxed whitespace-pre-wrap line-clamp-4">
                  {note.content}
                </p>
                <div className="flex gap-2 mt-4">
                  <button onClick={() => handleEdit(note)}
                    className="text-xs text-blue-500 hover:text-blue-700 border border-blue-200 px-3 py-1 rounded-lg">
                    ✏️ Edit
                  </button>
                  <button onClick={() => handleDelete(note._id)}
                    className="text-xs text-red-400 hover:text-red-600 border border-red-100 px-3 py-1 rounded-lg">
                    🗑️ Delete
                  </button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}