'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface Task {
  _id: string;
  title: string;
  subject: string;
  dueDate: string;
  completed: boolean;
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', subject: '', dueDate: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    const res = await fetch('/api/tasks');
    const data = await res.json();
    if (data.tasks) setTasks(data.tasks);
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    setForm({ title: '', subject: '', dueDate: '' });
    setShowForm(false);
    setLoading(false);
    fetchTasks();
  };

  const handleComplete = async (taskId: string, completed: boolean) => {
    await fetch('/api/tasks', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ taskId, completed: !completed }),
    });
    fetchTasks();
  };

  const handleDelete = async (taskId: string) => {
    await fetch('/api/tasks', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ taskId }),
    });
    fetchTasks();
  };

  const pending = tasks.filter(t => !t.completed);
  const completed = tasks.filter(t => t.completed);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Tasks</h1>
          <p className="text-blue-400 mt-1">Track your tasks and assignments</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 hover:bg-blue-700 text-white">
          {showForm ? 'Cancel' : '+ New Task'}
        </Button>
      </div>

      {/* Add Task Form */}
      {showForm && (
        <Card className="mb-6 border border-blue-200"
          style={{ boxShadow: '0 0 20px rgba(37,99,235,0.15)' }}>
          <CardHeader>
            <CardTitle className="text-white">Add New Task</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <Label className="text-white">Task Title</Label>
                <Input placeholder="Kya karna hai?"
                  value={form.title}
                  onChange={e => setForm({ ...form, title: e.target.value })}
                  className="border-blue-200" required />
              </div>
              <div>
                <Label className="text-white">Subject</Label>
                <Input placeholder="Subject ka naam"
                  value={form.subject}
                  onChange={e => setForm({ ...form, subject: e.target.value })}
                  className="border-blue-200" required />
              </div>
              <div>
                <Label className="text-white">Due Date</Label>
                <Input type="date"
                  value={form.dueDate}
                  onChange={e => setForm({ ...form, dueDate: e.target.value })}
                  className="border-blue-200" required />
              </div>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white w-full" disabled={loading}>
                {loading ? 'Adding...' : 'Add Task'}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Pending Tasks */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-blue-100 mb-3">
          Pending ({pending.length})
        </h2>
        {pending.length === 0 ? (
          <div className="text-center py-8 text-blue-300">
            Koi pending task nahi! 🎉
          </div>
        ) : (
          <div className="space-y-3">
            {pending.map(task => (
              <Card key={task._id} className="border border-blue-100 bg-white">
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <button onClick={() => handleComplete(task._id, task.completed)}
                      className="w-6 h-6 rounded-full border-2 border-blue-300 hover:border-blue-600 transition-all flex items-center justify-center">
                    </button>
                    <div>
                      <div className="font-medium text-blue-900">{task.title}</div>
                      <div className="text-sm text-blue-400">{task.subject} • Due: {task.dueDate}</div>
                    </div>
                  </div>
                  <button onClick={() => handleDelete(task._id)}
                    className="text-red-400 hover:text-red-600 text-sm">🗑️</button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Completed Tasks */}
      {completed.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-green-700 mb-3">
            Completed ({completed.length})
          </h2>
          <div className="space-y-3">
            {completed.map(task => (
              <Card key={task._id} className="border border-green-100 bg-green-50">
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <button onClick={() => handleComplete(task._id, task.completed)}
                      className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-white text-xs">
                      ✓
                    </button>
                    <div>
                      <div className="font-medium text-green-800 line-through">{task.title}</div>
                      <div className="text-sm text-green-500">{task.subject} • Due: {task.dueDate}</div>
                    </div>
                  </div>
                  <button onClick={() => handleDelete(task._id)}
                    className="text-red-400 hover:text-red-600 text-sm">🗑️</button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}