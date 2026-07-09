import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
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

const STATUS_META: Record<string, { label: string; color: string; bg: string }> = {
  submitted:         { label: 'Submitted',    color: 'text-slate-400',  bg: 'rgba(148,163,184,0.12)' },
  acknowledged:      { label: 'Acknowledged', color: 'text-blue-400',   bg: 'rgba(59,130,246,0.12)' },
  assigned:          { label: 'Assigned',     color: 'text-indigo-400', bg: 'rgba(99,102,241,0.12)' },
  in_progress:       { label: 'In Progress',  color: 'text-amber-400',  bg: 'rgba(245,158,11,0.12)' },
  waiting_for_parts: { label: 'Waiting Parts',color: 'text-orange-400', bg: 'rgba(249,115,22,0.12)' },
};

export function PortalDashboard() {
  const { tenantUser } = useTenantPortal();
  const navigate = useNavigate();
  const [noticeRead, setNoticeRead] = useState<string[]>([]);

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
    <div className="min-h-full" style={{ background: '#03070F' }}>

      {/* ── Hero Banner ────────────────────────────────────────────────── */}
      <motion.div {...fade(0)} className="relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #04091A 0%, #071530 35%, #075DE8 75%, #0797D8 100%)' }}>
        {/* Decorative elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-16 right-0 w-80 h-80 rounded-full" style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.05) 0%, transparent 70%)' }} />
          <div className="absolute bottom-0 left-1/3 w-64 h-48 rounded-full" style={{ background: 'radial-gradient(circle, rgba(50,230,164,0.08) 0%, transparent 70%)' }} />
          <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.5) 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
        </div>

        <div className="relative px-6 lg:px-8 xl:px-10 py-8 lg:py-10">
          <div className="max-w-[1400px] mx-auto">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">

              {/* Greeting */}
              <div className="flex-1">
                <p className="text-blue-200/60 text-sm font-medium mb-1">{greeting},</p>
                <h1 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-white tracking-tight leading-tight">
                  {firstName} 👋
                </h1>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-3">
                  <span className="flex items-center gap-1.5 text-blue-100/65 text-sm">
                    <Home size={13} />
                    {unit?.propertyName}
                  </span>
                  <span className="text-blue-200/30">·</span>
                  <span className="text-blue-100/65 text-sm">{unit?.unitNumber}</span>
                  <span className="text-blue-200/30">·</span>
                  <span className="inline-flex items-center gap-1.5 text-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#32E6A4] shadow-[0_0_6px_rgba(50,230,164,0.8)]" />
                    <span className="text-[#32E6A4] font-semibold">Lease Active</span>
                  </span>
                </div>

                {/* Alert pills */}
                <div className="flex flex-wrap gap-2 mt-5">
                  {openTickets.length > 0 && (
                    <button onClick={() => navigate('/portal/maintenance')}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full backdrop-blur-sm transition-colors hover:bg-white/20"
                      style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)' }}>
                      <Wrench size={12} className="text-amber-200" />
                      <span className="text-white/85 text-xs font-medium">{openTickets.length} open ticket{openTickets.length !== 1 ? 's' : ''}</span>
                    </button>
                  )}
                  {unreadMessages > 0 && (
                    <button onClick={() => navigate('/portal/messages')}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full backdrop-blur-sm transition-colors hover:bg-white/20"
                      style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)' }}>
                      <Bell size={12} className="text-violet-200" />
                      <span className="text-white/85 text-xs font-medium">{unreadMessages} unread</span>
                    </button>
                  )}
                  {overduePayments.length > 0 && (
                    <button onClick={() => navigate('/portal/payments')}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full backdrop-blur-sm transition-colors"
                      style={{ background: 'rgba(244,63,94,0.25)', border: '1px solid rgba(244,63,94,0.35)' }}>
                      <AlertTriangle size={12} className="text-rose-200" />
                      <span className="text-rose-100 text-xs font-medium">{overduePayments.length} overdue</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Payment card */}
              {nextPayment && (
                <motion.button
                  {...fade(0.15)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate('/portal/payments')}
                  className="lg:w-72 xl:w-80 flex items-center gap-4 p-4 lg:p-5 rounded-2xl text-left transition-all shadow-xl backdrop-blur-md"
                  style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)' }}
                >
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)' }}>
                    <CreditCard size={20} className="text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-blue-100/55 text-xs font-medium">
                      {overduePayments.length > 0 ? 'Overdue payment' : 'Next payment due'}
                    </p>
                    <p className="text-white font-bold text-lg leading-tight">£{nextPayment.amount.toFixed(2)}</p>
                    <p className="text-blue-100/45 text-xs mt-0.5 truncate">{nextPayment.description}</p>
                  </div>
                  <ChevronRight size={17} className="text-white/40 flex-shrink-0" />
                </motion.button>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── Page Body ──────────────────────────────────────────────────── */}
      <div className="px-6 lg:px-8 xl:px-10 py-7 max-w-[1400px] mx-auto space-y-7">

        {/* Overdue alert banner */}
        {overduePayments.length > 0 && (
          <motion.div {...fade(0.05)}
            className="flex items-center gap-4 p-4 rounded-2xl"
            style={{ background: 'rgba(244,63,94,0.08)', border: '1px solid rgba(244,63,94,0.2)' }}
          >
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(244,63,94,0.15)' }}>
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

        {/* ── KPI Grid ── */}
        <motion.div
          variants={stagger.container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-2 xl:grid-cols-4 gap-4"
        >
          {kpis.map(kpi => (
            <motion.button
              key={kpi.label}
              variants={stagger.item}
              whileHover={{ y: -2, boxShadow: `0 12px 32px rgba(0,0,0,0.4)` }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate(kpi.href)}
              className="group relative overflow-hidden rounded-2xl p-5 text-left transition-all"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
            >
              {/* Top accent bar */}
              <div className="absolute top-0 left-0 right-0 h-[1.5px] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ background: `linear-gradient(90deg, ${kpi.accent}, transparent)` }} />
              {/* Icon */}
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ background: kpi.accentBg }}>
                <kpi.icon size={18} style={{ color: kpi.accent }} />
              </div>
              <p className="text-3xl font-bold text-white">{kpi.value}</p>
              <p className="text-sm text-white/40 mt-1 leading-tight">{kpi.label}</p>
              <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <ArrowUpRight size={14} className="text-white/30" />
              </div>
            </motion.button>
          ))}
        </motion.div>

        {/* ── Two-column layout ── */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-7">

          {/* LEFT: main content */}
          <div className="xl:col-span-2 space-y-7">

            {/* Quick Actions */}
            <motion.section {...fade(0.12)}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-semibold text-white/80">Quick Actions</h2>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                {quickActions.map(action => (
                  <motion.button
                    key={action.label}
                    whileHover={{ y: -3, boxShadow: '0 8px 24px rgba(0,0,0,0.3)' }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate(action.href)}
                    className="group flex flex-col items-center gap-2.5 p-4 rounded-2xl transition-all"
                    style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
                  >
                    <div className="w-11 h-11 rounded-2xl flex items-center justify-center transition-transform duration-200 group-hover:scale-110" style={{ background: action.bg }}>
                      <action.icon size={20} style={{ color: action.accent }} />
                    </div>
                    <div className="text-center">
                      <p className="text-xs font-semibold text-white/70 leading-tight group-hover:text-white/90 transition-colors">{action.label}</p>
                      <p className="text-[10px] text-white/30 leading-tight mt-0.5 hidden sm:block">{action.desc}</p>
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.section>

            {/* Open Maintenance Tickets */}
            {openTickets.length > 0 && (
              <motion.section {...fade(0.18)}>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-base font-semibold text-white/80">Open Requests</h2>
                  <button onClick={() => navigate('/portal/maintenance')}
                    className="flex items-center gap-1 text-sm font-medium text-[#5BA4F5] hover:text-[#38BDF8] transition-colors">
                    View all <ArrowUpRight size={14} />
                  </button>
                </div>
                <div className="space-y-3">
                  {openTickets.slice(0, 3).map(ticket => {
                    const meta = STATUS_META[ticket.status] ?? { label: ticket.status, color: 'text-white/40', bg: 'rgba(255,255,255,0.07)' };
                    return (
                      <motion.button
                        key={ticket.id}
                        whileHover={{ x: 3 }}
                        whileTap={{ scale: 0.99 }}
                        onClick={() => navigate('/portal/maintenance')}
                        className="w-full flex items-center gap-4 p-4 rounded-2xl text-left transition-all"
                        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
                      >
                        <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(245,158,11,0.12)' }}>
                          <Wrench size={18} className="text-amber-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-white/85 truncate">{ticket.title}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-xs text-white/30">{ticket.ticketNumber}</span>
                            <span className="text-white/15">·</span>
                            <Clock size={10} className="text-white/25" />
                            <span className="text-xs text-white/30">
                              {new Date(ticket.updatedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                            </span>
                          </div>
                        </div>
                        <span className={`flex-shrink-0 text-[11px] font-semibold px-2.5 py-1 rounded-full ${meta.color}`} style={{ background: meta.bg }}>
                          {meta.label}
                        </span>
                        <ChevronRight size={14} className="text-white/20 flex-shrink-0" />
                      </motion.button>
                    );
                  })}
                </div>
              </motion.section>
            )}

            {/* Notice Board */}
            <motion.section {...fade(0.22)}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-semibold text-white/80">Notice Board</h2>
                <button onClick={() => navigate('/portal/notices')}
                  className="flex items-center gap-1 text-sm font-medium text-[#5BA4F5] hover:text-[#38BDF8] transition-colors">
                  All notices <ArrowUpRight size={14} />
                </button>
              </div>
              <div className="space-y-3">
                {pinnedNotices.slice(0, 3).map(notice => {
                  const isRead   = noticeRead.includes(notice.id) || notice.readBy.includes(tenantUser.id);
                  const isUrgent = notice.priority === 'urgent';
                  return (
                    <motion.button
                      key={notice.id}
                      whileHover={{ x: 3 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={() => { setNoticeRead(r => [...r, notice.id]); navigate('/portal/notices'); }}
                      className="w-full flex items-start gap-4 p-4 rounded-2xl text-left transition-all"
                      style={{
                        background: isUrgent ? 'rgba(244,63,94,0.07)' : 'rgba(255,255,255,0.03)',
                        border: `1px solid ${isUrgent ? 'rgba(244,63,94,0.2)' : 'rgba(255,255,255,0.07)'}`,
                      }}
                    >
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: isUrgent ? 'rgba(244,63,94,0.15)' : 'rgba(7,93,232,0.15)' }}>
                        <Bell size={16} className={isUrgent ? 'text-rose-400' : 'text-[#5BA4F5]'} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start gap-2">
                          {!isRead && <span className="mt-1.5 w-2 h-2 rounded-full bg-[#075DE8] flex-shrink-0 shadow-[0_0_6px_rgba(7,93,232,0.7)]" />}
                          <p className={`text-sm font-semibold truncate ${isUrgent ? 'text-rose-400' : 'text-white/80'}`}>
                            {notice.title}
                          </p>
                        </div>
                        <p className="text-xs text-white/35 line-clamp-2 mt-0.5">{notice.content}</p>
                        <p className="text-[11px] text-white/20 mt-1.5">
                          {new Date(notice.publishedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </p>
                      </div>
                      <ChevronRight size={14} className="text-white/20 flex-shrink-0 mt-0.5" />
                    </motion.button>
                  );
                })}
              </div>
            </motion.section>

            {/* Parcels */}
            {pendingParcels.length > 0 && (
              <motion.section {...fade(0.26)}>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-base font-semibold text-white/80">Parcels Waiting</h2>
                  <button onClick={() => navigate('/portal/parcels')}
                    className="flex items-center gap-1 text-sm font-medium text-[#5BA4F5] hover:text-[#38BDF8] transition-colors">
                    View all <ArrowUpRight size={14} />
                  </button>
                </div>
                <div className="space-y-3">
                  {pendingParcels.map(parcel => (
                    <motion.button
                      key={parcel.id}
                      whileHover={{ x: 3 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={() => navigate('/portal/parcels')}
                      className="w-full flex items-center gap-4 p-4 rounded-2xl text-left transition-all"
                      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
                    >
                      <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 text-xl" style={{ background: 'rgba(59,130,246,0.12)' }}>
                        📦
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-white/85 truncate">{parcel.description}</p>
                        <p className="text-xs text-white/35 mt-0.5">
                          {parcel.courier} · Code:{' '}
                          <span className="font-mono font-bold text-[#5BA4F5]">{parcel.collectionCode}</span>
                        </p>
                      </div>
                      <ChevronRight size={14} className="text-white/20 flex-shrink-0" />
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
                <h2 className="text-base font-semibold text-white/80 mb-4">Lease Overview</h2>
                <div className="rounded-2xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                  <div className="h-[2px] bg-uphold-gradient" />
                  <div className="p-5">
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      {[
                        { label: 'Monthly Rent',  value: `£${unit.rentAmount.toFixed(2)}`,                                                                                          danger: false },
                        { label: 'Balance',        value: unit.outstandingBalance > 0 ? `£${unit.outstandingBalance.toFixed(2)}` : 'All clear ✓',                                    danger: unit.outstandingBalance > 0 },
                        { label: 'Lease Expires',  value: new Date(unit.leaseEnd).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: '2-digit' }),                   danger: false },
                        { label: 'Deposit Held',   value: `£${unit.deposit.toFixed(2)}`,                                                                                             danger: false },
                      ].map(item => (
                        <div key={item.label} className="p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)' }}>
                          <p className="text-[10px] font-medium text-white/30 uppercase tracking-wide">{item.label}</p>
                          <p className={`text-sm font-bold mt-0.5 ${item.danger ? 'text-rose-400' : 'text-white/85'}`}>{item.value}</p>
                        </div>
                      ))}
                    </div>
                    <button
                      onClick={() => navigate('/portal/property')}
                      className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all text-[#5BA4F5] hover:text-white"
                      style={{ background: 'rgba(7,93,232,0.12)', border: '1px solid rgba(7,93,232,0.2)' }}
                    >
                      View tenancy details
                      <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              </motion.section>
            )}

            {/* Payment History */}
            <motion.section {...fade(0.22)}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-semibold text-white/80">Payments</h2>
                <button onClick={() => navigate('/portal/payments')}
                  className="flex items-center gap-1 text-sm font-medium text-[#5BA4F5] hover:text-[#38BDF8] transition-colors">
                  View all <ArrowUpRight size={14} />
                </button>
              </div>
              <div className="rounded-2xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                <div className="divide-y" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                  {payments.slice(0, 4).map(payment => (
                    <div key={payment.id} className="flex items-center justify-between px-4 py-3">
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-white/70 truncate">{payment.description}</p>
                        <p className="text-xs text-white/25 mt-0.5">
                          {new Date(payment.dueDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                        </p>
                      </div>
                      <div className="flex items-center gap-3 flex-shrink-0 ml-3">
                        <span className="text-sm font-bold text-white/70">£{payment.amount.toFixed(2)}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          payment.status === 'paid'     ? 'text-emerald-400' :
                          payment.status === 'overdue'  ? 'text-rose-400' :
                          payment.status === 'upcoming' ? 'text-blue-400' : 'text-amber-400'
                        }`} style={{
                          background:
                            payment.status === 'paid'     ? 'rgba(16,185,129,0.12)' :
                            payment.status === 'overdue'  ? 'rgba(244,63,94,0.12)' :
                            payment.status === 'upcoming' ? 'rgba(59,130,246,0.12)' : 'rgba(245,158,11,0.12)',
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
                <h2 className="text-base font-semibold text-white/80 mb-4">Upcoming Event</h2>
                <motion.button
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => navigate('/portal/community')}
                  className="w-full text-left rounded-2xl overflow-hidden transition-all"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
                >
                  <div className="h-[3px] w-full" style={{ background: `${upcomingEvent.imageColor}` }} />
                  <div className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-lg" style={{ background: `${upcomingEvent.imageColor}22` }}>
                        🎉
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-white/85 leading-tight">{upcomingEvent.title}</p>
                        <p className="text-xs text-white/35 mt-1">
                          {new Date(upcomingEvent.date).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })} · {upcomingEvent.time}
                        </p>
                        <p className="text-xs text-white/25 mt-0.5">{upcomingEvent.location}</p>
                      </div>
                    </div>
                    {upcomingEvent.isRegistered && (
                      <div className="flex items-center gap-1.5 mt-3 px-3 py-2 rounded-xl" style={{ background: 'rgba(50,230,164,0.1)', border: '1px solid rgba(50,230,164,0.18)' }}>
                        <CheckCircle size={12} className="text-[#32E6A4]" />
                        <span className="text-xs font-semibold text-[#32E6A4]">You're registered</span>
                      </div>
                    )}
                  </div>
                </motion.button>
              </motion.section>
            )}

            {/* Quick links */}
            <motion.section {...fade(0.3)}>
              <h2 className="text-base font-semibold text-white/80 mb-4">Quick Links</h2>
              <div className="space-y-1.5">
                {[
                  { icon: Zap,      label: 'Utilities',      href: '/portal/utilities' },
                  { icon: Users,    label: 'Community',      href: '/portal/community' },
                  { icon: MapPin,   label: 'Visitor Passes', href: '/portal/visitors' },
                  { icon: HelpCircle, label: 'Get Support',  href: '/portal/support' },
                ].map(link => (
                  <button
                    key={link.label}
                    onClick={() => navigate(link.href)}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-white/45 hover:text-white/75 transition-all group"
                    style={{ background: 'transparent' }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.04)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                  >
                    <link.icon size={15} className="text-white/25 group-hover:text-[#5BA4F5] transition-colors flex-shrink-0" />
                    <span>{link.label}</span>
                    <ChevronRight size={13} className="ml-auto text-white/15 group-hover:text-white/35 transition-colors" />
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
