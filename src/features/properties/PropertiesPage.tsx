import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Building2, Plus, MapPin, Users, ShieldCheck, ShieldAlert, ShieldX } from 'lucide-react';
import { Card, PageHeader, FilterBar, StatusPill, Badge, Button, ProgressBar, EmptyState } from '../../components/ui';
import { propertyService } from '../../services';
import { certificates, rooms, tenants } from '../../data/mockData';
import type { Property, Certificate } from '../../types';

const CERT_LABELS: Record<string, string> = {
  gas_safety: 'Gas Safety',
  fire_safety: 'Fire Safety',
  electrical_eicr: 'EICR',
  buildings_insurance: 'Insurance',
  hmo_licence: 'HMO Licence',
  epc: 'EPC',
  pat_testing: 'PAT Testing',
  legionella: 'Legionella',
};

function CertBadge({ cert }: { cert: Certificate | undefined }) {
  if (!cert) return <span className="w-3 h-3 rounded-full bg-rose-200 flex-shrink-0" title="Missing" />;
  const colors = { valid: 'bg-emerald-400', expiring_soon: 'bg-amber-400', expired: 'bg-rose-400', missing: 'bg-rose-200' };
  return <span className={`w-3 h-3 rounded-full ${colors[cert.status]} flex-shrink-0`} title={cert.status.replace('_', ' ')} />;
}

export function PropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [view, setView] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    propertyService.getAll('org-1').then(p => { setProperties(p); setLoading(false); });
  }, []);

  const filtered = properties.filter(p =>
    !search || `${p.address} ${p.city} ${p.postcode}`.toLowerCase().includes(search.toLowerCase())
  );

  const getCerts = (propId: string) => certificates.filter(c => c.propertyId === propId);
  const getTenants = (propId: string) => tenants.filter(t => t.propertyId === propId);

  const complianceScore = (propId: string) => {
    const certs = getCerts(propId);
    if (!certs.length) return 0;
    return Math.round((certs.filter(c => c.status === 'valid').length / certs.length) * 100);
  };

  const complianceIcon = (score: number) => {
    if (score >= 90) return <ShieldCheck size={16} className="text-emerald-500" />;
    if (score >= 60) return <ShieldAlert size={16} className="text-amber-500" />;
    return <ShieldX size={16} className="text-rose-500" />;
  };

  return (
    <div className="max-w-[1400px] mx-auto">
      <PageHeader
        title="Properties"
        subtitle={`${filtered.length} properties`}
        actions={<Button leftIcon={<Plus size={16} />}>Add Property</Button>}
      />

      <FilterBar
        search={search}
        onSearch={setSearch}
        placeholder="Search by address, city, postcode…"
        actions={
          <div className="flex items-center gap-1">
            {(['grid', 'list'] as const).map(v => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${view === v ? 'bg-uphold-gradient text-white' : 'bg-[#F8FAFC] dark:bg-[#1E2D45] text-[#64748B]'}`}
              >
                {v === 'grid' ? '⊞ Grid' : '☰ List'}
              </button>
            ))}
          </div>
        }
      />

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[...Array(6)].map((_, i) => <div key={i} className="h-64 skeleton rounded-xl" />)}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState icon={<Building2 size={28} />} title="No properties found" description="Try adjusting your search." />
      ) : (
        <div className={view === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5' : 'space-y-3'}>
          {filtered.map((prop, i) => {
            const certs = getCerts(prop.id);
            const propTenants = getTenants(prop.id);
            const score = complianceScore(prop.id);
            const certTypes = ['gas_safety', 'fire_safety', 'electrical_eicr', 'buildings_insurance', 'hmo_licence', 'epc', 'pat_testing', 'legionella'];

            return (
              <motion.div
                key={prop.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
              >
                <Card hover className="h-full cursor-pointer">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-uphold-gradient-subtle flex items-center justify-center text-[#075DE8]">
                        <Building2 size={20} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-[#0F172A] dark:text-[#F8FAFC] text-sm">{prop.address}</h3>
                        <p className="text-xs text-[#64748B]">{prop.city} · {prop.postcode}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      {complianceIcon(score)}
                    </div>
                  </div>

                  {/* Occupancy */}
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-[#64748B]">Occupancy</span>
                    <span className="text-xs font-semibold text-[#334155] dark:text-[#CBD5E1]">
                      {prop.occupiedRooms}/{prop.totalRooms} rooms
                    </span>
                  </div>
                  <ProgressBar
                    value={prop.occupiedRooms}
                    max={prop.totalRooms}
                    className="mb-4"
                    variant={prop.occupiedRooms / prop.totalRooms > 0.8 ? 'success' : 'warning'}
                  />

                  {/* Cert dots */}
                  <div className="mb-4">
                    <p className="text-[10px] text-[#94A3B8] uppercase font-semibold tracking-wide mb-2">Certificates</p>
                    <div className="flex flex-wrap gap-2">
                      {certTypes.slice(0, 6).map(ct => {
                        const cert = certs.find(c => c.type === ct);
                        return (
                          <div key={ct} className="flex items-center gap-1.5">
                            <CertBadge cert={cert} />
                            <span className="text-[10px] text-[#64748B]">{CERT_LABELS[ct]}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center justify-between pt-3 border-t border-[#E6EEF5] dark:border-[#1E2D45]">
                    <div className="flex items-center gap-1.5 text-xs text-[#64748B]">
                      <Users size={13} />
                      {propTenants.length} tenants
                    </div>
                    <Badge variant={score >= 90 ? 'success' : score >= 60 ? 'warning' : 'danger'}>
                      {score}% compliant
                    </Badge>
                    <span className="text-xs text-[#64748B] capitalize">{prop.type.replace(/_/g, ' ')}</span>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
