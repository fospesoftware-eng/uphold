import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles, RefreshCw, ChevronDown, TrendingUp, TrendingDown, Lightbulb,
  ArrowRight, Send, Gauge,
} from 'lucide-react';
import { getAIInsights, CATEGORY_LABEL } from './insightsData';
import type { InsightCategory } from './insightsData';
import { SEVERITY, CATEGORY_ICON, healthColor } from './ui';

export function AIInsightsPage() {
  const [seed, setSeed] = useState(0);
  const [regenerating, setRegenerating] = useState(false);
  const data = useMemo(() => getAIInsights(), [seed]);
  const [cat, setCat] = useState<InsightCategory | 'all'>('all');
  const [open, setOpen] = useState<string | null>(data.insights[0]?.id ?? null);

  const color = healthColor(data.healthScore);
  const filtered = cat === 'all' ? data.insights : data.insights.filter((i) => i.category === cat);
  const categories = Array.from(new Set(data.insights.map((i) => i.category)));

  const regenerate = () => {
    setRegenerating(true);
    setTimeout(() => { setSeed((s) => s + 1); setRegenerating(false); }, 700);
  };

  return (
    <div className="max-w-[1400px] mx-auto">
      {/* header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <span className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#075DE8] to-[#0EA5E9] flex items-center justify-center text-white shadow-lg shadow-blue-500/25">
            <Sparkles size={22} />
          </span>
          <div>
            <h1 className="text-xl font-bold text-[#0F172A] dark:text-white">AI Insights</h1>
            <p className="text-sm text-[#64748B] dark:text-[#94A3B8]">
              Automated analysis of your portfolio · generated {new Date(data.generatedAt).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
        </div>
        <button onClick={regenerate} disabled={regenerating}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#E6EEF5] dark:border-[#1E2D45] text-sm font-medium text-[#334155] dark:text-[#CBD5E1] hover:border-[#075DE8]/40 hover:text-[#075DE8] transition-all disabled:opacity-60">
          <RefreshCw size={15} className={regenerating ? 'animate-spin' : ''} /> {regenerating ? 'Analysing…' : 'Regenerate'}
        </button>
      </div>

      {/* summary hero */}
      <div className="rounded-3xl overflow-hidden border border-[#E6EEF5] dark:border-[#1E2D45] mb-6">
        <div className="relative bg-gradient-to-br from-[#0B1B3A] via-[#0E2E5A] to-[#0A6B8F] text-white p-6 sm:p-8">
          <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-white/5" />
          <div className="absolute -left-10 -bottom-16 w-52 h-52 rounded-full bg-white/5" />
          <div className="relative flex flex-col sm:flex-row items-start gap-6">
            {/* health ring */}
            <div className="relative w-28 h-28 shrink-0">
              <svg viewBox="0 0 36 36" className="w-28 h-28 -rotate-90">
                <circle cx="18" cy="18" r="15.5" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="2.5" />
                <motion.circle
                  cx="18" cy="18" r="15.5" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round"
                  strokeDasharray={2 * Math.PI * 15.5}
                  initial={{ strokeDashoffset: 2 * Math.PI * 15.5 }}
                  animate={{ strokeDashoffset: 2 * Math.PI * 15.5 * (1 - data.healthScore / 100) }}
                  transition={{ duration: 1.1, ease: 'easeOut' }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold">{data.healthScore}</span>
                <span className="text-[10px] text-white/60 uppercase tracking-wide">/ 100</span>
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <Gauge size={16} className="text-white/70" />
                <span className="text-sm font-semibold">Portfolio health · {data.healthLabel}</span>
              </div>
              <p className="mt-2 text-sm sm:text-base text-white/85 leading-relaxed max-w-3xl">{data.narrative}</p>
              {/* severity chips */}
              <div className="mt-4 flex flex-wrap gap-2">
                {(['critical', 'warning', 'opportunity', 'positive'] as const).map((s) =>
                  data.counts[s] > 0 ? (
                    <span key={s} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-white/10 backdrop-blur border border-white/15">
                      <span className={`w-1.5 h-1.5 rounded-full ${SEVERITY[s].dot}`} />
                      {data.counts[s]} {SEVERITY[s].label.toLowerCase()}
                    </span>
                  ) : null
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* forecasts */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {data.forecasts.map((f, i) => (
          <motion.div key={f.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className="rounded-2xl bg-white dark:bg-[#111827] border border-[#E6EEF5] dark:border-[#1E2D45] p-4">
            <p className="text-[11px] text-[#94A3B8] uppercase tracking-wide">{f.label}</p>
            <div className="mt-1 flex items-baseline gap-1.5">
              <span className="text-2xl font-bold text-[#0F172A] dark:text-white">{f.value}</span>
              {f.delta != null && (
                <span className={`inline-flex items-center gap-0.5 text-xs font-semibold ${f.delta >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {f.delta >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}{Math.abs(f.delta)}
                </span>
              )}
            </div>
            <p className="mt-0.5 text-[11px] text-[#64748B] dark:text-[#94A3B8]">{f.sub}</p>
          </motion.div>
        ))}
      </div>

      {/* category filter */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 mb-4">
        <FilterChip active={cat === 'all'} onClick={() => setCat('all')} label={`All (${data.insights.length})`} />
        {categories.map((c) => (
          <FilterChip key={c} active={cat === c} onClick={() => setCat(c)}
            icon={CATEGORY_ICON[c]} label={CATEGORY_LABEL[c]} />
        ))}
      </div>

      {/* insights list */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-3">
          <AnimatePresence mode="popLayout">
            {filtered.map((ins) => {
              const sev = SEVERITY[ins.severity];
              const isOpen = open === ins.id;
              return (
                <motion.div
                  key={ins.id}
                  layout
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  className={`rounded-2xl border bg-white dark:bg-[#111827] overflow-hidden ${sev.ring}`}
                >
                  <button onClick={() => setOpen(isOpen ? null : ins.id)} className="w-full text-left p-4 sm:p-5 flex items-start gap-4">
                    <span className={`mt-0.5 w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${sev.bg} ${sev.text}`}>{sev.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide ${sev.bg} ${sev.text}`}>{sev.label}</span>
                        <span className="inline-flex items-center gap-1 text-[11px] text-[#64748B] dark:text-[#94A3B8]">{CATEGORY_ICON[ins.category]} {CATEGORY_LABEL[ins.category]}</span>
                        <span className="text-[11px] text-[#94A3B8]">· {ins.impact} impact</span>
                      </div>
                      <h3 className="mt-1.5 text-sm font-bold text-[#0F172A] dark:text-white">{ins.title}</h3>
                      <p className="mt-1 text-xs text-[#64748B] dark:text-[#94A3B8] leading-relaxed">{ins.summary}</p>
                    </div>
                    <div className="flex flex-col items-end gap-2 shrink-0">
                      {ins.metric && (
                        <div className="text-right">
                          <p className="text-base font-bold text-[#0F172A] dark:text-white leading-none">{ins.metric.value}</p>
                          <p className="text-[10px] text-[#94A3B8]">{ins.metric.label}</p>
                        </div>
                      )}
                      <ChevronDown size={16} className={`text-[#94A3B8] transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                    </div>
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 pb-5 pt-0 sm:pl-[4.75rem]">
                          <p className="text-sm text-[#475569] dark:text-[#CBD5E1] leading-relaxed">{ins.detail}</p>
                          <div className="mt-3 rounded-xl bg-[#075DE8]/5 border border-[#075DE8]/15 p-3.5 flex items-start gap-2.5">
                            <Lightbulb size={16} className="text-[#075DE8] shrink-0 mt-0.5" />
                            <div>
                              <p className="text-[11px] font-bold uppercase tracking-wide text-[#075DE8]">Recommended action</p>
                              <p className="mt-0.5 text-sm text-[#0F172A] dark:text-white">{ins.recommendation}</p>
                            </div>
                          </div>
                          <div className="mt-3 flex items-center gap-2 flex-wrap">
                            {ins.tags.map((t) => (
                              <span key={t} className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#F1F5F9] dark:bg-white/5 text-[#64748B] dark:text-[#94A3B8]">#{t}</span>
                            ))}
                            <span className="ml-auto text-[11px] text-[#94A3B8]">Confidence {ins.confidence}%</span>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* right rail: Ask AI + priorities */}
        <div className="space-y-4">
          <div className="rounded-2xl border border-[#E6EEF5] dark:border-[#1E2D45] bg-white dark:bg-[#111827] p-5">
            <h3 className="text-sm font-bold text-[#0F172A] dark:text-white flex items-center gap-2"><Sparkles size={15} className="text-[#075DE8]" /> Ask AI</h3>
            <p className="mt-1 text-xs text-[#64748B] dark:text-[#94A3B8]">Ask anything about your portfolio.</p>
            <div className="mt-3 flex items-center gap-2 px-3 py-2.5 rounded-xl border border-[#E6EEF5] dark:border-[#1E2D45] bg-[#F8FAFC] dark:bg-white/[0.03]">
              <input placeholder="e.g. Which tenants are at risk?" className="w-full bg-transparent outline-none text-sm" />
              <button className="w-8 h-8 rounded-lg bg-[#075DE8] text-white flex items-center justify-center shrink-0"><Send size={14} /></button>
            </div>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {['Summarise arrears', 'Compliance risks', 'Vacancy revenue'].map((q) => (
                <span key={q} className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-[#F1F5F9] dark:bg-white/5 text-[#475569] dark:text-[#CBD5E1]">{q}</span>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-[#E6EEF5] dark:border-[#1E2D45] bg-white dark:bg-[#111827] p-5">
            <h3 className="text-sm font-bold text-[#0F172A] dark:text-white mb-3">Top priorities this week</h3>
            <div className="space-y-2.5">
              {data.insights.filter((i) => i.severity === 'critical' || i.severity === 'warning' || i.severity === 'opportunity').slice(0, 4).map((ins, i) => (
                <div key={ins.id} className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-[#075DE8]/10 text-[#075DE8] text-[11px] font-bold flex items-center justify-center shrink-0">{i + 1}</span>
                  <p className="text-xs text-[#334155] dark:text-[#CBD5E1] leading-snug">{ins.recommendation}</p>
                </div>
              ))}
            </div>
            <Link to="/reports" className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-[#075DE8] hover:text-[#0650CC]">
              Export as report <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function FilterChip({ active, onClick, label, icon }: { active: boolean; onClick: () => void; label: string; icon?: React.ReactNode }) {
  return (
    <button onClick={onClick}
      className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
        active ? 'bg-[#075DE8] text-white shadow-sm' : 'bg-white dark:bg-[#111827] border border-[#E6EEF5] dark:border-[#1E2D45] text-[#64748B] dark:text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-white'
      }`}>
      {icon}{label}
    </button>
  );
}
