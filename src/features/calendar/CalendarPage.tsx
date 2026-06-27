import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  CalendarDays, ClipboardList, Building2, ShieldAlert, HeartHandshake,
} from 'lucide-react';
import { Card, PageHeader, Badge } from '../../components/ui';
import { tenants, properties, certificates, starAssessments } from '../../data/mockData';

type EventType = 'review' | 'assessment' | 'inspection' | 'certificate';

interface AgendaEvent {
  id: string;
  date: string;
  type: EventType;
  title: string;
  detail: string;
}

const typeMeta: Record<EventType, { label: string; icon: React.ReactNode; color: string; dot: string }> = {
  review: { label: 'Support Review', icon: <HeartHandshake size={14} />, color: 'text-[#075DE8]', dot: 'bg-[#075DE8]' },
  assessment: { label: 'STAR Assessment', icon: <ClipboardList size={14} />, color: 'text-[#15C6B8]', dot: 'bg-[#15C6B8]' },
  inspection: { label: 'Property Inspection', icon: <Building2 size={14} />, color: 'text-purple-500', dot: 'bg-purple-500' },
  certificate: { label: 'Certificate Renewal', icon: <ShieldAlert size={14} />, color: 'text-amber-500', dot: 'bg-amber-500' },
};

const certLabels: Record<string, string> = {
  gas_safety: 'Gas Safety', fire_safety: 'Fire Safety', electrical_eicr: 'Electrical (EICR)',
  buildings_insurance: 'Buildings Insurance', hmo_licence: 'HMO Licence', epc: 'EPC',
  pat_testing: 'PAT Testing', legionella: 'Legionella',
};

export function CalendarPage() {
  const [filter, setFilter] = useState<EventType | 'all'>('all');

  const events = useMemo<AgendaEvent[]>(() => {
    const out: AgendaEvent[] = [];
    const propName = (id: string) => {
      const p = properties.find(p => p.id === id);
      return p ? `${p.address}, ${p.city}` : 'Property';
    };

    tenants.filter(t => t.status !== 'moved_on' && t.nextReviewDate).forEach(t => {
      out.push({ id: `rev-${t.id}`, date: t.nextReviewDate, type: 'review',
        title: `${t.firstName} ${t.lastName} — support review`, detail: `${t.supportLevel} support · room ${t.roomNumber}` });
    });
    starAssessments.filter(a => a.status !== 'completed').forEach(a => {
      const t = tenants.find(t => t.id === a.tenantId);
      out.push({ id: `star-${a.id}`, date: a.scheduledDate, type: 'assessment',
        title: `STAR assessment — ${t ? `${t.firstName} ${t.lastName}` : 'tenant'}`, detail: a.status === 'overdue' ? 'Overdue' : 'Scheduled' });
    });
    properties.filter(p => p.nextInspectionDate).forEach(p => {
      out.push({ id: `insp-${p.id}`, date: p.nextInspectionDate, type: 'inspection',
        title: `Inspection — ${p.address}`, detail: `${p.city} · ${p.occupiedRooms}/${p.totalRooms} occupied` });
    });
    certificates.filter(c => c.status !== 'missing').forEach(c => {
      out.push({ id: `cert-${c.id}`, date: c.expiryDate, type: 'certificate',
        title: `${certLabels[c.type] ?? c.type} renewal`, detail: propName(c.propertyId) });
    });

    return out.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, []);

  const filtered = filter === 'all' ? events : events.filter(e => e.type === filter);

  const grouped = useMemo(() => {
    const map = new Map<string, AgendaEvent[]>();
    filtered.forEach(e => {
      const key = new Date(e.date).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(e);
    });
    return Array.from(map.entries());
  }, [filtered]);

  const today = new Date(); today.setHours(0, 0, 0, 0);
  const counts = (Object.keys(typeMeta) as EventType[]).map(t => ({ type: t, count: events.filter(e => e.type === t).length }));

  return (
    <div className="max-w-[1100px] mx-auto">
      <PageHeader
        title="Calendar"
        subtitle="Upcoming reviews, assessments, inspections and renewals"
        actions={<Badge variant="info"><CalendarDays size={13} /> {events.length} scheduled</Badge>}
      />

      {/* Filter chips */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
            filter === 'all' ? 'bg-uphold-gradient text-white border-transparent' : 'border-[#E6EEF5] dark:border-[#1E2D45] text-[#64748B] hover:text-[#334155]'
          }`}
        >
          All ({events.length})
        </button>
        {counts.map(({ type, count }) => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
              filter === type ? 'bg-uphold-gradient text-white border-transparent' : 'border-[#E6EEF5] dark:border-[#1E2D45] text-[#64748B] hover:text-[#334155]'
            }`}
          >
            {typeMeta[type].icon} {typeMeta[type].label} ({count})
          </button>
        ))}
      </div>

      {/* Agenda */}
      <div className="space-y-6">
        {grouped.map(([day, dayEvents], gi) => {
          const dayDate = new Date(dayEvents[0].date); dayDate.setHours(0, 0, 0, 0);
          const isPast = dayDate < today;
          const isToday = dayDate.getTime() === today.getTime();
          return (
            <motion.div
              key={day}
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: gi * 0.04 }}
            >
              <div className="flex items-center gap-2 mb-3">
                <h3 className={`text-sm font-semibold font-display ${isPast ? 'text-[#94A3B8]' : 'text-[#0F172A] dark:text-[#F8FAFC]'}`}>{day}</h3>
                {isToday && <Badge variant="success">Today</Badge>}
                {isPast && <Badge variant="danger">Overdue</Badge>}
              </div>
              <Card padding="none">
                {dayEvents.map((e, i) => (
                  <div
                    key={e.id}
                    className={`flex items-center gap-3 px-5 py-3.5 ${i < dayEvents.length - 1 ? 'border-b border-[#E6EEF5] dark:border-[#1E2D45]' : ''}`}
                  >
                    <span className={`w-2 h-2 rounded-full flex-shrink-0 ${typeMeta[e.type].dot}`} />
                    <span className={`flex-shrink-0 ${typeMeta[e.type].color}`}>{typeMeta[e.type].icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[#0F172A] dark:text-[#F8FAFC] truncate">{e.title}</p>
                      <p className="text-xs text-[#64748B] truncate">{e.detail}</p>
                    </div>
                    <Badge variant="muted" className="hidden sm:inline-flex">{typeMeta[e.type].label}</Badge>
                  </div>
                ))}
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
