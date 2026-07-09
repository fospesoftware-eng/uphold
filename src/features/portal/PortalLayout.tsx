import { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Home, Wrench, CreditCard, MessageSquare, Grid3x3,
  Building2, Package, Bell, FileText, Users, MapPin, QrCode,
  Zap, HelpCircle, User, LogOut, X, ChevronRight,
  Sun, Moon,
} from 'lucide-react';
import { useTenantPortal } from './context';
import { getTenantData } from './data';

const allNavItems = [
  { href: '/portal/dashboard',   icon: LayoutDashboard, label: 'Dashboard',   group: 'main' },
  { href: '/portal/property',    icon: Building2,       label: 'My Property', group: 'main' },
  { href: '/portal/assets',      icon: Package,         label: 'My Assets',   group: 'main' },
  { href: '/portal/qr-scanner',  icon: QrCode,          label: 'QR Scanner',  group: 'main' },
  { href: '/portal/maintenance', icon: Wrench,          label: 'Maintenance', group: 'services' },
  { href: '/portal/payments',    icon: CreditCard,      label: 'Payments',    group: 'services' },
  { href: '/portal/documents',   icon: FileText,        label: 'Documents',   group: 'services' },
  { href: '/portal/notices',     icon: Bell,            label: 'Notices',     group: 'services' },
  { href: '/portal/community',   icon: Users,           label: 'Community',   group: 'community' },
  { href: '/portal/visitors',    icon: MapPin,          label: 'Visitors',    group: 'community' },
  { href: '/portal/parcels',     icon: Package,         label: 'Parcels',     group: 'community' },
  { href: '/portal/utilities',   icon: Zap,             label: 'Utilities',   group: 'community' },
  { href: '/portal/messages',    icon: MessageSquare,   label: 'Messages',    group: 'account' },
  { href: '/portal/support',     icon: HelpCircle,      label: 'Support',     group: 'account' },
  { href: '/portal/profile',     icon: User,            label: 'Profile',     group: 'account' },
];

const navGroups = [
  { label: 'My Space',  key: 'main' },
  { label: 'Services',  key: 'services' },
  { label: 'Community', key: 'community' },
  { label: 'Account',   key: 'account' },
];

const bottomNavItems = [
  { href: '/portal/dashboard',   icon: Home,          label: 'Home' },
  { href: '/portal/maintenance', icon: Wrench,        label: 'Maintenance' },
  { href: '/portal/payments',    icon: CreditCard,    label: 'Payments' },
  { href: '/portal/messages',    icon: MessageSquare, label: 'Messages' },
  { href: '/portal/more',        icon: Grid3x3,       label: 'More' },
];

