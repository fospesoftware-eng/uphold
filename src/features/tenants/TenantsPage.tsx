import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { UserPlus, ChevronRight, Phone, Mail } from 'lucide-react';
import {
  Card, PageHeader, FilterBar, StatusPill, Avatar, Button, Badge, DataTable, EmptyState
} from '../../components/ui';
import { tenantService } from '../../services';
import { users, properties } from '../../data/mockData';
import type { Tenant } from '../../types';

const statusFilters = ['all', 'active', 'at_risk', 'pending', 'moved_on'];

export function TenantsPage() {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selected, setSelected] = useState<string[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    tenantService.getAll('org-1').then(t => { setTenants(t); setLoading(false); });
  }, []);

  const getProperty = (id: string) => properties.find(p => p.id === id);
  const getKeyWorker = (id: string) => users.find(u => u.id === id);

  const filtered = tenants.filter(t => {
    const name = `${t.firstName} ${t.lastName}`.toLowerCase();
    const matchSearch = !search || name.includes(search.toLowerCase()) || t.email.includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || t.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const supportBadge = (t: Tenant) => {
    const pct = (t.supportHoursWeek / t.supportHoursRequired) * 100;
    if (pct < 50) return <Badge variant="danger">{t.supportHoursWeek}h / {t.supportHoursRequired}h</Badge>;
    if (pct < 100) return <Badge variant="warning">{t.supportHoursWeek}h / {t.supportHoursRequired}h</Badge>;
    return <Badge variant="success">{t.supportHoursWeek}h / {t.supportHoursRequired}h</Badge>;
  };

  const docsBadge = () => {
    // simplified: random for demo
    return <Badge variant="success">5/7</Badge>;
  };

  return (
    <div className="max-w-[1400px] mx-auto">
      <PageHeader
        title="Tenants"
        subtitle={`${filtered.length} of ${tenants.length} tenants`}
        actions={
          <Button leftIcon={<UserPlus size={16} />}>
            Add Tenant
          </Button>
        }
      />

      <Card padding="none">
        <div className="p-4 border-b border-[#E6EEF5] dark:border-[#1E2D45]">
          <FilterBar
            search={search}
            onSearch={setSearch}
            placeholder="Search tenants, email, property…"
            filters={
              <div className="flex items-center gap-1 flex-wrap">
                {statusFilters.map(s => (
                  <button
                    key={s}
                    onClick={() => setStatusFilter(s)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      statusFilter === s
                        ? 'bg-uphold-gradient text-white shadow-[0_2px_8px_rgba(7,93,232,.25)]'
                        : 'bg-[#F8FAFC] dark:bg-[#1E2D45] text-[#64748B] hover:text-[#334155]'
                    }`}
                  >
                    {s === 'all' ? 'All' : s.replace('_', ' ').replace(/^\w/, c => c.toUpperCase())}
                  </button>
                ))}
              </div>
            }
          />
        </div>

        <DataTable
          loading={loading}
          data={filtered}
          keyExtractor={t => t.id}
          selectable
          selected={selected}
          onSelect={setSelected}
          onRowClick={t => navigate(`/tenants/${t.id}`)}
          emptyState={
            <EmptyState
              title="No tenants found"
              description="Try adjusting your search or filters"
              className="py-12"
            />
          }
          columns={[
            {
              key: 'name',
              header: 'Tenant',
              render: t => (
                <div className="flex items-center gap-3">
                  <Avatar name={`${t.firstName} ${t.lastName}`} size="sm" />
                  <div>
                    <p className="font-medium text-[#0F172A] dark:text-[#F8FAFC]">{t.firstName} {t.lastName}</p>
                    <p className="text-xs text-[#64748B]">{t.email}</p>
                  </div>
                </div>
              ),
            },
            {
              key: 'status',
              header: 'Status',
              render: t => <StatusPill status={t.status} />,
            },
            {
              key: 'property',
              header: 'Property',
              render: t => {
                const prop = getProperty(t.propertyId);
                return (
                  <div>
                    <p className="text-sm text-[#334155] dark:text-[#CBD5E1]">{prop?.address}</p>
                    <p className="text-xs text-[#64748B]">Room {t.roomNumber}</p>
                  </div>
                );
              },
            },
            {
              key: 'keyWorker',
              header: 'Key Worker',
              render: t => {
                const kw = getKeyWorker(t.keyWorkerId);
                return kw ? (
                  <div className="flex items-center gap-2">
                    <Avatar name={kw.name} size="xs" />
                    <span className="text-sm text-[#334155] dark:text-[#CBD5E1]">{kw.name.split(' ')[0]}</span>
                  </div>
                ) : <span className="text-[#64748B]">—</span>;
              },
            },
            {
              key: 'supportHours',
              header: 'Support Hours',
              render: t => supportBadge(t),
            },
            {
              key: 'docs',
              header: 'Documents',
              render: () => docsBadge(),
            },
            {
              key: 'rentBalance',
              header: 'Rent Status',
              render: t => (
                <StatusPill status={t.rentBalance < 0 ? 'overdue' : 'paid'} />
              ),
            },
            {
              key: 'lastContactDate',
              header: 'Last Contact',
              render: t => (
                <span className="text-sm text-[#64748B]">
                  {new Date(t.lastContactDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                </span>
              ),
            },
            {
              key: 'actions',
              header: '',
              render: t => (
                <button
                  className="p-1.5 rounded-lg hover:bg-[#F8FAFC] dark:hover:bg-[#1E2D45] text-[#64748B] transition-colors"
                  onClick={e => { e.stopPropagation(); navigate(`/tenants/${t.id}`); }}
                >
                  <ChevronRight size={16} />
                </button>
              ),
            },
          ]}
        />

        {/* Pagination stub */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-[#E6EEF5] dark:border-[#1E2D45]">
          <p className="text-xs text-[#64748B]">Showing {filtered.length} results</p>
          <div className="flex items-center gap-1">
            {[1].map(p => (
              <button key={p} className="w-8 h-8 rounded-lg text-xs bg-uphold-gradient text-white font-semibold">{p}</button>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}
