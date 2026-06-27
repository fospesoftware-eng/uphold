import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { DollarSign, TrendingDown, AlertTriangle, CheckCircle } from 'lucide-react';
import {
  Card, PageHeader, Tabs, StatusPill, Avatar, StatCard, DataTable,
  EmptyState, ProgressBar, FilterBar, Badge
} from '../../components/ui';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartTooltip,
  ResponsiveContainer
} from 'recharts';
import { financialService } from '../../services';
import { tenants, properties, rentCollectionTrend } from '../../data/mockData';
import type { Invoice, Transaction } from '../../types';

export function FinancialsPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('invoices');
  const [search, setSearch] = useState('');

  useEffect(() => {
    Promise.all([
      financialService.getAllInvoices('org-1'),
      financialService.getAllTransactions('org-1'),
    ]).then(([inv, tx]) => { setInvoices(inv); setTransactions(tx); setLoading(false); });
  }, []);

  const getTenant = (id: string) => tenants.find(t => t.id === id);
  const getProperty = (id: string) => properties.find(p => p.id === id);

  const totalCollected = invoices.filter(i => i.status === 'paid').reduce((s, i) => s + i.amount, 0);
  const totalExpected = invoices.reduce((s, i) => s + i.amount, 0);
  const totalOverdue = invoices.filter(i => i.status === 'overdue').reduce((s, i) => s + i.amount, 0);
  const arrearsTenants = tenants.filter(t => t.rentBalance < 0);

  const filteredInvoices = invoices.filter(inv => {
    if (!search) return true;
    const t = getTenant(inv.tenantId);
    return t ? `${t.firstName} ${t.lastName}`.toLowerCase().includes(search.toLowerCase()) : false;
  });

  const tabs = [
    { id: 'invoices', label: 'Invoices', count: invoices.length },
    { id: 'transactions', label: 'Transactions', count: transactions.length },
    { id: 'arrears', label: 'Arrears', count: arrearsTenants.length },
  ];

  return (
    <div className="max-w-[1400px] mx-auto">
      <PageHeader title="Financials" subtitle="Rent collection, invoices, and payment history" />

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard title="Collected (June)" value={`£${totalCollected.toLocaleString()}`} subtitle={`${Math.round((totalCollected / totalExpected) * 100)}% collection rate`} icon={<CheckCircle size={22} />} variant="success" />
        <StatCard title="Expected (June)" value={`£${totalExpected.toLocaleString()}`} subtitle="total rent due" icon={<DollarSign size={22} />} />
        <StatCard title="Overdue Amounts" value={`£${totalOverdue.toLocaleString()}`} subtitle={`${invoices.filter(i => i.status === 'overdue').length} overdue invoices`} icon={<AlertTriangle size={22} />} variant={totalOverdue > 0 ? 'danger' : 'success'} />
        <StatCard title="Tenants in Arrears" value={arrearsTenants.length} subtitle={`£${Math.abs(arrearsTenants.reduce((s, t) => s + t.rentBalance, 0)).toLocaleString()} total arrears`} icon={<TrendingDown size={22} />} variant={arrearsTenants.length > 0 ? 'warning' : 'success'} />
      </div>

      {/* Chart */}
      <Card className="mb-6">
        <h3 className="font-semibold font-display text-[#0F172A] dark:text-[#F8FAFC] mb-4">Rent Collection Trend — 2026</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={rentCollectionTrend} margin={{ top: 4, right: 4, bottom: 0, left: -10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E6EEF5" vertical={false} />
            <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#64748B' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 10, fill: '#64748B' }} axisLine={false} tickLine={false} tickFormatter={v => `£${(v/1000).toFixed(0)}k`} />
            <RechartTooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} formatter={(v: unknown) => [`£${(v as number).toLocaleString()}`, '']} />
            <Bar dataKey="expected" fill="#E6EEF5" radius={[4, 4, 0, 0]} name="Expected" />
            <Bar dataKey="collected" fill="#075DE8" radius={[4, 4, 0, 0]} name="Collected" />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <Card padding="none">
        <div className="p-4 border-b border-[#E6EEF5] dark:border-[#1E2D45]">
          <Tabs tabs={tabs} active={activeTab} onChange={setActiveTab} />
        </div>
        <div className="p-4">
          {activeTab === 'invoices' && (
            <>
              <FilterBar search={search} onSearch={setSearch} placeholder="Search by tenant…" />
              <DataTable
                loading={loading}
                data={filteredInvoices}
                keyExtractor={i => i.id}
                emptyState={<EmptyState title="No invoices" className="py-8" />}
                columns={[
                  { key: 'invoiceNumber', header: 'Invoice #', render: i => <span className="font-mono text-xs font-semibold">{i.invoiceNumber}</span> },
                  {
                    key: 'tenant',
                    header: 'Tenant',
                    render: i => {
                      const t = getTenant(i.tenantId);
                      return t ? (
                        <div className="flex items-center gap-2">
                          <Avatar name={`${t.firstName} ${t.lastName}`} size="xs" />
                          <span className="text-sm">{t.firstName} {t.lastName}</span>
                        </div>
                      ) : <span>—</span>;
                    },
                  },
                  { key: 'period', header: 'Period' },
                  { key: 'amount', header: 'Amount', render: i => <span className="font-semibold">£{i.amount}</span> },
                  { key: 'dueDate', header: 'Due Date', render: i => new Date(i.dueDate).toLocaleDateString('en-GB') },
                  { key: 'status', header: 'Status', render: i => <StatusPill status={i.status} /> },
                  { key: 'paymentMethod', header: 'Method', render: i => <span className="text-xs capitalize">{i.paymentMethod.replace(/_/g, ' ')}</span> },
                ]}
              />
            </>
          )}

          {activeTab === 'transactions' && (
            <DataTable
              loading={loading}
              data={transactions}
              keyExtractor={t => t.id}
              emptyState={<EmptyState title="No transactions" className="py-8" />}
              columns={[
                { key: 'date', header: 'Date', render: t => new Date(t.date).toLocaleDateString('en-GB') },
                {
                  key: 'tenant',
                  header: 'Tenant',
                  render: tx => {
                    const t = getTenant(tx.tenantId);
                    return t ? `${t.firstName} ${t.lastName}` : '—';
                  },
                },
                { key: 'type', header: 'Type', render: t => <Badge variant="default" className="capitalize">{t.type}</Badge> },
                { key: 'amount', header: 'Amount', render: t => <span className="font-semibold text-emerald-600">£{t.amount}</span> },
                { key: 'method', header: 'Method', render: t => <span className="text-xs capitalize">{t.method.replace(/_/g, ' ')}</span> },
                { key: 'reference', header: 'Reference', render: t => <span className="font-mono text-xs">{t.reference}</span> },
                { key: 'status', header: 'Status', render: t => <StatusPill status={t.status} /> },
              ]}
            />
          )}

          {activeTab === 'arrears' && (
            <div className="space-y-3 pt-2">
              {arrearsTenants.length === 0 ? (
                <EmptyState title="No arrears" description="All tenants are up to date." className="py-8" />
              ) : (
                arrearsTenants.map((t, i) => (
                  <motion.div
                    key={t.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-center gap-4 p-4 rounded-xl border border-rose-200 dark:border-rose-900/30 bg-rose-50 dark:bg-rose-900/10"
                  >
                    <Avatar name={`${t.firstName} ${t.lastName}`} size="sm" />
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-[#0F172A] dark:text-[#F8FAFC]">{t.firstName} {t.lastName}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <StatusPill status={t.housingBenefitStatus === 'confirmed' ? 'confirmed' : 'pending'} />
                        <span className="text-xs text-[#64748B]">£{t.rentAmount}/wk</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-base font-bold text-rose-600">-£{Math.abs(t.rentBalance)}</p>
                      <p className="text-xs text-[#64748B]">arrears</p>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
