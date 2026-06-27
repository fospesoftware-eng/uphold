import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Users, Building2, AlertTriangle, ShieldAlert, DollarSign,
  FileX, ClipboardList, Wrench, TrendingUp, Activity, Clock,
  Sparkles, Brain, CircleAlert, ArrowRight
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip as RechartTooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts';
import { StatCard, Card, SkeletonCard, Avatar, StatusPill, PageHeader, ProgressBar, Badge } from '../../components/ui';
import { dashboardService } from '../../services';
import { aiService } from '../../services/ai';
import { tenants, activityFeed, notifications } from '../../data/mockData';
import type { DashboardKPI, ActivityEvent, AppNotification } from '../../types';
import type { RiskInsight, AIAction, AIBriefing } from '../../services/ai';

const CHART_COLORS = ['#075DE8', '#0797D8', '#15C6B8', '#32E6A4', '#6366F1', '#8B5CF6'];

export function DashboardPage() {
  const [kpis, setKpis] = useState<DashboardKPI | null>(null);
  const [occupancy, setOccupancy] = useState<{month: string; occupancy: number}[]>([]);
  const [rentData, setRentData] = useState<{month: string; collected: number; expected: number}[]>([]);
  const [supportData, setSupportData] = useState<{name: string; hours: number}[]>([]);
  const [activity, setActivity] = useState<ActivityEvent[]>([]);
  const [alerts, setAlerts] = useState<AppNotification[]>([]);
  const [briefing, setBriefing] = useState<AIBriefing | null>(null);
  const [risks, setRisks] = useState<RiskInsight[]>([]);
  const [aiActions, setAiActions] = useState<AIAction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const [k, occ, rent, supp, act, alrt, brief, rsk, acts] = await Promise.all([
        dashboardService.getKPIs('org-1'),
        dashboardService.getOccupancyTrend('org-1'),
        dashboardService.getRentCollectionTrend('org-1'),
        dashboardService.getSupportHoursBreakdown('org-1'),
        dashboardService.getRecentActivity('org-1'),
        dashboardService.getAlerts('org-1'),
        aiService.getBriefing(),
        aiService.getRiskInsights(),
        aiService.getRecommendedActions(),
      ]);
      setKpis(k); setOccupancy(occ); setRentData(rent);
      setSupportData(supp); setActivity(act); setAlerts(alrt);
      setBriefing(brief); setRisks(rsk); setAiActions(acts);
      setLoading(false);
    };
    load();
  }, []);

  const activityTypeIcons: Record<string, React.ReactNode> = {
    login: <Activity size={14} />,
    upload: <FileX size={14} />,
    support_log: <Clock size={14} />,
    tenant_change: <Users size={14} />,
    payment: <DollarSign size={14} />,
    certificate_update: <ShieldAlert size={14} />,
    assessment_update: <ClipboardList size={14} />,
  };

  const formatCurrency = (v: number) => `£${v.toLocaleString()}`;
  const formatTime = (ts: string) => {
    const d = new Date(ts);
    const now = new Date();
    const diff = (now.getTime() - d.getTime()) / 1000;
    if (diff < 60) return 'just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  if (loading) {
    return (
      <div>
        <PageHeader title="Dashboard" subtitle="NorthBridge Supported Living" />
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
          {[...Array(8)].map((_, i) => <SkeletonCard key={i} />)}
        </div>
      </div>
    );
  }

  const rentCollectionPct = kpis ? Math.round((kpis.rentCollected / kpis.rentExpected) * 100) : 0;

  return (
    <div className="max-w-[1400px] mx-auto">
      <PageHeader
        title="Dashboard"
        subtitle="NorthBridge Supported Living — June 2026"
        actions={
          <div className="flex items-center gap-2 text-xs text-[#64748B]">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Live data
          </div>
        }
      />

      {/* AI Briefing banner */}
      {briefing && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-2xl bg-[linear-gradient(135deg,#06122A_0%,#0A2A4D_45%,#06302F_100%)] p-5 sm:p-6 text-white mb-6"
        >
          <div className="absolute -top-16 -right-10 w-64 h-64 rounded-full bg-[#15C6B8]/20 blur-3xl" />
          <div className="relative z-10 flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center flex-shrink-0">
              <Sparkles size={20} className="text-[#32E6A4]" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <p className="font-semibold font-display text-sm">{briefing.greeting} — Uphold AI briefing</p>
                <span className="text-[11px] text-white/50">live</span>
              </div>
              <p className="text-sm text-white/80 leading-relaxed">{briefing.summary}</p>
            </div>
            <Link
              to="/ai-insights"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 border border-white/15 text-xs font-medium transition-colors flex-shrink-0"
            >
              View insights <ArrowRight size={14} />
            </Link>
          </div>
        </motion.div>
      )}

      {/* KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Occupancy Rate"
          value={`${kpis!.occupancyRate}%`}
          subtitle="29 of 33 rooms occupied"
          icon={<Building2 size={22} />}
          trend={{ value: 2, label: 'vs last month' }}
          variant="gradient"
        />
        <StatCard
          title="Active Tenants"
          value={kpis!.activeTenants}
          subtitle={`${kpis!.tenantsAtRisk} at risk`}
          icon={<Users size={22} />}
          trend={{ value: 0, label: 'stable' }}
        />
        <StatCard
          title="Rent Collected"
          value={formatCurrency(kpis!.rentCollected)}
          subtitle={`${rentCollectionPct}% of £${kpis!.rentExpected.toLocaleString()} expected`}
          icon={<DollarSign size={22} />}
          trend={{ value: -3, label: 'vs last month' }}
          variant={rentCollectionPct < 90 ? 'warning' : 'default'}
        />
        <StatCard
          title="STAR Assessments"
          value={kpis!.starAssessmentsOverdue}
          subtitle="overdue assessments"
          icon={<ClipboardList size={22} />}
          variant={kpis!.starAssessmentsOverdue > 0 ? 'danger' : 'success'}
        />
        <StatCard
          title="Below Support Threshold"
          value={kpis!.belowSupportThreshold}
          subtitle="tenants under required hours"
          icon={<AlertTriangle size={22} />}
          variant={kpis!.belowSupportThreshold > 0 ? 'warning' : 'success'}
        />
        <StatCard
          title="Certificates Valid"
          value={kpis!.certificatesValid}
          subtitle={`${kpis!.certificatesExpiringSoon} expiring · ${kpis!.certificatesExpired} expired`}
          icon={<ShieldAlert size={22} />}
          variant={kpis!.certificatesExpired > 0 ? 'danger' : 'default'}
        />
        <StatCard
          title="Missing Documents"
          value={kpis!.missingDocuments}
          subtitle="required docs outstanding"
          icon={<FileX size={22} />}
          variant={kpis!.missingDocuments > 2 ? 'warning' : 'default'}
        />
        <StatCard
          title="Maintenance Items"
          value={kpis!.openMaintenanceItems}
          subtitle="open issues"
          icon={<Wrench size={22} />}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Occupancy Trend */}
        <Card>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-semibold font-display text-[#0F172A] dark:text-[#F8FAFC]">Occupancy Trend</h3>
              <p className="text-xs text-[#64748B] mt-0.5">Last 12 months</p>
            </div>
            <span className="text-2xl font-bold font-display text-[#075DE8]">{kpis!.occupancyRate}%</span>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={occupancy} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
              <defs>
                <linearGradient id="occGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#075DE8" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#075DE8" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E6EEF5" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#64748B' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#64748B' }} axisLine={false} tickLine={false} domain={[70, 100]} />
              <RechartTooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #E6EEF5' }} />
              <Area type="monotone" dataKey="occupancy" stroke="#075DE8" strokeWidth={2} fill="url(#occGrad)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        {/* Rent Collection */}
        <Card>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-semibold font-display text-[#0F172A] dark:text-[#F8FAFC]">Rent Collection</h3>
              <p className="text-xs text-[#64748B] mt-0.5">Collected vs expected, 2026</p>
            </div>
            <span className="text-2xl font-bold font-display text-[#15C6B8]">{rentCollectionPct}%</span>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={rentData} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E6EEF5" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#64748B' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#64748B' }} axisLine={false} tickLine={false} tickFormatter={v => `£${(v/1000).toFixed(0)}k`} />
              <RechartTooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} formatter={(v: unknown) => [`£${(v as number).toLocaleString()}`, '']} />
              <Bar dataKey="expected" fill="#E6EEF5" radius={[4, 4, 0, 0]} name="Expected" />
              <Bar dataKey="collected" fill="#075DE8" radius={[4, 4, 0, 0]} name="Collected" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Alerts */}
        <Card className="lg:col-span-1">
          <h3 className="font-semibold font-display text-[#0F172A] dark:text-[#F8FAFC] mb-4">Active Alerts</h3>
          <div className="space-y-3">
            {alerts.slice(0, 5).map(alert => (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                className={`flex items-start gap-3 p-3 rounded-xl border ${
                  alert.severity === 'danger' ? 'bg-rose-50 dark:bg-rose-900/10 border-rose-200 dark:border-rose-900/30' :
                  alert.severity === 'warning' ? 'bg-amber-50 dark:bg-amber-900/10 border-amber-200 dark:border-amber-900/30' :
                  'bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-900/30'
                }`}
              >
                <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${alert.severity === 'danger' ? 'bg-rose-500' : alert.severity === 'warning' ? 'bg-amber-500' : 'bg-blue-500'}`} />
                <div>
                  <p className="text-xs font-semibold text-[#0F172A] dark:text-[#F8FAFC]">{alert.title}</p>
                  <p className="text-xs text-[#64748B] mt-0.5">{alert.message}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>

        {/* Support Hours */}
        <Card>
          <h3 className="font-semibold font-display text-[#0F172A] dark:text-[#F8FAFC] mb-4">Support Hours Breakdown</h3>
          <div className="space-y-3">
            {supportData.map((item, i) => (
              <div key={item.name}>
                <div className="flex justify-between text-xs text-[#64748B] mb-1">
                  <span>{item.name}</span>
                  <span className="font-medium">{item.hours}h</span>
                </div>
                <ProgressBar
                  value={item.hours}
                  max={30}
                  animated
                />
              </div>
            ))}
          </div>
        </Card>

        {/* Recent Activity */}
        <Card>
          <h3 className="font-semibold font-display text-[#0F172A] dark:text-[#F8FAFC] mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {activity.slice(0, 6).map((event, i) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-start gap-3"
              >
                <Avatar name={event.userName} size="xs" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-[#334155] dark:text-[#CBD5E1] leading-relaxed">{event.description}</p>
                  <p className="text-[10px] text-[#94A3B8] mt-0.5">{formatTime(event.timestamp)}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
      </div>

      {/* AI row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        {/* AI Risk Radar */}
        <Card className="lg:col-span-2">
          <div className="flex items-center gap-2 mb-5">
            <Brain size={18} className="text-[#075DE8]" />
            <h3 className="font-semibold font-display text-[#0F172A] dark:text-[#F8FAFC]">AI Risk Radar</h3>
            <Badge variant="info" className="ml-1">Predictive</Badge>
            <Link to="/ai-insights" className="ml-auto text-xs text-[#075DE8] hover:underline inline-flex items-center gap-1">
              View all <ArrowRight size={12} />
            </Link>
          </div>
          <div className="space-y-2">
            {risks.slice(0, 4).map((r, i) => (
              <motion.div
                key={r.tenantId}
                initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                className="flex items-center gap-3 p-3 rounded-xl border border-[#E6EEF5] dark:border-[#1E2D45]"
              >
                <div className={`w-11 h-11 rounded-xl flex flex-col items-center justify-center flex-shrink-0 font-bold font-display text-sm ${
                  r.level === 'critical' || r.level === 'high' ? 'bg-rose-50 text-rose-600 dark:bg-rose-900/20' :
                  r.level === 'medium' ? 'bg-amber-50 text-amber-600 dark:bg-amber-900/20' :
                  'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20'
                }`}>
                  {r.score}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-[#0F172A] dark:text-[#F8FAFC] truncate">{r.tenantName}</p>
                    <Badge variant={r.level === 'critical' || r.level === 'high' ? 'danger' : r.level === 'medium' ? 'warning' : 'success'} className="capitalize">{r.level}</Badge>
                  </div>
                  <p className="text-xs text-[#64748B] truncate flex items-center gap-1">
                    <CircleAlert size={11} className="flex-shrink-0 text-amber-500" /> {r.factors[0] ?? 'Stable — routine monitoring'}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>

        {/* AI Recommended Actions */}
        <Card>
          <div className="flex items-center gap-2 mb-5">
            <Sparkles size={18} className="text-[#15C6B8]" />
            <h3 className="font-semibold font-display text-[#0F172A] dark:text-[#F8FAFC]">Suggested Actions</h3>
          </div>
          <div className="space-y-2.5">
            {aiActions.slice(0, 5).map((a, i) => (
              <motion.div
                key={a.id}
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                className="flex items-start gap-2.5"
              >
                <span className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${a.priority === 'high' ? 'bg-rose-500' : a.priority === 'medium' ? 'bg-amber-500' : 'bg-slate-400'}`} />
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-[#0F172A] dark:text-[#F8FAFC]">{a.title}</p>
                  <p className="text-xs text-[#64748B] leading-relaxed">{a.detail}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
