import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Store, Eye, Globe, Star, TrendingUp, Search, ExternalLink, Sparkles,
  CheckCircle2, Clock, Home, Wrench, EyeOff, Zap, Filter,
} from 'lucide-react';
import { Calendar, Video, MapPin as MapPinIcon, Users as UsersIcon, User, Check, XCircle } from 'lucide-react';
import { useAllListings, useBookings, marketplaceStore } from '../useMarketplace';
import { AVAILABILITY_LABEL } from '../listings';
import { gbp, tierLabel, shortDate } from '../format';
import type { Availability } from '../listings';

const AVAIL_BADGE: Record<Availability, { cls: string; icon: React.ReactNode }> = {
  available:   { cls: 'text-emerald-700 bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200', icon: <CheckCircle2 size={12} /> },
  reserved:    { cls: 'text-amber-700 bg-amber-50 dark:bg-amber-900/20 border-amber-200',     icon: <Clock size={12} /> },
  occupied:    { cls: 'text-slate-600 bg-slate-50 dark:bg-slate-800 border-slate-200',        icon: <Home size={12} /> },
  unavailable: { cls: 'text-rose-700 bg-rose-50 dark:bg-rose-900/20 border-rose-200',         icon: <Wrench size={12} /> },
  hidden:      { cls: 'text-slate-500 bg-slate-50 dark:bg-slate-800 border-slate-200',        icon: <EyeOff size={12} /> },
};

const TABS = ['Listings', 'Viewing Requests', 'Applications', 'Analytics'] as const;

