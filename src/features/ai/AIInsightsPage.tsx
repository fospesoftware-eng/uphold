import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Sparkles, Brain, ShieldAlert, TrendingUp, CircleAlert,
  HeartHandshake, FileText, DollarSign, ClipboardCheck, RefreshCw,
} from 'lucide-react';
import { Card, PageHeader, Badge, ProgressRing, Button, SkeletonCard } from '../../components/ui';
import { aiService } from '../../services/ai';
import type { RiskInsight, AIAction, AIBriefing, ComplianceForecast } from '../../services/ai';

const riskColor: Record<string, { ring: 'danger' | 'warning' | 'success' | 'default'; badge: 'danger' | 'warning' | 'info' | 'success' }> = {
  critical: { ring: 'danger', badge: 'danger' },
  high: { ring: 'danger', badge: 'danger' },
  medium: { ring: 'warning', badge: 'warning' },
  low: { ring: 'success', badge: 'success' },
};

const categoryIcon: Record<AIAction['category'], React.ReactNode> = {
  Wellbeing: <HeartHandshake size={15} />,
  Compliance: <ShieldAlert size={15} />,
  Financial: <DollarSign size={15} />,
  Documentation: <FileText size={15} />,
};

const priorityBadge: Record<AIAction['priority'], 'danger' | 'warning' | 'muted'> = {
  high: 'danger', medium: 'warning', low: 'muted',
};

