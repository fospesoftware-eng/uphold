import { useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, Pin, Search, ChevronRight } from 'lucide-react';
import { NOTICES } from '../data';
import { useTenantPortal } from '../context';

const TYPE_CONFIG: Record<string, { label: string; color: string; bg: string; emoji: string }> = {
  general:         { label: 'General',          color: 'text-blue-600',    bg: 'bg-blue-100 dark:bg-blue-900/30',    emoji: '📢' },
  emergency:       { label: 'Emergency',         color: 'text-rose-600',    bg: 'bg-rose-100 dark:bg-rose-900/30',    emoji: '🚨' },
  maintenance:     { label: 'Maintenance',       color: 'text-amber-700',   bg: 'bg-amber-100 dark:bg-amber-900/30',  emoji: '🔧' },
  event:           { label: 'Event',             color: 'text-violet-600',  bg: 'bg-violet-100 dark:bg-violet-900/30',emoji: '🎉' },
  news:            { label: 'News',              color: 'text-emerald-600', bg: 'bg-emerald-100 dark:bg-emerald-900/30',emoji: '📰' },
  utility_shutdown:{ label: 'Utility Shutdown',  color: 'text-orange-600',  bg: 'bg-orange-100 dark:bg-orange-900/30',emoji: '⚡' },
  rules:           { label: 'Policy Update',     color: 'text-slate-600',   bg: 'bg-slate-100 dark:bg-slate-800/50',  emoji: '📋' },
};

const PRIORITY_BORDER: Record<string, string> = {
  urgent: 'border-l-4 border-l-rose-500',
  high:   'border-l-4 border-l-amber-500',
  normal: '',
};

export function NoticesPage() {
  const { tenantUser } = useTenantPortal();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'unread' | 'pinned'>('all');
  const [expanded, setExpanded] = useState<string | null>(null);
  const [read, setRead] = useState<string[]>([]);

  if (!tenantUser) return null;

  const isRead = (id: string) => read.includes(id) || NOTICES.find(n => n.id === id)?.readBy.includes(tenantUser.id);

  const filtered = NOTICES.filter(n => {
    const matchSearch = n.title.toLowerCase().includes(search.toLowerCase()) || n.content.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' ? true : filter === 'unread' ? !isRead(n.id) : n.isPinned;
    return matchSearch && matchFilter;
  }).sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
  });

  const unreadCount = NOTICES.filter(n => !isRead(n.id)).length;

  return (
    <div className="max-w-2xl mx-auto px-4 pt-6 pb-8 lg:max-w-none lg:px-6">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-xl font-bold text-[#0F172A] dark:text-white">Notice Board</h1>
          <p className="text-sm text-[#64748B]">{unreadCount} unread · {NOTICES.length} total</p>
        </div>
        <div className="w-10 h-10 rounded-2xl bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center">
          <Bell size={20} className="text-amber-600" />
        </div>
      </div>

      <div className="relative mb-4">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search notices..."
          className="w-full pl-10 pr-4 py-3 rounded-2xl border border-[#E6EEF5] dark:border-[#1E2D45] bg-white dark:bg-[#111827] text-sm text-[#0F172A] dark:text-white placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#075DE8]"
        />
      </div>

      <div className="flex gap-2 mb-5">
        {(['all', 'unread', 'pinned'] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all capitalize ${
              filter === f ? 'bg-[#075DE8] text-white' : 'bg-white dark:bg-[#111827] border border-[#E6EEF5] dark:border-[#1E2D45] text-[#64748B]'
            }`}
          >{f}{f === 'unread' && unreadCount > 0 ? ` (${unreadCount})` : ''}</button>
        ))}
      </div>

      <div className="space-y-2.5">
        {filtered.map(notice => {
          const cfg = TYPE_CONFIG[notice.type] ?? TYPE_CONFIG.general;
          const isExpanded = expanded === notice.id;
          const alreadyRead = isRead(notice.id);

          return (
            <motion.div
              key={notice.id}
              layout
              className={`bg-white dark:bg-[#111827] border border-[#E6EEF5] dark:border-[#1E2D45] rounded-2xl overflow-hidden ${PRIORITY_BORDER[notice.priority]}`}
            >
              <button
                onClick={() => {
                  setExpanded(isExpanded ? null : notice.id);
                  if (!alreadyRead) setRead(r => [...r, notice.id]);
                }}
                className="w-full flex items-start gap-3 p-4 text-left hover:bg-[#F8FAFC] dark:hover:bg-[#1E2D45]/50 transition-colors"
              >
                <div className="text-xl flex-shrink-0 mt-0.5">{cfg.emoji}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    {notice.isPinned && <Pin size={12} className="text-[#075DE8]" />}
                    {!alreadyRead && <span className="w-2 h-2 rounded-full bg-[#075DE8]" />}
                    <p className={`text-sm font-semibold truncate flex-1 ${!alreadyRead ? 'text-[#0F172A] dark:text-white' : 'text-[#334155] dark:text-[#CBD5E1]'}`}>
                      {notice.title}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${cfg.bg} ${cfg.color}`}>{cfg.label}</span>
                    {notice.priority !== 'normal' && (
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        notice.priority === 'urgent' ? 'bg-rose-100 text-rose-600 dark:bg-rose-900/30' : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30'
                      }`}>{notice.priority.toUpperCase()}</span>
                    )}
                    <span className="text-[10px] text-[#94A3B8]">
                      {new Date(notice.publishedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                    </span>
                  </div>
                  {!isExpanded && <p className="text-xs text-[#64748B] mt-2 line-clamp-2">{notice.content}</p>}
                </div>
                <ChevronRight size={16} className={`text-[#94A3B8] flex-shrink-0 mt-1 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
              </button>
              {isExpanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="px-4 pb-4 border-t border-[#F1F5F9] dark:border-[#1E2D45]"
                >
                  <p className="text-sm text-[#334155] dark:text-[#CBD5E1] mt-3 leading-relaxed">{notice.content}</p>
                  {notice.expiresAt && (
                    <p className="text-xs text-[#94A3B8] mt-3">
                      Expires: {new Date(notice.expiresAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                  )}
                  <p className="text-[10px] text-[#94A3B8] mt-1">
                    Posted by {notice.author} · {notice.authorRole}
                  </p>
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
