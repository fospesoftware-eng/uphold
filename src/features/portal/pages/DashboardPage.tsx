import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { LeaseStatusBadge } from '../components/LeaseStatusBadge';
import { getLeaseInfo } from '../lease';
import {
  CreditCard, Wrench, FileText, Bell, Package, MapPin,
  ChevronRight, AlertTriangle, Clock, ArrowUpRight,
  Zap, Home, Shield, Calendar, BarChart3, CheckCircle,
  Users, HelpCircle,
} from 'lucide-react';
import { useTenantPortal } from '../context';
import { getTenantData, NOTICES, COMMUNITY_EVENTS } from '../data';

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.38, delay, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] },
});

const stagger = {
  container: { hidden: {}, show: { transition: { staggerChildren: 0.07 } } },
  item: {
    hidden: { opacity: 0, y: 14 },
    show:   { opacity: 1, y: 0, transition: { duration: 0.32, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] } },
  },
};

// Animated number that springs from 0 up to `value` on mount.
function CountUp({ value }: { value: number }) {
  const mv = useMotionValue(0);
  const spring = useSpring(mv, { stiffness: 90, damping: 18, mass: 0.6 });
  const text = useTransform(spring, v => Math.round(v).toString());
  useEffect(() => { mv.set(value); }, [value, mv]);
  return <motion.span>{text}</motion.span>;
}

const STATUS_META: Record<string, { label: string; color: string; bg: string }> = {
  submitted:         { label: 'Submitted',    color: 'text-slate-400',  bg: 'rgba(148,163,184,0.12)' },
  acknowledged:      { label: 'Acknowledged', color: 'text-blue-400',   bg: 'rgba(59,130,246,0.12)' },
  assigned:          { label: 'Assigned',     color: 'text-indigo-400', bg: 'rgba(99,102,241,0.12)' },
  in_progress:       { label: 'In Progress',  color: 'text-amber-400',  bg: 'rgba(245,158,11,0.12)' },
  waiting_for_parts: { label: 'Waiting Parts',color: 'text-orange-400', bg: 'rgba(249,115,22,0.12)' },
};

