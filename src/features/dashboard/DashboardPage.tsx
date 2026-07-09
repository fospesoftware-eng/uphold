import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Users, Building2, AlertTriangle, ShieldAlert, DollarSign,
  FileX, ClipboardList, Wrench, TrendingUp, Activity, Clock
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip as RechartTooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts';
import { StatCard, Card, SkeletonCard, Avatar, StatusPill, PageHeader, ProgressBar } from '../../components/ui';
import { dashboardService } from '../../services';
import { tenants, activityFeed, notifications } from '../../data/mockData';
import type { DashboardKPI, ActivityEvent, AppNotification } from '../../types';

const CHART_COLORS = ['#075DE8', '#0797D8', '#15C6B8', '#32E6A4', '#6366F1', '#8B5CF6'];

export function DashboardPage() {
  const [kpis, setKpis] = useState<DashboardKPI | null>(null);
  const [occupancy, setOccupancy] = useState<{month: string; occupancy: number}[]>([]);
  const [rentData, setRentData] = useState<{month: string; collected: number; expected: number}[]>([]);
  const [supportData, setSupportData] = useState<{name: string; hours: number}[]>([]);
  const [activity, setActivity] = useState<ActivityEvent[]>([]);
  const [alerts, setAlerts] = useState<AppNotification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const [k, occ, rent, supp, act, alrt] = await Promise.all([
        dashboardService.getKPIs('org-1'),
        dashboardService.getOccupancyTrend('org-1'),
        dashboardService.getRentCollectionTrend('org-1'),
        dashboardService.getSupportHoursBreakdown('org-1'),
        dashboardService.getRecentActivity('org-1'),
        dashboardService.getAlerts('org-1'),
      ]);
      setKpis(k); setOccupancy(occ); setRentData(rent);
      setSupportData(supp); setActivity(act); setAlerts(alrt);
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
    </div>
  );
}
