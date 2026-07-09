import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  CreditCard, Wrench, FileText, Bell, Package, MapPin,
  ChevronRight, AlertTriangle, CheckCircle, Clock, Zap, TrendingUp, ArrowUpRight,
} from 'lucide-react';
import { useTenantPortal } from '../context';
import { getTenantData, NOTICES, COMMUNITY_EVENTS } from '../data';

const stagger = {
  container: { hidden: {}, show: { transition: { staggerChildren: 0.06 } } },
  item: { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.35 } } },
};

function QuickAction({ icon: Icon, label, color, onClick }: { icon: React.FC<{ size: number }>, label: string, color: string, onClick: () => void }) {
  return (
    <motion.button
      whileTap={{ scale: 0.93 }}
      onClick={onClick}
      className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-white dark:bg-[#111827] border border-[#E6EEF5] dark:border-[#1E2D45] hover:shadow-md transition-all active:scale-95"
    >
      <div className={`w-11 h-11 rounded-2xl ${color} flex items-center justify-center`}>
        <Icon size={20} />
      </div>
      <span className="text-[11px] font-medium text-[#334155] dark:text-[#CBD5E1] text-center leading-tight">{label}</span>
    </motion.button>
  );
}

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

  return (
    <div className="max-w-2xl mx-auto px-4 pt-6 pb-8 lg:max-w-none lg:px-6 space-y-6">
      {/* Hero greeting */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#075DE8] to-[#0EA5E9] p-5 text-white shadow-xl shadow-blue-500/20"
      >
        <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-white/5 -translate-y-10 translate-x-10" />
        <div className="absolute bottom-0 right-12 w-24 h-24 rounded-full bg-white/10 translate-y-8" />
        <div className="relative">
          <p className="text-blue-100 text-sm font-medium">{greeting},</p>
          <h1 className="text-2xl font-bold mt-0.5">{tenantUser.name.split(' ')[0]} 👋</h1>
          <div className="flex items-center gap-2 mt-3 text-blue-100 text-sm">
            <span>{unit?.propertyName}</span>
            <span className="text-blue-200">·</span>
            <span>{unit?.unitNumber}</span>
            <span className="text-blue-200">·</span>
            <span className="inline-flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-300" />
              Lease Active
            </span>
          </div>
        </div>

        {/* Next payment chip */}
        {nextPayment && (
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/portal/payments')}
            className="mt-4 flex items-center gap-3 w-full bg-white/15 backdrop-blur-sm rounded-2xl px-4 py-3 text-left hover:bg-white/25 transition-colors"
          >
            <CreditCard size={16} className="text-blue-100 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-xs text-blue-100">{nextPayment.status === 'overdue' ? '⚠️ Overdue payment' : 'Next payment'}</p>
              <p className="text-sm font-semibold truncate">£{nextPayment.amount.toFixed(2)} – {nextPayment.description.split(' ').slice(-2).join(' ')}</p>
            </div>
            <ChevronRight size={16} className="text-blue-100 flex-shrink-0" />
          </motion.button>
        )}
      </motion.div>

      {/* Alert banners */}
      {overduePayments.length > 0 && (
        <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800/50"
        >
          <AlertTriangle size={18} className="text-rose-500 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-rose-700 dark:text-rose-400">Overdue payment</p>
            <p className="text-xs text-rose-600 dark:text-rose-400/80">You have {overduePayments.length} overdue payment{overduePayments.length > 1 ? 's' : ''}. Please pay to avoid further late fees.</p>
          </div>
          <button onClick={() => navigate('/portal/payments')} className="text-xs font-semibold text-rose-600 dark:text-rose-400 flex-shrink-0">Pay now</button>
        </motion.div>
      )}

      {/* KPI strip */}
      <motion.div variants={stagger.container} initial="hidden" animate="show" className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Open Tickets', value: openTickets.length, icon: Wrench, color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-900/20', href: '/portal/maintenance' },
          { label: 'Pending Parcels', value: pendingParcels.length, icon: Package, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/20', href: '/portal/parcels' },
          { label: 'Unread Messages', value: unreadMessages, icon: Bell, color: 'text-violet-600', bg: 'bg-violet-50 dark:bg-violet-900/20', href: '/portal/messages' },
          { label: 'My Assets', value: assets.length, icon: Package, color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-900/20', href: '/portal/assets' },
        ].map(kpi => (
          <motion.button
            key={kpi.label}
            variants={stagger.item}
            whileTap={{ scale: 0.96 }}
            onClick={() => navigate(kpi.href)}
            className="bg-white dark:bg-[#111827] border border-[#E6EEF5] dark:border-[#1E2D45] rounded-2xl p-4 text-left hover:shadow-md transition-all"
          >
            <div className={`w-9 h-9 rounded-xl ${kpi.bg} flex items-center justify-center mb-3`}>
              <kpi.icon size={17} className={kpi.color} />
            </div>
            <p className="text-2xl font-bold text-[#0F172A] dark:text-white">{kpi.value}</p>
            <p className="text-xs text-[#64748B] mt-0.5 leading-tight">{kpi.label}</p>
          </motion.button>
        ))}
      </motion.div>

      {/* Quick actions */}
      <section>
        <h2 className="text-sm font-semibold text-[#334155] dark:text-[#CBD5E1] mb-3">Quick Actions</h2>
        <div className="grid grid-cols-4 gap-2.5">
          <QuickAction icon={Wrench} label="New Request" color="bg-amber-50 dark:bg-amber-900/20 text-amber-600" onClick={() => navigate('/portal/maintenance')} />
          <QuickAction icon={CreditCard} label="Pay Rent" color="bg-blue-50 dark:bg-blue-900/20 text-blue-600" onClick={() => navigate('/portal/payments')} />
          <QuickAction icon={MapPin} label="Add Visitor" color="bg-violet-50 dark:bg-violet-900/20 text-violet-600" onClick={() => navigate('/portal/visitors')} />
          <QuickAction icon={FileText} label="Documents" color="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600" onClick={() => navigate('/portal/documents')} />
        </div>
      </section>

      {/* Recent tickets */}
      {openTickets.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-[#334155] dark:text-[#CBD5E1]">Open Requests</h2>
            <button onClick={() => navigate('/portal/maintenance')} className="text-xs font-medium text-[#075DE8] flex items-center gap-1">View all <ArrowUpRight size={12} /></button>
          </div>
          <div className="space-y-2.5">
            {openTickets.slice(0, 2).map(ticket => {
              const statusColors: Record<string, string> = {
                submitted: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400',
                acknowledged: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
                assigned: 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400',
                in_progress: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
                waiting_for_parts: 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400',
              };
              return (
                <motion.button
                  key={ticket.id}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate('/portal/maintenance')}
                  className="w-full flex items-center gap-3 p-4 bg-white dark:bg-[#111827] border border-[#E6EEF5] dark:border-[#1E2D45] rounded-2xl text-left hover:shadow-md transition-all"
                >
                  <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center flex-shrink-0">
                    <Wrench size={17} className="text-amber-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-[#0F172A] dark:text-white truncate">{ticket.title}</p>
                    <p className="text-xs text-[#64748B] mt-0.5">{ticket.ticketNumber} · Updated {new Date(ticket.updatedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</p>
                  </div>
                  <span className={`text-[10px] font-semibold px-2 py-1 rounded-full flex-shrink-0 capitalize ${statusColors[ticket.status] ?? 'bg-gray-100 text-gray-600'}`}>
                    {ticket.status.replace(/_/g, ' ')}
                  </span>
                </motion.button>
              );
            })}
          </div>
        </section>
      )}

      {/* Pinned notices */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-[#334155] dark:text-[#CBD5E1]">Notice Board</h2>
          <button onClick={() => navigate('/portal/notices')} className="text-xs font-medium text-[#075DE8] flex items-center gap-1">All notices <ArrowUpRight size={12} /></button>
        </div>
        <div className="space-y-2.5">
          {pinnedNotices.slice(0, 2).map(notice => {
            const isRead = noticeRead.includes(notice.id) || notice.readBy.includes(tenantUser.id);
            const typeColors: Record<string, string> = {
              urgent: 'bg-rose-50 dark:bg-rose-900/20 border-rose-200 dark:border-rose-800/50',
              high: 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800/50',
              normal: 'bg-white dark:bg-[#111827] border-[#E6EEF5] dark:border-[#1E2D45]',
            };
            return (
              <motion.button
                key={notice.id}
                whileTap={{ scale: 0.98 }}
                onClick={() => { setNoticeRead(r => [...r, notice.id]); navigate('/portal/notices'); }}
                className={`w-full flex items-start gap-3 p-4 border rounded-2xl text-left hover:shadow-md transition-all ${typeColors[notice.priority]}`}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    {!isRead && <span className="w-2 h-2 rounded-full bg-[#075DE8] flex-shrink-0" />}
                    <p className="text-sm font-semibold text-[#0F172A] dark:text-white truncate">{notice.title}</p>
                  </div>
                  <p className="text-xs text-[#64748B] line-clamp-2">{notice.content}</p>
                  <p className="text-[10px] text-[#94A3B8] mt-1">{new Date(notice.publishedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</p>
                </div>
                <ChevronRight size={16} className="text-[#94A3B8] flex-shrink-0 mt-1" />
              </motion.button>
            );
          })}
        </div>
      </section>

      {/* Upcoming event */}
      {upcomingEvent && (
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-[#334155] dark:text-[#CBD5E1]">Upcoming Event</h2>
            <button onClick={() => navigate('/portal/community')} className="text-xs font-medium text-[#075DE8] flex items-center gap-1">Community <ArrowUpRight size={12} /></button>
          </div>
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/portal/community')}
            className={`w-full overflow-hidden rounded-2xl bg-gradient-to-r ${upcomingEvent.imageColor} p-5 text-left shadow-lg`}
          >
            <p className="text-white/80 text-xs font-medium">{new Date(upcomingEvent.date).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })} · {upcomingEvent.time}</p>
            <h3 className="text-white text-lg font-bold mt-1">{upcomingEvent.title}</h3>
            <p className="text-white/80 text-xs mt-1">{upcomingEvent.location}</p>
            <div className="flex items-center gap-2 mt-3">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-sm">
                <TrendingUp size={12} className="text-white" />
                <span className="text-white text-xs font-medium">{upcomingEvent.registeredCount} attending</span>
              </div>
              {upcomingEvent.isRegistered && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-sm">
                  <CheckCircle size={12} className="text-white" />
                  <span className="text-white text-xs font-medium">You're going</span>
                </div>
              )}
            </div>
          </motion.button>
        </section>
      )}

      {/* Lease info */}
      {unit && (
        <section>
          <h2 className="text-sm font-semibold text-[#334155] dark:text-[#CBD5E1] mb-3">Lease Overview</h2>
          <div className="bg-white dark:bg-[#111827] border border-[#E6EEF5] dark:border-[#1E2D45] rounded-2xl p-4">
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Monthly Rent', value: `£${unit.rentAmount.toFixed(2)}` },
                { label: 'Balance', value: unit.outstandingBalance > 0 ? `£${unit.outstandingBalance.toFixed(2)}` : 'All clear ✓', danger: unit.outstandingBalance > 0 },
                { label: 'Lease Expires', value: new Date(unit.leaseEnd).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) },
                { label: 'Deposit Held', value: `£${unit.deposit.toFixed(2)}` },
              ].map(item => (
                <div key={item.label}>
                  <p className="text-xs text-[#94A3B8] font-medium">{item.label}</p>
                  <p className={`text-sm font-semibold mt-0.5 ${item.danger ? 'text-rose-600' : 'text-[#0F172A] dark:text-white'}`}>{item.value}</p>
                </div>
              ))}
            </div>
            <button
              onClick={() => navigate('/portal/property')}
              className="w-full mt-4 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-medium text-[#075DE8] bg-[#EFF6FF] dark:bg-[#1E2D45] hover:bg-blue-100 transition-colors"
            >
              <Zap size={13} />
              View full property details
            </button>
          </div>
        </section>
      )}

      {/* Utility peek */}
      {unit && (
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-[#334155] dark:text-[#CBD5E1]">Last Month Utilities</h2>
            <button onClick={() => navigate('/portal/utilities')} className="text-xs font-medium text-[#075DE8] flex items-center gap-1">Details <ArrowUpRight size={12} /></button>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Electricity', value: '180 kWh', cost: '£48.60', icon: '⚡', color: 'bg-yellow-50 dark:bg-yellow-900/20' },
              { label: 'Water', value: '4.0 m³', cost: '£8.00', icon: '💧', color: 'bg-blue-50 dark:bg-blue-900/20' },
              { label: 'Gas', value: '5 m³', cost: '£6.75', icon: '🔥', color: 'bg-orange-50 dark:bg-orange-900/20' },
            ].map(u => (
              <div key={u.label} className={`${u.color} rounded-2xl p-3 text-center`}>
                <p className="text-xl mb-1">{u.icon}</p>
                <p className="text-xs font-semibold text-[#0F172A] dark:text-white">{u.cost}</p>
                <p className="text-[10px] text-[#64748B]">{u.value}</p>
                <p className="text-[10px] text-[#94A3B8]">{u.label}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Parcels */}
      {pendingParcels.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-[#334155] dark:text-[#CBD5E1]">Parcels Waiting</h2>
            <button onClick={() => navigate('/portal/parcels')} className="text-xs font-medium text-[#075DE8] flex items-center gap-1">View all <ArrowUpRight size={12} /></button>
          </div>
          {pendingParcels.map(parcel => (
            <motion.button
              key={parcel.id}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/portal/parcels')}
              className="w-full flex items-center gap-3 p-4 bg-white dark:bg-[#111827] border border-[#E6EEF5] dark:border-[#1E2D45] rounded-2xl text-left hover:shadow-md transition-all"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center flex-shrink-0 text-xl">
                📦
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[#0F172A] dark:text-white truncate">{parcel.description}</p>
                <p className="text-xs text-[#64748B]">{parcel.courier} · Code: <span className="font-mono font-bold text-[#075DE8]">{parcel.collectionCode}</span></p>
              </div>
              <ChevronRight size={16} className="text-[#94A3B8] flex-shrink-0" />
            </motion.button>
          ))}
        </section>
      )}
    </div>
  );
}