export function PortalDashboard() {
  const { tenantUser, theme } = useTenantPortal();
  const navigate = useNavigate();
  const [noticeRead, setNoticeRead] = useState<string[]>([]);
  const isLight = theme === 'light';

  if (!tenantUser) return null;

  const { unit, tickets, payments, parcels, assets, conversations } = getTenantData(tenantUser.id);

  const openTickets      = tickets.filter(t => !['resolved', 'closed'].includes(t.status));
  const overduePayments  = payments.filter(p => p.status === 'overdue');
  const pendingParcels   = parcels.filter(p => p.status === 'pending_collection');
  const nextPayment      = payments.find(p => p.status === 'upcoming' || p.status === 'pending');
  const unreadMessages   = conversations.reduce((s, c) => s + c.unreadCount, 0);
  const pinnedNotices    = NOTICES.filter(n => n.isPinned);
  const upcomingEvent    = COMMUNITY_EVENTS[0];

  const hour = new Date().getHours();
  const greeting  = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const firstName = tenantUser.name.split(' ')[0];

  // ── theme tokens ──
  const heroGrad = isLight
    ? 'linear-gradient(135deg, #FFFFFF 0%, #EEF4FF 35%, #D6E4FF 70%, #B8D0FF 100%)'
    : 'linear-gradient(135deg, #04091A 0%, #071530 35%, #075DE8 75%, #0797D8 100%)';
  const pageBg   = isLight ? '#F5F7FA' : '#03070F';
  const cardBg   = isLight ? '#FFFFFF'  : 'rgba(255,255,255,0.03)';
  const cardBorder = isLight ? 'rgba(0,0,0,0.07)' : 'rgba(255,255,255,0.07)';
  const textMain = isLight ? 'text-slate-800' : 'text-white/85';
  const textMuted = isLight ? 'text-slate-500' : 'text-white/35';
  const textSubtle = isLight ? 'text-slate-400' : 'text-white/25';
  const textFaint = isLight ? 'text-slate-300' : 'text-white/15';
  const heroSub = isLight ? 'text-slate-500' : 'text-blue-100/65';
  const heroTitle = isLight ? 'text-slate-900' : 'text-white';
  const heroDot = isLight ? 'rgba(0,0,0,0.03)' : 'rgba(255,255,255,0.04)';
  const badgeOverBg = isLight ? 'rgba(244,63,94,0.08)' : 'rgba(244,63,94,0.12)';
  const badgeOverBorder = isLight ? 'rgba(244,63,94,0.18)' : 'rgba(244,63,94,0.22)';
  const noticeUnread = isLight ? '#075DE8' : '#075DE8';
  const noticeUrgentBg = isLight ? 'rgba(244,63,94,0.07)' : 'rgba(244,63,94,0.07)';
  const noticeUrgentBorder = isLight ? 'rgba(244,63,94,0.18)' : 'rgba(244,63,94,0.2)';
  const noticeNormalBg = isLight ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.03)';
  const noticeNormalBorder = isLight ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.07)';

  const kpis = [
    { label: 'Open Tickets',    value: openTickets.length,    icon: Wrench,   accent: '#F59E0B', accentBg: 'rgba(245,158,11,0.12)',   href: '/portal/maintenance' },
    { label: 'Pending Parcels', value: pendingParcels.length, icon: Package,  accent: '#3B82F6', accentBg: 'rgba(59,130,246,0.12)',   href: '/portal/parcels' },
    { label: 'Unread Messages', value: unreadMessages,        icon: Bell,     accent: '#8B5CF6', accentBg: 'rgba(139,92,246,0.12)',   href: '/portal/messages' },
    { label: 'My Assets',       value: assets.length,         icon: Shield,   accent: '#10B981', accentBg: 'rgba(16,185,129,0.12)',   href: '/portal/assets' },
  ];

  const quickActions = [
    { icon: Wrench,     label: 'New Request',  desc: 'Report an issue',  accent: '#F59E0B', bg: 'rgba(245,158,11,0.1)',   href: '/portal/maintenance' },
    { icon: CreditCard, label: 'Pay Rent',     desc: 'Make a payment',   accent: '#3B82F6', bg: 'rgba(59,130,246,0.1)',   href: '/portal/payments' },
    { icon: MapPin,     label: 'Add Visitor',  desc: 'Register a guest', accent: '#8B5CF6', bg: 'rgba(139,92,246,0.1)',   href: '/portal/visitors' },
    { icon: FileText,   label: 'Documents',    desc: 'View your files',  accent: '#10B981', bg: 'rgba(16,185,129,0.1)',   href: '/portal/documents' },
    { icon: BarChart3,  label: 'Utilities',    desc: 'Track usage',      accent: '#0EA5E9', bg: 'rgba(14,165,233,0.1)',   href: '/portal/utilities' },
    { icon: Calendar,   label: 'Community',    desc: 'Events & notices', accent: '#EC4899', bg: 'rgba(236,72,153,0.1)',   href: '/portal/community' },
  ];

  return (
    <div className="min-h-full" style={{ background: pageBg }}>

      {/* ── Hero Banner ── */}
      <motion.div {...fade(0)} className="relative overflow-hidden" style={{ background: heroGrad }}>
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <motion.div className="absolute -top-16 right-0 w-80 h-80 rounded-full"
            style={{ background: `radial-gradient(circle, ${isLight ? 'rgba(7,93,232,0.06)' : 'rgba(255,255,255,0.05)'} 0%, transparent 70%)` }}
            animate={{ x: [0, -28, 0], y: [0, 22, 0], scale: [1, 1.12, 1] }}
            transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }} />
          <motion.div className="absolute bottom-0 left-1/3 w-64 h-48 rounded-full"
            style={{ background: `radial-gradient(circle, ${isLight ? 'rgba(21,198,184,0.06)' : 'rgba(50,230,164,0.08)'} 0%, transparent 70%)` }}
            animate={{ x: [0, 34, 0], y: [0, -18, 0], scale: [1, 1.18, 1] }}
            transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }} />
          <div className="absolute inset-0 opacity-[0.04]"
            style={{ backgroundImage: `radial-gradient(${heroDot} 1px, transparent 1px)`, backgroundSize: '24px 24px' }} />
        </div>

        <div className="relative px-6 lg:px-8 xl:px-10 py-8 lg:py-10">
          <div className="max-w-[1400px] mx-auto">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">

              {/* Greeting */}
              <div className="flex-1">
                <p className={`text-sm font-medium mb-1 ${heroSub}`}>{greeting},</p>
                <h1 className={`text-3xl lg:text-4xl xl:text-5xl font-bold tracking-tight leading-tight ${heroTitle}`}>
                  {firstName} 👋
                </h1>
                <div className={`flex flex-wrap items-center gap-x-3 gap-y-1 mt-3 ${heroSub}`}>
                  <span className="flex items-center gap-1.5 text-sm"><Home size={13} /> {unit?.propertyName}</span>
                  <span className={isLight ? 'text-slate-300' : 'text-blue-200/30'}>·</span>
                  <span className="text-sm">{unit?.unitNumber}</span>
                  <span className={isLight ? 'text-slate-300' : 'text-blue-200/30'}>·</span>
                  {unit && <LeaseStatusBadge leaseEnd={unit.leaseEnd} variant="inline" tone={isLight ? 'auto' : 'light'} />}
                </div>

                {/* Alert pills */}
                <div className="flex flex-wrap gap-2 mt-5">
                  {openTickets.length > 0 && (
                    <button onClick={() => navigate('/portal/maintenance')}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full backdrop-blur-sm transition-colors"
                      style={{ background: isLight ? 'rgba(245,158,11,0.12)' : 'rgba(255,255,255,0.1)', border: `1px solid ${isLight ? 'rgba(245,158,11,0.2)' : 'rgba(255,255,255,0.15)'}` }}>
                      <Wrench size={12} className={isLight ? 'text-amber-600' : 'text-amber-200'} />
                      <span className={`text-xs font-medium ${isLight ? 'text-amber-700' : 'text-white/85'}`}>{openTickets.length} open</span>
                    </button>
                  )}
                  {unreadMessages > 0 && (
                    <button onClick={() => navigate('/portal/messages')}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full backdrop-blur-sm transition-colors"
                      style={{ background: isLight ? 'rgba(139,92,246,0.12)' : 'rgba(255,255,255,0.1)', border: `1px solid ${isLight ? 'rgba(139,92,246,0.2)' : 'rgba(255,255,255,0.15)'}` }}>
                      <Bell size={12} className={isLight ? 'text-violet-600' : 'text-violet-200'} />
                      <span className={`text-xs font-medium ${isLight ? 'text-violet-700' : 'text-white/85'}`}>{unreadMessages} unread</span>
                    </button>
                  )}
                  {overduePayments.length > 0 && (
                    <button onClick={() => navigate('/portal/payments')}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full backdrop-blur-sm transition-colors"
                      style={{ background: badgeOverBg, border: `1px solid ${badgeOverBorder}` }}>
                      <AlertTriangle size={12} className={isLight ? 'text-rose-500' : 'text-rose-200'} />
                      <span className={`text-xs font-medium ${isLight ? 'text-rose-600' : 'text-rose-100'}`}>{overduePayments.length} overdue</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Payment card */}
              {nextPayment && (
                <motion.button {...fade(0.15)} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  onClick={() => navigate('/portal/payments')}
                  className="lg:w-72 xl:w-80 flex items-center gap-4 p-4 lg:p-5 rounded-2xl text-left transition-all shadow-xl backdrop-blur-md"
                  style={{ background: isLight ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.08)', border: `1px solid ${isLight ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.15)'}` }}>
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
                    style={{ background: isLight ? 'rgba(7,93,232,0.1)' : 'rgba(255,255,255,0.1)', border: `1px solid ${isLight ? 'rgba(7,93,232,0.2)' : 'rgba(255,255,255,0.15)'}` }}>
                    <CreditCard size={20} className={isLight ? 'text-[#075DE8]' : 'text-white'} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-xs font-medium ${isLight ? 'text-slate-400' : 'text-blue-100/55'}`}>
                      {overduePayments.length > 0 ? 'Overdue payment' : 'Next payment due'}
                    </p>
                    <p className={`font-bold text-lg leading-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>£{nextPayment.amount.toFixed(2)}</p>
                    <p className={`text-xs mt-0.5 truncate ${isLight ? 'text-slate-400' : 'text-blue-100/45'}`}>{nextPayment.description}</p>
                  </div>
                  <ChevronRight size={17} className={isLight ? 'text-slate-400' : 'text-white/40'} />
                </motion.button>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── Page Body ── */}
      <div className="px-6 lg:px-8 xl:px-10 py-7 max-w-[1400px] mx-auto space-y-7">

        {/* Overdue alert */}
        {overduePayments.length > 0 && (
          <motion.div {...fade(0.05)} className="flex items-center gap-4 p-4 rounded-2xl"
            style={{ background: badgeOverBg, border: `1px solid ${badgeOverBorder}` }}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: isLight ? 'rgba(244,63,94,0.12)' : 'rgba(244,63,94,0.15)' }}>
              <AlertTriangle size={18} className="text-rose-400" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-rose-400">Overdue payment</p>
              <p className="text-xs text-rose-400/60 mt-0.5">
                You have {overduePayments.length} overdue payment{overduePayments.length > 1 ? 's' : ''}. Please pay to avoid further late fees.
              </p>
            </div>
            <button onClick={() => navigate('/portal/payments')}
              className="flex-shrink-0 px-4 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-semibold transition-colors">
              Pay now
            </button>
          </motion.div>
        )}

        {/* KPI Grid */}
        <motion.div variants={stagger.container} initial="hidden" animate="show" className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          {kpis.map(kpi => (
            <motion.button key={kpi.label} variants={stagger.item}
              whileHover={{ y: -2, boxShadow: isLight ? '0 12px 32px rgba(0,0,0,0.1)' : '0 12px 32px rgba(0,0,0,0.4)' }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate(kpi.href)}
              className="group relative overflow-hidden rounded-2xl p-5 text-left transition-all"
              style={{ background: cardBg, border: `1px solid ${cardBorder}` }}>
              <div className="absolute top-0 left-0 right-0 h-[1.5px] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ background: `linear-gradient(90deg, ${kpi.accent}, transparent)` }} />
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ background: kpi.accentBg }}>
                <kpi.icon size={18} style={{ color: kpi.accent }} />
              </div>
              <p className={`text-3xl font-bold ${isLight ? 'text-slate-800' : 'text-white'}`}><CountUp value={kpi.value} /></p>
              <p className={`text-sm mt-1 leading-tight ${textMuted}`}>{kpi.label}</p>
              <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <ArrowUpRight size={14} className={textFaint} />
              </div>
            </motion.button>
          ))}
        </motion.div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-7">

          {/* LEFT: main */}
          <div className="xl:col-span-2 space-y-7">

            {/* Quick Actions */}
            <motion.section {...fade(0.12)}>
              <div className="flex items-center justify-between mb-4">
                <h2 className={`text-base font-semibold ${textMain}`}>Quick Actions</h2>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                {quickActions.map(action => (
                  <motion.button key={action.label}
                    whileHover={{ y: -3, boxShadow: isLight ? '0 8px 24px rgba(0,0,0,0.1)' : '0 8px 24px rgba(0,0,0,0.3)' }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate(action.href)}
                    className="group flex flex-col items-center gap-2.5 p-4 rounded-2xl transition-all"
                    style={{ background: cardBg, border: `1px solid ${cardBorder}` }}>
                    <div className="w-11 h-11 rounded-2xl flex items-center justify-center transition-transform duration-200 group-hover:scale-110"
                      style={{ background: action.bg }}>
                      <action.icon size={20} style={{ color: action.accent }} />
                    </div>
                    <div className="text-center">
                      <p className={`text-xs font-semibold leading-tight group-hover:${isLight ? 'text-slate-900' : 'text-white/90'} transition-colors ${isLight ? 'text-slate-600' : 'text-white/70'}`}>{action.label}</p>
                      <p className={`text-[10px] leading-tight mt-0.5 hidden sm:block ${textMuted}`}>{action.desc}</p>
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.section>

            {/* Open Requests */}
            {openTickets.length > 0 && (
              <motion.section {...fade(0.18)}>
                <div className="flex items-center justify-between mb-4">
                  <h2 className={`text-base font-semibold ${textMain}`}>Open Requests</h2>
                  <button onClick={() => navigate('/portal/maintenance')}
                    className="flex items-center gap-1 text-sm font-medium text-[#5BA4F5] hover:text-[#38BDF8] transition-colors">
                    View all <ArrowUpRight size={14} />
                  </button>
                </div>
                <div className="space-y-3">
                  {openTickets.slice(0, 3).map(ticket => {
                    const meta = STATUS_META[ticket.status] ?? { label: ticket.status, color: isLight ? 'text-slate-500' : 'text-white/40', bg: isLight ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.07)' };
                    return (
                      <motion.button key={ticket.id}
                        whileHover={{ x: 3 }} whileTap={{ scale: 0.99 }}
                        onClick={() => navigate('/portal/maintenance')}
                        className="w-full flex items-center gap-4 p-4 rounded-2xl text-left transition-all"
                        style={{ background: cardBg, border: `1px solid ${cardBorder}` }}>
                        <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                          style={{ background: isLight ? 'rgba(245,158,11,0.12)' : 'rgba(245,158,11,0.12)' }}>
                          <Wrench size={18} className="text-amber-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-semibold truncate ${textMain}`}>{ticket.title}</p>
                          <div className={`flex items-center gap-2 mt-0.5 ${textMuted}`}>
                            <span className="text-xs">{ticket.ticketNumber}</span>
                            <span className={isLight ? 'text-slate-300' : 'text-white/15'}>·</span>
                            <Clock size={10} />
                            <span className="text-xs">
                              {new Date(ticket.updatedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                            </span>
                          </div>
                        </div>
                        <span className={`flex-shrink-0 text-[11px] font-semibold px-2.5 py-1 rounded-full ${meta.color}`} style={{ background: meta.bg }}>
                          {meta.label}
                        </span>
                        <ChevronRight size={14} className={textFaint} />
                      </motion.button>
                    );
                  })}
                </div>
              </motion.section>
            )}

            {/* Notices */}
            <motion.section {...fade(0.22)}>
              <div className="flex items-center justify-between mb-4">
                <h2 className={`text-base font-semibold ${textMain}`}>Notice Board</h2>
                <button onClick={() => navigate('/portal/notices')}
                  className="flex items-center gap-1 text-sm font-medium text-[#5BA4F5] hover:text-[#38BDF8] transition-colors">
                  All notices <ArrowUpRight size={14} />
                </button>
              </div>
              <div className="space-y-3">
                {pinnedNotices.slice(0, 3).map(notice => {
                  const isRead = noticeRead.includes(notice.id) || notice.readBy.includes(tenantUser.id);
                  const isUrgent = notice.priority === 'urgent';
                  return (
                    <motion.button key={notice.id}
                      whileHover={{ x: 3 }} whileTap={{ scale: 0.99 }}
                      onClick={() => { setNoticeRead(r => [...r, notice.id]); navigate('/portal/notices'); }}
                      className="w-full flex items-start gap-4 p-4 rounded-2xl text-left transition-all"
                      style={{
                        background: isUrgent ? noticeUrgentBg : noticeNormalBg,
                        border: `1px solid ${isUrgent ? noticeUrgentBorder : noticeNormalBorder}`,
                      }}>
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ background: isUrgent ? 'rgba(244,63,94,0.15)' : (isLight ? 'rgba(7,93,232,0.1)' : 'rgba(7,93,232,0.15)') }}>
                        <Bell size={16} className={isUrgent ? 'text-rose-400' : (isLight ? 'text-[#075DE8]' : 'text-[#5BA4F5]')} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start gap-2">
                          {!isRead && <span className="mt-1.5 w-2 h-2 rounded-full flex-shrink-0 shadow-[0_0_6px_rgba(7,93,232,0.7)]"
                            style={{ background: noticeUnread }} />}
                          <p className={`text-sm font-semibold truncate ${isUrgent ? 'text-rose-400' : textMain}`}>{notice.title}</p>
                        </div>
                        <p className={`text-xs line-clamp-2 mt-0.5 ${textMuted}`}>{notice.content}</p>
                        <p className={`text-[11px] mt-1.5 ${textSubtle}`}>
                          {new Date(notice.publishedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </p>
                      </div>
                      <ChevronRight size={14} className={textFaint} />
                    </motion.button>
                  );
                })}
              </div>
            </motion.section>

            {/* Parcels */}
            {pendingParcels.length > 0 && (
              <motion.section {...fade(0.26)}>
                <div className="flex items-center justify-between mb-4">
                  <h2 className={`text-base font-semibold ${textMain}`}>Parcels Waiting</h2>
                  <button onClick={() => navigate('/portal/parcels')}
                    className="flex items-center gap-1 text-sm font-medium text-[#5BA4F5] hover:text-[#38BDF8] transition-colors">
                    View all <ArrowUpRight size={14} />
                  </button>
                </div>
                <div className="space-y-3">
                  {pendingParcels.map(parcel => (
                    <motion.button key={parcel.id}
                      whileHover={{ x: 3 }} whileTap={{ scale: 0.99 }}
                      onClick={() => navigate('/portal/parcels')}
                      className="w-full flex items-center gap-4 p-4 rounded-2xl text-left transition-all"
                      style={{ background: cardBg, border: `1px solid ${cardBorder}` }}>
                      <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 text-xl"
                        style={{ background: isLight ? 'rgba(59,130,246,0.12)' : 'rgba(59,130,246,0.12)' }}>
                        📦
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-semibold truncate ${textMain}`}>{parcel.description}</p>
                        <p className={`text-xs mt-0.5 ${textMuted}`}>
                          {parcel.courier} · Code: <span className={`font-mono font-bold ${isLight ? 'text-[#075DE8]' : 'text-[#5BA4F5]'}`}>{parcel.collectionCode}</span>
                        </p>
                      </div>
                      <ChevronRight size={14} className={textFaint} />
                    </motion.button>
                  ))}
                </div>
              </motion.section>
            )}
          </div>

          {/* RIGHT: sidebar */}
          <div className="space-y-6">

            {/* Lease Overview */}
            {unit && (
              <motion.section {...fade(0.18)}>
                <h2 className={`text-base font-semibold ${textMain} mb-4`}>Lease Overview</h2>
                <div className="rounded-2xl overflow-hidden" style={{ background: cardBg, border: `1px solid ${cardBorder}` }}>
                  <div className="h-[2px] bg-uphold-gradient" />
                  <div className="p-5">
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      {[
                        { label: 'Monthly Rent', value: `£${unit.rentAmount.toFixed(2)}`, danger: false },
                        { label: 'Balance', value: unit.outstandingBalance > 0 ? `£${unit.outstandingBalance.toFixed(2)}` : 'All clear ✓', danger: unit.outstandingBalance > 0 },
                        { label: 'Lease Expires', value: new Date(unit.leaseEnd).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: '2-digit' }), danger: getLeaseInfo(unit.leaseEnd).state !== 'active' },
                        { label: 'Deposit Held', value: `£${unit.deposit.toFixed(2)}`, danger: false },
                      ].map(item => (
                        <div key={item.label} className="p-3 rounded-xl"
                          style={{ background: isLight ? 'rgba(0,0,0,0.03)' : 'rgba(255,255,255,0.04)' }}>
                          <p className={`text-[10px] font-medium uppercase tracking-wide ${textSubtle}`}>{item.label}</p>
                          <p className={`text-sm font-bold mt-0.5 ${item.danger ? 'text-rose-400' : textMain}`}>{item.value}</p>
                        </div>
                      ))}
                    </div>
                    <button onClick={() => navigate('/portal/property')}
                      className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all text-[#5BA4F5] hover:text-white"
                      style={{ background: isLight ? 'rgba(7,93,232,0.08)' : 'rgba(7,93,232,0.12)', border: `1px solid ${isLight ? 'rgba(7,93,232,0.15)' : 'rgba(7,93,232,0.2)'}` }}>
                      View tenancy details <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              </motion.section>
            )}

            {/* Payment History */}
            <motion.section {...fade(0.22)}>
              <div className="flex items-center justify-between mb-4">
                <h2 className={`text-base font-semibold ${textMain}`}>Payments</h2>
                <button onClick={() => navigate('/portal/payments')}
                  className="flex items-center gap-1 text-sm font-medium text-[#5BA4F5] hover:text-[#38BDF8] transition-colors">
                  View all <ArrowUpRight size={14} />
                </button>
              </div>
              <div className="rounded-2xl overflow-hidden" style={{ background: cardBg, border: `1px solid ${cardBorder}` }}>
                <div className="divide-y" style={{ borderColor: isLight ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.06)' }}>
                  {payments.slice(0, 4).map(payment => (
                    <div key={payment.id} className="flex items-center justify-between px-4 py-3">
                      <div className="min-w-0 flex-1">
                        <p className={`text-sm font-medium truncate ${textMuted}`}>{payment.description}</p>
                        <p className={`text-xs mt-0.5 ${textSubtle}`}>{new Date(payment.dueDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</p>
                      </div>
                      <div className="flex items-center gap-3 flex-shrink-0 ml-3">
                        <span className={`text-sm font-bold ${textMuted}`}>£{payment.amount.toFixed(2)}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          payment.status === 'paid'     ? (isLight ? 'text-emerald-600' : 'text-emerald-400') :
                          payment.status === 'overdue'  ? (isLight ? 'text-rose-600' : 'text-rose-400') :
                          payment.status === 'upcoming' ? (isLight ? 'text-blue-600' : 'text-blue-400') :
                          (isLight ? 'text-amber-600' : 'text-amber-400')
                        }`} style={{
                          background:
                            payment.status === 'paid'     ? (isLight ? 'rgba(16,185,129,0.12)' : 'rgba(16,185,129,0.12)') :
                            payment.status === 'overdue'  ? (isLight ? 'rgba(244,63,94,0.10)' : 'rgba(244,63,94,0.12)') :
                            payment.status === 'upcoming' ? (isLight ? 'rgba(59,130,246,0.12)' : 'rgba(59,130,246,0.12)') :
                            (isLight ? 'rgba(245,158,11,0.12)' : 'rgba(245,158,11,0.12)'),
                        }}>
                          {payment.status === 'paid' ? '✓ Paid' : payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.section>

            {/* Upcoming Event */}
            {upcomingEvent && (
              <motion.section {...fade(0.26)}>
                <h2 className={`text-base font-semibold ${textMain} mb-4`}>Upcoming Event</h2>
                <motion.button whileHover={{ y: -2 }} whileTap={{ scale: 0.99 }}
                  onClick={() => navigate('/portal/community')}
                  className="w-full text-left rounded-2xl overflow-hidden transition-all"
                  style={{ background: cardBg, border: `1px solid ${cardBorder}` }}>
                  <div className="h-[3px] w-full" style={{ background: upcomingEvent.imageColor }} />
                  <div className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-lg"
                        style={{ background: `${upcomingEvent.imageColor}22` }}>
                        🎉
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-semibold leading-tight ${textMain}`}>{upcomingEvent.title}</p>
                        <p className={`text-xs mt-1 ${textMuted}`}>
                          {new Date(upcomingEvent.date).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })} · {upcomingEvent.time}
                        </p>
                        <p className={`text-xs mt-0.5 ${textSubtle}`}>{upcomingEvent.location}</p>
                      </div>
                    </div>
                    {upcomingEvent.isRegistered && (
                      <div className="flex items-center gap-1.5 mt-3 px-3 py-2 rounded-xl"
                        style={{ background: isLight ? 'rgba(16,185,129,0.1)' : 'rgba(50,230,164,0.1)', border: `1px solid ${isLight ? 'rgba(16,185,129,0.18)' : 'rgba(50,230,164,0.18)'}` }}>
                        <CheckCircle size={12} className={isLight ? 'text-emerald-500' : 'text-[#32E6A4]'} />
                        <span className={`text-xs font-semibold ${isLight ? 'text-emerald-600' : 'text-[#32E6A4]'}`}>You're registered</span>
                      </div>
                    )}
                  </div>
                </motion.button>
              </motion.section>
            )}

            {/* Quick links */}
            <motion.section {...fade(0.3)}>
              <h2 className={`text-base font-semibold ${textMain} mb-4`}>Quick Links</h2>
              <div className="space-y-1.5">
                {[
                  { icon: Zap,      label: 'Utilities',      href: '/portal/utilities' },
                  { icon: Users,    label: 'Community',      href: '/portal/community' },
                  { icon: MapPin,   label: 'Visitor Passes', href: '/portal/visitors' },
                  { icon: HelpCircle, label: 'Get Support',  href: '/portal/support' },
                ].map(link => (
                  <button key={link.label} onClick={() => navigate(link.href)}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all group"
                    style={{ background: 'transparent' }}
                    onMouseEnter={e => (e.currentTarget.style.background = isLight ? 'rgba(0,0,0,0.04)' : 'rgba(255,255,255,0.04)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                    <link.icon size={15} className={`flex-shrink-0 transition-colors ${textSubtle} group-hover:text-[#5BA4F5]`} />
                    <span className={textMuted}>{link.label}</span>
                    <ChevronRight size={13} className={`ml-auto transition-colors ${textFaint} group-hover:${isLight ? 'text-slate-400' : 'text-white/35'}`} />
                  </button>
                ))}
              </div>
            </motion.section>
          </div>
        </div>
      </div>
    </div>
  );
}
