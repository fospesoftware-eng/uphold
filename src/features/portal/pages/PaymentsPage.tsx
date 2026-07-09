import { useState } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Download, AlertTriangle, CheckCircle, Clock, ChevronRight, ArrowUpRight } from 'lucide-react';
import { useTenantPortal } from '../context';
import { getTenantData } from '../data';

const STATUS_CONFIG = {
  paid:      { label: 'Paid',     color: 'text-emerald-600', bg: 'bg-emerald-100 dark:bg-emerald-900/30', icon: CheckCircle },
  pending:   { label: 'Pending',  color: 'text-amber-600',   bg: 'bg-amber-100 dark:bg-amber-900/30',   icon: Clock },
  overdue:   { label: 'Overdue',  color: 'text-rose-600',    bg: 'bg-rose-100 dark:bg-rose-900/30',     icon: AlertTriangle },
  upcoming:  { label: 'Upcoming', color: 'text-blue-600',    bg: 'bg-blue-100 dark:bg-blue-900/30',     icon: CreditCard },
  cancelled: { label: 'Cancelled',color: 'text-slate-500',   bg: 'bg-slate-100 dark:bg-slate-800/50',  icon: CreditCard },
};

const TYPE_ICONS: Record<string, string> = {
  rent: '🏠', deposit: '🔐', utility: '⚡', parking: '🚗',
  maintenance_charge: '🔧', late_fee: '⚠️', refund: '↩️',
};

