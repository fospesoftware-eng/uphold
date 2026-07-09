import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Users, Building2, FileText, DollarSign, X } from 'lucide-react';
import { tenants, properties, tenantDocuments } from '../../data/mockData';

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
}

const searchItems = [
  ...tenants.map(t => ({ id: t.id, type: 'tenant' as const, label: `${t.firstName} ${t.lastName}`, subtitle: `${t.propertyId} · Room ${t.roomNumber}`, href: `/tenants/${t.id}`, icon: <Users size={16} /> })),
  ...properties.map(p => ({ id: p.id, type: 'property' as const, label: `${p.address}, ${p.city}`, subtitle: p.postcode, href: `/properties/${p.id}`, icon: <Building2 size={16} /> })),
  ...tenantDocuments.slice(0, 5).map(d => ({ id: d.id, type: 'document' as const, label: d.name, subtitle: d.type.replace(/_/g, ' '), href: `/documents`, icon: <FileText size={16} /> })),
];

export function CommandPalette({ open, onClose }: CommandPaletteProps) {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (!open) setQuery('');
  }, [open]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); }
      if (e.key === 'Escape' && open) onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onClose]);

  const filtered = query.trim()
    ? searchItems.filter(item =>
        item.label.toLowerCase().includes(query.toLowerCase()) ||
        item.subtitle.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 8)
    : searchItems.slice(0, 6);

  const handleSelect = useCallback((href: string) => {
    navigate(href);
    onClose();
  }, [navigate, onClose]);

  const typeColors = { tenant: 'text-[#075DE8]', property: 'text-[#15C6B8]', document: 'text-[#0797D8]', invoice: 'text-emerald-600' };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4" role="dialog" aria-modal aria-label="Command palette">
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: -16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: -16 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="relative z-10 w-full max-w-xl bg-white dark:bg-[#111827] rounded-2xl shadow-[0_25px_60px_rgba(15,23,42,.3)] border border-[#E6EEF5] dark:border-[#1E2D45] overflow-hidden"
          >
            <div className="flex items-center gap-3 px-4 py-3.5 border-b border-[#E6EEF5] dark:border-[#1E2D45]">
              <Search size={18} className="text-[#64748B] flex-shrink-0" />
              <input
                autoFocus
                type="text"
                placeholder="Search tenants, properties, documents…"
                value={query}
                onChange={e => setQuery(e.target.value)}
                className="flex-1 bg-transparent text-sm text-[#0F172A] dark:text-[#F8FAFC] placeholder:text-[#94A3B8] outline-none"
              />
              <button onClick={onClose} className="p-1 rounded-lg hover:bg-[#F8FAFC] dark:hover:bg-[#1E2D45] text-[#64748B]">
                <X size={16} />
              </button>
            </div>

            <div className="py-2 max-h-80 overflow-y-auto">
              {filtered.length === 0 ? (
                <div className="px-4 py-8 text-center text-sm text-[#64748B]">No results for "{query}"</div>
              ) : (
                <>
                  <div className="px-4 pb-1">
                    <p className="text-[10px] font-semibold text-[#94A3B8] uppercase tracking-wider">Results</p>
                  </div>
                  {filtered.map((item, i) => (
                    <motion.button
                      key={item.id}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.03 }}
                      onClick={() => handleSelect(item.href)}
                      className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-[#F8FAFC] dark:hover:bg-[#1E2D45] transition-colors text-left"
                    >
                      <span className={`flex-shrink-0 ${typeColors[item.type]}`}>{item.icon}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-[#0F172A] dark:text-[#F8FAFC] truncate">{item.label}</p>
                        <p className="text-xs text-[#64748B] truncate capitalize">{item.subtitle}</p>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#F8FAFC] dark:bg-[#1E2D45] text-[#64748B] border border-[#E6EEF5] dark:border-[#1E2D45] capitalize">{item.type}</span>
                    </motion.button>
                  ))}
                </>
              )}
            </div>

            <div className="px-4 py-2.5 border-t border-[#E6EEF5] dark:border-[#1E2D45] flex items-center gap-4 text-[10px] text-[#94A3B8]">
              <span>↑↓ navigate</span>
              <span>↵ select</span>
              <span>esc close</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
