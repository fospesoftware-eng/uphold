import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Phone, Mail, Bell, Moon, Sun, LogOut, ChevronRight, Shield, Key } from 'lucide-react';
import { useTenantPortal } from '../context';
import { getTenantData } from '../data';
import { useNavigate } from 'react-router-dom';

export function ProfilePage() {
  const { tenantUser, logout } = useTenantPortal();
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(localStorage.getItem('uphold-theme') === 'dark');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  if (!tenantUser) return null;
  const { unit } = getTenantData(tenantUser.id);

  const initials = tenantUser.name.split(' ').map(n => n[0]).join('').slice(0, 2);

  const toggleDark = () => {
    const next = !darkMode;
    setDarkMode(next);
    document.documentElement.classList.toggle('dark', next);
    localStorage.setItem('uphold-theme', next ? 'dark' : 'light');
  };

  const handleLogout = () => {
    logout();
    navigate('/portal/login', { replace: true });
  };

  return (
    <div className="max-w-2xl mx-auto px-4 pt-6 pb-8 lg:max-w-none lg:px-6 space-y-5">
      {/* Profile hero */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#075DE8] to-[#0EA5E9] p-5 text-white"
      >
        <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-white/5 -translate-y-10 translate-x-10" />
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-3xl bg-white/20 flex items-center justify-center text-2xl font-bold flex-shrink-0">
            {initials}
          </div>
          <div>
            <h1 className="text-xl font-bold">{tenantUser.name}</h1>
            <p className="text-blue-100 text-sm">{tenantUser.email}</p>
            <p className="text-blue-100 text-xs mt-1">{unit?.propertyName} · {unit?.unitNumber}</p>
          </div>
        </div>
        <div className="mt-4 flex gap-2">
          <div className="px-3 py-1.5 rounded-full bg-white/15 text-xs font-medium">
            Tenant since {new Date(tenantUser.joinedAt).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}
          </div>
          <div className="px-3 py-1.5 rounded-full bg-emerald-400/20 text-xs font-medium text-emerald-200">
            ● Active Resident
          </div>
        </div>
      </motion.div>

      {/* Personal info */}
      <div className="bg-white dark:bg-[#111827] border border-[#E6EEF5] dark:border-[#1E2D45] rounded-2xl overflow-hidden">
        <div className="px-4 py-3 border-b border-[#E6EEF5] dark:border-[#1E2D45]">
          <p className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wider">Personal Information</p>
        </div>
        {[
          { icon: User, label: 'Full Name', value: tenantUser.name },
          { icon: Mail, label: 'Email', value: tenantUser.email },
          { icon: Phone, label: 'Phone', value: tenantUser.phone ?? 'Not set' },
        ].map(item => (
          <div key={item.label} className="flex items-center gap-3 px-4 py-3.5 border-b border-[#F1F5F9] dark:border-[#1E2D45] last:border-0">
            <div className="w-8 h-8 rounded-xl bg-[#EFF6FF] dark:bg-[#1E2D45] flex items-center justify-center flex-shrink-0">
              <item.icon size={15} className="text-[#075DE8]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] text-[#94A3B8] font-medium">{item.label}</p>
              <p className="text-sm font-medium text-[#334155] dark:text-[#CBD5E1] truncate">{item.value}</p>
            </div>
            <button className="text-[10px] font-medium text-[#075DE8]">Edit</button>
          </div>
        ))}
      </div>

      {/* Preferences */}
      <div className="bg-white dark:bg-[#111827] border border-[#E6EEF5] dark:border-[#1E2D45] rounded-2xl overflow-hidden">
        <div className="px-4 py-3 border-b border-[#E6EEF5] dark:border-[#1E2D45]">
          <p className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wider">Preferences</p>
        </div>
        <div className="flex items-center justify-between px-4 py-4 border-b border-[#F1F5F9] dark:border-[#1E2D45]">
          <div className="flex items-center gap-3">
            {darkMode ? <Moon size={18} className="text-[#075DE8]" /> : <Sun size={18} className="text-amber-500" />}
            <p className="text-sm font-medium text-[#334155] dark:text-[#CBD5E1]">Dark Mode</p>
          </div>
          <button
            onClick={toggleDark}
            className={`relative w-11 h-6 rounded-full transition-colors ${darkMode ? 'bg-[#075DE8]' : 'bg-[#E6EEF5]'}`}
          >
            <motion.span
              animate={{ x: darkMode ? 20 : 2 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm"
            />
          </button>
        </div>
        <div className="flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <Bell size={18} className="text-[#075DE8]" />
            <p className="text-sm font-medium text-[#334155] dark:text-[#CBD5E1]">Push Notifications</p>
          </div>
          <button
            onClick={() => setNotificationsEnabled(v => !v)}
            className={`relative w-11 h-6 rounded-full transition-colors ${notificationsEnabled ? 'bg-[#075DE8]' : 'bg-[#E6EEF5]'}`}
          >
            <motion.span
              animate={{ x: notificationsEnabled ? 20 : 2 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm"
            />
          </button>
        </div>
      </div>

      {/* Account actions */}
      <div className="bg-white dark:bg-[#111827] border border-[#E6EEF5] dark:border-[#1E2D45] rounded-2xl overflow-hidden">
        <div className="px-4 py-3 border-b border-[#E6EEF5] dark:border-[#1E2D45]">
          <p className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wider">Account</p>
        </div>
        {[
          { icon: Key, label: 'Change Password', action: () => {} },
          { icon: Shield, label: 'Security & Privacy', action: () => {} },
        ].map(item => (
          <button
            key={item.label}
            onClick={item.action}
            className="w-full flex items-center gap-3 px-4 py-4 border-b border-[#F1F5F9] dark:border-[#1E2D45] last:border-0 hover:bg-[#F8FAFC] dark:hover:bg-[#1E2D45] transition-colors text-left"
          >
            <div className="w-8 h-8 rounded-xl bg-[#F8FAFC] dark:bg-[#1E2D45] flex items-center justify-center flex-shrink-0">
              <item.icon size={15} className="text-[#64748B]" />
            </div>
            <span className="flex-1 text-sm font-medium text-[#334155] dark:text-[#CBD5E1]">{item.label}</span>
            <ChevronRight size={16} className="text-[#94A3B8]" />
          </button>
        ))}
      </div>

      {/* Sign out */}
      <button
        onClick={handleLogout}
        className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl border-2 border-rose-200 dark:border-rose-800/50 text-rose-600 font-semibold text-sm hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors"
      >
        <LogOut size={17} />
        Sign Out
      </button>
    </div>
  );
}
