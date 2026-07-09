import { useState } from 'react';
import { motion } from 'framer-motion';
import { Building2, MapPin, Calendar, Key, Phone, Mail, ChevronDown, ChevronUp, Star } from 'lucide-react';
import { useTenantPortal } from '../context';
import { getTenantData } from '../data';

function Section({ title, children, defaultOpen = true }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="bg-white dark:bg-[#111827] border border-[#E6EEF5] dark:border-[#1E2D45] rounded-2xl overflow-hidden">
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-[#F8FAFC] dark:hover:bg-[#1E2D45] transition-colors"
      >
        <span className="text-sm font-semibold text-[#0F172A] dark:text-white">{title}</span>
        {open ? <ChevronUp size={16} className="text-[#64748B]" /> : <ChevronDown size={16} className="text-[#64748B]" />}
      </button>
      {open && <div className="px-5 pb-5 border-t border-[#E6EEF5] dark:border-[#1E2D45] pt-4">{children}</div>}
    </div>
  );
}

function InfoRow({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex items-start justify-between py-2.5 border-b border-[#F1F5F9] dark:border-[#1E2D45] last:border-0">
      <span className="text-xs text-[#64748B] font-medium">{label}</span>
      <span className={`text-xs font-semibold text-right max-w-[55%] ${highlight ? 'text-rose-600' : 'text-[#0F172A] dark:text-white'}`}>{value}</span>
    </div>
  );
}

export function PropertyPage() {
  const { tenantUser } = useTenantPortal();
  if (!tenantUser) return null;
  const { unit } = getTenantData(tenantUser.id);
  if (!unit) return null;

  const daysLeft = Math.ceil((new Date(unit.leaseEnd).getTime() - Date.now()) / (1000 * 60 * 60 * 24));

  return (
    <div className="max-w-2xl mx-auto px-4 pt-6 pb-8 lg:max-w-none lg:px-6 space-y-4">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0F172A] to-[#1E3A5F] p-5 text-white"
      >
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle at 70% 50%, #075DE8 0%, transparent 60%)' }} />
        <div className="relative">
          <div className="flex items-center gap-2 text-blue-300 text-xs font-medium mb-3">
            <MapPin size={13} />
            <span>{unit.propertyAddress}, {unit.city} {unit.postcode}</span>
          </div>
          <h1 className="text-2xl font-bold">{unit.propertyName}</h1>
          <p className="text-blue-200 text-sm mt-1">{unit.unitNumber} · {unit.building} · {unit.floor}</p>
          <div className="flex flex-wrap gap-2 mt-4">
            <span className="px-3 py-1.5 rounded-full bg-white/15 text-xs font-medium">{unit.bedrooms} Bedroom</span>
            <span className="px-3 py-1.5 rounded-full bg-white/15 text-xs font-medium">{unit.bathrooms} Bathroom</span>
            <span className="px-3 py-1.5 rounded-full bg-white/15 text-xs font-medium">{unit.areaSqft} sq ft</span>
            <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${
              daysLeft < 90 ? 'bg-amber-400/20 text-amber-300' : 'bg-emerald-400/20 text-emerald-300'
            }`}>
              {daysLeft > 0 ? `${daysLeft} days left on lease` : 'Lease expired'}
            </span>
          </div>
        </div>
      </motion.div>

      {/* Lease Details */}
      <Section title="Lease Details">
        <InfoRow label="Lease Start" value={new Date(unit.leaseStart).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })} />
        <InfoRow label="Lease End" value={new Date(unit.leaseEnd).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })} highlight={daysLeft < 90} />
        <InfoRow label="Move-in Date" value={new Date(unit.moveInDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })} />
        <InfoRow label="Monthly Rent" value={`£${unit.rentAmount.toFixed(2)}`} />
        <InfoRow label="Rent Due" value={`1st of each month`} />
        <InfoRow label="Security Deposit" value={`£${unit.deposit.toFixed(2)}`} />
        <InfoRow label="Outstanding Balance" value={unit.outstandingBalance > 0 ? `£${unit.outstandingBalance.toFixed(2)}` : '£0.00 – all clear'} highlight={unit.outstandingBalance > 0} />
        <InfoRow label="Lease Status" value={unit.leaseStatus === 'active' ? 'Active ✓' : unit.leaseStatus} />
      </Section>

      {/* Unit Details */}
      <Section title="Unit Details">
        <InfoRow label="Property" value={unit.propertyName} />
        <InfoRow label="Unit Number" value={unit.unitNumber} />
        <InfoRow label="Building" value={unit.building} />
        <InfoRow label="Floor" value={unit.floor} />
        <InfoRow label="Bedrooms" value={`${unit.bedrooms}`} />
        <InfoRow label="Bathrooms" value={`${unit.bathrooms}`} />
        <InfoRow label="Area" value={`${unit.areaSqft} sq ft`} />
        <InfoRow label="Parking" value={unit.parking} />
        <InfoRow label="Storage Locker" value={unit.storage} />
      </Section>

      {/* Amenities */}
      <Section title="Included Amenities">
        <div className="flex flex-wrap gap-2">
          {unit.amenities.map(a => (
            <span key={a} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#EFF6FF] dark:bg-[#1E2D45] text-[#075DE8] text-xs font-medium">
              <Star size={11} className="fill-current" />
              {a}
            </span>
          ))}
        </div>
      </Section>

      {/* Room Features */}
      <Section title="Room Features" defaultOpen={false}>
        <div className="grid grid-cols-2 gap-2">
          {unit.features.map(f => (
            <div key={f} className="flex items-center gap-2 text-xs text-[#334155] dark:text-[#CBD5E1]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#075DE8] flex-shrink-0" />
              {f}
            </div>
          ))}
        </div>
      </Section>

      {/* Property Manager */}
      <Section title="Property Manager">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
            SM
          </div>
          <div>
            <p className="text-sm font-semibold text-[#0F172A] dark:text-white">{unit.managerName}</p>
            <p className="text-xs text-[#64748B]">Property Manager</p>
          </div>
        </div>
        <div className="space-y-2">
          <a href={`tel:${unit.managerPhone}`} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#F8FAFC] dark:bg-[#1E2D45] hover:bg-[#EFF6FF] dark:hover:bg-[#253557] transition-colors">
            <Phone size={15} className="text-[#075DE8]" />
            <span className="text-sm text-[#334155] dark:text-[#CBD5E1]">{unit.managerPhone}</span>
          </a>
          <a href={`mailto:${unit.managerEmail}`} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#F8FAFC] dark:bg-[#1E2D45] hover:bg-[#EFF6FF] dark:hover:bg-[#253557] transition-colors">
            <Mail size={15} className="text-[#075DE8]" />
            <span className="text-sm text-[#334155] dark:text-[#CBD5E1] truncate">{unit.managerEmail}</span>
          </a>
        </div>
      </Section>

      {/* Landlord */}
      <Section title="Landlord" defaultOpen={false}>
        <InfoRow label="Name" value={unit.landlordName} />
        <InfoRow label="Phone" value={unit.landlordPhone} />
        <InfoRow label="Email" value={unit.landlordEmail} />
      </Section>

      {/* Emergency */}
      <div className="bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800/50 rounded-2xl p-4">
        <div className="flex items-center gap-2 mb-2">
          <Key size={16} className="text-rose-600" />
          <p className="text-sm font-semibold text-rose-700 dark:text-rose-400">Emergency Contact</p>
        </div>
        <a href={`tel:${unit.emergencyPhone}`} className="text-lg font-bold text-rose-600">
          {unit.emergencyPhone}
        </a>
        <p className="text-xs text-rose-500 mt-1">Available 24/7 for urgent property emergencies</p>
      </div>
    </div>
  );
}