// ── Theme-aware tokens ──
const T = {
  dark: {
    pageBg:      '#03070F',
    sidebarBg:   '#040B1A',
    sidebarBorder: 'rgba(255,255,255,0.06)',
    sidebarLabel:  'rgba(255,255,255,0.18)',
    headerBg:    '#040B1A',
    headerBorder:  'rgba(255,255,255,0.06)',
    navDefault:  'rgba(255,255,255,0.03)',
    navText:     'text-white/40',
    navTextHover:'text-white/70',
    activeBg:    'rgba(7,93,232,0.14)',
    activeBorder:  'rgba(7,93,232,0.22)',
    activeText:  'text-white',
    activeIcon:  'text-[#5BA4F5]',
    navIcon:     'text-white/30',
    navIconHover: 'text-white/55',
    cardBg:      'rgba(255,255,255,0.03)',
    cardBorder:  'rgba(255,255,255,0.07)',
    textMain:    'text-white/85',
    textMuted:   'text-white/35',
    textSubtle:  'text-white/25',
    textFaint:   'text-white/15',
    divider:     'rgba(255,255,255,0.06)',
    moreBg:      '#0A1628',
    moreBorder:  'rgba(255,255,255,0.08)',
    topGrad:     'rgba(255,255,255,0.15)',
    mobileNavBg: 'rgba(4,11,26,0.95)',
    heroAccent:  '#32E6A4',
    overBg:      'rgba(244,63,94,0.12)',
    overBorder:  'rgba(244,63,94,0.22)',
    overText:    'text-rose-400',
    mobileTop:   '#040B1A',
    mobileTopBorder: 'rgba(255,255,255,0.06)',
  },
  light: {
    pageBg:      '#F5F7FA',
    sidebarBg:   '#FFFFFF',
    sidebarBorder: 'rgba(0,0,0,0.06)',
    sidebarLabel:  'rgba(100,116,139,0.6)',
    headerBg:    '#FFFFFF',
    headerBorder:  'rgba(0,0,0,0.07)',
    navDefault:  'rgba(0,0,0,0.04)',
    navText:     'text-slate-500',
    navTextHover:'text-slate-700',
    activeBg:    'rgba(7,93,232,0.1)',
    activeBorder:  'rgba(7,93,232,0.18)',
    activeText:  'text-[#075DE8]',
    activeIcon:  'text-[#075DE8]',
    navIcon:     'text-slate-400',
    navIconHover: 'text-slate-600',
    cardBg:      'rgba(255,255,255,0.8)',
    cardBorder:  'rgba(0,0,0,0.06)',
    textMain:    'text-slate-800',
    textMuted:   'text-slate-500',
    textSubtle:  'text-slate-400',
    textFaint:   'text-slate-300',
    divider:     'rgba(0,0,0,0.06)',
    moreBg:      '#FFFFFF',
    moreBorder:  'rgba(0,0,0,0.08)',
    topGrad:     'rgba(0,0,0,0.15)',
    mobileNavBg: 'rgba(255,255,255,0.95)',
    heroAccent:  '#075DE8',
    overBg:      'rgba(244,63,94,0.08)',
    overBorder:  'rgba(244,63,94,0.18)',
    overText:    'text-rose-500',
    mobileTop:   '#FFFFFF',
    mobileTopBorder: 'rgba(0,0,0,0.07)',
  },
};

