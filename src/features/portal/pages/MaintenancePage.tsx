import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, ChevronRight, Search, AlertTriangle, X, Upload, Clock, CheckCircle, Wrench } from 'lucide-react';
import { useTenantPortal } from '../context';
import { getTenantData } from '../data';
import type { MaintenanceTicket, TicketCategory, TicketPriority } from '../types';

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  submitted:        { label: 'Submitted',         color: 'text-slate-600',  bg: 'bg-slate-100 dark:bg-slate-800/50' },
  acknowledged:     { label: 'Acknowledged',      color: 'text-blue-600',   bg: 'bg-blue-100 dark:bg-blue-900/30' },
  assigned:         { label: 'Assigned',           color: 'text-indigo-600', bg: 'bg-indigo-100 dark:bg-indigo-900/30' },
  in_progress:      { label: 'In Progress',        color: 'text-amber-700',  bg: 'bg-amber-100 dark:bg-amber-900/30' },
  waiting_for_parts:{ label: 'Waiting Parts',      color: 'text-orange-600', bg: 'bg-orange-100 dark:bg-orange-900/30' },
  resolved:         { label: 'Resolved',           color: 'text-emerald-600',bg: 'bg-emerald-100 dark:bg-emerald-900/30' },
  closed:           { label: 'Closed',             color: 'text-slate-500',  bg: 'bg-slate-100 dark:bg-slate-800/50' },
};

const PRIORITY_CONFIG: Record<TicketPriority, { label: string; color: string }> = {
  low:    { label: 'Low',    color: 'text-slate-500' },
  medium: { label: 'Medium', color: 'text-amber-600' },
  high:   { label: 'High',   color: 'text-orange-600' },
  urgent: { label: 'Urgent', color: 'text-rose-600' },
};

const CATEGORIES: { value: TicketCategory; label: string; icon: string }[] = [
  { value: 'maintenance', label: 'General Maintenance', icon: '🔧' },
  { value: 'electrical',  label: 'Electrical',          icon: '⚡' },
  { value: 'plumbing',    label: 'Plumbing',            icon: '🚿' },
  { value: 'furniture',   label: 'Furniture',           icon: '🛋️' },
  { value: 'cleaning',    label: 'Cleaning',            icon: '🧹' },
  { value: 'security',    label: 'Security',            icon: '🔒' },
  { value: 'internet',    label: 'Internet / Wi-Fi',    icon: '📡' },
  { value: 'noise',       label: 'Noise',               icon: '🔊' },
  { value: 'parking',     label: 'Parking',             icon: '🚗' },
  { value: 'billing',     label: 'Billing',             icon: '💳' },
  { value: 'other',       label: 'Other',               icon: '📋' },
];

