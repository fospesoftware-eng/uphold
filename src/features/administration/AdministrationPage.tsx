import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Building2, Users, Shield, Plus, Settings } from 'lucide-react';
import {
  Card, PageHeader, Tabs, StatusPill, Avatar, Badge, Button, DataTable,
  StatCard, ProgressBar, EmptyState
} from '../../components/ui';
import { adminService, organisationService } from '../../services';
import type { Organisation, User } from '../../types';

export function AdministrationPage() {
  const [organisations, setOrganisations] = useState<Organisation[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('organisations');

  useEffect(() => {
    Promise.all([
      adminService.getAllOrganisations(),
      adminService.getUsers('org-1'),
    ]).then(([orgs, usrs]) => { setOrganisations(orgs); setUsers(usrs); setLoading(false); });
  }, []);

  const planColors: Record<string, string> = {
    enterprise: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-400',
    professional: 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400',
    starter: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300',
  };

  const roleColors: Record<string, string> = {
    super_admin: 'bg-rose-100 text-rose-700',
    admin: 'bg-blue-100 text-blue-700',
    support_staff: 'bg-teal-100 text-teal-700',
    board: 'bg-slate-100 text-slate-600',
  };

  const tabs = [
    { id: 'organisations', label: 'Organisations', count: organisations.length },
    { id: 'users', label: 'Users & Roles', count: users.length },
    { id: 'licensing', label: 'Licensing' },
    { id: 'audit', label: 'System Audit' },
  ];

  return (
    <div className="max-w-[1400px] mx-auto">
      <PageHeader
        title="Administration"
        subtitle="Organisations, users, roles, and licensing"
        actions={<Button leftIcon={<Plus size={16} />}>New Organisation</Button>}
      />

      {/* Platform KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <StatCard title="Total Organisations" value={organisations.length} icon={<Building2 size={22} />} />
        <StatCard title="Total Users" value={users.length} subtitle="across all organisations" icon={<Users size={22} />} />
        <StatCard title="Active Plans" value={organisations.filter(o => o.status === 'active').length} subtitle="active subscriptions" icon={<Shield size={22} />} variant="success" />
      </div>

      <Card padding="none">
        <div className="p-4 border-b border-[#E6EEF5] dark:border-[#1E2D45]">
          <Tabs tabs={tabs} active={activeTab} onChange={setActiveTab} />
        </div>
        <div className="p-4">
          {activeTab === 'organisations' && (
            <DataTable
              loading={loading}
              data={organisations}
              keyExtractor={o => o.id}
              emptyState={<EmptyState title="No organisations" className="py-8" />}
              columns={[
                {
                  key: 'name',
                  header: 'Organisation',
                  render: o => (
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-uphold-gradient flex items-center justify-center text-white text-sm font-bold">
                        {o.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-sm text-[#0F172A] dark:text-[#F8FAFC]">{o.name}</p>
                        <p className="text-xs text-[#64748B]">{o.activeUsers} users</p>
                      </div>
                    </div>
                  ),
                },
                {
                  key: 'plan',
                  header: 'Plan',
                  render: o => <span className={`px-2.5 py-0.5 text-xs rounded-full font-semibold capitalize ${planColors[o.plan]}`}>{o.plan}</span>,
                },
                {
                  key: 'usage',
                  header: 'Occupant Usage',
                  render: o => (
                    <div className="flex items-center gap-2 w-36">
                      <ProgressBar
                        value={o.tenantCount}
                        max={o.occupantLimit}
                        variant={o.tenantCount / o.occupantLimit > 0.9 ? 'warning' : 'default'}
                      />
                      <span className="text-xs text-[#64748B] whitespace-nowrap">{o.tenantCount}/{o.occupantLimit}</span>
                    </div>
                  ),
                },
                {
                  key: 'paymentStatus',
                  header: 'Billing',
                  render: o => <StatusPill status={o.paymentStatus === 'paid' ? 'paid' : o.paymentStatus === 'overdue' ? 'overdue' : 'pending'} />,
                },
                {
                  key: 'renewalDate',
                  header: 'Renewal',
                  render: o => new Date(o.renewalDate).toLocaleDateString('en-GB'),
                },
                { key: 'status', header: 'Status', render: o => <StatusPill status={o.status} /> },
                {
                  key: 'actions',
                  header: '',
                  render: () => (
                    <button className="p-1.5 rounded-lg hover:bg-[#F8FAFC] dark:hover:bg-[#1E2D45] text-[#64748B] transition-colors">
                      <Settings size={15} />
                    </button>
                  ),
                },
              ]}
            />
          )}

          {activeTab === 'users' && (
            <>
              <div className="flex justify-end mb-4">
                <Button size="sm" leftIcon={<Plus size={14} />}>Invite User</Button>
              </div>
              <DataTable
                loading={loading}
                data={users}
                keyExtractor={u => u.id}
                emptyState={<EmptyState title="No users" className="py-8" />}
                columns={[
                  {
                    key: 'user',
                    header: 'User',
                    render: u => (
                      <div className="flex items-center gap-3">
                        <Avatar name={u.name} size="sm" />
                        <div>
                          <p className="font-medium text-sm text-[#0F172A] dark:text-[#F8FAFC]">{u.name}</p>
                          <p className="text-xs text-[#64748B]">{u.email}</p>
                        </div>
                      </div>
                    ),
                  },
                  {
                    key: 'role',
                    header: 'Role',
                    render: u => (
                      <span className={`px-2.5 py-0.5 text-xs rounded-full font-medium capitalize ${roleColors[u.role] ?? 'bg-slate-100 text-slate-600'}`}>
                        {u.role.replace(/_/g, ' ')}
                      </span>
                    ),
                  },
                  {
                    key: 'twoFactor',
                    header: '2FA',
                    render: u => u.twoFactorEnabled
                      ? <Badge variant="success">Enabled</Badge>
                      : <Badge variant="warning">Disabled</Badge>,
                  },
                  {
                    key: 'lastLogin',
                    header: 'Last Login',
                    render: u => new Date(u.lastLogin).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }),
                  },
                  { key: 'status', header: 'Status', render: u => <StatusPill status={u.status} /> },
                  {
                    key: 'actions',
                    header: '',
                    render: () => (
                      <button className="p-1.5 rounded-lg hover:bg-[#F8FAFC] dark:hover:bg-[#1E2D45] text-[#64748B] transition-colors">
                        <Settings size={15} />
                      </button>
                    ),
                  },
                ]}
              />
            </>
          )}

          {activeTab === 'licensing' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {organisations.map((org, i) => (
                  <motion.div
                    key={org.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.07 }}
                  >
                    <Card>
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="font-semibold text-sm text-[#0F172A] dark:text-[#F8FAFC]">{org.name}</h3>
                          <span className={`inline-block mt-1 px-2.5 py-0.5 text-xs rounded-full font-semibold capitalize ${planColors[org.plan]}`}>{org.plan}</span>
                        </div>
                        <StatusPill status={org.paymentStatus === 'paid' ? 'paid' : 'overdue'} />
                      </div>
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between text-xs text-[#64748B] mb-1">
                            <span>Occupant Usage</span>
                            <span>{org.tenantCount} / {org.occupantLimit}</span>
                          </div>
                          <ProgressBar value={org.tenantCount} max={org.occupantLimit} variant={org.tenantCount / org.occupantLimit > 0.9 ? 'warning' : 'default'} />
                        </div>
                        <div>
                          <div className="flex justify-between text-xs text-[#64748B] mb-1">
                            <span>Users</span>
                            <span>{org.activeUsers} seats</span>
                          </div>
                        </div>
                        <div className="pt-2 border-t border-[#E6EEF5] dark:border-[#1E2D45] flex justify-between text-xs text-[#64748B]">
                          <span>Renewal</span>
                          <span className="font-medium">{new Date(org.renewalDate).toLocaleDateString('en-GB')}</span>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'audit' && (
            <div className="space-y-3">
              {[
                { action: 'Organisation created: Unity Housing Care', user: 'Alex Patel', time: '22 Jun 2026, 09:00', type: 'create' },
                { action: 'User invited: david.thornton@granvillehomes.org.uk', user: 'Sarah Johnson', time: '20 Jun 2026, 14:30', type: 'create' },
                { action: 'Plan upgraded: HavenPath Housing → Professional', user: 'Alex Patel', time: '15 Jun 2026, 11:00', type: 'update' },
                { action: 'Role changed: marcus.webb → Support Staff', user: 'Sarah Johnson', time: '10 Jun 2026, 10:15', type: 'update' },
                { action: '2FA enforced for organisation: Granville', user: 'Alex Patel', time: '1 Jun 2026, 08:00', type: 'security' },
              ].map((e, i) => (
                <div key={i} className="flex items-start gap-4 py-3 border-b border-[#E6EEF5] dark:border-[#1E2D45] last:border-0">
                  <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${e.type === 'create' ? 'bg-emerald-500' : e.type === 'security' ? 'bg-rose-500' : 'bg-amber-500'}`} />
                  <div className="flex-1">
                    <p className="text-sm text-[#334155] dark:text-[#CBD5E1]">{e.action}</p>
                    <p className="text-xs text-[#64748B] mt-0.5">{e.user} · {e.time}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