export function PaymentsPage() {
  const { tenantUser } = useTenantPortal();
  const [tab, setTab] = useState<'all' | 'upcoming' | 'history'>('all');

  if (!tenantUser) return null;
  const { payments, unit } = getTenantData(tenantUser.id);

  const overdue = payments.filter(p => p.status === 'overdue');
  const upcoming = payments.filter(p => p.status === 'upcoming');
  const pending = payments.filter(p => p.status === 'pending');
  const paid = payments.filter(p => p.status === 'paid');
  const totalOutstanding = overdue.reduce((s, p) => s + p.amount, 0) +
                           pending.reduce((s, p) => s + p.amount, 0);

  const filtered = payments.filter(p =>
    tab === 'all' ? true :
    tab === 'upcoming' ? ['upcoming', 'pending', 'overdue'].includes(p.status) :
    p.status === 'paid'
  );

  return (
    <div className="max-w-2xl mx-auto px-4 pt-6 pb-8 lg:max-w-none lg:px-6 space-y-5">
      {/* Balance card */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`relative overflow-hidden rounded-3xl p-5 text-white ${
          overdue.length > 0
            ? 'bg-gradient-to-br from-rose-600 to-rose-800 shadow-xl shadow-rose-500/20'
            : 'bg-gradient-to-br from-emerald-500 to-teal-600 shadow-xl shadow-emerald-500/20'
        }`}
      >
        <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-white/5 -translate-y-10 translate-x-10" />
        <p className="text-sm text-white/80 font-medium">
          {overdue.length > 0 ? 'Outstanding Balance' : 'Account Status'}
        </p>
        <p className="text-4xl font-bold mt-1">
          {totalOutstanding > 0 ? `£${totalOutstanding.toFixed(2)}` : 'All Clear ✓'}
        </p>
        {totalOutstanding > 0 && (
          <p className="text-white/70 text-sm mt-1">{overdue.length} overdue · {pending.length} pending</p>
        )}
        <div className="mt-4 flex gap-2">
          <button className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl bg-white/20 hover:bg-white/30 transition-colors font-semibold text-sm">
            <CreditCard size={16} />
            Pay Now
          </button>
          <button className="flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-white/20 hover:bg-white/30 transition-colors text-sm">
            Set Up Auto Pay
          </button>
        </div>
      </motion.div>

      {/* Stats strip */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Monthly Rent', value: `£${unit?.rentAmount.toFixed(2) ?? '–'}`, sub: 'Per month', color: 'text-[#0F172A] dark:text-white' },
          { label: 'Paid (6mo)', value: `£${(paid.reduce((s, p) => s + p.amount, 0)).toFixed(0)}`, sub: `${paid.length} payments`, color: 'text-emerald-600' },
          { label: 'Deposit', value: `£${unit?.deposit.toFixed(0) ?? '–'}`, sub: 'Held securely', color: 'text-[#0F172A] dark:text-white' },
        ].map(stat => (
          <div key={stat.label} className="bg-white dark:bg-[#111827] border border-[#E6EEF5] dark:border-[#1E2D45] rounded-2xl p-3">
            <p className="text-[10px] text-[#94A3B8] font-medium mb-1">{stat.label}</p>
            <p className={`text-base font-bold ${stat.color}`}>{stat.value}</p>
            <p className="text-[10px] text-[#64748B]">{stat.sub}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {(['all', 'upcoming', 'history'] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all capitalize ${
              tab === t
                ? 'bg-[#075DE8] text-white shadow-sm'
                : 'bg-white dark:bg-[#111827] border border-[#E6EEF5] dark:border-[#1E2D45] text-[#64748B]'
            }`}
          >{t}</button>
        ))}
      </div>

      {/* Payment list */}
      <div className="space-y-2.5">
        {filtered.map(payment => {
          const cfg = STATUS_CONFIG[payment.status] ?? STATUS_CONFIG.upcoming;
          const Icon = cfg.icon;
          return (
            <motion.div
              key={payment.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex items-center gap-3 p-4 rounded-2xl border ${
                payment.status === 'overdue'
                  ? 'bg-rose-50 dark:bg-rose-900/10 border-rose-200 dark:border-rose-800/50'
                  : 'bg-white dark:bg-[#111827] border-[#E6EEF5] dark:border-[#1E2D45]'
              }`}
            >
              <div className="w-10 h-10 rounded-xl bg-[#F8FAFC] dark:bg-[#1E2D45] flex items-center justify-center text-xl flex-shrink-0">
                {TYPE_ICONS[payment.type] ?? '💳'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[#0F172A] dark:text-white truncate">{payment.description}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${cfg.bg} ${cfg.color}`}>
                    {cfg.label}
                  </span>
                  <span className="text-[10px] text-[#94A3B8]">
                    Due {new Date(payment.dueDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                </div>
                {payment.paidDate && (
                  <p className="text-[10px] text-emerald-600 mt-0.5">
                    Paid {new Date(payment.paidDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                    {payment.method && ` · ${payment.method.replace(/_/g, ' ')}`}
                  </p>
                )}
              </div>
              <div className="text-right flex-shrink-0">
                <p className={`text-base font-bold ${payment.status === 'overdue' ? 'text-rose-600' : payment.status === 'paid' ? 'text-emerald-600' : 'text-[#0F172A] dark:text-white'}`}>
                  £{payment.amount.toFixed(2)}
                </p>
                {payment.status === 'paid' && (
                  <button className="flex items-center gap-1 text-[10px] text-[#075DE8] mt-1">
                    <Download size={10} />
                    Receipt
                  </button>
                )}
                {payment.status === 'overdue' && (
                  <button className="text-[10px] font-semibold text-rose-600 mt-1">Pay now</button>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Payment methods */}
      <div className="bg-white dark:bg-[#111827] border border-[#E6EEF5] dark:border-[#1E2D45] rounded-2xl p-4">
        <h3 className="text-sm font-semibold text-[#334155] dark:text-[#CBD5E1] mb-3">Accepted Payment Methods</h3>
        <div className="flex flex-wrap gap-2">
          {['💳 Card', '🏦 Bank Transfer', '📱 Apple Pay', '🤖 Google Pay', '🔄 Direct Debit'].map(method => (
            <span key={method} className="px-3 py-1.5 rounded-xl bg-[#F8FAFC] dark:bg-[#1E2D45] text-xs font-medium text-[#334155] dark:text-[#CBD5E1]">
              {method}
            </span>
          ))}
        </div>
        <button className="w-full mt-3 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium text-[#075DE8] bg-[#EFF6FF] dark:bg-[#1E2D45] hover:bg-blue-100 transition-colors">
          <CreditCard size={15} />
          Manage Payment Methods
        </button>
      </div>
    </div>
  );
}
