'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [role, setRole] = useState('student');

  useEffect(() => {
    fetch('/api/profile').then(r => r.json()).then(data => {
      if (data.user) setRole(data.user.role);
    });
  }, []);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  };

  const studentNav = [
    { href: '/dashboard', label: 'Dashboard', icon: '🏠' },
    { href: '/dashboard/tasks', label: 'Tasks', icon: '✅' },
    { href: '/dashboard/timetable', label: 'Timetable', icon: '📅' },
    { href: '/dashboard/attendance', label: 'Attendance', icon: '📊' },
    { href: '/dashboard/notices', label: 'Notices', icon: '📢' },
    { href: '/dashboard/notes', label: 'Notes', icon: '📝' },
    { href: '/dashboard/profile', label: 'Profile', icon: '👤' },
  ];

  const adminNav = [
    { href: '/dashboard', label: 'Dashboard', icon: '🏠' },
    { href: '/dashboard/notices', label: 'Post Notice', icon: '📢' },
    { href: '/dashboard/students', label: 'All Students', icon: '👥' },
    { href: '/dashboard/profile', label: 'Profile', icon: '👤' },
  ];

  const navItems = role === 'admin' ? adminNav : studentNav;

  return (
    <div className="min-h-screen flex" style={{ background: 'var(--background)' }}>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-blue-950 border-r border-blue-800 shadow-lg min-h-screen fixed top-0 left-0">
        <div className="p-6 border-b border-blue-100">
          <div className="text-2xl font-bold text-white">🎓 Smart Campus</div>
          <div className="text-xs text-blue-200 mt-1">
            {role === 'admin' ? '🔐 Admin Panel' : 'Manage your campus life'}
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-white hover:bg-blue-900 hover:text-white transition-all font-medium">
              <span className="text-xl">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-blue-100">
          {role === 'admin' && (
            <div className="mb-2 px-4 py-2 bg-blue-50 rounded-xl text-xs text-blue-500 text-center font-medium">
              🔐 Admin Mode
            </div>
          )}
          <button onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-all font-medium">
            <span>🚪</span> Logout
          </button>
        </div>
      </aside>

      {/* Mobile Top Bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b border-blue-100 px-4 py-3 flex items-center justify-between shadow-sm">
        <div className="text-lg font-bold text-blue-700">🎓 Smart Campus</div>
        <div className="flex items-center gap-2">
          {role === 'admin' && (
            <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded-full">Admin</span>
          )}
          <button onClick={() => setMobileOpen(!mobileOpen)} className="text-blue-700 text-2xl">
            {mobileOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-white pt-16">
          <nav className="p-4 space-y-1">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href}
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-blue-700 hover:bg-blue-50 transition-all font-medium">
                <span className="text-xl">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}
            <button onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-all font-medium">
              <span>🚪</span> Logout
            </button>
          </nav>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 md:ml-64 pt-16 md:pt-0 p-6 overflow-auto">
        {children}
      </main>
    </div>
  );
}