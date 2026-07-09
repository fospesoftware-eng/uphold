import { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Home, Wrench, CreditCard, MessageSquare, Grid3x3,
  Building2, Package, Bell, FileText, Users, MapPin, QrCode,
  Zap, HelpCircle, User, LogOut, X, ChevronRight, AlertCircle,
} from 'lucide-react';
import { useTenantPortal } from './context';
import { getTenantData } from './data';

const bottomNavItems = [
  { href: '/portal/dashboard', icon: Home, label: 'Home' },
  { href: '/portal/maintenance', icon: Wrench, label: 'Maintenance' },
  { href: '/portal/payments', icon: CreditCard, label: 'Payments' },
  { href: '/portal/messages', icon: MessageSquare, label: 'Messages' },
  { href: '/portal/more', icon: Grid3x3, label: 'More' },
];

const allNavItems = [
  { href: '/portal/dashboard',  icon: LayoutDashboard, label: 'Dashboard',       group: 'main' },
  { href: '/portal/property',   icon: Building2,        label: 'My Property',     group: 'main' },
  { href: '/portal/assets',     icon: Package,          label: 'My Assets',       group: 'main' },
  { href: '/portal/qr-scanner', icon: QrCode,           label: 'QR Scanner',      group: 'main' },
  { href: '/portal/maintenance',icon: Wrench,           label: 'Maintenance',     group: 'services' },
  { href: '/portal/payments',   icon: CreditCard,       label: 'Payments',        group: 'services' },
  { href: '/portal/documents',  icon: FileText,         label: 'Documents',       group: 'services' },
  { href: '/portal/notices',    icon: Bell,             label: 'Notices',         group: 'services' },
  { href: '/portal/community',  icon: Users,            label: 'Community',       group: 'community' },
  { href: '/portal/visitors',   icon: MapPin,           label: 'Visitors',        group: 'community' },
  { href: '/portal/parcels',    icon: Package,          label: 'Parcels',         group: 'community' },
  { href: '/portal/utilities',  icon: Zap,              label: 'Utilities',       group: 'community' },
  { href: '/portal/messages',   icon: MessageSquare,    label: 'Messages',        group: 'account' },
  { href: '/portal/support',    icon: HelpCircle,       label: 'Support',         group: 'account' },
  { href: '/portal/profile',    icon: User,             label: 'Profile',         group: 'account' },
];

function MoreSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { logout } = useTenantPortal();
  const navigate = useNavigate();

  const groups = [
    { label: 'My Space', items: allNavItems.filter(i => i.group === 'main') },
    { label: 'Services', items: allNavItems.filter(i => i.group === 'services') },
    { label: 'Community', items: allNavItems.filter(i => i.group === 'community') },
    { label: 'Account', items: allNavItems.filter(i => i.group === 'account') },
  ];

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed bottom-0 inset-x-0 z-50 bg-white dark:bg-[#111827] rounded-t-3xl shadow-2xl max-h-[85vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between px-5 pt-5 pb-3 sticky top-0 bg-white dark:bg-[#111827] border-b border-[#E6EEF5] dark:border-[#1E2D45]">
              <h2 className="text-base font-semibold text-[#0F172A] dark:text-[#F8FAFC]">All Features</h2>
              <button onClick={onClose} className="p-2 rounded-full hover:bg-[#F1F5F9] dark:hover:bg-[#1E2D45] transition-colors">
                <X size={18} className="text-[#64748B]" />
              </button>
            </div>
            <div className="px-4 pb-8 pt-2 space-y-5">
              {groups.map(group => (
                <div key={group.label}>
                  <p className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider px-1 mb-2">{group.label}</p>
                  <div className="grid grid-cols-4 gap-2">
                    {group.items.map(item => (
                      <button
                        key={item.href}
                        onClick={() => { navigate(item.href); onClose(); }}
                        className="flex flex-col items-center gap-1.5 p-3 rounded-2xl hover:bg-[#F8FAFC] dark:hover:bg-[#1E2D45] transition-colors active:scale-95"
                      >
                        <div className="w-10 h-10 rounded-xl bg-[#EFF6FF] dark:bg-[#1E2D45] flex items-center justify-center">
                          <item.icon size={18} className="text-[#075DE8]" />
                        </div>
                        <span className="text-[10px] font-medium text-[#334155] dark:text-[#CBD5E1] text-center leading-tight">{item.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
              <button
                onClick={() => { logout(); navigate('/portal/login'); onClose(); }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors mt-2"
              >
                <LogOut size={18} />
                <span className="text-sm font-medium">Sign Out</span>
              </button>
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

  const initials = tenantUser.name.split(' ').map(n => n[0]).join('').slice(0, 2);

  return (
    <div className="flex h-screen bg-[#F8FAFC] dark:bg-[#0A0F1E] overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 flex-shrink-0 bg-white dark:bg-[#111827] border-r border-[#E6EEF5] dark:border-[#1E2D45] h-screen overflow-y-auto">
        {/* Header */}
        <div className="px-5 py-5 border-b border-[#E6EEF5] dark:border-[#1E2D45]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#075DE8] to-[#0EA5E9] flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
              {initials}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-[#0F172A] dark:text-white truncate">{tenantUser.name}</p>
              <p className="text-[11px] text-[#64748B] truncate">{unit?.propertyName} · {unit?.unitNumber}</p>
            </div>
          </div>
        </div>

        {/* Nav groups */}
        <nav className="flex-1 py-3 px-3 space-y-4 overflow-y-auto">
          {[
            { label: 'My Space', items: allNavItems.filter(i => i.group === 'main') },
            { label: 'Services', items: allNavItems.filter(i => i.group === 'services') },
            { label: 'Community', items: allNavItems.filter(i => i.group === 'community') },
            { label: 'Account', items: allNavItems.filter(i => i.group === 'account') },
          ].map(group => (
            <div key={group.label}>
              <p className="text-[10px] font-semibold text-[#94A3B8] uppercase tracking-wider px-3 mb-1">{group.label}</p>
              {group.items.map(item => {
                const active = isActive(item.href);
                const badge = item.href === '/portal/messages' ? unreadMessages :
                              item.href === '/portal/payments' ? overduePayments : 0;
                return (
                  <NavLink
                    key={item.href}
                    to={item.href}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                      active
                        ? 'bg-[#EFF6FF] dark:bg-[#1E2D45] text-[#075DE8]'
                        : 'text-[#64748B] hover:bg-[#F8FAFC] dark:hover:bg-[#1E2D45] hover:text-[#334155] dark:hover:text-[#CBD5E1]'
                    }`}
                  >
                    <item.icon size={17} className="flex-shrink-0" />
                    <span className="flex-1">{item.label}</span>
                    {badge > 0 && (
                      <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400">
                        {badge}
                      </span>
                    )}
                  </NavLink>
                );
              })}
            </div>
          ))}
        </nav>

        <div className="border-t border-[#E6EEF5] dark:border-[#1E2D45] p-3">
          <button
            onClick={() => setDarkMode(v => !v)}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-[#64748B] hover:bg-[#F8FAFC] dark:hover:bg-[#1E2D45] transition-colors mb-1"
          >
            <span className="text-base">{darkMode ? '☀️' : '🌙'}</span>
            <span>{darkMode ? 'Light Mode' : 'Dark Mode'}</span>
          </button>
          <button
            onClick={() => { logout(); navigate('/portal/login'); }}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors"
          >
            <LogOut size={17} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {/* Mobile top bar */}
        <header className="lg:hidden flex items-center justify-between px-4 py-3 bg-white dark:bg-[#111827] border-b border-[#E6EEF5] dark:border-[#1E2D45] flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#075DE8] to-[#0EA5E9] flex items-center justify-center text-white text-xs font-bold">
              {initials}
            </div>
            <div>
              <p className="text-sm font-semibold text-[#0F172A] dark:text-white leading-none">{tenantUser.name.split(' ')[0]}</p>
              <p className="text-[10px] text-[#64748B] leading-none mt-0.5">{unit?.unitNumber} · {unit?.propertyName}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {overduePayments > 0 && (
              <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-rose-100 dark:bg-rose-900/30">
                <AlertCircle size={12} className="text-rose-500" />
                <span className="text-[10px] font-bold text-rose-600">{overduePayments} overdue</span>
              </div>
            )}
            <NavLink to="/portal/notifications" className="relative p-2 rounded-xl hover:bg-[#F1F5F9] dark:hover:bg-[#1E2D45]">
              <Bell size={20} className="text-[#64748B]" />
              {unreadMessages > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">{unreadMessages}</span>
              )}
            </NavLink>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto pb-20 lg:pb-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="h-full"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Mobile bottom nav */}
      <nav className="lg:hidden fixed bottom-0 inset-x-0 z-30 bg-white/95 dark:bg-[#111827]/95 backdrop-blur-xl border-t border-[#E6EEF5] dark:border-[#1E2D45] px-2 pb-safe">
        <div className="flex items-center justify-around h-16">
          {bottomNavItems.map(item => {
            const active = item.href === '/portal/more' ? moreOpen : isActive(item.href);
            const badge = item.href === '/portal/messages' ? unreadMessages :
                          item.href === '/portal/payments' ? overduePayments : 0;
            const handleClick = item.href === '/portal/more'
              ? () => setMoreOpen(v => !v)
              : undefined;

            if (item.href === '/portal/more') {
              return (
                <button
                  key={item.href}
                  onClick={handleClick}
                  className={`flex flex-col items-center gap-1 py-2 px-3 rounded-2xl transition-all duration-150 ${
                    active ? 'text-[#075DE8]' : 'text-[#94A3B8]'
                  }`}
                >
                  <div className={`p-1.5 rounded-xl transition-all ${active ? 'bg-[#EFF6FF] dark:bg-[#1E3A8A]/30' : ''}`}>
                    <item.icon size={20} />
                  </div>
                  <span className="text-[10px] font-medium">{item.label}</span>
                </button>
              );
            }
            return (
              <NavLink
                key={item.href}
                to={item.href}
                className={({ isActive: ia }) => `relative flex flex-col items-center gap-1 py-2 px-3 rounded-2xl transition-all duration-150 ${
                  ia ? 'text-[#075DE8]' : 'text-[#94A3B8]'
                }`}
              >
                {({ isActive: ia }) => (
                  <>
                    <div className={`p-1.5 rounded-xl transition-all ${ia ? 'bg-[#EFF6FF] dark:bg-[#1E3A8A]/30' : ''}`}>
                      <item.icon size={20} />
                    </div>
                    {badge > 0 && (
                      <span className="absolute top-1.5 right-2 w-4 h-4 bg-rose-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">{badge}</span>
                    )}
                    <span className="text-[10px] font-medium">{item.label}</span>
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
