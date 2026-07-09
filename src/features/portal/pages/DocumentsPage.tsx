import { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Download, Edit3, Search, AlertCircle } from 'lucide-react';
import { useTenantPortal } from '../context';
import { getTenantData } from '../data';

const CAT_ICONS: Record<string, string> = {
  lease: '📄', inspection: '🔍', invoice: '💳', policy: '📋',
  manual: '📖', certificate: '🏆', checklist: '✅', other: '📁',
};

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  current:          { label: 'Current',          color: 'text-emerald-600', bg: 'bg-emerald-100 dark:bg-emerald-900/30' },
  expiring_soon:    { label: 'Expiring Soon',     color: 'text-amber-700',   bg: 'bg-amber-100 dark:bg-amber-900/30' },
  expired:          { label: 'Expired',           color: 'text-rose-600',    bg: 'bg-rose-100 dark:bg-rose-900/30' },
  pending_signature:{ label: 'Needs Signature',   color: 'text-blue-600',    bg: 'bg-blue-100 dark:bg-blue-900/30' },
  signed:           { label: 'Signed',            color: 'text-emerald-600', bg: 'bg-emerald-100 dark:bg-emerald-900/30' },
};

export function DocumentsPage() {
  const { tenantUser } = useTenantPortal();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<string>('all');

  if (!tenantUser) return null;
  const { documents } = getTenantData(tenantUser.id);

  const categories = ['all', ...Array.from(new Set(documents.map(d => d.category)))];
  const pendingSig = documents.filter(d => d.status === 'pending_signature');

  const filtered = documents.filter(d => {
    const matchSearch = d.name.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' ? true : d.category === filter;
    return matchSearch && matchFilter;
  });

  return (
    <div className="max-w-2xl mx-auto px-4 pt-6 pb-8 lg:max-w-none lg:px-6">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-xl font-bold text-[#0F172A] dark:text-white">Documents</h1>
          <p className="text-sm text-[#64748B]">{documents.length} documents</p>
        </div>
      </div>

      {pendingSig.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-start gap-3 p-4 mb-5 rounded-2xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/50"
        >
          <AlertCircle size={18} className="text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-blue-700 dark:text-blue-400">Action Required</p>
            <p className="text-xs text-blue-600 dark:text-blue-400/80 mt-0.5">
              {pendingSig.length} document{pendingSig.length > 1 ? 's need' : ' needs'} your signature: {pendingSig.map(d => d.name).join(', ')}
            </p>
          </div>
        </motion.div>
      )}

      <div className="relative mb-4">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search documents..."
          className="w-full pl-10 pr-4 py-3 rounded-2xl border border-[#E6EEF5] dark:border-[#1E2D45] bg-white dark:bg-[#111827] text-sm text-[#0F172A] dark:text-white placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#075DE8]"
        />
      </div>

      <div className="flex gap-2 mb-5 overflow-x-auto pb-1">
        {categories.map(cat => (
          <button key={cat} onClick={() => setFilter(cat)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all capitalize flex-shrink-0 ${
              filter === cat ? 'bg-[#075DE8] text-white' : 'bg-white dark:bg-[#111827] border border-[#E6EEF5] dark:border-[#1E2D45] text-[#64748B]'
            }`}
          >{cat}</button>
        ))}
      </div>

      <div className="space-y-2.5">
        {filtered.map(doc => {
          const statusCfg = STATUS_CONFIG[doc.status] ?? STATUS_CONFIG.current;
          return (
            <motion.div
              key={doc.id}
              whileTap={{ scale: 0.98 }}
              className={`flex items-center gap-3 p-4 rounded-2xl border cursor-pointer hover:shadow-md transition-all ${
                doc.status === 'pending_signature'
                  ? 'bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800/50'
                  : 'bg-white dark:bg-[#111827] border-[#E6EEF5] dark:border-[#1E2D45]'
              }`}
            >
              <div className="w-11 h-11 rounded-2xl bg-[#F8FAFC] dark:bg-[#1E2D45] flex items-center justify-center text-2xl flex-shrink-0">
                {CAT_ICONS[doc.category] ?? '📁'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[#0F172A] dark:text-white truncate">{doc.name}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${statusCfg.bg} ${statusCfg.color}`}>
                    {statusCfg.label}
                  </span>
                  <span className="text-[10px] text-[#94A3B8]">{doc.fileType.toUpperCase()} · {doc.fileSize}</span>
                </div>
                {doc.description && <p className="text-xs text-[#64748B] mt-1 truncate">{doc.description}</p>}
                {doc.expiryDate && (
                  <p className="text-[10px] text-[#94A3B8] mt-0.5">
                    Expires {new Date(doc.expiryDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-2 flex-shrink-0">
                {doc.status === 'pending_signature' ? (
                  <button className="p-2 rounded-xl bg-[#075DE8] text-white hover:bg-[#0650CC] transition-colors">
                    <Edit3 size={15} />
                  </button>
                ) : (
                  <button className="p-2 rounded-xl bg-[#F8FAFC] dark:bg-[#1E2D45] text-[#64748B] hover:bg-[#E6EEF5] transition-colors">
                    <Download size={15} />
                  </button>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
