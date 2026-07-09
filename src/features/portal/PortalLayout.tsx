import { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Home, Wrench, CreditCard, MessageSquare, Grid3x3,
  Building2, Package, Bell, FileText, Users, MapPin, QrCode,
  Zap, HelpCircle, User, LogOut, X, ChevronRight,
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

function MoreSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { logout } = useTenantPortal();
  const navigate = useNavigate();

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 32, stiffness: 320 }}
            className="fixed bottom-0 inset-x-0 z-50 rounded-t-3xl shadow-2xl max-h-[85vh] overflow-y-auto"
            style={{ background: '#0A1628', border: '1px solid rgba(255,255,255,0.08)' }}
          >
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 rounded-full" style={{ background: 'rgba(255,255,255,0.12)' }} />
            </div>
            <div className="flex items-center justify-between px-5 pt-2 pb-3 sticky top-0 border-b" style={{ background: '#0A1628', borderColor: 'rgba(255,255,255,0.07)' }}>
              <h2 className="text-base font-semibold text-white">All Features</h2>
              <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors" style={{ background: 'rgba(255,255,255,0.06)' }}>
                <X size={16} className="text-white/60" />
              </button>
            </div>
            <div className="px-4 pb-10 pt-4 space-y-5">
              {navGroups.map(group => (
                <div key={group.key}>
                  <p className="text-[10px] font-bold text-white/25 uppercase tracking-widest px-1 mb-2">{group.label}</p>
                  <div className="grid grid-cols-4 gap-2">
                    {allNavItems.filter(i => i.group === group.key).map(item => (
                      <button
                        key={item.href}
                        onClick={() => { navigate(item.href); onClose(); }}
                        className="flex flex-col items-center gap-1.5 p-3 rounded-2xl transition-all active:scale-95"
                        style={{ background: 'rgba(255,255,255,0.04)' }}
                      >
                        <div className="w-11 h-11 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(7,93,232,0.15)', border: '1px solid rgba(7,93,232,0.2)' }}>
                          <item.icon size={18} className="text-[#5BA4F5]" />
                        </div>
                        <span className="text-[10px] font-semibold text-white/60 text-center leading-tight">{item.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
              <div className="pt-1 border-t" style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
                <button
                  onClick={() => { logout(); navigate('/portal/login'); onClose(); }}
                  className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-rose-400 transition-colors"
                  style={{ background: 'rgba(244,63,94,0.07)' }}
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
  const navigate  = useNavigate();
  const location  = useLocation();
  const [moreOpen, setMoreOpen] = useState(false);

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
    <div className="flex h-screen overflow-hidden" style={{ background: '#03070F' }}>

      {/* ── Desktop Sidebar ──────────────────────────────────────────────── */}
      <aside
        className="hidden lg:flex flex-col w-[240px] xl:w-[256px] flex-shrink-0 h-screen"
        style={{ background: '#040B1A', borderRight: '1px solid rgba(255,255,255,0.06)' }}
      >
        {/* Brand + tenant card */}
        <div className="px-4 py-5" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          {/* Uphold logo */}
          <div className="mb-4">
            <img src="/uphold-logo-transparent.png" alt="Uphold" className="h-9 w-auto object-contain" />
            <div className="flex items-center gap-2 mt-1.5">
              <div className="h-px flex-1" style={{ background: 'rgba(255,255,255,0.06)' }} />
              <span className="text-[9px] font-bold text-white/20 uppercase tracking-[0.2em]">Resident Portal</span>
              <div className="h-px flex-1" style={{ background: 'rgba(255,255,255,0.06)' }} />
            </div>
          </div>

          {/* Tenant card */}
          <div className="flex items-center gap-3 p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
            <div className="w-9 h-9 rounded-xl bg-uphold-gradient flex items-center justify-center text-white text-xs font-bold flex-shrink-0 shadow-lg shadow-blue-500/20">
              {initials}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-white truncate leading-tight">{tenantUser.name}</p>
              <p className="text-[11px] text-white/35 truncate leading-tight mt-0.5">
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
              <p className="text-[9px] font-bold text-white/18 uppercase tracking-[0.2em] px-3 mb-1.5">
                {group.label}
              </p>
              <div className="space-y-0.5">
                {allNavItems.filter(i => i.group === group.key).map(item => {
                  const active = isActive(item.href);
                  const badge  = item.href === '/portal/messages' ? unreadMessages
                               : item.href === '/portal/payments'  ? overduePayments : 0;
                  return (
                    <NavLink
                      key={item.href}
                      to={item.href}
                      className={`group relative flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-150 ${
                        active
                          ? 'text-white'
                          : 'text-white/40 hover:text-white/70'
                      }`}
                      style={active ? {
                        background: 'rgba(7,93,232,0.14)',
                        border: '1px solid rgba(7,93,232,0.22)',
                      } : {
                        background: 'transparent',
                        border: '1px solid transparent',
                      }}
                    >
                      {active && (
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-r-full bg-uphold-gradient" />
                      )}
                      <item.icon
                        size={15}
                        className={`flex-shrink-0 transition-colors ${active ? 'text-[#5BA4F5]' : 'text-white/30 group-hover:text-white/55'}`}
                      />
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
        <div className="p-3 space-y-0.5" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <button
            onClick={() => { logout(); navigate('/portal/login'); }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-rose-400/70 hover:text-rose-400 transition-all"
            style={{ background: 'transparent' }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(244,63,94,0.08)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
          >
            <LogOut size={15} className="flex-shrink-0" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* ── Main Content Area ────────────────────────────────────────────── */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">

        {/* Desktop top bar */}
        <header
          className="hidden lg:flex items-center justify-between px-8 xl:px-10 h-[58px] flex-shrink-0"
          style={{ background: '#040B1A', borderBottom: '1px solid rgba(255,255,255,0.06)' }}
        >
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm">
            <span className="text-white/25 font-medium">Portal</span>
            {currentNav && (
              <>
                <ChevronRight size={13} className="text-white/15" />
                <span className="font-semibold text-white/80">{currentNav.label}</span>
              </>
            )}
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2.5">
            {overduePayments > 0 && (
              <button
                onClick={() => navigate('/portal/payments')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-colors"
                style={{ background: 'rgba(244,63,94,0.12)', border: '1px solid rgba(244,63,94,0.22)' }}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                <span className="text-xs font-semibold text-rose-400">{overduePayments} overdue</span>
              </button>
            )}

            <NavLink
              to="/portal/messages"
              className="relative w-9 h-9 rounded-xl flex items-center justify-center transition-colors"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
            >
              <Bell size={16} className="text-white/45" />
              {unreadMessages > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#075DE8] text-white text-[9px] font-bold rounded-full flex items-center justify-center shadow-lg">
                  {unreadMessages}
                </span>
              )}
            </NavLink>

            <NavLink
              to="/portal/profile"
              className="w-9 h-9 rounded-xl bg-uphold-gradient flex items-center justify-center text-white text-xs font-bold shadow-lg shadow-blue-500/25 transition-all hover:shadow-blue-500/40"
            >
              {initials}
            </NavLink>
          </div>
        </header>

        {/* Mobile top bar */}
        <header
          className="lg:hidden flex items-center justify-between px-4 py-3 flex-shrink-0"
          style={{ background: '#040B1A', borderBottom: '1px solid rgba(255,255,255,0.06)' }}
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-uphold-gradient flex items-center justify-center text-white text-xs font-bold shadow-md shadow-blue-500/20">
              {initials}
            </div>
            <div>
              <p className="text-sm font-semibold text-white leading-none">{tenantUser.name.split(' ')[0]}</p>
              <p className="text-[10px] text-white/35 leading-none mt-0.5">{unit?.unitNumber} · {unit?.propertyName}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {overduePayments > 0 && (
              <button onClick={() => navigate('/portal/payments')} className="flex items-center gap-1 px-2.5 py-1 rounded-full" style={{ background: 'rgba(244,63,94,0.12)', border: '1px solid rgba(244,63,94,0.22)' }}>
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                <span className="text-[10px] font-bold text-rose-400">{overduePayments} overdue</span>
              </button>
            )}
            <NavLink to="/portal/messages" className="relative p-2 rounded-xl transition-colors" style={{ background: 'rgba(255,255,255,0.04)' }}>
              <Bell size={19} className="text-white/45" />
              {unreadMessages > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-[#075DE8] text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {unreadMessages}
                </span>
              )}
            </NavLink>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto pb-20 lg:pb-0" style={{ background: '#03070F' }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.22, ease: [0.25, 0.1, 0.25, 1] }}
              className="h-full"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* ── Mobile bottom nav ─────────────────────────────────────────────── */}
      <nav
        className="lg:hidden fixed bottom-0 inset-x-0 z-30 backdrop-blur-xl"
        style={{ background: 'rgba(4,11,26,0.95)', borderTop: '1px solid rgba(255,255,255,0.07)' }}
      >
        <div className="flex items-center justify-around px-2" style={{ paddingBottom: 'max(10px, env(safe-area-inset-bottom))', paddingTop: '6px' }}>
          {bottomNavItems.map(item => {
            const active = item.href === '/portal/more' ? moreOpen : isActive(item.href);
            const badge  = item.href === '/portal/messages' ? unreadMessages
                         : item.href === '/portal/payments'  ? overduePayments : 0;

            if (item.href === '/portal/more') {
              return (
                <button key={item.href} onClick={() => setMoreOpen(v => !v)}
                  className="relative flex flex-col items-center gap-1 py-1.5 px-4 rounded-2xl transition-all"
                >
                  <div className={`p-1.5 rounded-xl transition-all ${active ? 'bg-[#075DE8]/20' : ''}`}>
                    <item.icon size={20} className={active ? 'text-[#5BA4F5]' : 'text-white/30'} />
                  </div>
                  <span className={`text-[10px] font-semibold ${active ? 'text-[#5BA4F5]' : 'text-white/30'}`}>{item.label}</span>
                </button>
              );
            }

            return (
              <NavLink key={item.href} to={item.href}
                className={({ isActive: ia }) => `relative flex flex-col items-center gap-1 py-1.5 px-4 rounded-2xl transition-all`}
              >
                {({ isActive: ia }) => (
                  <>
                    <div className={`p-1.5 rounded-xl transition-all ${ia ? 'bg-[#075DE8]/20' : ''}`}>
                      <item.icon size={20} className={ia ? 'text-[#5BA4F5]' : 'text-white/30'} />
                    </div>
                    {badge > 0 && (
                      <span className="absolute top-1.5 right-3 w-4 h-4 bg-rose-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">{badge}</span>
                    )}
                    <span className={`text-[10px] font-semibold ${ia ? 'text-[#5BA4F5]' : 'text-white/30'}`}>{item.label}</span>
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
