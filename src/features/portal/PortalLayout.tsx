import { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Home, Wrench, CreditCard, MessageSquare, Grid3x3,
  Building2, Package, Bell, FileText, Users, MapPin, QrCode,
  Zap, HelpCircle, User, LogOut, X, ChevronRight, Moon, Sun,
} from 'lucide-react';
import { useTenantPortal } from './context';
import { getTenantData } from './data';

const bottomNavItems = [
  { href: '/portal/dashboard',   icon: Home,         label: 'Home' },
  { href: '/portal/maintenance', icon: Wrench,       label: 'Maintenance' },
  { href: '/portal/payments',    icon: CreditCard,   label: 'Payments' },
  { href: '/portal/messages',    icon: MessageSquare, label: 'Messages' },
  { href: '/portal/more',        icon: Grid3x3,      label: 'More' },
];

const allNavItems = [
  { href: '/portal/dashboard',   icon: LayoutDashboard, label: 'Dashboard',    group: 'main' },
  { href: '/portal/property',    icon: Building2,       label: 'My Property',  group: 'main' },
  { href: '/portal/assets',      icon: Package,         label: 'My Assets',    group: 'main' },
  { href: '/portal/qr-scanner',  icon: QrCode,          label: 'QR Scanner',   group: 'main' },
  { href: '/portal/maintenance', icon: Wrench,          label: 'Maintenance',  group: 'services' },
  { href: '/portal/payments',    icon: CreditCard,      label: 'Payments',     group: 'services' },
  { href: '/portal/documents',   icon: FileText,        label: 'Documents',    group: 'services' },
  { href: '/portal/notices',     icon: Bell,            label: 'Notices',      group: 'services' },
  { href: '/portal/community',   icon: Users,           label: 'Community',    group: 'community' },
  { href: '/portal/visitors',    icon: MapPin,          label: 'Visitors',     group: 'community' },
  { href: '/portal/parcels',     icon: Package,         label: 'Parcels',      group: 'community' },
  { href: '/portal/utilities',   icon: Zap,             label: 'Utilities',    group: 'community' },
  { href: '/portal/messages',    icon: MessageSquare,   label: 'Messages',     group: 'account' },
  { href: '/portal/support',     icon: HelpCircle,      label: 'Support',      group: 'account' },
  { href: '/portal/profile',     icon: User,            label: 'Profile',      group: 'account' },
];

const navGroups = [
  { label: 'My Space',   key: 'main' },
  { label: 'Services',   key: 'services' },
  { label: 'Community',  key: 'community' },
  { label: 'Account',    key: 'account' },
];

function MoreSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { logout } = useTenantPortal();
  const navigate = useNavigate();

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 32, stiffness: 320 }}
            className="fixed bottom-0 inset-x-0 z-50 bg-white dark:bg-[#111827] rounded-t-3xl shadow-2xl max-h-[85vh] overflow-y-auto"
          >
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 rounded-full bg-[#E2E8F0] dark:bg-[#334155]" />
            </div>
            <div className="flex items-center justify-between px-5 pt-2 pb-3 sticky top-0 bg-white dark:bg-[#111827] border-b border-[#E6EEF5] dark:border-[#1E2D45]">
              <h2 className="text-base font-semibold text-[#0F172A] dark:text-white">All Features</h2>
              <button onClick={onClose} className="w-8 h-8 rounded-full bg-[#F1F5F9] dark:bg-[#1E2D45] flex items-center justify-center hover:bg-[#E2E8F0] dark:hover:bg-[#2A3D5A] transition-colors">
                <X size={16} className="text-[#64748B]" />
              </button>
            </div>
            <div className="px-4 pb-10 pt-3 space-y-5">
              {navGroups.map(group => (
                <div key={group.key}>
                  <p className="text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider px-1 mb-2">{group.label}</p>
                  <div className="grid grid-cols-4 gap-2">
                    {allNavItems.filter(i => i.group === group.key).map(item => (
                      <button
                        key={item.href}
                        onClick={() => { navigate(item.href); onClose(); }}
                        className="flex flex-col items-center gap-1.5 p-3 rounded-2xl hover:bg-[#F8FAFC] dark:hover:bg-[#1E2D45] active:scale-95 transition-all"
                      >
                        <div className="w-11 h-11 rounded-2xl bg-[#EFF6FF] dark:bg-[#1E2D45] flex items-center justify-center">
                          <item.icon size={19} className="text-[#075DE8]" />
                        </div>
                        <span className="text-[10px] font-semibold text-[#334155] dark:text-[#CBD5E1] text-center leading-tight">{item.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
              <div className="pt-1 border-t border-[#E6EEF5] dark:border-[#1E2D45]">
                <button
                  onClick={() => { logout(); navigate('/portal/login'); onClose(); }}
                  className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors"
                >
                  <LogOut size={18} />
                  <span className="text-sm font-semibold">Sign Out</span>
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export function PortalLayout() {
  const { tenantUser, isAuthenticated, logout } = useTenantPortal();
  const navigate = useNavigate();
  const location = useLocation();
  const [moreOpen, setMoreOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('uphold-theme') === 'dark');

  useEffect(() => {
    if (!isAuthenticated) navigate('/portal/login', { replace: true });
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    localStorage.setItem('uphold-theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  if (!isAuthenticated || !tenantUser) return null;

  const { unit, payments, conversations } = getTenantData(tenantUser.id);
  const unreadMessages = conversations.reduce((s, c) => s + c.unreadCount, 0);
  const overduePayments = payments.filter(p => p.status === 'overdue').length;

  const isActive = (href: string) => {
    if (href === '/portal/more') return false;
    return location.pathname === href || location.pathname.startsWith(href + '/');
  };

  const initials = tenantUser.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  // Current page title
  const currentNav = allNavItems.find(i => isActive(i.href));

  return (
    <div className="flex h-screen bg-[#F8FAFC] dark:bg-[#0A0F1E] overflow-hidden">

      {/* ── Desktop Sidebar ── */}
      <aside className="hidden lg:flex flex-col w-[240px] xl:w-[260px] flex-shrink-0 bg-white dark:bg-[#0D1526] border-r border-[#E6EEF5] dark:border-[#1A2640] h-screen">

        {/* Brand + user */}
        <div className="px-5 py-5 border-b border-[#E6EEF5] dark:border-[#1A2640]">
          {/* Brand */}
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#075DE8] to-[#0EA5E9] flex items-center justify-center flex-shrink-0">
              <Building2 size={14} className="text-white" />
            </div>
            <div>
              <p className="text-xs font-bold text-[#0F172A] dark:text-white leading-none">NorthBridge</p>
              <p className="text-[10px] text-[#94A3B8] leading-none mt-0.5">Resident Portal</p>
            </div>
          </div>

          {/* Tenant card */}
          <div className="flex items-center gap-3 p-3 rounded-xl bg-[#F8FAFC] dark:bg-[#1A2640]">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#075DE8] to-[#0EA5E9] flex items-center justify-center text-white text-xs font-bold flex-shrink-0 shadow-md shadow-blue-500/20">
              {initials}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-[#0F172A] dark:text-white truncate leading-tight">{tenantUser.name}</p>
              <p className="text-[11px] text-[#64748B] dark:text-[#94A3B8] truncate leading-tight mt-0.5">{unit?.unitNumber} · {unit?.propertyName}</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 px-3 space-y-5 overflow-y-auto">
          {navGroups.map(group => (
            <div key={group.key}>
              <p className="text-[10px] font-bold text-[#C4CDD6] dark:text-[#3D5270] uppercase tracking-widest px-3 mb-1.5">{group.label}</p>
              <div className="space-y-0.5">
                {allNavItems.filter(i => i.group === group.key).map(item => {
                  const active = isActive(item.href);
                  const badge = item.href === '/portal/messages' ? unreadMessages
                              : item.href === '/portal/payments' ? overduePayments : 0;
                  return (
                    <NavLink
                      key={item.href}
                      to={item.href}
                      className={`group flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-150 ${
                        active
                          ? 'bg-[#EFF6FF] dark:bg-[#1E2D45] text-[#075DE8]'
                          : 'text-[#64748B] dark:text-[#64748B] hover:bg-[#F8FAFC] dark:hover:bg-[#1A2640] hover:text-[#334155] dark:hover:text-[#94A3B8]'
                      }`}
                    >
                      {active && (
                        <div className="absolute left-3 w-0.5 h-4 rounded-full bg-[#075DE8]" />
                      )}
                      <item.icon size={16} className={`flex-shrink-0 transition-colors ${active ? 'text-[#075DE8]' : 'text-[#94A3B8] group-hover:text-[#64748B]'}`} />
                      <span className="flex-1 truncate">{item.label}</span>
                      {badge > 0 && (
                        <span className={`px-1.5 py-0.5 text-[10px] font-bold rounded-full flex-shrink-0 ${
                          item.href === '/portal/payments'
                            ? 'bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400'
                            : 'bg-[#075DE8]/10 dark:bg-[#075DE8]/20 text-[#075DE8]'
                        }`}>
                          {badge}
                        </span>
                      )}
                    </NavLink>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Footer actions */}
        <div className="border-t border-[#E6EEF5] dark:border-[#1A2640] p-3 space-y-0.5">
          <button
            onClick={() => setDarkMode(v => !v)}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-[#64748B] dark:text-[#64748B] hover:bg-[#F8FAFC] dark:hover:bg-[#1A2640] hover:text-[#334155] dark:hover:text-[#94A3B8] transition-all"
          >
            {darkMode ? <Sun size={16} className="text-[#94A3B8]" /> : <Moon size={16} className="text-[#94A3B8]" />}
            <span>{darkMode ? 'Light Mode' : 'Dark Mode'}</span>
          </button>
          <button
            onClick={() => { logout(); navigate('/portal/login'); }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-all"
          >
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* ── Main Content Area ── */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">

        {/* Desktop top bar */}
        <header className="hidden lg:flex items-center justify-between px-8 xl:px-10 h-[60px] bg-white dark:bg-[#0D1526] border-b border-[#E6EEF5] dark:border-[#1A2640] flex-shrink-0">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-[#94A3B8]">Portal</span>
            {currentNav && (
              <>
                <ChevronRight size={13} className="text-[#C4CDD6] dark:text-[#3D5270]" />
                <span className="font-semibold text-[#0F172A] dark:text-white">{currentNav.label}</span>
              </>
            )}
          </div>
          <div className="flex items-center gap-3">
            {overduePayments > 0 && (
              <button
                onClick={() => navigate('/portal/payments')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800/50 hover:bg-rose-100 transition-colors"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                <span className="text-xs font-semibold text-rose-600 dark:text-rose-400">{overduePayments} overdue</span>
              </button>
            )}
            <NavLink
              to="/portal/messages"
              className="relative w-9 h-9 rounded-xl bg-[#F8FAFC] dark:bg-[#1A2640] flex items-center justify-center hover:bg-[#EFF6FF] dark:hover:bg-[#1E2D45] transition-colors"
            >
              <Bell size={17} className="text-[#64748B] dark:text-[#94A3B8]" />
              {unreadMessages > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#075DE8] text-white text-[9px] font-bold rounded-full flex items-center justify-center">{unreadMessages}</span>
              )}
            </NavLink>
            <NavLink
              to="/portal/profile"
              className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#075DE8] to-[#0EA5E9] flex items-center justify-center text-white text-xs font-bold shadow-md shadow-blue-500/20 hover:shadow-lg transition-all"
            >
              {initials}
            </NavLink>
          </div>
        </header>

        {/* Mobile top bar */}
        <header className="lg:hidden flex items-center justify-between px-4 py-3 bg-white dark:bg-[#0D1526] border-b border-[#E6EEF5] dark:border-[#1A2640] flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#075DE8] to-[#0EA5E9] flex items-center justify-center text-white text-xs font-bold shadow-md shadow-blue-500/20">
              {initials}
            </div>
            <div>
              <p className="text-sm font-semibold text-[#0F172A] dark:text-white leading-none">{tenantUser.name.split(' ')[0]}</p>
              <p className="text-[10px] text-[#64748B] leading-none mt-0.5">{unit?.unitNumber} · {unit?.propertyName}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {overduePayments > 0 && (
              <button onClick={() => navigate('/portal/payments')} className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800/50">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                <span className="text-[10px] font-bold text-rose-600 dark:text-rose-400">{overduePayments} overdue</span>
              </button>
            )}
            <NavLink to="/portal/messages" className="relative p-2 rounded-xl hover:bg-[#F1F5F9] dark:hover:bg-[#1A2640]">
              <Bell size={20} className="text-[#64748B] dark:text-[#94A3B8]" />
              {unreadMessages > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-[#075DE8] text-white text-[9px] font-bold rounded-full flex items-center justify-center">{unreadMessages}</span>
              )}
            </NavLink>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto pb-20 lg:pb-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
              className="h-full"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* ── Mobile bottom nav ── */}
      <nav className="lg:hidden fixed bottom-0 inset-x-0 z-30 bg-white/95 dark:bg-[#0D1526]/95 backdrop-blur-xl border-t border-[#E6EEF5] dark:border-[#1A2640]">
        <div className="flex items-center justify-around px-2 pb-safe" style={{ paddingBottom: 'max(8px, env(safe-area-inset-bottom))' }}>
          {bottomNavItems.map(item => {
            const active = item.href === '/portal/more' ? moreOpen : isActive(item.href);
            const badge = item.href === '/portal/messages' ? unreadMessages
                        : item.href === '/portal/payments' ? overduePayments : 0;

            if (item.href === '/portal/more') {
              return (
                <button key={item.href} onClick={() => setMoreOpen(v => !v)}
                  className={`relative flex flex-col items-center gap-1 py-2.5 px-4 rounded-2xl transition-all ${active ? 'text-[#075DE8]' : 'text-[#94A3B8]'}`}>
                  <div className={`p-1.5 rounded-xl transition-all ${active ? 'bg-[#EFF6FF] dark:bg-[#1E2D45]' : ''}`}>
                    <item.icon size={20} />
                  </div>
                  <span className="text-[10px] font-semibold">{item.label}</span>
                </button>
              );
            }

            return (
              <NavLink key={item.href} to={item.href}
                className={({ isActive: ia }) => `relative flex flex-col items-center gap-1 py-2.5 px-4 rounded-2xl transition-all ${ia ? 'text-[#075DE8]' : 'text-[#94A3B8]'}`}
              >
                {({ isActive: ia }) => (
                  <>
                    <div className={`p-1.5 rounded-xl transition-all ${ia ? 'bg-[#EFF6FF] dark:bg-[#1E2D45]' : ''}`}>
                      <item.icon size={20} />
                    </div>
                    {badge > 0 && (
                      <span className="absolute top-2 right-3 w-4 h-4 bg-rose-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">{badge}</span>
                    )}
                    <span className="text-[10px] font-semibold">{item.label}</span>
                  </>
                )}
              </NavLink>
            );
          })}
        </div>
      </nav>

      <MoreSheet open={moreOpen} onClose={() => setMoreOpen(false)} />
    </div>
  );
}