export function AIInsightsPage() {
  const [briefing, setBriefing] = useState<AIBriefing | null>(null);
  const [risks, setRisks] = useState<RiskInsight[]>([]);
  const [actions, setActions] = useState<AIAction[]>([]);
  const [forecast, setForecast] = useState<ComplianceForecast[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const [b, r, a, f] = await Promise.all([
      aiService.getBriefing(),
      aiService.getRiskInsights(),
      aiService.getRecommendedActions(),
      aiService.getComplianceForecast(),
    ]);
    setBriefing(b); setRisks(r); setActions(a); setForecast(f);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  return (
    <div className="max-w-[1400px] mx-auto">
      <PageHeader
        title="AI Insights"
        subtitle="Predictive intelligence across wellbeing, compliance and finances"
        actions={
          <Button variant="outline" size="sm" leftIcon={<RefreshCw size={14} />} onClick={load} disabled={loading}>
            Regenerate
          </Button>
        }
      />

      {/* AI Briefing hero */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl bg-[linear-gradient(135deg,#06122A_0%,#0A2A4D_45%,#06302F_100%)] p-6 sm:p-8 text-white mb-6"
      >
        <div className="absolute -top-16 -right-10 w-72 h-72 rounded-full bg-[#15C6B8]/20 blur-3xl" />
        <div className="absolute -bottom-20 left-1/3 w-72 h-72 rounded-full bg-[#075DE8]/20 blur-3xl" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-3">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 border border-white/15 text-xs font-medium">
              <Sparkles size={13} className="text-[#32E6A4]" /> Uphold AI
            </span>
            <span className="text-xs text-white/50">
              {briefing ? `Updated ${new Date(briefing.generatedAt).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}` : 'Generating…'}
            </span>
          </div>
          {loading || !briefing ? (
            <div className="space-y-3">
              <div className="h-6 w-64 rounded bg-white/10 animate-pulse" />
              <div className="h-4 w-full max-w-2xl rounded bg-white/10 animate-pulse" />
              <div className="h-4 w-3/4 max-w-xl rounded bg-white/10 animate-pulse" />
            </div>
          ) : (
            <>
              <h2 className="text-xl sm:text-2xl font-bold font-display mb-2">{briefing.greeting}, here's your briefing</h2>
              <p className="text-white/80 leading-relaxed max-w-3xl">{briefing.summary}</p>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-6">
                {briefing.highlights.map((h, i) => (
                  <motion.div
                    key={h.label}
                    initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.08 }}
                    className="rounded-xl bg-white/10 border border-white/10 backdrop-blur-sm p-3.5"
                  >
                    <p className={`text-2xl font-bold font-display ${h.tone === 'negative' ? 'text-[#FCA5A5]' : h.tone === 'positive' ? 'text-[#32E6A4]' : 'text-white'}`}>{h.value}</p>
                    <p className="text-xs text-white/70 mt-0.5">{h.label}</p>
                  </motion.div>
                ))}
              </div>
            </>
          )}
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Risk Radar */}
        <Card className="lg:col-span-2">
          <div className="flex items-center gap-2 mb-5">
            <Brain size={18} className="text-[#075DE8]" />
            <h3 className="font-semibold font-display text-[#0F172A] dark:text-[#F8FAFC]">AI Risk Radar</h3>
            <Badge variant="info" className="ml-auto">{risks.length} tenants scored</Badge>
          </div>
          {loading ? (
            <div className="space-y-3">{[...Array(4)].map((_, i) => <SkeletonCard key={i} />)}</div>
          ) : (
            <div className="space-y-3">
              {risks.slice(0, 6).map((r, i) => (
                <motion.div
                  key={r.tenantId}
                  initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                  className="flex items-start gap-4 p-4 rounded-xl border border-[#E6EEF5] dark:border-[#1E2D45] hover:border-[#075DE8] transition-colors"
                >
                  <ProgressRing value={r.score} size={56} strokeWidth={5} variant={riskColor[r.level].ring}>
                    <span className="text-sm font-bold font-display text-[#0F172A] dark:text-[#F8FAFC]">{r.score}</span>
                  </ProgressRing>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold text-sm text-[#0F172A] dark:text-[#F8FAFC]">{r.tenantName}</p>
                      <Badge variant={riskColor[r.level].badge} className="capitalize">{r.level} risk</Badge>
                      <span className="text-xs text-[#94A3B8]">· {r.keyWorker}</span>
                    </div>
                    {r.factors.length > 0 && (
                      <ul className="mt-1.5 space-y-0.5">
                        {r.factors.slice(0, 2).map((f, j) => (
                          <li key={j} className="text-xs text-[#64748B] flex items-start gap-1.5">
                            <CircleAlert size={12} className="mt-0.5 flex-shrink-0 text-amber-500" /> {f}
                          </li>
                        ))}
                      </ul>
                    )}
                    <p className="text-xs mt-2 text-[#075DE8] flex items-start gap-1.5">
                      <Sparkles size={12} className="mt-0.5 flex-shrink-0" /> {r.recommendation}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </Card>

        {/* Recommended Actions */}
        <Card>
          <div className="flex items-center gap-2 mb-5">
            <ClipboardCheck size={18} className="text-[#15C6B8]" />
            <h3 className="font-semibold font-display text-[#0F172A] dark:text-[#F8FAFC]">Recommended Actions</h3>
          </div>
          {loading ? (
            <div className="space-y-3">{[...Array(4)].map((_, i) => <SkeletonCard key={i} />)}</div>
          ) : (
            <div className="space-y-3">
              {actions.map((a, i) => (
                <motion.div
                  key={a.id}
                  initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                  className="p-3.5 rounded-xl border border-[#E6EEF5] dark:border-[#1E2D45]"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[#64748B]">{categoryIcon[a.category]}</span>
                    <p className="text-sm font-semibold text-[#0F172A] dark:text-[#F8FAFC] flex-1 min-w-0 truncate">{a.title}</p>
                    <Badge variant={priorityBadge[a.priority]} className="capitalize">{a.priority}</Badge>
                  </div>
                  <p className="text-xs text-[#64748B] leading-relaxed">{a.detail}</p>
                </motion.div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* Compliance forecast */}
      <Card className="mt-6">
        <div className="flex items-center gap-2 mb-5">
          <TrendingUp size={18} className="text-[#075DE8]" />
          <h3 className="font-semibold font-display text-[#0F172A] dark:text-[#F8FAFC]">Compliance Forecast</h3>
          <span className="text-xs text-[#64748B] ml-1">AI-prioritised renewals</span>
        </div>
        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">{[...Array(3)].map((_, i) => <SkeletonCard key={i} />)}</div>
        ) : forecast.length === 0 ? (
          <p className="text-sm text-[#64748B] py-6 text-center">All certificates are valid with no upcoming renewals in the next 90 days. ✅</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {forecast.map((c, i) => (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                className={`p-4 rounded-xl border ${
                  c.risk === 'expired' ? 'bg-rose-50 dark:bg-rose-900/10 border-rose-200 dark:border-rose-900/30' :
                  c.risk === 'urgent' ? 'bg-amber-50 dark:bg-amber-900/10 border-amber-200 dark:border-amber-900/30' :
                  'bg-white dark:bg-[#111827] border-[#E6EEF5] dark:border-[#1E2D45]'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-semibold text-[#0F172A] dark:text-[#F8FAFC]">{c.type}</p>
                  <Badge variant={c.risk === 'expired' ? 'danger' : c.risk === 'urgent' ? 'warning' : 'info'}>
                    {c.daysUntil < 0 ? `${Math.abs(c.daysUntil)}d overdue` : `${c.daysUntil}d left`}
                  </Badge>
                </div>
                <p className="text-xs text-[#64748B] truncate">{c.property}</p>
                <p className="text-xs mt-2 text-[#075DE8] flex items-start gap-1.5">
                  <Sparkles size={12} className="mt-0.5 flex-shrink-0" /> {c.recommendation}
                </p>
              </motion.div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
