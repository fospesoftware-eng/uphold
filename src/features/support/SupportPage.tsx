import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Clock, AlertTriangle, ClipboardList, Users } from 'lucide-react';
import {
  Card, PageHeader, Tabs, StatusPill, Avatar, Badge, Button, DataTable,
  EmptyState, StatCard, ProgressBar, FilterBar, Drawer, Input, Select, Textarea
} from '../../components/ui';
import { supportService } from '../../services';
import { tenants, users } from '../../data/mockData';
import type { SupportLog, StarAssessment } from '../../types';

const SUPPORT_TYPES = [
  { value: 'housing_support', label: 'Housing Support' },
  { value: 'benefits_support', label: 'Benefits Support' },
  { value: 'health_wellbeing', label: 'Health & Wellbeing' },
  { value: 'employment_training', label: 'Employment & Training' },
  { value: 'safeguarding', label: 'Safeguarding' },
  { value: 'independent_living', label: 'Independent Living Skills' },
  { value: 'crisis_support', label: 'Crisis Support' },
  { value: 'tenancy_sustainment', label: 'Tenancy Sustainment' },
];

export function SupportPage() {
  const [logs, setLogs] = useState<SupportLog[]>([]);
  const [assessments, setAssessments] = useState<StarAssessment[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('logs');
  const [search, setSearch] = useState('');
  const [logDrawerOpen, setLogDrawerOpen] = useState(false);

  useEffect(() => {
    Promise.all([
      supportService.getAllLogs('org-1'),
      supportService.getStarAssessments('org-1'),
    ]).then(([l, a]) => { setLogs(l); setAssessments(a); setLoading(false); });
  }, []);

  const getTenant = (id: string) => tenants.find(t => t.id === id);

  const tenantsBelow = tenants.filter(t => t.supportHoursWeek < t.supportHoursRequired && t.status === 'active');
  const overdue = assessments.filter(a => a.status === 'overdue');
  const totalHoursThisWeek = logs.filter(l => {
    const d = new Date(l.date);
    const now = new Date();
    const diff = (now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24);
    return diff <= 7;
  }).reduce((sum, l) => sum + l.duration, 0);

  const tabs = [
    { id: 'logs', label: 'Support Logs', count: logs.length },
    { id: 'followups', label: 'Follow-ups', count: logs.filter(l => l.followUpRequired).length },
    { id: 'star', label: 'STAR Assessments', count: assessments.length },
    { id: 'below', label: 'Below Threshold', count: tenantsBelow.length },
  ];

  const filteredLogs = logs.filter(l => {
    if (!search) return true;
    const t = getTenant(l.tenantId);
    return t ? `${t.firstName} ${t.lastName}`.toLowerCase().includes(search.toLowerCase()) : false;
  });

  return (
    <div className="max-w-[1400px] mx-auto">
      <PageHeader
        title="Support"
        subtitle="Support sessions, follow-ups, and STAR assessments"
        actions={<Button leftIcon={<Plus size={16} />} onClick={() => setLogDrawerOpen(true)}>Log Support</Button>}
      />

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard title="Hours This Week" value={`${Math.round(totalHoursThisWeek / 60)}h`} subtitle={`${logs.filter(l => new Date(l.date) >= new Date(Date.now() - 7*86400000)).length} sessions`} icon={<Clock size={22} />} />
        <StatCard title="Below Threshold" value={tenantsBelow.length} subtitle="tenants under required hours" icon={<AlertTriangle size={22} />} variant={tenantsBelow.length > 0 ? 'warning' : 'success'} />
        <StatCard title="Overdue Assessments" value={overdue.length} subtitle="STAR assessments overdue" icon={<ClipboardList size={22} />} variant={overdue.length > 0 ? 'danger' : 'success'} />
        <StatCard title="Key Workers" value={new Set(logs.map(l => l.keyWorkerId)).size} subtitle="active this week" icon={<Users size={22} />} />
      </div>

      <Card padding="none">
        <div className="p-4 border-b border-[#E6EEF5] dark:border-[#1E2D45]">
          <Tabs tabs={tabs} active={activeTab} onChange={setActiveTab} />
        </div>

        <div className="p-4">
          {activeTab === 'logs' && (
            <>
              <FilterBar search={search} onSearch={setSearch} placeholder="Search by tenant…" />
              <DataTable
                loading={loading}
                data={filteredLogs}
                keyExtractor={l => l.id}
                emptyState={<EmptyState title="No support logs" description="Log a support session to get started." className="py-8" />}
                columns={[
                  {
                    key: 'tenant',
                    header: 'Tenant',
                    render: l => {
                      const t = getTenant(l.tenantId);
                      return t ? (
                        <div className="flex items-center gap-2">
                          <Avatar name={`${t.firstName} ${t.lastName}`} size="xs" />
                          <span className="text-sm font-medium text-[#0F172A] dark:text-[#F8FAFC]">{t.firstName} {t.lastName}</span>
                        </div>
                      ) : <span>—</span>;
                    },
                  },
                  { key: 'date', header: 'Date', render: l => new Date(l.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) },
                  { key: 'supportType', header: 'Type', render: l => <Badge variant="info">{l.supportType.replace(/_/g, ' ').replace(/^\w/, c => c.toUpperCase())}</Badge> },
                  { key: 'duration', header: 'Duration', render: l => `${l.duration}min` },
                  { key: 'location', header: 'Location' },
                  { key: 'followUp', header: 'Follow-up', render: l => l.followUpRequired ? <Badge variant="warning">Required</Badge> : <Badge variant="muted">None</Badge> },
                ]}
              />
            </>
          )}

          {activeTab === 'followups' && (
            <div className="space-y-3">
              {logs.filter(l => l.followUpRequired).length === 0 ? (
                <EmptyState title="No follow-ups due" className="py-8" />
              ) : (
                logs.filter(l => l.followUpRequired).map((l, i) => {
                  const t = getTenant(l.tenantId);
                  const isOverdue = l.nextFollowUpDate && new Date(l.nextFollowUpDate) < new Date();
                  return (
                    <motion.div
                      key={l.id}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className={`flex items-center gap-4 p-4 rounded-xl border ${isOverdue ? 'border-rose-200 dark:border-rose-900/30 bg-rose-50 dark:bg-rose-900/10' : 'border-amber-200 dark:border-amber-900/30 bg-amber-50 dark:bg-amber-900/10'}`}
                    >
                      {t && <Avatar name={`${t.firstName} ${t.lastName}`} size="sm" />}
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-[#0F172A] dark:text-[#F8FAFC]">{t ? `${t.firstName} ${t.lastName}` : '—'}</p>
                        <p className="text-xs text-[#64748B]">{l.outcome}</p>
                      </div>
                      <div className="text-right">
                        <StatusPill status={isOverdue ? 'overdue' : 'pending'} />
                        {l.nextFollowUpDate && <p className="text-xs text-[#64748B] mt-1">{new Date(l.nextFollowUpDate).toLocaleDateString('en-GB')}</p>}
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>
          )}

          {activeTab === 'star' && (
            <DataTable
              loading={loading}
              data={assessments}
              keyExtractor={a => a.id}
              emptyState={<EmptyState title="No assessments" className="py-8" />}
              columns={[
                {
                  key: 'tenant',
                  header: 'Tenant',
                  render: a => {
                    const t = getTenant(a.tenantId);
                    return t ? (
                      <div className="flex items-center gap-2">
                        <Avatar name={`${t.firstName} ${t.lastName}`} size="xs" />
                        <span className="font-medium">{t.firstName} {t.lastName}</span>
                      </div>
                    ) : <span>—</span>;
                  },
                },
                { key: 'scheduledDate', header: 'Scheduled', render: a => new Date(a.scheduledDate).toLocaleDateString('en-GB') },
                { key: 'status', header: 'Status', render: a => <StatusPill status={a.status} /> },
                { key: 'score', header: 'Score', render: a => a.status === 'completed' ? (
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-[#075DE8]">{a.overallScore}/80</span>
                    <ProgressBar value={a.overallScore} max={80} className="w-24" />
                  </div>
                ) : '—' },
              ]}
            />
          )}

          {activeTab === 'below' && (
            <div className="space-y-3">
              {tenantsBelow.length === 0 ? (
                <EmptyState title="All tenants meeting support requirements" className="py-8" />
              ) : (
                tenantsBelow.map((t, i) => (
                  <motion.div
                    key={t.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-center gap-4 p-4 rounded-xl border border-amber-200 dark:border-amber-900/30 bg-amber-50 dark:bg-amber-900/10"
                  >
                    <Avatar name={`${t.firstName} ${t.lastName}`} size="sm" />
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-[#0F172A] dark:text-[#F8FAFC]">{t.firstName} {t.lastName}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <ProgressBar value={t.supportHoursWeek} max={t.supportHoursRequired} className="w-32" variant={t.supportHoursWeek / t.supportHoursRequired < 0.5 ? 'danger' : 'warning'} />
                        <span className="text-xs text-[#64748B]">{t.supportHoursWeek}h / {t.supportHoursRequired}h required</span>
                      </div>
                    </div>
                    <Button size="sm" variant="outline">Log Support</Button>
                  </motion.div>
                ))
              )}
            </div>
          )}
        </div>
      </Card>

      {/* Log Support Drawer */}
      <Drawer open={logDrawerOpen} onClose={() => setLogDrawerOpen(false)} title="Log Support Session">
        <form className="space-y-4">
          <Select
            label="Tenant"
            required
            options={[{ value: '', label: 'Select tenant…' }, ...tenants.map(t => ({ value: t.id, label: `${t.firstName} ${t.lastName}` }))]}
          />
          <div className="grid grid-cols-2 gap-3">
            <Input label="Date" type="date" required />
            <Select label="Support Type" required options={[{ value: '', label: 'Select type…' }, ...SUPPORT_TYPES]} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input label="Start Time" type="time" required />
            <Input label="End Time" type="time" required />
          </div>
          <Input label="Location" placeholder="Property, community centre…" />
          <Textarea label="Session Notes" required placeholder="Describe the support provided…" />
          <Textarea label="Outcome" placeholder="What was achieved?" />
          <div className="flex items-center gap-2">
            <input type="checkbox" id="followup" className="rounded accent-[#075DE8]" />
            <label htmlFor="followup" className="text-sm text-[#334155] dark:text-[#CBD5E1]">Follow-up required</label>
          </div>
        </form>
        <div className="flex gap-3 mt-6">
          <Button variant="secondary" onClick={() => setLogDrawerOpen(false)} fullWidth>Cancel</Button>
          <Button fullWidth>Save Session</Button>
        </div>
      </Drawer>
    </div>
  );
}
