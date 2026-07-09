import { useState } from 'react';
import { motion } from 'framer-motion';
import { Package, AlertTriangle, Clock, CheckCircle, Search, ChevronRight, QrCode } from 'lucide-react';
import { useTenantPortal } from '../context';
import { getTenantData } from '../data';
import type { PortalAsset } from '../types';

const CONDITION_CONFIG = {
  excellent: { label: 'Excellent', color: 'text-emerald-600', bg: 'bg-emerald-100 dark:bg-emerald-900/30' },
  good:      { label: 'Good',      color: 'text-blue-600',    bg: 'bg-blue-100 dark:bg-blue-900/30' },
  fair:      { label: 'Fair',      color: 'text-amber-600',   bg: 'bg-amber-100 dark:bg-amber-900/30' },
  poor:      { label: 'Poor',      color: 'text-rose-600',    bg: 'bg-rose-100 dark:bg-rose-900/30' },
};

const STATUS_CONFIG = {
  working:        { label: 'Working',       color: 'text-emerald-600', bg: 'bg-emerald-100 dark:bg-emerald-900/30' },
  needs_service:  { label: 'Service Due',   color: 'text-amber-600',   bg: 'bg-amber-100 dark:bg-amber-900/30' },
  reported_issue: { label: 'Issue Reported',color: 'text-rose-600',    bg: 'bg-rose-100 dark:bg-rose-900/30' },
  out_of_service: { label: 'Out of Service',color: 'text-slate-500',   bg: 'bg-slate-100 dark:bg-slate-800/50' },
};

const CATEGORY_COLORS: Record<string, string> = {
  'Furniture': 'from-amber-400 to-orange-500',
  'Electronics': 'from-blue-400 to-indigo-500',
  'Networking': 'from-violet-400 to-purple-500',
  'Care Equipment': 'from-emerald-400 to-teal-500',
  'Safety': 'from-rose-400 to-red-500',
  'Kitchen Appliances': 'from-orange-400 to-amber-500',
};

function AssetDetailSheet({ asset, onClose }: { asset: PortalAsset; onClose: () => void }) {
  const statusCfg = STATUS_CONFIG[asset.status];
  const condCfg = CONDITION_CONFIG[asset.condition];
  const gradient = CATEGORY_COLORS[asset.category] ?? 'from-slate-400 to-slate-600';

  return (
    <>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        className="fixed inset-x-0 bottom-0 z-50 bg-white dark:bg-[#111827] rounded-t-3xl max-h-[88vh] overflow-y-auto"
      >
        <div className={`h-32 bg-gradient-to-br ${gradient} flex items-center justify-center rounded-t-3xl`}>
          <Package size={48} className="text-white/80" />
        </div>
        <div className="px-5 py-4 space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-lg font-bold text-[#0F172A] dark:text-white">{asset.name}</h2>
              <p className="text-xs text-[#64748B]">{asset.assetCode} · {asset.category}</p>
            </div>
            <div className="flex flex-col items-end gap-1">
              <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${statusCfg.bg} ${statusCfg.color}`}>{statusCfg.label}</span>
              <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${condCfg.bg} ${condCfg.color}`}>{condCfg.label}</span>
            </div>
          </div>

          <p className="text-sm text-[#64748B]">{asset.description}</p>

          <div className="grid grid-cols-2 gap-3">
            {[
              asset.manufacturer && { label: 'Manufacturer', value: asset.manufacturer },
              asset.model && { label: 'Model', value: asset.model },
              asset.serialNumber && { label: 'Serial No.', value: asset.serialNumber },
              asset.installationDate && { label: 'Installed', value: new Date(asset.installationDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) },
              asset.warrantyExpiry && { label: 'Warranty Until', value: new Date(asset.warrantyExpiry).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) },
              asset.lastService && { label: 'Last Service', value: new Date(asset.lastService).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) },
              asset.nextService && { label: 'Next Service', value: new Date(asset.nextService).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) },
            ].filter(Boolean).map(item => item && (
              <div key={item.label} className="p-3 rounded-xl bg-[#F8FAFC] dark:bg-[#1E2D45]">
                <p className="text-[10px] text-[#94A3B8] mb-1">{item.label}</p>
                <p className="text-xs font-semibold text-[#334155] dark:text-[#CBD5E1]">{item.value}</p>
              </div>
            ))}
          </div>

          {/* QR code placeholder */}
          <div className="flex items-center gap-3 p-4 rounded-2xl border border-dashed border-[#E6EEF5] dark:border-[#1E2D45]">
            <div className="w-16 h-16 bg-[#F8FAFC] dark:bg-[#1E2D45] rounded-xl flex items-center justify-center flex-shrink-0">
              <QrCode size={32} className="text-[#94A3B8]" />
            </div>
            <div>
              <p className="text-sm font-semibold text-[#334155] dark:text-[#CBD5E1]">Asset QR Code</p>
              <p className="text-xs text-[#94A3B8]">{asset.qrCode}</p>
              <button className="text-xs font-medium text-[#075DE8] mt-1">View QR Code</button>
            </div>
          </div>

          <button className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl border-2 border-rose-200 dark:border-rose-800/50 text-rose-600 font-semibold text-sm hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors">
            <AlertTriangle size={16} />
            Report a Problem
          </button>
          <button onClick={onClose} className="w-full py-3 rounded-2xl border border-[#E6EEF5] dark:border-[#1E2D45] text-sm font-medium text-[#64748B]">
            Close
          </button>
        </div>
      </motion.div>
    </>
  );
}

