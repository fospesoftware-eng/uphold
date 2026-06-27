import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Search, Plus, Sun, Moon, Menu, ChevronDown, Building2 } from 'lucide-react';
import { useAuth } from '../../lib/auth';
import { Avatar, Badge, StatusPill } from '../ui';
import { notifications } from '../../data/mockData';
import type { UserRole } from '../../types';

interface TopBarProps {
  onMobileMenuOpen: () => void;
  onCommandPaletteOpen: () => void;
  darkMode: boolean;
  onToggleDark: () => void;
}

const roles: { value: UserRole; label: string }[] = [
  { value: 'super_admin', label: 'Super Admin' },
  { value: 'admin', label: 'Administrator' },
  { value: 'support_staff', label: 'Support Staff' },
  { value: 'board', label: 'Board (Read-Only)' },
];

export function TopBar({ onMobileMenuOpen, onCommandPaletteOpen, darkMode, onToggleDark }: TopBarProps) {
  const { user, effectiveRole, viewAsRole, setViewAsRole } = useAuth();
  const [showNotifs, setShowNotifs] = useState(false);
  const [showUser, setShowUser] = useState(false);
  const [showRoleSwitch, setShowRoleSwitch] = useState(false);

  const unread = notifications.filter(n => !n.read).length;

  return (
    <header className="h-16 bg-white/90 dark:bg-[#111827]/90 backdrop-blur-xl border-b border-[#E6EEF5] dark:border-[#1E2D45] flex items-center px-4 gap-3 sticky top-0 z-30 flex-shrink-0">
      {/* Mobile menu */}
      <button
        onClick={onMobileMenuOpen}
        className="lg:hidden p-2 rounded-xl hover:bg-[#F8FAFC] dark:hover:bg-[#1E2D45] text-[#64748B] transition-colors"
        aria-label="Open menu"
      >
        <Menu size={20} />
      </button>

      {/* Search */}
      <button
        onClick={onCommandPaletteOpen}
        className="flex-1 max-w-sm flex items-center gap-2.5 px-3.5 py-2 rounded-xl border border-[#E6EEF5] dark:border-[#1E2D45] bg-[#F8FAFC] dark:bg-[#0A0F1E] text-[#64748B] text-sm hover:border-[#15C6B8] hover:bg-white dark:hover:bg-[#111827] transition-all duration-150 group"
        aria-label="Open command palette"
      >
        <Search size={15} className="flex-shrink-0" />
        <span className="flex-1 text-left hidden sm:block">Search tenants, properties…</span>
        <kbd className="hidden sm:flex items-center gap-1 px-1.5 py-0.5 text-[10px] rounded border border-[#E6EEF5] dark:border-[#1E2D45] font-mono text-[#94A3B8]">
          <span>⌘</span><span>K</span>
        </kbd>
      </button>

      <div className="flex-1" />

      {/* View As Role */}
      <div className="relative hidden md:block">
        <button
          onClick={() => setShowRoleSwitch(!showRoleSwitch)}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${viewAsRole ? 'bg-amber-100 dark:bg-amber-900/20 text-amber-700 border border-amber-200' : 'bg-[#F8FAFC] dark:bg-[#1E2D45] text-[#64748B] border border-[#E6EEF5] dark:border-[#1E2D45]'}`}
        >
          <Building2 size={13} />
          {viewAsRole ? `Viewing as: ${roles.find(r => r.value === viewAsRole)?.label}` : 'View as Role'}
          <ChevronDown size={13} />
        </button>
        <AnimatePresence>
          {showRoleSwitch && (
            <motion.div
              initial={{ opacity: 0, y: 6, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 6, scale: 0.97 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-[#111827] border border-[#E6EEF5] dark:border-[#1E2D45] rounded-xl shadow-[0_8px_24px_rgba(15,23,42,.12)] z-50 overflow-hidden"
            >
              <div className="p-1">
                <button
                  onClick={() => { setViewAsRole(null); setShowRoleSwitch(false); }}
                  className={`w-full text-left px-3 py-2 text-xs rounded-lg hover:bg-[#F8FAFC] dark:hover:bg-[#1E2D45] transition-colors ${!viewAsRole ? 'text-[#075DE8] font-medium' : 'text-[#334155] dark:text-[#CBD5E1]'}`}
                >
                  My Role ({roles.find(r => r.value === user?.role)?.label})
                </button>
                {roles.map(role => (
                  <button
                    key={role.value}
                    onClick={() => { setViewAsRole(role.value); setShowRoleSwitch(false); }}
                    className={`w-full text-left px-3 py-2 text-xs rounded-lg hover:bg-[#F8FAFC] dark:hover:bg-[#1E2D45] transition-colors ${viewAsRole === role.value ? 'text-[#075DE8] font-medium' : 'text-[#334155] dark:text-[#CBD5E1]'}`}
                  >
                    {role.label}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Quick Action */}
      <button
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-uphold-gradient text-white text-xs font-semibold shadow-[0_2px_8px_rgba(7,93,232,.3)] hover:opacity-90 transition-opacity"
        aria-label="Quick actions"
      >
        <Plus size={14} />
        <span className="hidden sm:block">New</span>
      </button>

      {/* Dark Mode */}
      <button
        onClick={onToggleDark}
        className="p-2 rounded-xl hover:bg-[#F8FAFC] dark:hover:bg-[#1E2D45] text-[#64748B] transition-colors"
        aria-label="Toggle dark mode"
      >
        {darkMode ? <Sun size={18} /> : <Moon size={18} />}
      </button>

      {/* Notifications */}
      <div className="relative">
        <button
          onClick={() => { setShowNotifs(!showNotifs); setShowUser(false); }}
          className="relative p-2 rounded-xl hover:bg-[#F8FAFC] dark:hover:bg-[#1E2D45] text-[#64748B] transition-colors"
          aria-label={`Notifications, ${unread} unread`}
        >
          <Bell size={18} />
          {unread > 0 && (
            <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
              {unread > 9 ? '9+' : unread}
            </span>
          )}
        </button>
        <AnimatePresence>
          {showNotifs && (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.97 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-[#111827] border border-[#E6EEF5] dark:border-[#1E2D45] rounded-2xl shadow-[0_16px_40px_rgba(15,23,42,.16)] z-50 overflow-hidden"
            >
              <div className="flex items-center justify-between px-4 py-3 border-b border-[#E6EEF5] dark:border-[#1E2D45]">
                <h3 className="text-sm font-semibold text-[#0F172A] dark:text-[#F8FAFC]">Notifications</h3>
                <span className="px-2 py-0.5 text-xs rounded-full bg-rose-100 text-rose-600 font-medium">{unread} new</span>
              </div>
              <div className="max-h-80 overflow-y-auto divide-y divide-[#E6EEF5] dark:divide-[#1E2D45]">
                {notifications.slice(0, 6).map(n => (
                  <div key={n.id} className={`flex gap-3 px-4 py-3 hover:bg-[#F8FAFC] dark:hover:bg-[#1E2D45] transition-colors cursor-pointer ${!n.read ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''}`}>
                    <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${n.severity === 'danger' ? 'bg-rose-500' : n.severity === 'warning' ? 'bg-amber-500' : n.severity === 'success' ? 'bg-emerald-500' : 'bg-blue-500'}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-[#0F172A] dark:text-[#F8FAFC]">{n.title}</p>
                      <p className="text-xs text-[#64748B] mt-0.5 truncate">{n.message}</p>
                      <p className="text-[10px] text-[#94A3B8] mt-0.5">{new Date(n.timestamp).toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-3 border-t border-[#E6EEF5] dark:border-[#1E2D45] text-center">
                <button className="text-xs text-[#075DE8] font-medium hover:underline">View all notifications</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* User Menu */}
      <div className="relative">
        <button
          onClick={() => { setShowUser(!showUser); setShowNotifs(false); }}
          className="flex items-center gap-2 p-1 rounded-xl hover:bg-[#F8FAFC] dark:hover:bg-[#1E2D45] transition-colors"
          aria-label="User menu"
        >
          {user && <Avatar name={user.name} size="sm" />}
          <ChevronDown size={14} className="text-[#64748B] hidden sm:block" />
        </button>
        <AnimatePresence>
          {showUser && user && (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.97 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-[#111827] border border-[#E6EEF5] dark:border-[#1E2D45] rounded-2xl shadow-[0_16px_40px_rgba(15,23,42,.16)] z-50 overflow-hidden"
            >
              <div className="px-4 py-3 border-b border-[#E6EEF5] dark:border-[#1E2D45]">
                <p className="text-sm font-semibold text-[#0F172A] dark:text-[#F8FAFC]">{user.name}</p>
                <p className="text-xs text-[#64748B]">{user.email}</p>
              </div>
              <div className="p-1">
                <button className="w-full text-left px-3 py-2 text-sm text-[#334155] dark:text-[#CBD5E1] hover:bg-[#F8FAFC] dark:hover:bg-[#1E2D45] rounded-lg transition-colors">Profile Settings</button>
                <button className="w-full text-left px-3 py-2 text-sm text-[#334155] dark:text-[#CBD5E1] hover:bg-[#F8FAFC] dark:hover:bg-[#1E2D45] rounded-lg transition-colors">Security & 2FA</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
