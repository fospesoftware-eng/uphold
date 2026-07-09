import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  CreditCard, Wrench, FileText, Bell, Package, MapPin,
  ChevronRight, AlertTriangle, CheckCircle, Clock,
  TrendingUp, ArrowUpRight, Zap, Home, Activity,
  BarChart3, Shield, Calendar,
} from 'lucide-react';
import { useTenantPortal } from '../context';
import { getTenantData, NOTICES, COMMUNITY_EVENTS } from '../data';

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, delay, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] },
});

const stagger = {
  container: { hidden: {}, show: { transition: { staggerChildren: 0.07 } } },
  item: { hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] } } },
};

export function PortalDashboard() {
  const { tenantUser } = useTenantPortal();
  const navigate = useNavigate();
  const [noticeRead, setNoticeRead] = useState<string[]>([]);

  if (!tenantUser) return null;

  const { unit, tickets, payments, parcels, assets, conversations } = getTenantData(tenantUser.id);

  const openTickets = tickets.filter(t => !['resolved', 'closed'].includes(t.status));
  const overduePayments = payments.filter(p => p.status === 'overdue');
  const pendingParcels = parcels.filter(p => p.status === 'pending_collection');
  const nextPayment = payments.find(p => p.status === 'upcoming' || p.status === 'pending');
  const unreadMessages = conversations.reduce((s, c) => s + c.unreadCount, 0);
  const pinnedNotices = NOTICES.filter(n => n.isPinned);
  const upcomingEvent = COMMUNITY_EVENTS[0];

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const firstName = tenantUser.name.split(' ')[0];

  const statusMeta: Record<string, { label: string; cls: string }> = {
    submitted:          { label: 'Submitted',       cls: 'bg-slate-100 text-slate-600 dark:bg-slate-800/60 dark:text-slate-400' },
    acknowledged:       { label: 'Acknowledged',    cls: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300' },
    assigned:           { label: 'Assigned',        cls: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300' },
    in_progress:        { label: 'In Progress',     cls: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300' },
    waiting_for_parts:  { label: 'Waiting Parts',   cls: 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300' },
  };

  const kpis = [
    { label: 'Open Tickets',     value: openTickets.length,    icon: Wrench,   accent: 'from-amber-400 to-orange-500',  bgLight: 'bg-amber-50 dark:bg-amber-900/20',   textLight: 'text-amber-600 dark:text-amber-400',   href: '/portal/maintenance' },
    { label: 'Pending Parcels',  value: pendingParcels.length, icon: Package,  accent: 'from-blue-400 to-blue-600',     bgLight: 'bg-blue-50 dark:bg-blue-900/20',     textLight: 'text-blue-600 dark:text-blue-400',     href: '/portal/parcels' },
    { label: 'Unread Messages',  value: unreadMessages,        icon: Bell,     accent: 'from-violet-400 to-violet-600', bgLight: 'bg-violet-50 dark:bg-violet-900/20', textLight: 'text-violet-600 dark:text-violet-400', href: '/portal/messages' },
    { label: 'My Assets',        value: assets.length,         icon: Shield,   accent: 'from-emerald-400 to-teal-500',  bgLight: 'bg-emerald-50 dark:bg-emerald-900/20', textLight: 'text-emerald-600 dark:text-emerald-400', href: '/portal/assets' },
  ];

  const quickActions = [
    { icon: Wrench,     label: 'New Request',  desc: 'Report an issue',   bg: 'bg-amber-50 dark:bg-amber-900/20',  text: 'text-amber-600',  href: '/portal/maintenance' },
    { icon: CreditCard, label: 'Pay Rent',     desc: 'Make a payment',    bg: 'bg-blue-50 dark:bg-blue-900/20',    text: 'text-blue-600',   href: '/portal/payments' },
    { icon: MapPin,     label: 'Add Visitor',  desc: 'Register a guest',  bg: 'bg-violet-50 dark:bg-violet-900/20', text: 'text-violet-600', href: '/portal/visitors' },
    { icon: FileText,   label: 'Documents',    desc: 'View your files',   bg: 'bg-emerald-50 dark:bg-emerald-900/20', text: 'text-emerald-600', href: '/portal/documents' },
    { icon: BarChart3,  label: 'Utilities',    desc: 'Track usage',       bg: 'bg-sky-50 dark:bg-sky-900/20',      text: 'text-sky-600',    href: '/portal/utilities' },
    { icon: Calendar,   label: 'Community',    desc: 'Events & notices',  bg: 'bg-pink-50 dark:bg-pink-900/20',    text: 'text-pink-600',   href: '/portal/community' },
  ];

  return (
    <div className="min-h-full bg-[#F8FAFC] dark:bg-[#0A0F1E]">
      {/* ── Hero Banner ── */}
      <motion.div {...fade(0)} className="relative overflow-hidden bg-[linear-gradient(135deg,#06122A_0%,#075DE8_55%,#0EA5E9_100%)]">
        {/* Decorative orbs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-20 right-0 w-96 h-96 rounded-full bg-white/5 blur-3xl" />
          <div className="absolute bottom-0 left-1/3 w-64 h-64 rounded-full bg-white/5 blur-2xl" />
          <div className="absolute top-4 right-1/4 w-2 h-2 rounded-full bg-white/40" />
          <div className="absolute top-12 right-1/3 w-1.5 h-1.5 rounded-full bg-white/30" />
          <div className="absolute bottom-8 right-1/6 w-1 h-1 rounded-full bg-white/40" />
        </div>

        <div className="relative px-6 lg:px-8 xl:px-10 py-8 lg:py-10">
          <div className="max-w-[1400px] mx-auto">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
              {/* Left: greeting */}
              <div className="flex-1">
                <p className="text-blue-200/80 text-sm font-medium mb-1">{greeting},</p>
                <h1 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-white tracking-tight leading-tight">
                  {firstName} 👋
                </h1>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-3">
                  <span className="flex items-center gap-1.5 text-blue-100/80 text-sm">
                    <Home size={13} />
                    {unit?.propertyName}
                  </span>
                  <span className="text-blue-200/40">·</span>
                  <span className="text-blue-100/80 text-sm">{unit?.unitNumber}</span>
                  <span className="text-blue-200/40">·</span>
                  <span className="inline-flex items-center gap-1.5 text-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 shadow-[0_0_6px_rgba(110,231,183,0.8)]" />
                    <span className="text-emerald-200 font-medium">Lease Active</span>
                  </span>
                </div>

                {/* Stat pills */}
                <div className="flex flex-wrap gap-2 mt-5">
                  {openTickets.length > 0 && (
                    <button onClick={() => navigate('/portal/maintenance')}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/15 transition-colors">
                      <Wrench size={12} className="text-amber-200" />
                      <span className="text-white/90 text-xs font-medium">{openTickets.length} open ticket{openTickets.length !== 1 ? 's' : ''}</span>
                    </button>
                  )}
                  {unreadMessages > 0 && (
                    <button onClick={() => navigate('/portal/messages')}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/15 transition-colors">
                      <Bell size={12} className="text-violet-200" />
                      <span className="text-white/90 text-xs font-medium">{unreadMessages} unread</span>
                    </button>
                  )}
                  {overduePayments.length > 0 && (
                    <button onClick={() => navigate('/portal/payments')}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-rose-500/30 hover:bg-rose-500/40 backdrop-blur-sm border border-rose-300/30 transition-colors">
                      <AlertTriangle size={12} className="text-rose-200" />
                      <span className="text-rose-100 text-xs font-medium">{overduePayments.length} overdue</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Right: payment card */}
              {nextPayment && (
                <motion.button
                  {...fade(0.15)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate('/portal/payments')}
                  className="lg:w-72 xl:w-80 flex items-center gap-4 p-4 lg:p-5 rounded-2xl bg-white/10 hover:bg-white/15 backdrop-blur-md border border-white/20 text-left transition-all shadow-xl"
                >
                  <div className="w-12 h-12 rounded-2xl bg-white/15 flex items-center justify-center flex-shrink-0 border border-white/20">
                    <CreditCard size={20} className="text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-blue-100/70 text-xs font-medium">
                      {overduePayments.length > 0 ? 'Overdue payment' : 'Next payment due'}
                    </p>
                    <p className="text-white font-bold text-lg leading-tight">
                      £{nextPayment.amount.toFixed(2)}
                    </p>
                    <p className="text-blue-100/60 text-xs mt-0.5 truncate">{nextPayment.description}</p>
                  </div>
                  <ChevronRight size={18} className="text-white/50 flex-shrink-0" />
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
          <motion.div {...fade(0.05)}
            className="flex items-center gap-4 p-4 rounded-2xl bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800/50">
            <div className="w-10 h-10 rounded-xl bg-rose-100 dark:bg-rose-900/40 flex items-center justify-center flex-shrink-0">
              <AlertTriangle size={18} className="text-rose-500" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-rose-700 dark:text-rose-400">Overdue payment</p>
              <p className="text-xs text-rose-600/80 dark:text-rose-400/70 mt-0.5">
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
        <motion.div variants={stagger.container} initial="hidden" animate="show"
          className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          {kpis.map(kpi => (
            <motion.button
              key={kpi.label}
              variants={stagger.item}
              whileHover={{ y: -2, boxShadow: '0 8px 24px rgba(0,0,0,0.10)' }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate(kpi.href)}
              className="group relative overflow-hidden bg-white dark:bg-[#111827] border border-[#E6EEF5] dark:border-[#1E2D45] rounded-2xl p-5 text-left hover:border-[#C7D9F5] dark:hover:border-[#2A3D5A] transition-all"
            >
              {/* Accent bar */}
              <div className={`absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r ${kpi.accent} opacity-0 group-hover:opacity-100 transition-opacity`} />
              <div className={`w-10 h-10 rounded-xl ${kpi.bgLight} flex items-center justify-center mb-4`}>
                <kpi.icon size={18} className={kpi.textLight} />
              </div>
              <p className="text-3xl font-bold text-[#0F172A] dark:text-white">{kpi.value}</p>
              <p className="text-sm text-[#64748B] dark:text-[#94A3B8] mt-1 leading-tight">{kpi.label}</p>
              <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <ArrowUpRight size={14} className="text-[#94A3B8]" />
              </div>
            </motion.button>
          ))}
        </motion.div>

        {/* ── Two-column layout for desktop ── */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-7">

          {/* ── LEFT COLUMN (main content) ── */}
          <div className="xl:col-span-2 space-y-7">

            {/* Quick Actions */}
            <motion.section {...fade(0.15)}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-semibold text-[#0F172A] dark:text-white">Quick Actions</h2>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                {quickActions.map(action => (
                  <motion.button
                    key={action.label}
                    whileHover={{ y: -3, boxShadow: '0 6px 20px rgba(0,0,0,0.10)' }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate(action.href)}
                    className="flex flex-col items-center gap-2.5 p-4 rounded-2xl bg-white dark:bg-[#111827] border border-[#E6EEF5] dark:border-[#1E2D45] hover:border-[#C7D9F5] dark:hover:border-[#2A3D5A] transition-all group"
                  >
                    <div className={`w-11 h-11 rounded-2xl ${action.bg} flex items-center justify-center`}>
                      <action.icon size={20} className={action.text} />
                    </div>
                    <div className="text-center">
                      <p className="text-xs font-semibold text-[#334155] dark:text-[#CBD5E1] leading-tight">{action.label}</p>
                      <p className="text-[10px] text-[#94A3B8] leading-tight mt-0.5 hidden sm:block">{action.desc}</p>
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.section>

            {/* Open Maintenance Requests */}
            {openTickets.length > 0 && (
              <motion.section {...fade(0.2)}>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-base font-semibold text-[#0F172A] dark:text-white">Open Requests</h2>
                  <button onClick={() => navigate('/portal/maintenance')}
                    className="flex items-center gap-1 text-sm font-medium text-[#075DE8] hover:text-[#0650CC] transition-colors">
                    View all <ArrowUpRight size={14} />
                  </button>
                </div>
                <div className="space-y-3">
                  {openTickets.slice(0, 3).map(ticket => {
                    const meta = statusMeta[ticket.status] ?? { label: ticket.status, cls: 'bg-gray-100 text-gray-600' };
                    return (
                      <motion.button
                        key={ticket.id}
                        whileHover={{ x: 2 }}
                        whileTap={{ scale: 0.99 }}
                        onClick={() => navigate('/portal/maintenance')}
                        className="w-full flex items-center gap-4 p-4 bg-white dark:bg-[#111827] border border-[#E6EEF5] dark:border-[#1E2D45] rounded-2xl text-left hover:border-amber-200 dark:hover:border-amber-800/50 hover:shadow-sm transition-all"
                      >
                        <div className="w-11 h-11 rounded-xl bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center flex-shrink-0">
                          <Wrench size={18} className="text-amber-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-[#0F172A] dark:text-white truncate">{ticket.title}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-xs text-[#64748B] dark:text-[#94A3B8]">{ticket.ticketNumber}</span>
                            <span className="text-[#CBD5E1] dark:text-[#334155]">·</span>
                            <Clock size={11} className="text-[#94A3B8]" />
                            <span className="text-xs text-[#64748B] dark:text-[#94A3B8]">
                              {new Date(ticket.updatedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                            </span>
                          </div>
                        </div>
                        <span className={`flex-shrink-0 text-[11px] font-semibold px-2.5 py-1 rounded-full ${meta.cls}`}>
                          {meta.label}
                        </span>
                        <ChevronRight size={15} className="text-[#CBD5E1] dark:text-[#334155] flex-shrink-0" />
                      </motion.button>
                    );
                  })}
                </div>
              </motion.section>
            )}

            {/* Notice Board */}
            <motion.section {...fade(0.25)}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-semibold text-[#0F172A] dark:text-white">Notice Board</h2>
                <button onClick={() => navigate('/portal/notices')}
                  className="flex items-center gap-1 text-sm font-medium text-[#075DE8] hover:text-[#0650CC] transition-colors">
                  All notices <ArrowUpRight size={14} />
                </button>
              </div>
              <div className="space-y-3">
                {pinnedNotices.slice(0, 3).map(notice => {
                  const isRead = noticeRead.includes(notice.id) || notice.readBy.includes(tenantUser.id);
                  const isUrgent = notice.priority === 'urgent';
                  return (
                    <motion.button
                      key={notice.id}
                      whileHover={{ x: 2 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={() => { setNoticeRead(r => [...r, notice.id]); navigate('/portal/notices'); }}
                      className={`w-full flex items-start gap-4 p-4 rounded-2xl border text-left hover:shadow-sm transition-all ${
                        isUrgent
                          ? 'bg-rose-50 dark:bg-rose-900/15 border-rose-200 dark:border-rose-800/50'
                          : 'bg-white dark:bg-[#111827] border-[#E6EEF5] dark:border-[#1E2D45] hover:border-[#C7D9F5] dark:hover:border-[#2A3D5A]'
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        isUrgent ? 'bg-rose-100 dark:bg-rose-900/40' : 'bg-[#EFF6FF] dark:bg-[#1E2D45]'
                      }`}>
                        <Bell size={16} className={isUrgent ? 'text-rose-500' : 'text-[#075DE8]'} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start gap-2">
                          {!isRead && <span className="mt-1.5 w-2 h-2 rounded-full bg-[#075DE8] flex-shrink-0" />}
                          <p className={`text-sm font-semibold truncate ${isUrgent ? 'text-rose-700 dark:text-rose-400' : 'text-[#0F172A] dark:text-white'}`}>
                            {notice.title}
                          </p>
                        </div>
                        <p className="text-xs text-[#64748B] dark:text-[#94A3B8] line-clamp-2 mt-0.5">{notice.content}</p>
                        <p className="text-[11px] text-[#94A3B8] dark:text-[#475569] mt-1.5">
                          {new Date(notice.publishedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </p>
                      </div>
                      <ChevronRight size={15} className="text-[#CBD5E1] dark:text-[#334155] flex-shrink-0 mt-0.5" />
                    </motion.button>
                  );
                })}
              </div>
            </motion.section>

            {/* Parcels */}
            {pendingParcels.length > 0 && (
              <motion.section {...fade(0.3)}>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-base font-semibold text-[#0F172A] dark:text-white">Parcels Waiting</h2>
                  <button onClick={() => navigate('/portal/parcels')}
                    className="flex items-center gap-1 text-sm font-medium text-[#075DE8] hover:text-[#0650CC] transition-colors">
                    View all <ArrowUpRight size={14} />
                  </button>
                </div>
                <div className="space-y-3">
                  {pendingParcels.map(parcel => (
                    <motion.button
                      key={parcel.id}
                      whileHover={{ x: 2 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={() => navigate('/portal/parcels')}
                      className="w-full flex items-center gap-4 p-4 bg-white dark:bg-[#111827] border border-[#E6EEF5] dark:border-[#1E2D45] rounded-2xl text-left hover:border-blue-200 dark:hover:border-blue-800/50 hover:shadow-sm transition-all"
                    >
                      <div className="w-11 h-11 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center flex-shrink-0 text-xl">
                        📦
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-[#0F172A] dark:text-white truncate">{parcel.description}</p>
                        <p className="text-xs text-[#64748B] dark:text-[#94A3B8] mt-0.5">
                          {parcel.courier} · Code: <span className="font-mono font-bold text-[#075DE8]">{parcel.collectionCode}</span>
                        </p>
                      </div>
                      <ChevronRight size={15} className="text-[#CBD5E1] dark:text-[#334155] flex-shrink-0" />
                    </motion.button>
                  ))}
                </div>
              </motion.section>
            )}
          </div>

          {/* ── RIGHT COLUMN (sidebar info) ── */}
          <div className="space-y-6">

            {/* Lease Overview */}
            {unit && (
              <motion.section {...fade(0.2)}>
                <h2 className="text-base font-semibold text-[#0F172A] dark:text-white mb-4">Lease Overview</h2>
                <div className="bg-white dark:bg-[#111827] border border-[#E6EEF5] dark:border-[#1E2D45] rounded-2xl overflow-hidden">
                  {/* Header accent */}
                  <div className="h-1.5 bg-gradient-to-r from-[#075DE8] to-[#0EA5E9]" />
                  <div className="p-5">
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      {[
                        { label: 'Monthly Rent', value: `£${unit.rentAmount.toFixed(2)}`, danger: false },
                        { label: 'Balance', value: unit.outstandingBalance > 0 ? `£${unit.outstandingBalance.toFixed(2)}` : 'All clear ✓', danger: unit.outstandingBalance > 0 },
                        { label: 'Lease Expires', value: new Date(unit.leaseEnd).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: '2-digit' }), danger: false },
                        { label: 'Deposit Held', value: `£${unit.deposit.toFixed(2)}`, danger: false },
                      ].map(item => (
                        <div key={item.label} className="p-3 rounded-xl bg-[#F8FAFC] dark:bg-[#0A0F1E]/60">
                          <p className="text-[11px] font-medium text-[#94A3B8] uppercase tracking-wide">{item.label}</p>
                          <p className={`text-sm font-bold mt-0.5 ${item.danger ? 'text-rose-500' : 'text-[#0F172A] dark:text-white'}`}>{item.value}</p>
                        </div>
                      ))}
                    </div>
                    <button
                      onClick={() => navigate('/portal/property')}
                      className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#EFF6FF] dark:bg-[#1E2D45] hover:bg-blue-100 dark:hover:bg-[#1E3A5F] text-[#075DE8] text-sm font-medium transition-colors"
                    >
                      <Home size={14} />
                      View property details
                    </button>
                  </div>
                </div>
              </motion.section>
            )}

            {/* Last Month Utilities */}
            {unit && (
              <motion.section {...fade(0.25)}>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-base font-semibold text-[#0F172A] dark:text-white">Last Month Utilities</h2>
                  <button onClick={() => navigate('/portal/utilities')}
                    className="flex items-center gap-1 text-sm font-medium text-[#075DE8] hover:text-[#0650CC] transition-colors">
                    Details <ArrowUpRight size={14} />
                  </button>
                </div>
                <div className="bg-white dark:bg-[#111827] border border-[#E6EEF5] dark:border-[#1E2D45] rounded-2xl p-4">
                  <div className="space-y-3">
                    {[
                      { label: 'Electricity', value: '180 kWh', cost: '£48.60', icon: '⚡', bar: 72, color: 'bg-yellow-400' },
                      { label: 'Water',       value: '4.0 m³',  cost: '£8.00',  icon: '💧', bar: 30, color: 'bg-blue-400' },
                      { label: 'Gas',         value: '5 m³',    cost: '£6.75',  icon: '🔥', bar: 25, color: 'bg-orange-400' },
                    ].map(u => (
                      <div key={u.label} className="flex items-center gap-3">
                        <span className="text-lg flex-shrink-0">{u.icon}</span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-medium text-[#334155] dark:text-[#CBD5E1]">{u.label}</span>
                            <span className="text-xs font-bold text-[#0F172A] dark:text-white">{u.cost}</span>
                          </div>
                          <div className="h-1.5 rounded-full bg-[#F1F5F9] dark:bg-[#1E2D45]">
                            <div className={`h-full rounded-full ${u.color}`} style={{ width: `${u.bar}%` }} />
                          </div>
                          <p className="text-[10px] text-[#94A3B8] mt-0.5">{u.value}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.section>
            )}

            {/* Upcoming Event */}
            {upcomingEvent && (
              <motion.section {...fade(0.3)}>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-base font-semibold text-[#0F172A] dark:text-white">Upcoming Event</h2>
                  <button onClick={() => navigate('/portal/community')}
                    className="flex items-center gap-1 text-sm font-medium text-[#075DE8] hover:text-[#0650CC] transition-colors">
                    Community <ArrowUpRight size={14} />
                  </button>
                </div>
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => navigate('/portal/community')}
                  className={`w-full overflow-hidden rounded-2xl bg-gradient-to-br ${upcomingEvent.imageColor} p-5 text-left shadow-lg`}
                >
                  <p className="text-white/70 text-xs font-medium">
                    {new Date(upcomingEvent.date).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'long' })} · {upcomingEvent.time}
                  </p>
                  <h3 className="text-white text-base font-bold mt-1 leading-snug">{upcomingEvent.title}</h3>
                  <p className="text-white/70 text-xs mt-1">{upcomingEvent.location}</p>
                  <div className="flex items-center gap-2 mt-4">
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-sm">
                      <Activity size={11} className="text-white" />
                      <span className="text-white text-xs font-medium">{upcomingEvent.registeredCount} attending</span>
                    </div>
                    {upcomingEvent.isRegistered && (
                      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-sm">
                        <CheckCircle size={11} className="text-white" />
                        <span className="text-white text-xs font-medium">You're going</span>
                      </div>
                    )}
                  </div>
                </motion.button>
              </motion.section>
            )}

            {/* Quick property info */}
            {unit && (
              <motion.section {...fade(0.35)}>
                <h2 className="text-base font-semibold text-[#0F172A] dark:text-white mb-4">Property Info</h2>
                <div className="bg-white dark:bg-[#111827] border border-[#E6EEF5] dark:border-[#1E2D45] rounded-2xl p-4 space-y-3">
                  {[
                    { icon: MapPin, label: 'Address', value: `${unit.propertyAddress}, ${unit.city}` },
                    { icon: Zap, label: 'Emergency', value: unit.emergencyPhone },
                    { icon: TrendingUp, label: 'Manager', value: unit.managerName },
                  ].map(row => (
                    <div key={row.label} className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#F1F5F9] dark:bg-[#1E2D45] flex items-center justify-center flex-shrink-0 mt-0.5">
                        <row.icon size={13} className="text-[#64748B] dark:text-[#94A3B8]" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[11px] font-medium text-[#94A3B8] uppercase tracking-wide">{row.label}</p>
                        <p className="text-sm text-[#334155] dark:text-[#CBD5E1] leading-snug mt-0.5">{row.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