function MoreSheet({ open, onClose, theme }: { open: boolean; onClose: () => void; theme: 'dark' | 'light' }) {
  const { logout } = useTenantPortal();
  const navigate = useNavigate();
  const t = T[theme];

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 backdrop-blur-sm"
            style={{ background: theme === 'dark' ? 'rgba(0,0,0,0.6)' : 'rgba(0,0,0,0.25)' }}
            onClick={onClose}
          />
          <motion.div
            initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 32, stiffness: 320 }}
            className="fixed bottom-0 inset-x-0 z-50 rounded-t-3xl shadow-2xl max-h-[85vh] overflow-y-auto"
            style={{ background: t.moreBg, borderTop: `1px solid ${t.moreBorder}` }}
          >
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 rounded-full" style={{ background: theme === 'dark' ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.15)' }} />
            </div>
            <div className="flex items-center justify-between px-5 pt-2 pb-3 sticky top-0"
              style={{ background: t.moreBg, borderBottom: `1px solid ${t.divider}` }}>
              <h2 className={`text-base font-semibold ${t.textMain}`}>All Features</h2>
              <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center transition-colors hover:bg-black/5"
                style={{ background: theme === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)' }}>
                <X size={16} className={t.textMuted} />
              </button>
            </div>
            <div className="px-4 pb-10 pt-4 space-y-5">
              {navGroups.map(group => (
                <div key={group.key}>
                  <p className={`text-[10px] font-bold uppercase tracking-widest px-1 mb-2 ${t.textSubtle}`}>{group.label}</p>
                  <div className="grid grid-cols-4 gap-2">
                    {allNavItems.filter(i => i.group === group.key).map(item => (
                      <button key={item.href}
                        onClick={() => { navigate(item.href); onClose(); }}
                        className="flex flex-col items-center gap-1.5 p-3 rounded-2xl transition-all active:scale-95"
                        style={{ background: theme === 'dark' ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)' }}>
                        <div className="w-11 h-11 rounded-2xl flex items-center justify-center"
                          style={{ background: theme === 'dark' ? 'rgba(7,93,232,0.15)' : 'rgba(7,93,232,0.1)', border: theme === 'dark' ? '1px solid rgba(7,93,232,0.2)' : '1px solid rgba(7,93,232,0.15)' }}>
                          <item.icon size={18} className={theme === 'dark' ? 'text-[#5BA4F5]' : 'text-[#075DE8]'} />
                        </div>
                        <span className={`text-[10px] font-semibold text-center leading-tight ${t.textMuted}`}>{item.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
              <div className="pt-1" style={{ borderTop: `1px solid ${t.divider}` }}>
                <button onClick={() => { logout(); navigate('/portal/login'); onClose(); }}
                  className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-rose-400 transition-colors"
                  style={{ background: 'rgba(244,63,94,0.07)' }}>
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
  const { tenantUser, isAuthenticated, logout, theme, toggleTheme } = useTenantPortal();
  const navigate  = useNavigate();
  const location  = useLocation();
  const [moreOpen, setMoreOpen] = useState(false);
  const t = T[theme];

  useEffect(() => {
    if (!isAuthenticated) navigate('/portal/login', { replace: true });
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated || !tenantUser) return null;

  const { unit, payments, conversations } = getTenantData(tenantUser.id);
  const unreadMessages  = conversations.reduce((s, c) => s + c.unreadCount, 0);
  const overduePayments = payments.filter(p => p.status === 'overdue').length;

  const isActive = (href: string) => {
    if (href === '/portal/more') return false;
    return location.pathname === href || location.pathname.startsWith(href + '/');
  };

  const initials    = tenantUser.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  const currentNav  = allNavItems.find(i => isActive(i.href));

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: t.pageBg }}>

      {/* ── Desktop Sidebar ── */}
      <aside
        className="hidden lg:flex flex-col w-[240px] xl:w-[256px] flex-shrink-0 h-screen"
        style={{ background: t.sidebarBg, borderRight: `1px solid ${t.sidebarBorder}` }}
      >
        {/* Brand */}
        <div className="px-4 pt-5 pb-4" style={{ borderBottom: `1px solid ${t.divider}` }}>
          <div className="mb-4">
            <img src="/uphold-logo-wordmark.png" alt="Uphold" className="h-12 xl:h-14 w-auto object-contain" />
            <div className="flex items-center gap-2 mt-1.5">
              <div className="h-px flex-1" style={{ background: t.divider }} />
              <span className={`text-[9px] font-bold uppercase tracking-[0.2em] ${t.textSubtle}`}>Resident Portal</span>
              <div className="h-px flex-1" style={{ background: t.divider }} />
            </div>
          </div>

          {/* Tenant card */}
          <div className="flex items-center gap-3 p-3 rounded-xl"
            style={{ background: t.cardBg, border: `1px solid ${t.cardBorder}` }}>
            <div className="w-9 h-9 rounded-xl bg-uphold-gradient flex items-center justify-center text-white text-xs font-bold flex-shrink-0 shadow-lg shadow-blue-500/20">
              {initials}
            </div>
            <div className="min-w-0 flex-1">
              <p className={`text-sm font-semibold truncate leading-tight ${t.textMain}`}>{tenantUser.name}</p>
              <p className={`text-[11px] truncate leading-tight mt-0.5 ${t.textMuted}`}>
                {unit ? `${unit.unitNumber} · ${unit.propertyName}` : 'Portal Member'}
              </p>
            </div>
            <div className="w-2 h-2 rounded-full bg-[#32E6A4] flex-shrink-0 shadow-[0_0_6px_rgba(50,230,164,0.7)]" />
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 px-3 space-y-5 overflow-y-auto">
          {navGroups.map(group => (
            <div key={group.key}>
              <p className={`text-[9px] font-bold uppercase tracking-[0.2em] px-3 mb-1.5 ${t.sidebarLabel}`}>
                {group.label}
              </p>
              <div className="space-y-0.5">
                {allNavItems.filter(i => i.group === group.key).map(item => {
                  const active = isActive(item.href);
                  const badge  = item.href === '/portal/messages' ? unreadMessages
                               : item.href === '/portal/payments'  ? overduePayments : 0;
                  return (
                    <NavLink key={item.href} to={item.href}
                      className={`group relative flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-150 ${
                        active ? t.activeText : t.navText + ' hover:' + t.navTextHover
                      }`}
                      style={active ? {
                        background: t.activeBg,
                        border: `1px solid ${t.activeBorder}`,
                      } : {
                        background: 'transparent',
                        border: '1px solid transparent',
                      }}
                    >
                      {active && (
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-r-full bg-uphold-gradient" />
                      )}
                      <item.icon size={15}
                        className={`flex-shrink-0 transition-colors ${active ? t.activeIcon : t.navIcon + ' group-hover:' + t.navIconHover}`} />
                      <span className="flex-1 truncate">{item.label}</span>
                      {badge > 0 && (
                        <span className={`px-1.5 py-0.5 text-[9px] font-bold rounded-full flex-shrink-0 ${
                          item.href === '/portal/payments'
                            ? 'bg-rose-500/20 text-rose-400'
                            : 'bg-[#075DE8]/20 text-[#5BA4F5]'
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

        {/* Footer */}
        <div className="p-3 space-y-0.5" style={{ borderTop: `1px solid ${t.divider}` }}>
          <button onClick={() => { logout(); navigate('/portal/login'); }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all"
          >
            <LogOut size={15} className="flex-shrink-0" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* ── Main Content ── */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">

        {/* Desktop top bar */}
        <header
          className="hidden lg:flex items-center justify-between px-8 xl:px-10 h-[58px] flex-shrink-0"
          style={{ background: t.headerBg, borderBottom: `1px solid ${t.headerBorder}` }}
        >
          <div className="flex items-center gap-2 text-sm">
            <span className={`font-medium ${t.textSubtle}`}>Portal</span>
            {currentNav && (
              <>
                <ChevronRight size={13} className={t.textFaint} />
                <span className={`font-semibold ${t.textMain}`}>{currentNav.label}</span>
              </>
            )}
          </div>

          <div className="flex items-center gap-2.5">
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="w-9 h-9 rounded-xl flex items-center justify-center transition-all"
              style={{ background: t.cardBg, border: `1px solid ${t.cardBorder}` }}
              title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {theme === 'dark'
                ? <Sun size={16} className="text-amber-400" />
                : <Moon size={16} className="text-slate-500" />}
            </button>

            {overduePayments > 0 && (
              <button onClick={() => navigate('/portal/payments')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-colors"
                style={{ background: t.overBg, border: `1px solid ${t.overBorder}` }}>
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                <span className={`text-xs font-semibold ${t.overText}`}>{overduePayments} overdue</span>
              </button>
            )}

            <NavLink to="/portal/messages"
              className="relative w-9 h-9 rounded-xl flex items-center justify-center transition-colors"
              style={{ background: t.cardBg, border: `1px solid ${t.cardBorder}` }}>
              <Bell size={16} className={t.navIcon} />
              {unreadMessages > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#075DE8] text-white text-[9px] font-bold rounded-full flex items-center justify-center shadow-lg">
                  {unreadMessages}
                </span>
              )}
            </NavLink>

            <NavLink to="/portal/profile"
              className="w-9 h-9 rounded-xl bg-uphold-gradient flex items-center justify-center text-white text-xs font-bold shadow-lg shadow-blue-500/25 transition-all hover:shadow-blue-500/40">
              {initials}
            </NavLink>
          </div>
        </header>

        {/* Mobile top bar */}
        <header className="lg:hidden flex items-center justify-between px-4 py-3 flex-shrink-0"
          style={{ background: t.mobileTop, borderBottom: `1px solid ${t.mobileTopBorder}` }}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-uphold-gradient flex items-center justify-center text-white text-xs font-bold shadow-md shadow-blue-500/20">
              {initials}
            </div>
            <div>
              <p className={`text-sm font-semibold leading-none ${t.textMain}`}>{tenantUser.name.split(' ')[0]}</p>
              <p className={`text-[10px] leading-none mt-0.5 ${t.textMuted}`}>{unit?.unitNumber} · {unit?.propertyName}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {overduePayments > 0 && (
              <button onClick={() => navigate('/portal/payments')}
                className="flex items-center gap-1 px-2.5 py-1 rounded-full"
                style={{ background: t.overBg, border: `1px solid ${t.overBorder}` }}>
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                <span className={`text-[10px] font-bold ${t.overText}`}>{overduePayments}</span>
              </button>
            )}
            <button onClick={toggleTheme}
              className="p-2 rounded-xl transition-colors"
              style={{ background: t.cardBg }}>
              {theme === 'dark'
                ? <Sun size={17} className="text-amber-400" />
                : <Moon size={17} className="text-slate-500" />}
            </button>
            <NavLink to="/portal/messages" className="relative p-2 rounded-xl transition-colors" style={{ background: t.cardBg }}>
              <Bell size={19} className={t.navIcon} />
              {unreadMessages > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-[#075DE8] text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {unreadMessages}
                </span>
              )}
            </NavLink>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto pb-20 lg:pb-0" style={{ background: t.pageBg }}>
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.22, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] }}
            className="h-full"
          >
            <Outlet />
          </motion.div>
        </main>
      </div>

      {/* ── Mobile bottom nav ── */}
      <nav className="lg:hidden fixed bottom-0 inset-x-0 z-30 backdrop-blur-xl"
        style={{ background: t.mobileNavBg, borderTop: `1px solid ${t.cardBorder}` }}>
        <div className="flex items-center justify-around px-2"
          style={{ paddingBottom: 'max(10px, env(safe-area-inset-bottom))', paddingTop: '6px' }}>
          {bottomNavItems.map(item => {
            const active = item.href === '/portal/more' ? moreOpen : isActive(item.href);
            const badge  = item.href === '/portal/messages' ? unreadMessages
                         : item.href === '/portal/payments'  ? overduePayments : 0;

            if (item.href === '/portal/more') {
              return (
                <button key={item.href} onClick={() => setMoreOpen(v => !v)}
                  className="relative flex flex-col items-center gap-1 py-1.5 px-4 rounded-2xl transition-all">
                  <div className={`p-1.5 rounded-xl transition-all ${active ? 'bg-[#075DE8]/20' : ''}`}>
                    <item.icon size={20} className={active ? 'text-[#075DE8]' : 'text-slate-400'} />
                  </div>
                  <span className={`text-[10px] font-semibold ${active ? 'text-[#075DE8]' : 'text-slate-400'}`}>{item.label}</span>
                </button>
              );
            }

            return (
              <NavLink key={item.href} to={item.href}
                className="relative flex flex-col items-center gap-1 py-1.5 px-4 rounded-2xl transition-all">
                {({ isActive: ia }) => (
                  <>
                    <div className={`p-1.5 rounded-xl transition-all ${ia ? 'bg-[#075DE8]/20' : ''}`}>
                      <item.icon size={20} className={ia ? 'text-[#075DE8]' : 'text-slate-400'} />
                    </div>
                    {badge > 0 && (
                      <span className="absolute top-1.5 right-3 w-4 h-4 bg-rose-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">{badge}</span>
                    )}
                    <span className={`text-[10px] font-semibold ${ia ? 'text-[#075DE8]' : 'text-slate-400'}`}>{item.label}</span>
                  </>
                )}
              </NavLink>
            );
          })}
        </div>
      </nav>

      <MoreSheet open={moreOpen} onClose={() => setMoreOpen(false)} theme={theme} />
    </div>
  );
}
