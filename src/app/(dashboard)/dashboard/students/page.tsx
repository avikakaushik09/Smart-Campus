'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface Student {
  _id: string;
  name: string;
  email: string;
  createdAt: string;
}

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchStudents(); }, []);

  const fetchStudents = async () => {
    const res = await fetch('/api/students');
    const data = await res.json();
    if (data.students) setStudents(data.students);
    setLoading(false);
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">All Students</h1>
        <p className="text-blue-400 mt-1">Registered students ki list</p>
      </div>

      {loading ? (
        <div className="text-center py-16 text-blue-300">Loading...</div>
      ) : students.length === 0 ? (
        <div className="text-center py-16 text-blue-300">
          <div className="text-5xl mb-4">👥</div>
          <p>Koi student registered nahi hai abhi</p>
        </div>
      ) : (
        <div className="space-y-3">
          {students.map((student, i) => (
            <Card key={student._id} className="border border-blue-100 bg-white">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold shrink-0">
                  {student.name?.[0]?.toUpperCase()}
                </div>
                <div className="flex-1">
                  <div className="font-medium text-white">{student.name}</div>
                  <div className="text-sm text-blue-400">{student.email}</div>
                </div>
                <div className="text-xs text-blue-300">
                  #{i + 1}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}