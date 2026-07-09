import { useState } from 'react';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Zap, Droplets, Flame, Wifi } from 'lucide-react';
import { useTenantPortal } from '../context';
import { getTenantData } from '../data';

const TABS = ['Electricity', 'Water', 'Gas'] as const;
type Tab = typeof TABS[number];

const TAB_CONFIG = {
  Electricity: { icon: Zap,      key: 'electricity',     costKey: 'electricityCost', color: '#F59E0B', unit: 'kWh',  gradient: 'from-yellow-400 to-amber-500' },
  Water:       { icon: Droplets, key: 'water',           costKey: 'waterCost',       color: '#0EA5E9', unit: 'm³',   gradient: 'from-sky-400 to-blue-500' },
  Gas:         { icon: Flame,    key: 'gas',             costKey: 'gasCost',         color: '#EF4444', unit: 'm³',   gradient: 'from-red-400 to-rose-500' },
} as const;

export function UtilitiesPage() {
  const { tenantUser } = useTenantPortal();
  const [tab, setTab] = useState<Tab>('Electricity');

  if (!tenantUser) return null;
  const { utilities } = getTenantData(tenantUser.id);

  const cfg = TAB_CONFIG[tab];
  const chartData = utilities.map(u => ({
    month: u.month,
    usage: u[cfg.key as keyof typeof u] as number,
    cost: u[cfg.costKey as keyof typeof u] as number,
  }));

  const latest = utilities[utilities.length - 1];
  const prev = utilities[utilities.length - 2];
  const latestUsage = latest ? latest[cfg.key as keyof typeof latest] as number : 0;
  const prevUsage = prev ? prev[cfg.key as keyof typeof prev] as number : 0;
  const change = prevUsage > 0 ? ((latestUsage - prevUsage) / prevUsage) * 100 : 0;
  const totalCost = utilities.reduce((s, u) => s + (u[cfg.costKey as keyof typeof u] as number), 0);

  return (
    <div className="max-w-2xl mx-auto px-4 pt-6 pb-8 lg:max-w-none lg:px-6 space-y-5">
      <div>
        <h1 className="text-xl font-bold text-[#0F172A] dark:text-white">Utility Dashboard</h1>
        <p className="text-sm text-[#64748B]">6-month consumption overview</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-3">
        {TABS.map(t => {
          const c = TAB_CONFIG[t];
          const lastEntry = utilities[utilities.length - 1];
          const val = lastEntry ? lastEntry[c.key as keyof typeof lastEntry] : 0;
          const cost = lastEntry ? lastEntry[c.costKey as keyof typeof lastEntry] : 0;
          return (
            <motion.button
              key={t}
              whileTap={{ scale: 0.95 }}
              onClick={() => setTab(t)}
              className={`p-3 rounded-2xl border text-left transition-all ${
                tab === t
                  ? 'border-[#075DE8] bg-[#EFF6FF] dark:bg-[#1E2D45] shadow-sm'
                  : 'border-[#E6EEF5] dark:border-[#1E2D45] bg-white dark:bg-[#111827]'
              }`}
            >
              <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${c.gradient} flex items-center justify-center mb-2`}>
                <c.icon size={15} className="text-white" />
              </div>
              <p className="text-sm font-bold text-[#0F172A] dark:text-white">£{(cost as number).toFixed(2)}</p>
              <p className="text-[10px] text-[#64748B]">{val as number} {c.unit}</p>
              <p className="text-[10px] text-[#94A3B8]">{t}</p>
            </motion.button>
          );
        })}
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              tab === t ? 'bg-[#075DE8] text-white' : 'bg-white dark:bg-[#111827] border border-[#E6EEF5] dark:border-[#1E2D45] text-[#64748B]'
            }`}
          >{t}</button>
        ))}
      </div>

      {/* Chart */}
      <div className="bg-white dark:bg-[#111827] border border-[#E6EEF5] dark:border-[#1E2D45] rounded-2xl p-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-lg font-bold text-[#0F172A] dark:text-white">{latestUsage} {cfg.unit}</p>
            <p className="text-xs text-[#64748B]">This month · {change >= 0 ? '↑' : '↓'} {Math.abs(change).toFixed(1)}% vs last month</p>
          </div>
          <div className={`px-3 py-1.5 rounded-xl text-xs font-semibold ${change > 0 ? 'bg-rose-100 text-rose-600 dark:bg-rose-900/30' : 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30'}`}>
            {change > 0 ? '+' : ''}{change.toFixed(1)}%
          </div>
        </div>
        <ResponsiveContainer width="100%" height={180}>
          <AreaChart data={chartData} margin={{ top: 5, right: 0, bottom: 0, left: -20 }}>
            <defs>
              <linearGradient id="utilGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={cfg.color} stopOpacity={0.3} />
                <stop offset="95%" stopColor={cfg.color} stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#E6EEF5" vertical={false} />
            <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 10, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ background: '#fff', border: '1px solid #E6EEF5', borderRadius: 12, fontSize: 12 }}
              formatter={(value: unknown) => [`${value ?? 0} ${cfg.unit}`, tab as string] as [string, string]} />
            <Area type="monotone" dataKey="usage" stroke={cfg.color} strokeWidth={2} fill="url(#utilGrad)" dot={{ fill: cfg.color, r: 3 }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Monthly breakdown table */}
      <div className="bg-white dark:bg-[#111827] border border-[#E6EEF5] dark:border-[#1E2D45] rounded-2xl overflow-hidden">
        <div className="px-4 py-3 border-b border-[#E6EEF5] dark:border-[#1E2D45]">
          <p className="text-sm font-semibold text-[#334155] dark:text-[#CBD5E1]">Monthly Bills</p>
        </div>
        {[...utilities].reverse().map(month => (
          <div key={month.month} className="flex items-center justify-between px-4 py-3 border-b border-[#F1F5F9] dark:border-[#1E2D45]/50 last:border-0">
            <p className="text-sm font-medium text-[#334155] dark:text-[#CBD5E1]">{month.month}</p>
            <div className="text-right">
              <p className="text-sm font-bold text-[#0F172A] dark:text-white">£{month.total.toFixed(2)}</p>
              <p className="text-[10px] text-[#94A3B8]">Total (all utilities)</p>
            </div>
          </div>
        ))}
        <div className="px-4 py-3 bg-[#F8FAFC] dark:bg-[#1E2D45]">
          <div className="flex justify-between">
            <p className="text-sm font-semibold text-[#334155] dark:text-[#CBD5E1]">6-Month Total</p>
            <p className="text-sm font-bold text-[#0F172A] dark:text-white">£{utilities.reduce((s, u) => s + u.total, 0).toFixed(2)}</p>
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="flex items-start gap-3 p-4 rounded-2xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/50">
        <Wifi size={18} className="text-blue-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-blue-700 dark:text-blue-400">Broadband Included</p>
          <p className="text-xs text-blue-600 dark:text-blue-400/80 mt-0.5">Your broadband is included in your rent. You are not charged separately for internet usage.</p>
        </div>
      </div>
    </div>
  );
}