export function MarketplaceAdminPage() {
  const listings = useAllListings();
  const bookings = useBookings();
  const pendingCount = bookings.filter((b) => b.status === 'pending').length;
  const [tab, setTab] = useState<(typeof TABS)[number]>('Listings');
  const [q, setQ] = useState('');
  const [filter, setFilter] = useState<'all' | 'live' | 'unpublished'>('all');

  const stats = useMemo(() => {
    const live = listings.filter((l) => l.isLive).length;
    const published = listings.filter((l) => l.published).length;
    const views = listings.reduce((s, l) => s + l.views, 0);
    const avgRating = listings.length ? listings.reduce((s, l) => s + l.meta.rating, 0) / listings.length : 0;
    return { live, published, views, avgRating, total: listings.length };
  }, [listings]);

  const rows = useMemo(() => {
    return listings.filter((l) => {
      if (filter === 'live' && !l.isLive) return false;
      if (filter === 'unpublished' && l.published) return false;
      if (q && !`${l.meta.headline} ${l.property.address} ${l.property.city}`.toLowerCase().includes(q.toLowerCase())) return false;
      return true;
    });
  }, [listings, q, filter]);

  return (
    <div className="max-w-[1400px] mx-auto">
      {/* header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#075DE8] to-[#0EA5E9] flex items-center justify-center text-white shadow-lg shadow-blue-500/25">
              <Store size={20} />
            </span>
            <div>
              <h1 className="text-xl font-bold text-[#0F172A] dark:text-white">Property Marketplace</h1>
              <p className="text-sm text-[#64748B] dark:text-[#94A3B8]">Publish vacant homes to the public marketplace — one toggle, live instantly.</p>
            </div>
          </div>
        </div>
        <Link
          to="/marketplace"
          target="_blank"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#075DE8] hover:bg-[#0650CC] text-white text-sm font-semibold shadow-sm transition-colors"
        >
          <Globe size={16} /> View public site <ExternalLink size={13} />
        </Link>
      </div>

      {/* stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {[
          { label: 'Live on marketplace', value: stats.live, icon: <Globe size={15} />, color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
          { label: 'Published', value: `${stats.published}/${stats.total}`, icon: <CheckCircle2 size={15} />, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/20' },
          { label: 'Total views', value: stats.views.toLocaleString(), icon: <Eye size={15} />, color: 'text-violet-600', bg: 'bg-violet-50 dark:bg-violet-900/20' },
          { label: 'Avg. rating', value: stats.avgRating.toFixed(2), icon: <Star size={15} />, color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-900/20' },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className="rounded-xl bg-white dark:bg-[#111827] border border-[#E6EEF5] dark:border-[#1E2D45] p-4">
            <div className={`w-8 h-8 rounded-lg ${s.bg} flex items-center justify-center mb-2 ${s.color}`}>{s.icon}</div>
            <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-[11px] text-[#94A3B8]">{s.label}</p>
          </motion.div>
        ))}
      </div>

      {/* tabs */}
      <div className="flex items-center gap-1 bg-white dark:bg-[#111827] rounded-xl border border-[#E6EEF5] dark:border-[#1E2D45] p-1 mb-5 w-max max-w-full overflow-x-auto">
        {TABS.map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-3.5 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all inline-flex items-center gap-1.5 ${
              tab === t ? 'bg-[#075DE8] text-white shadow-sm' : 'text-[#64748B] dark:text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-white'
            }`}>
            {t}
            {t === 'Viewing Requests' && pendingCount > 0 && (
              <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${tab === t ? 'bg-white/25 text-white' : 'bg-rose-100 text-rose-600'}`}>{pendingCount}</span>
            )}
          </button>
        ))}
      </div>

      {tab === 'Listings' && (
        <>
          {/* toolbar */}
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <div className="flex-1 flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-[#E6EEF5] dark:border-[#1E2D45] bg-white dark:bg-[#111827]">
              <Search size={16} className="text-[#94A3B8]" />
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search listings by name, address or city…"
                className="w-full bg-transparent outline-none text-sm" />
            </div>
            <div className="flex items-center gap-1 bg-white dark:bg-[#111827] rounded-xl border border-[#E6EEF5] dark:border-[#1E2D45] p-1">
              {([['all', 'All'], ['live', 'Live'], ['unpublished', 'Unpublished']] as const).map(([v, label]) => (
                <button key={v} onClick={() => setFilter(v)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${filter === v ? 'bg-[#075DE8] text-white' : 'text-[#64748B] hover:text-[#0F172A] dark:hover:text-white'}`}>
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* table */}
          <div className="rounded-2xl border border-[#E6EEF5] dark:border-[#1E2D45] bg-white dark:bg-[#111827] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#F1F5F9] dark:border-[#1E2D45] text-left">
                    {['Property', 'Status', 'Type', 'From', 'Views', 'Featured', 'Publish', ''].map((h) => (
                      <th key={h} className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-[#94A3B8] whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((l) => {
                    const badge = AVAIL_BADGE[l.availability];
                    return (
                      <tr key={l.id} className="border-b border-[#F1F5F9] dark:border-[#1E2D45] last:border-0 hover:bg-[#F8FAFC] dark:hover:bg-white/[0.02] transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3 min-w-[220px]">
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#075DE8]/15 to-[#0EA5E9]/15 flex items-center justify-center text-[#075DE8] shrink-0">
                              <Home size={16} />
                            </div>
                            <div className="min-w-0">
                              <p className="font-semibold text-[#0F172A] dark:text-white truncate max-w-[240px]">{l.meta.headline}</p>
                              <p className="text-xs text-[#94A3B8] truncate">{l.property.address}, {l.property.city}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-[11px] font-semibold border ${badge.cls}`}>
                            {badge.icon} {AVAILABILITY_LABEL[l.availability]}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-[#475569] dark:text-[#CBD5E1] whitespace-nowrap">{tierLabel[l.meta.tier]}</td>
                        <td className="px-4 py-3 font-semibold text-[#0F172A] dark:text-white whitespace-nowrap">{gbp(l.priceMonthly)}<span className="text-[11px] font-normal text-[#94A3B8]">/mo</span></td>
                        <td className="px-4 py-3 text-[#475569] dark:text-[#CBD5E1]">{l.views.toLocaleString()}</td>
                        <td className="px-4 py-3">
                          <button onClick={() => marketplaceStore.toggleFeatured(l.id)}
                            className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${l.featured ? 'text-amber-500 bg-amber-50 dark:bg-amber-900/20' : 'text-[#CBD5E1] hover:text-amber-400'}`}
                            title={l.featured ? 'Featured' : 'Feature this listing'}>
                            <Star size={16} fill={l.featured ? '#f59e0b' : 'none'} />
                          </button>
                        </td>
                        <td className="px-4 py-3">
                          <Toggle
                            on={l.published}
                            disabled={l.availability === 'hidden'}
                            onChange={() => marketplaceStore.togglePublished(l.id)}
                          />
                        </td>
                        <td className="px-4 py-3">
                          <Link to={`/marketplace/property/${l.id}?preview=1`} target="_blank"
                            className="inline-flex items-center gap-1 text-xs font-semibold text-[#075DE8] hover:text-[#0650CC] whitespace-nowrap">
                            Preview <ExternalLink size={12} />
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {rows.length === 0 && (
              <div className="py-16 text-center">
                <Filter size={28} className="mx-auto text-[#CBD5E1] mb-2" />
                <p className="text-sm text-[#64748B] dark:text-[#94A3B8]">No listings match your filters.</p>
              </div>
            )}
          </div>

          {/* auto-publish explainer */}
          <div className="mt-5 rounded-2xl border border-[#075DE8]/20 bg-[#075DE8]/5 p-5">
            <h3 className="text-sm font-bold text-[#0F172A] dark:text-white flex items-center gap-2"><Zap size={15} className="text-[#075DE8]" /> How auto-status works</h3>
            <div className="mt-3 grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
              {[
                { s: 'Vacant', r: 'Available on marketplace', c: 'text-emerald-600' },
                { s: 'Pending', r: 'Shows “Reserved” badge', c: 'text-amber-600' },
                { s: 'Occupied', r: 'Hidden from public', c: 'text-slate-500' },
                { s: 'Maintenance', r: 'Marked unavailable', c: 'text-rose-600' },
                { s: 'Inactive', r: 'Fully hidden', c: 'text-slate-500' },
              ].map((x) => (
                <div key={x.s} className="rounded-xl bg-white dark:bg-[#111827] border border-[#E6EEF5] dark:border-[#1E2D45] p-3">
                  <p className={`font-bold ${x.c}`}>{x.s}</p>
                  <p className="mt-0.5 text-[#64748B] dark:text-[#94A3B8]">{x.r}</p>
                </div>
              ))}
            </div>
            <p className="mt-3 text-xs text-[#64748B] dark:text-[#94A3B8]">
              Status is derived live from each property/room record in the PMS — no duplicate data. Toggle <strong>Publish</strong> to list a vacant home; it appears on the public site instantly and disappears automatically when occupied.
            </p>
          </div>
        </>
      )}

      {tab === 'Viewing Requests' && <ViewingRequests bookings={bookings} />}
      {(tab === 'Applications' || tab === 'Analytics') && <ComingSoon tab={tab} />}
    </div>
  );
}

function ViewingRequests({ bookings }: { bookings: ReturnType<typeof useBookings> }) {
  if (bookings.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-[#E6EEF5] dark:border-[#1E2D45] bg-white dark:bg-[#111827] py-16 text-center">
        <div className="mx-auto w-14 h-14 rounded-2xl bg-[#075DE8]/10 flex items-center justify-center text-[#075DE8] mb-4">
          <Calendar size={24} />
        </div>
        <p className="text-lg font-semibold text-[#0F172A] dark:text-white">No viewing requests yet</p>
        <p className="mt-1 text-sm text-[#64748B] dark:text-[#94A3B8] max-w-md mx-auto">
          When a prospective tenant books a viewing on the public marketplace, it lands here for approval.
        </p>
        <Link to="/marketplace" target="_blank" className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-[#075DE8]">
          Open public site <ExternalLink size={13} />
        </Link>
      </div>
    );
  }
  return (
    <div className="space-y-3">
      {bookings.map((b) => {
        const statusCls = b.status === 'approved' ? 'text-emerald-700 bg-emerald-50 dark:bg-emerald-900/20'
          : b.status === 'declined' ? 'text-rose-700 bg-rose-50 dark:bg-rose-900/20'
          : 'text-amber-700 bg-amber-50 dark:bg-amber-900/20';
        return (
          <motion.div key={b.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-[#E6EEF5] dark:border-[#1E2D45] bg-white dark:bg-[#111827] p-4 sm:p-5">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-mono font-semibold text-[#075DE8]">{b.id}</span>
                  <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold capitalize ${statusCls}`}>{b.status}</span>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-[#F1F5F9] dark:bg-white/5 text-[#475569] dark:text-[#CBD5E1]">
                    {b.mode === 'virtual' ? <Video size={11} /> : <MapPinIcon size={11} />} {b.mode === 'virtual' ? 'Virtual' : 'In person'}
                  </span>
                </div>
                <p className="mt-2 font-semibold text-[#0F172A] dark:text-white truncate">{b.listingHeadline}</p>
                <p className="text-xs text-[#94A3B8]">{b.propertyAddress}</p>
                <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5 text-xs text-[#475569] dark:text-[#CBD5E1]">
                  <span className="inline-flex items-center gap-1.5"><Calendar size={13} className="text-[#075DE8]" /> {shortDate(b.date)} · {b.time}</span>
                  <span className="inline-flex items-center gap-1.5"><UsersIcon size={13} className="text-[#075DE8]" /> {b.visitors} visitor{b.visitors > 1 ? 's' : ''}</span>
                  <span className="inline-flex items-center gap-1.5"><User size={13} className="text-[#075DE8]" /> {b.name} · {b.phone}</span>
                </div>
                {b.comments && <p className="mt-2 text-xs text-[#64748B] dark:text-[#94A3B8] italic">“{b.comments}”</p>}
              </div>
              {b.status === 'pending' && (
                <div className="flex sm:flex-col gap-2 shrink-0">
                  <button onClick={() => marketplaceStore.setBookingStatus(b.id, 'approved')}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-colors">
                    <Check size={14} /> Approve
                  </button>
                  <button onClick={() => marketplaceStore.setBookingStatus(b.id, 'declined')}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl border border-[#E6EEF5] dark:border-white/10 text-[#64748B] hover:text-rose-600 hover:border-rose-300 text-xs font-semibold transition-colors">
                    <XCircle size={14} /> Decline
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

function Toggle({ on, disabled, onChange }: { on: boolean; disabled?: boolean; onChange: () => void }) {
  return (
    <button
      onClick={onChange}
      disabled={disabled}
      role="switch"
      aria-checked={on}
      className={`relative w-12 h-6.5 rounded-full transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${on ? 'bg-[#075DE8]' : 'bg-[#CBD5E1] dark:bg-[#334155]'}`}
      style={{ height: 26 }}
      title={disabled ? 'This property is hidden and cannot be published' : on ? 'Published — click to unpublish' : 'Unpublished — click to publish'}
    >
      <motion.span
        layout
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow"
        style={{ left: on ? 26 : 3 }}
      />
    </button>
  );
}

function ComingSoon({ tab }: { tab: string }) {
  const copy: Record<string, string> = {
    'Viewing Requests': 'Approve or decline viewing bookings, sync to calendars and send confirmations.',
    'Applications': 'Review online rental applications with referencing, documents and digital signatures.',
    'Analytics': 'Track views, leads, conversion funnel, average days on market and top performers.',
  };
  return (
    <div className="rounded-2xl border border-dashed border-[#E6EEF5] dark:border-[#1E2D45] bg-white dark:bg-[#111827] py-16 text-center">
      <div className="mx-auto w-14 h-14 rounded-2xl bg-[#075DE8]/10 flex items-center justify-center text-[#075DE8] mb-4">
        <Sparkles size={24} />
      </div>
      <p className="text-lg font-semibold text-[#0F172A] dark:text-white">{tab}</p>
      <p className="mt-1 text-sm text-[#64748B] dark:text-[#94A3B8] max-w-md mx-auto">{copy[tab]}</p>
      <span className="mt-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-[#075DE8]/10 text-[#075DE8]">
        <TrendingUp size={13} /> Phase 2
      </span>
    </div>
  );
}