function TicketDetailSheet({ ticket, onClose }: { ticket: MaintenanceTicket; onClose: () => void }) {
  const statusCfg = STATUS_CONFIG[ticket.status] ?? STATUS_CONFIG.submitted;
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        className="fixed inset-x-0 bottom-0 z-50 bg-white dark:bg-[#111827] rounded-t-3xl max-h-[88vh] overflow-y-auto"
      >
        <div className="sticky top-0 bg-white dark:bg-[#111827] px-5 pt-5 pb-3 border-b border-[#E6EEF5] dark:border-[#1E2D45] flex items-center justify-between">
          <div>
            <span className={`text-[11px] font-semibold px-2 py-1 rounded-full ${statusCfg.bg} ${statusCfg.color}`}>
              {statusCfg.label}
            </span>
            <p className="text-xs text-[#64748B] mt-1">{ticket.ticketNumber}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-[#F1F5F9] dark:hover:bg-[#1E2D45]">
            <X size={18} className="text-[#64748B]" />
          </button>
        </div>
        <div className="px-5 py-4 space-y-4">
          <div>
            <h2 className="text-lg font-bold text-[#0F172A] dark:text-white">{ticket.title}</h2>
            <p className="text-sm text-[#64748B] mt-1">{ticket.description}</p>
          </div>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-[#F8FAFC] dark:bg-[#1E2D45]">
              <p className="text-[#94A3B8] mb-1">Priority</p>
              <p className={`font-semibold ${PRIORITY_CONFIG[ticket.priority].color}`}>{PRIORITY_CONFIG[ticket.priority].label}</p>
            </div>
            <div className="p-3 rounded-xl bg-[#F8FAFC] dark:bg-[#1E2D45]">
              <p className="text-[#94A3B8] mb-1">Category</p>
              <p className="font-semibold text-[#334155] dark:text-[#CBD5E1] capitalize">{ticket.category}</p>
            </div>
            {ticket.assignedTo && (
              <div className="p-3 rounded-xl bg-[#F8FAFC] dark:bg-[#1E2D45]">
                <p className="text-[#94A3B8] mb-1">Assigned To</p>
                <p className="font-semibold text-[#334155] dark:text-[#CBD5E1]">{ticket.assignedTo}</p>
              </div>
            )}
            {ticket.estimatedResolution && (
              <div className="p-3 rounded-xl bg-[#F8FAFC] dark:bg-[#1E2D45]">
                <p className="text-[#94A3B8] mb-1">Est. Resolution</p>
                <p className="font-semibold text-[#334155] dark:text-[#CBD5E1]">
                  {new Date(ticket.estimatedResolution).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                </p>
              </div>
            )}
          </div>
          {/* Timeline */}
          <div>
            <h3 className="text-sm font-semibold text-[#334155] dark:text-[#CBD5E1] mb-3">Updates</h3>
            <div className="space-y-3 relative">
              <div className="absolute left-3.5 top-5 bottom-5 w-px bg-[#E6EEF5] dark:bg-[#1E2D45]" />
              {ticket.updates.map(update => (
                <div key={update.id} className="flex gap-3 relative">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold z-10 ${
                    update.authorRole === 'tenant' ? 'bg-[#075DE8] text-white' :
                    update.authorRole === 'technician' ? 'bg-amber-500 text-white' :
                    'bg-emerald-500 text-white'
                  }`}>
                    {update.author.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>
                  <div className="flex-1 pb-3">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-xs font-semibold text-[#334155] dark:text-[#CBD5E1]">{update.author}</p>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full capitalize ${
                        update.authorRole === 'tenant' ? 'bg-blue-100 text-blue-600' :
                        update.authorRole === 'technician' ? 'bg-amber-100 text-amber-700' :
                        'bg-emerald-100 text-emerald-700'
                      }`}>{update.authorRole}</span>
                      <p className="text-[10px] text-[#94A3B8] ml-auto">
                        {new Date(update.timestamp).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                      </p>
                    </div>
                    <p className="text-sm text-[#334155] dark:text-[#CBD5E1] bg-[#F8FAFC] dark:bg-[#1E2D45] rounded-xl px-3 py-2">{update.message}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {ticket.rating && (
            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800/50">
              <div className="flex items-center gap-1 mb-1">
                {Array.from({ length: ticket.rating }).map((_, i) => <span key={i} className="text-amber-400">★</span>)}
                {Array.from({ length: 5 - ticket.rating }).map((_, i) => <span key={i} className="text-slate-200">★</span>)}
              </div>
              <p className="text-sm text-emerald-700 dark:text-emerald-400 italic">"{ticket.feedback}"</p>
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

function NewTicketSheet({ onClose, onSubmit }: { onClose: () => void; onSubmit: (t: Partial<MaintenanceTicket>) => void }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<TicketCategory>('maintenance');
  const [priority, setPriority] = useState<TicketPriority>('medium');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ title, description, category, priority });
    setSubmitted(true);
    setTimeout(onClose, 2000);
  };

  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        className="fixed inset-x-0 bottom-0 z-50 bg-white dark:bg-[#111827] rounded-t-3xl max-h-[88vh] overflow-y-auto"
      >
        <div className="sticky top-0 bg-white dark:bg-[#111827] px-5 pt-5 pb-3 border-b border-[#E6EEF5] dark:border-[#1E2D45] flex items-center justify-between">
          <h2 className="text-base font-bold text-[#0F172A] dark:text-white">New Maintenance Request</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-[#F1F5F9] dark:hover:bg-[#1E2D45]">
            <X size={18} className="text-[#64748B]" />
          </button>
        </div>
        {submitted ? (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
            className="px-5 py-12 flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mb-4">
              <CheckCircle size={32} className="text-emerald-600" />
            </div>
            <h3 className="text-lg font-bold text-[#0F172A] dark:text-white mb-2">Request Submitted!</h3>
            <p className="text-sm text-[#64748B]">We'll acknowledge your request within 24 hours.</p>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="px-5 py-4 space-y-4 pb-8">
            <div>
              <label className="block text-xs font-semibold text-[#334155] dark:text-[#CBD5E1] mb-2">Category</label>
              <div className="grid grid-cols-3 gap-2">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat.value}
                    type="button"
                    onClick={() => setCategory(cat.value)}
                    className={`flex flex-col items-center gap-1 p-2.5 rounded-xl border text-center transition-all ${
                      category === cat.value
                        ? 'border-[#075DE8] bg-[#EFF6FF] dark:bg-[#1E2D45]'
                        : 'border-[#E6EEF5] dark:border-[#1E2D45] hover:bg-[#F8FAFC] dark:hover:bg-[#1E2D45]'
                    }`}
                  >
                    <span className="text-lg">{cat.icon}</span>
                    <span className="text-[10px] font-medium text-[#334155] dark:text-[#CBD5E1] leading-tight">{cat.label}</span>
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#334155] dark:text-[#CBD5E1] mb-2">Title *</label>
              <input
                value={title} onChange={e => setTitle(e.target.value)} required
                placeholder="e.g. Radiator not working in bedroom"
                className="w-full px-4 py-3 rounded-xl border border-[#E6EEF5] dark:border-[#1E2D45] bg-[#F8FAFC] dark:bg-[#1E2D45] text-[#0F172A] dark:text-white text-sm placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#075DE8]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#334155] dark:text-[#CBD5E1] mb-2">Description *</label>
              <textarea
                value={description} onChange={e => setDescription(e.target.value)} required rows={4}
                placeholder="Please describe the issue in detail..."
                className="w-full px-4 py-3 rounded-xl border border-[#E6EEF5] dark:border-[#1E2D45] bg-[#F8FAFC] dark:bg-[#1E2D45] text-[#0F172A] dark:text-white text-sm placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#075DE8] resize-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#334155] dark:text-[#CBD5E1] mb-2">Priority</label>
              <div className="flex gap-2">
                {(['low', 'medium', 'high', 'urgent'] as TicketPriority[]).map(p => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPriority(p)}
                    className={`flex-1 py-2 rounded-xl text-xs font-semibold border transition-all capitalize ${
                      priority === p
                        ? p === 'urgent' ? 'border-rose-500 bg-rose-50 dark:bg-rose-900/20 text-rose-600' :
                          p === 'high' ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20 text-orange-600' :
                          p === 'medium' ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/20 text-amber-700' :
                          'border-slate-400 bg-slate-50 dark:bg-slate-800/50 text-slate-600'
                        : 'border-[#E6EEF5] dark:border-[#1E2D45] text-[#64748B]'
                    }`}
                  >{p}</button>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2 px-4 py-3 rounded-xl border border-dashed border-[#E6EEF5] dark:border-[#1E2D45] text-[#64748B] hover:border-[#075DE8] hover:text-[#075DE8] cursor-pointer transition-colors">
              <Upload size={16} />
              <span className="text-sm">Add photos or videos (optional)</span>
            </div>
            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#075DE8] to-[#0EA5E9] text-white font-semibold text-sm shadow-lg shadow-blue-500/20 hover:opacity-95 transition-all"
            >
              Submit Request
            </button>
          </form>
        )}
      </motion.div>
    </AnimatePresence>
  );
}

export function MaintenancePage() {
  const { tenantUser } = useTenantPortal();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'open' | 'resolved'>('all');
  const [selectedTicket, setSelectedTicket] = useState<MaintenanceTicket | null>(null);
  const [showNew, setShowNew] = useState(false);

  if (!tenantUser) return null;
  const { tickets } = getTenantData(tenantUser.id);

  const filtered = tickets.filter(t => {
    const matchSearch = t.title.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' ? true :
                        filter === 'open' ? !['resolved', 'closed'].includes(t.status) :
                        ['resolved', 'closed'].includes(t.status);
    return matchSearch && matchFilter;
  });

  return (
    <div className="max-w-2xl mx-auto px-4 pt-6 pb-8 lg:max-w-none lg:px-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-xl font-bold text-[#0F172A] dark:text-white">Maintenance</h1>
          <p className="text-sm text-[#64748B] mt-0.5">{tickets.filter(t => !['resolved', 'closed'].includes(t.status)).length} open requests</p>
        </div>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowNew(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-[#075DE8] to-[#0EA5E9] text-white text-sm font-semibold shadow-lg shadow-blue-500/20"
        >
          <Plus size={16} />
          New Request
        </motion.button>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
        <input
          value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search requests..."
          className="w-full pl-10 pr-4 py-3 rounded-2xl border border-[#E6EEF5] dark:border-[#1E2D45] bg-white dark:bg-[#111827] text-[#0F172A] dark:text-white text-sm placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#075DE8]"
        />
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-5">
        {(['all', 'open', 'resolved'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all capitalize ${
              filter === f
                ? 'bg-[#075DE8] text-white shadow-sm'
                : 'bg-white dark:bg-[#111827] border border-[#E6EEF5] dark:border-[#1E2D45] text-[#64748B]'
            }`}
          >{f}</button>
        ))}
      </div>

      {/* Ticket list */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="py-16 text-center">
            <div className="w-16 h-16 rounded-full bg-[#F8FAFC] dark:bg-[#1E2D45] flex items-center justify-center mx-auto mb-4">
              <Wrench size={28} className="text-[#94A3B8]" />
            </div>
            <p className="text-sm font-semibold text-[#334155] dark:text-[#CBD5E1]">No requests found</p>
            <p className="text-xs text-[#94A3B8] mt-1">Tap "New Request" to report an issue</p>
          </div>
        ) : filtered.map(ticket => {
          const statusCfg = STATUS_CONFIG[ticket.status] ?? STATUS_CONFIG.submitted;
          const isOpen = !['resolved', 'closed'].includes(ticket.status);
          return (
            <motion.button
              key={ticket.id}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedTicket(ticket)}
              className="w-full flex items-start gap-3 p-4 bg-white dark:bg-[#111827] border border-[#E6EEF5] dark:border-[#1E2D45] rounded-2xl text-left hover:shadow-md transition-all"
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                isOpen ? 'bg-amber-50 dark:bg-amber-900/20' : 'bg-emerald-50 dark:bg-emerald-900/20'
              }`}>
                {isOpen
                  ? <Clock size={18} className="text-amber-600" />
                  : <CheckCircle size={18} className="text-emerald-600" />
                }
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="text-sm font-semibold text-[#0F172A] dark:text-white truncate">{ticket.title}</p>
                  {ticket.priority === 'urgent' && <AlertTriangle size={13} className="text-rose-500 flex-shrink-0" />}
                </div>
                <p className="text-xs text-[#64748B] truncate mb-2">{ticket.description}</p>
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${statusCfg.bg} ${statusCfg.color}`}>
                    {statusCfg.label}
                  </span>
                  <span className="text-[10px] text-[#94A3B8]">
                    {new Date(ticket.updatedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                  </span>
                  {ticket.updates.length > 0 && (
                    <span className="text-[10px] text-[#94A3B8]">{ticket.updates.length} updates</span>
                  )}
                </div>
              </div>
              <ChevronRight size={16} className="text-[#94A3B8] flex-shrink-0 mt-1" />
            </motion.button>
          );
        })}
      </div>

      {selectedTicket && (
        <TicketDetailSheet ticket={selectedTicket} onClose={() => setSelectedTicket(null)} />
      )}
      {showNew && (
        <NewTicketSheet
          onClose={() => setShowNew(false)}
          onSubmit={() => {}}
        />
      )}
    </div>
  );
}
