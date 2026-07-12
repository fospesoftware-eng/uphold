import { useMemo, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight } from 'lucide-react';
import { getAIInsights, CATEGORY_LABEL } from './insightsData';
import { SEVERITY, CATEGORY_ICON, healthColor } from './ui';

function useWide(query = '(min-width: 1024px)') {
  const [wide, setWide] = useState(false);
  useEffect(() => {
    const m = window.matchMedia(query);
    const on = () => setWide(m.matches);
    on();
    m.addEventListener('change', on);
    return () => m.removeEventListener('change', on);
  }, [query]);
  return wide;
}

/** Full-width horizontal AI-insights band for the top of the dashboard. */
export function InsightsWidget() {
  const data = useMemo(() => getAIInsights(), []);
  const wide = useWide();
  const top = data.insights.slice(0, 3);
  const color = healthColor(data.healthScore);
  const C = 2 * Math.PI * 15.5;

  return (
    <div className="relative rounded-2xl overflow-hidden border border-white/10 text-white bg-gradient-to-br from-[#0B1B3A] via-[#0E2E5A] to-[#0A6B8F]">
      <div className="absolute -right-12 -top-16 w-56 h-56 rounded-full bg-white/5" />
      <div className="absolute -left-14 -bottom-20 w-56 h-56 rounded-full bg-white/5" />

      <div
        className="relative p-4 sm:p-5 grid items-center gap-4"
        style={{ gridTemplateColumns: wide ? '1.15fr 1.7fr auto' : '1fr' }}
      >
        {/* Left: health ring + title + narrative */}
        <div
          className="flex items-center gap-4"
          style={wide ? { paddingRight: 20, borderRight: '1px solid rgba(255,255,255,0.1)' } : undefined}
        >
          <div className="relative w-16 h-16 shrink-0">
            <svg viewBox="0 0 36 36" className="w-16 h-16 -rotate-90">
              <circle cx="18" cy="18" r="15.5" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="3" />
              <motion.circle
                cx="18" cy="18" r="15.5" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round"
                strokeDasharray={C}
                initial={{ strokeDashoffset: C }}
                animate={{ strokeDashoffset: C * (1 - data.healthScore / 100) }}
                transition={{ duration: 1, ease: 'easeOut' }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-lg font-bold">{data.healthScore}</span>
            </div>
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="w-6 h-6 rounded-lg bg-white/15 flex items-center justify-center"><Sparkles size={13} /></span>
              <h3 className="font-semibold leading-tight">AI Insights</h3>
              <span className="text-[10px] text-white/55">· {data.healthLabel}</span>
            </div>
            <p className="mt-1.5 text-xs text-white/75 leading-relaxed line-clamp-2">{data.narrative}</p>
          </div>
        </div>

        {/* Middle: top insights laid out horizontally */}
        <div
          className="grid gap-3 min-w-0"
          style={{ gridTemplateColumns: wide ? 'repeat(3, minmax(0, 1fr))' : '1fr' }}
        >
          {top.map((ins, i) => {
            const sev = SEVERITY[ins.severity];
            return (
              <motion.div
                key={ins.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                className="rounded-xl bg-white/[0.06] border border-white/10 p-3 backdrop-blur-sm"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${sev.bg} ${sev.text}`}>{sev.icon}</span>
                  <span className="text-[10px] uppercase tracking-wide text-white/50 inline-flex items-center gap-1">
                    {CATEGORY_ICON[ins.category]} {CATEGORY_LABEL[ins.category]}
                  </span>
                </div>
                <p className="mt-2 text-xs font-semibold leading-snug line-clamp-2">{ins.title}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Right: CTA */}
        <Link
          to="/insights"
          className="justify-self-start xl:justify-self-auto shrink-0 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white text-[#0B1B3A] text-sm font-semibold hover:bg-white/90 transition-colors"
        >
          View all {data.insights.length} <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
}
