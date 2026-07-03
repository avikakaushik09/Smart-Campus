'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface NavLink {
  label: string;
  icon: string;
  href: string;
  color: string;
}

export default function DashboardPage() {
  const [stats, setStats] = useState({ tasksDue: 0, attendance: 0, notices: 0 });
  const [userName, setUserName] = useState('Student');
  const [role, setRole] = useState('student');

  useEffect(() => { fetchStats(); }, []);

  const fetchStats = async () => {
    try {
      const [tasksRes, attendanceRes, noticesRes, profileRes] = await Promise.all([
        fetch('/api/tasks'),
        fetch('/api/attendance'),
        fetch('/api/notices'),
        fetch('/api/profile'),
      ]);

      const tasksData = await tasksRes.json();
      const attendanceData = await attendanceRes.json();
      const noticesData = await noticesRes.json();
      const profileData = await profileRes.json();

      const pendingTasks = tasksData.tasks?.filter((t: any) => !t.completed).length || 0;
      const records = attendanceData.records || [];
      const present = records.filter((r: any) => r.status === 'present').length;
      const total = records.length;
      const attendancePct = total === 0 ? 0 : Math.round((present / total) * 100);
      const notices = noticesData.notices?.length || 0;

      if (profileData.user) {
        setUserName(profileData.user.name);
        setRole(profileData.user.role);
      }

      setStats({ tasksDue: pendingTasks, attendance: attendancePct, notices });
    } catch (err) {
      console.error(err);
    }
  };

  const studentLinks: NavLink[] = [
    { label: 'My Tasks', icon: '✅', href: '/dashboard/tasks', color: 'bg-blue-50 hover:bg-blue-100' },
    { label: 'Timetable', icon: '📅', href: '/dashboard/timetable', color: 'bg-purple-50 hover:bg-purple-100' },
    { label: 'Attendance', icon: '📊', href: '/dashboard/attendance', color: 'bg-green-50 hover:bg-green-100' },
    { label: 'Notices', icon: '📢', href: '/dashboard/notices', color: 'bg-orange-50 hover:bg-orange-100' },
    { label: 'Notes', icon: '📝', href: '/dashboard/notes', color: 'bg-yellow-50 hover:bg-yellow-100' },
    { label: 'Profile', icon: '👤', href: '/dashboard/profile', color: 'bg-pink-50 hover:bg-pink-100' },
  ];

  const adminLinks: NavLink[] = [
    { label: 'Post Notice', icon: '📢', href: '/dashboard/notices', color: 'bg-orange-50 hover:bg-orange-100' },
    { label: 'All Students', icon: '👥', href: '/dashboard/students', color: 'bg-blue-50 hover:bg-blue-100' },
    { label: 'Profile', icon: '👤', href: '/dashboard/profile', color: 'bg-pink-50 hover:bg-pink-100' },
  ];

  const links = role === 'admin' ? adminLinks : studentLinks;

  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center gap-2">
          <h1 className="text-3xl font-bold text-blue-900">Dashboard</h1>
          {role === 'admin' && (
            <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">Admin</span>
          )}
        </div>
        <p className="text-blue-400 mt-1">Welcome back, {userName}! 👋</p>
      </div>

      {role === 'admin' ? (
        <div className="mb-8">
          <Card className="border border-blue-200 bg-white"
            style={{ boxShadow: '0 0 20px rgba(37,99,235,0.15)' }}>
            <CardContent className="p-6">
              <h2 className="text-blue-900 font-bold mb-2">Admin Panel</h2>
              <p className="text-blue-400 text-sm">Tum admin ho — notices post kar sakte ho aur students manage kar sakte ho.</p>
              <div className="mt-4 flex gap-3">
                <div className="bg-orange-50 rounded-xl p-4 flex-1 text-center">
                  <div className="text-2xl font-bold text-orange-500">{stats.notices}</div>
                  <div className="text-xs text-orange-400">Total Notices</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="border border-blue-200 bg-white"
            style={{ boxShadow: '0 0 20px rgba(37,99,235,0.15)' }}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-blue-400 font-medium">Tasks Due</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-blue-700">{stats.tasksDue}</div>
              <p className="text-xs text-blue-300 mt-1">Pending tasks</p>
            </CardContent>
          </Card>

          <Card className="border border-blue-200 bg-white"
            style={{ boxShadow: '0 0 20px rgba(37,99,235,0.15)' }}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-blue-400 font-medium">Attendance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold"
                style={{ color: stats.attendance >= 75 ? '#16a34a' : '#dc2626' }}>
                {stats.attendance}%
              </div>
              <p className="text-xs text-blue-300 mt-1">Overall attendance</p>
            </CardContent>
          </Card>

          <Card className="border border-blue-200 bg-white"
            style={{ boxShadow: '0 0 20px rgba(37,99,235,0.15)' }}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-blue-400 font-medium">Notices</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-orange-500">{stats.notices}</div>
              <p className="text-xs text-blue-300 mt-1">Total notices</p>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {links.map((item) => (
          <a key={item.href} href={item.href}
            className={`${item.color} rounded-2xl p-6 flex flex-col items-center gap-3 transition-all border border-blue-100 cursor-pointer`}>
            <span className="text-4xl">{item.icon}</span>
            <span className="text-blue-800 font-medium text-sm">{item.label}</span>
          </a>
        ))}
      </div>
    </div>
  );
}