export function AssetsPage() {
  const { tenantUser } = useTenantPortal();
  const [search, setSearch] = useState('');
  const [selectedAsset, setSelectedAsset] = useState<PortalAsset | null>(null);

  if (!tenantUser) return null;
  const { assets } = getTenantData(tenantUser.id);

  const filtered = assets.filter(a =>
    a.name.toLowerCase().includes(search.toLowerCase()) ||
    a.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-2xl mx-auto px-4 pt-6 pb-8 lg:max-w-none lg:px-6">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-xl font-bold text-[#0F172A] dark:text-white">My Assets</h1>
          <p className="text-sm text-[#64748B]">{assets.length} items assigned to you</p>
        </div>
      </div>

      <div className="relative mb-5">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
        <input
          value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search assets..."
          className="w-full pl-10 pr-4 py-3 rounded-2xl border border-[#E6EEF5] dark:border-[#1E2D45] bg-white dark:bg-[#111827] text-[#0F172A] dark:text-white text-sm placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#075DE8]"
        />
      </div>

      {/* Summary badges */}
      <div className="flex gap-2 mb-5 flex-wrap">
        {Object.entries(
          assets.reduce((acc, a) => { acc[a.category] = (acc[a.category] ?? 0) + 1; return acc; }, {} as Record<string, number>)
        ).map(([cat, count]) => (
          <span key={cat} className="px-3 py-1.5 rounded-full bg-white dark:bg-[#111827] border border-[#E6EEF5] dark:border-[#1E2D45] text-xs font-medium text-[#334155] dark:text-[#CBD5E1]">
            {cat} · {count}
          </span>
        ))}
      </div>

      <div className="space-y-2.5">
        {filtered.map(asset => {
          const statusCfg = STATUS_CONFIG[asset.status];
          const condCfg = CONDITION_CONFIG[asset.condition];
          const gradient = CATEGORY_COLORS[asset.category] ?? 'from-slate-400 to-slate-600';
          return (
            <motion.button
              key={asset.id}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedAsset(asset)}
              className="w-full flex items-center gap-3 p-4 bg-white dark:bg-[#111827] border border-[#E6EEF5] dark:border-[#1E2D45] rounded-2xl text-left hover:shadow-md transition-all"
            >
              <div className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center flex-shrink-0`}>
                <Package size={20} className="text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[#0F172A] dark:text-white truncate">{asset.name}</p>
                <p className="text-xs text-[#64748B] truncate">{asset.category}{asset.model ? ` · ${asset.model}` : ''}</p>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${statusCfg.bg} ${statusCfg.color}`}>
                    {statusCfg.label}
                  </span>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${condCfg.bg} ${condCfg.color}`}>
                    {condCfg.label}
                  </span>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2 flex-shrink-0">
                {asset.status === 'needs_service' && <AlertTriangle size={16} className="text-amber-500" />}
                <ChevronRight size={16} className="text-[#94A3B8]" />
              </div>
            </motion.button>
          );
        })}
      </div>

      {selectedAsset && (
        <AssetsPage.Detail asset={selectedAsset} onClose={() => setSelectedAsset(null)} />
      )}
    </div>
  );
}

AssetsPage.Detail = AssetDetailSheet;
