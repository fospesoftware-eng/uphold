import { motion } from 'framer-motion';
import { Package, Clock, CheckCircle, QrCode } from 'lucide-react';
import { useTenantPortal } from '../context';
import { getTenantData } from '../data';

const STATUS_CONFIG = {
  pending_collection: { label: 'Ready to Collect', color: 'text-blue-600',    bg: 'bg-blue-100 dark:bg-blue-900/30' },
  collected:          { label: 'Collected',         color: 'text-emerald-600', bg: 'bg-emerald-100 dark:bg-emerald-900/30' },
  returned:           { label: 'Returned to Sender',color: 'text-rose-600',    bg: 'bg-rose-100 dark:bg-rose-900/30' },
};

const COURIER_COLORS: Record<string, string> = {
  'Royal Mail': 'from-red-400 to-rose-500',
  'DPD': 'from-orange-400 to-amber-500',
  'Evri': 'from-violet-400 to-purple-500',
  'Amazon': 'from-blue-400 to-indigo-500',
  'UPS': 'from-amber-600 to-yellow-600',
  'DHL': 'from-yellow-400 to-amber-400',
};

export function ParcelsPage() {
  const { tenantUser } = useTenantPortal();
  if (!tenantUser) return null;
  const { parcels } = getTenantData(tenantUser.id);

  const pending = parcels.filter(p => p.status === 'pending_collection');
  const collected = parcels.filter(p => p.status !== 'pending_collection');

  return (
    <div className="max-w-2xl mx-auto px-4 pt-6 pb-8 lg:max-w-none lg:px-6">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-xl font-bold text-[#0F172A] dark:text-white">Parcel Tracking</h1>
          <p className="text-sm text-[#64748B]">{pending.length} awaiting collection</p>
        </div>
        <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
          <Package size={20} className="text-blue-600" />
        </div>
      </div>

      {pending.length > 0 && (
        <section className="mb-6">
          <h2 className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wider mb-3">Awaiting Collection</h2>
          <div className="space-y-3">
            {pending.map(parcel => {
              const gradient = COURIER_COLORS[parcel.courier] ?? 'from-slate-400 to-slate-600';
              return (
                <motion.div key={parcel.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                  className="bg-white dark:bg-[#111827] border border-[#E6EEF5] dark:border-[#1E2D45] rounded-2xl overflow-hidden hover:shadow-md transition-all"
                >
                  <div className={`h-2 bg-gradient-to-r ${gradient}`} />
                  <div className="p-4">
                    <div className="flex items-start gap-3">
                      <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white text-2xl flex-shrink-0`}>
                        📦
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-[#0F172A] dark:text-white">{parcel.description}</p>
                        <p className="text-xs text-[#64748B] mt-0.5">{parcel.courier}{parcel.sender ? ` · From: ${parcel.sender}` : ''}</p>
                        <p className="text-[10px] text-[#94A3B8] font-mono mt-1">{parcel.trackingNumber}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${STATUS_CONFIG[parcel.status].bg} ${STATUS_CONFIG[parcel.status].color}`}>
                            {STATUS_CONFIG[parcel.status].label}
                          </span>
                          <span className="text-[10px] text-[#94A3B8]">
                            Received {new Date(parcel.receivedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Collection code */}
                    <div className="mt-4 flex items-center gap-3 p-3 rounded-xl bg-[#EFF6FF] dark:bg-[#1E2D45] border border-[#075DE8]/20">
                      <QrCode size={20} className="text-[#075DE8] flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-xs text-[#94A3B8]">Collection Code</p>
                        <p className="text-lg font-bold font-mono text-[#075DE8] tracking-widest">{parcel.collectionCode}</p>
                      </div>
                    </div>

                    <div className="mt-3 flex items-center gap-1.5 text-xs text-[#64748B]">
                      <Clock size={12} />
                      <span>{parcel.location} · Reception hours: Mon–Fri 8am–6pm</span>
                    </div>
                    {parcel.notes && (
                      <p className="text-xs text-[#94A3B8] mt-1.5">📝 {parcel.notes}</p>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>
      )}

      {collected.length > 0 && (
        <section>
          <h2 className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wider mb-3">Collected</h2>
          <div className="space-y-2">
            {collected.map(parcel => (
              <div key={parcel.id} className="flex items-center gap-3 p-3 bg-white dark:bg-[#111827] border border-[#E6EEF5] dark:border-[#1E2D45] rounded-xl opacity-70">
                <div className="w-9 h-9 rounded-xl bg-[#F8FAFC] dark:bg-[#1E2D45] flex items-center justify-center text-lg flex-shrink-0">
                  📦
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[#334155] dark:text-[#CBD5E1] truncate">{parcel.description}</p>
                  <p className="text-xs text-[#94A3B8]">{parcel.courier} · Collected {parcel.collectedAt ? new Date(parcel.collectedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) : '–'}</p>
                </div>
                <CheckCircle size={16} className="text-emerald-500 flex-shrink-0" />
              </div>
            ))}
          </div>
        </section>
      )}

      {parcels.length === 0 && (
        <div className="py-20 text-center">
          <div className="w-16 h-16 rounded-full bg-[#F8FAFC] dark:bg-[#1E2D45] flex items-center justify-center mx-auto mb-4 text-3xl">
            📭
          </div>
          <p className="text-sm font-semibold text-[#334155] dark:text-[#CBD5E1]">No parcels</p>
          <p className="text-xs text-[#94A3B8] mt-1">You'll be notified when a parcel arrives for you</p>
        </div>
      )}
    </div>
  );
}
