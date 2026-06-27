import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import {
  ArrowRight, CheckCircle, Building2, Users, DollarSign,
  FileText, BarChart3, ShieldCheck, TrendingUp, AlertTriangle,
  Zap, MapPin, Sparkles, Brain,
} from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: 'easeOut' as const },
  }),
};

function useReveal(margin = '-60px') {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin } as Parameters<typeof useInView>[1]);
  return { ref, isInView };
}

function Sparkline({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data), min = Math.min(...data);
  const range = max - min || 1;
  const w = 64, h = 22;
  const pts = data
    .map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / range) * (h - 4) - 2}`)
    .join(' ');
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} fill="none" className="opacity-80">
      <polyline points={pts} stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

interface DashCardProps {
  label: string;
  value: string;
  sub: string;
  accent: string;
  data: number[];
  className?: string;
}

function DashCard({ label, value, sub, accent, data, className = '' }: DashCardProps) {
  return (
    <div className={`bg-[#0C1829] border border-white/[0.07] rounded-xl p-3.5 flex flex-col gap-2 ${className}`}>
      <div className="h-[2px] w-6 rounded-full" style={{ background: accent }} />
      <span className="text-[9px] text-white/35 uppercase tracking-widest font-semibold">{label}</span>
      <div className="text-[1.35rem] font-bold text-white leading-none">{value}</div>
      <div className="flex items-end justify-between gap-2">
        <span className="text-[9px] text-white/30 leading-tight">{sub}</span>
        <Sparkline data={data} color={accent} />
      </div>
    </div>
  );
}

function DashboardPreview() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.0, delay: 0.4, ease: 'easeOut' as const }}
      className="relative hidden lg:block"
    >
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
      >
      <div className="absolute -inset-8 bg-gradient-to-br from-[#075DE8]/18 via-[#0797D8]/8 to-[#32E6A4]/12 blur-[60px] rounded-3xl pointer-events-none" />

      <div className="relative rounded-[18px] overflow-hidden shadow-[0_32px_100px_rgba(0,0,0,0.75),inset_0_1px_0_rgba(255,255,255,0.06)]"
        style={{ border: '1px solid rgba(255,255,255,0.07)' }}>
        {/* Chrome bar */}
        <div className="flex items-center gap-3 px-4 py-3 border-b" style={{ background: '#0B1524', borderColor: 'rgba(255,255,255,0.06)' }}>
          <div className="flex gap-1.5">
            {['#FF5F57', '#FFBD2E', '#28C840'].map((c, i) => (
              <div key={i} className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: c, opacity: 0.75 }} />
            ))}
          </div>
          <div className="flex-1 mx-3 px-3 py-1 rounded-md" style={{ background: '#070F1C', border: '1px solid rgba(255,255,255,0.05)' }}>
            <span className="text-[10px] text-white/20 font-mono">app.uphold.co.uk / dashboard</span>
          </div>
          <div className="flex gap-1">
            {[...Array(3)].map((_, i) => <div key={i} className="w-3 h-0.5 rounded-full bg-white/10" />)}
          </div>
        </div>

        {/* Dashboard body */}
        <div className="p-4 space-y-3" style={{ background: '#070F1C' }}>
          {/* Row 1 */}
          <div className="grid grid-cols-5 gap-3">
            <DashCard
              label="Occupancy Rate"
              value="88%"
              sub="+3% vs last month"
              accent="#075DE8"
              data={[55, 60, 65, 72, 78, 83, 88]}
              className="col-span-3"
            />
            <DashCard
              label="Active Tenants"
              value="1,245"
              sub="6 flagged for review"
              accent="#15C6B8"
              data={[1100, 1120, 1145, 1180, 1210, 1232, 1245]}
              className="col-span-2"
            />
          </div>

          {/* Row 2 */}
          <div className="grid grid-cols-3 gap-3">
            <DashCard
              label="Rent Collected"
              value="£5,820"
              sub="86% of £6,800 target"
              accent="#32E6A4"
              data={[3200, 4100, 4600, 5000, 5300, 5600, 5820]}
            />
            <DashCard
              label="STAR Score"
              value="High"
              sub="All tenants current"
              accent="#6366F1"
              data={[55, 62, 68, 75, 82, 90, 95]}
            />
            <DashCard
              label="Active Alerts"
              value="3"
              sub="2 certs expiring soon"
              accent="#F59E0B"
              data={[9, 8, 7, 6, 5, 4, 3]}
            />
          </div>

          {/* Status bar */}
          <div className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl" style={{ background: '#0C1829', border: '1px solid rgba(255,255,255,0.07)' }}>
            <div className="flex items-center gap-2">
              <span className="block w-1.5 h-1.5 rounded-full bg-[#32E6A4] animate-pulse" />
              <span className="text-[9px] text-white/35 uppercase tracking-widest font-semibold">All systems operational</span>
            </div>
            <div className="ml-auto flex gap-4">
              {['ISO 27001', 'GDPR', 'UK Data'].map(b => (
                <span key={b} className="text-[8px] text-white/20 font-semibold uppercase tracking-wider">{b}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
      </motion.div>
    </motion.div>
  );
}

function HeroSection() {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-[#03070F] pt-[72px]">
      {/* Animated gradient blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ x: [0, 40, -20, 0], y: [0, -50, 20, 0], scale: [1, 1.12, 0.92, 1] }}
          transition={{ duration: 28, repeat: Infinity, ease: 'easeInOut' as const }}
          className="absolute -top-48 -left-48 w-[800px] h-[800px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(7,93,232,0.13) 0%, transparent 70%)' }}
        />
        <motion.div
          animate={{ x: [0, -50, 30, 0], y: [0, 40, -30, 0], scale: [1, 0.88, 1.18, 1] }}
          transition={{ duration: 34, repeat: Infinity, ease: 'easeInOut' as const, delay: 6 }}
          className="absolute top-1/3 -right-48 w-[700px] h-[700px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(21,198,184,0.11) 0%, transparent 70%)' }}
        />
        <motion.div
          animate={{ x: [0, 25, -35, 0], y: [0, -25, 45, 0] }}
          transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' as const, delay: 3 }}
          className="absolute -bottom-32 left-1/3 w-[600px] h-[600px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(50,230,164,0.08) 0%, transparent 70%)' }}
        />

        {/* Dot grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.15]"
          style={{
            backgroundImage: 'radial-gradient(rgba(255,255,255,0.25) 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        />

        {/* Subtle horizontal lines */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px)', backgroundSize: '100% 80px' }}
        />

        {/* Scan line */}
        <div className="hero-scan absolute inset-0" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 w-full py-20 lg:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Left */}
          <div>
            <motion.div
              variants={fadeUp} initial="hidden" animate="visible" custom={0}
              className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full mb-8"
              style={{ background: 'rgba(7,93,232,0.1)', border: '1px solid rgba(7,93,232,0.22)' }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#32E6A4] animate-pulse" />
              <span className="text-xs text-white/70 font-medium tracking-wide">200+ UK housing associations live</span>
              <ArrowRight size={11} className="text-white/35" />
            </motion.div>

            <div className="overflow-hidden mb-8">
              <motion.h1
                className="text-[3.2rem] sm:text-[4rem] lg:text-[4.75rem] font-bold text-white leading-[1.0] tracking-[-0.02em]"
              >
                <motion.span
                  initial={{ opacity: 0, y: 70 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.75, delay: 0.12, ease: 'easeOut' as const }}
                  className="block"
                >
                  Housing
                </motion.span>
                <motion.span
                  initial={{ opacity: 0, y: 70 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.75, delay: 0.26, ease: 'easeOut' as const }}
                  className="block"
                >
                  Management,
                </motion.span>
                <motion.span
                  initial={{ opacity: 0, y: 70 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.75, delay: 0.40, ease: 'easeOut' as const }}
                  className="block text-uphold-gradient-animated"
                >
                  Reinvented.
                </motion.span>
              </motion.h1>
            </div>

            <div className="flex flex-wrap gap-2 mb-10">
              {['STAR Assessments', 'Compliance Tracking', 'Rent & Benefits', 'GDPR Documents', 'Multi-site'].map((tag, i) => (
                <motion.span
                  key={tag}
                  variants={fadeUp}
                  initial="hidden"
                  animate="visible"
                  custom={3.5 + i * 0.15}
                  className="px-3 py-1.5 text-[11px] font-medium text-white/55 rounded-lg"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
                >
                  {tag}
                </motion.span>
              ))}
            </div>

            <motion.div
              variants={fadeUp} initial="hidden" animate="visible" custom={5}
              className="flex flex-col sm:flex-row gap-3"
            >
              <motion.button
                whileHover={{ scale: 1.02, boxShadow: '0 8px 40px rgba(7,93,232,0.55)' }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/login')}
                className="flex items-center justify-center gap-2.5 px-7 py-3.5 text-sm font-semibold text-white rounded-xl bg-uphold-gradient shadow-[0_4px_24px_rgba(7,93,232,0.35)] transition-all"
              >
                Start free trial
                <ArrowRight size={15} />
              </motion.button>
              <Link
                to="/features"
                className="flex items-center justify-center gap-2 px-7 py-3.5 text-sm font-semibold rounded-xl transition-all hover:bg-white/[0.06]"
                style={{ color: 'rgba(255,255,255,0.65)', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.09)' }}
              >
                See the platform
                <ArrowRight size={13} className="opacity-50" />
              </Link>
            </motion.div>

            <motion.div
              variants={fadeUp} initial="hidden" animate="visible" custom={6}
              className="flex items-center flex-wrap gap-5 mt-8 pt-7"
              style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
            >
              {[
                { icon: <Zap size={11} />, text: '14-day free trial' },
                { icon: <CheckCircle size={11} />, text: 'No credit card' },
                { icon: <ShieldCheck size={11} />, text: 'ISO 27001 certified' },
              ].map(({ icon, text }) => (
                <div key={text} className="flex items-center gap-1.5 text-xs text-white/35 font-medium">
                  <span className="text-[#32E6A4]">{icon}</span>
                  {text}
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right: dashboard preview */}
          <DashboardPreview />
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-48 pointer-events-none" style={{ background: 'linear-gradient(to top, #03070F, transparent)' }} />
    </section>
  );
}

// ── Trust bar with animated marquee cards ────────────────────────────────────
const trustOrgs = [
  { name: 'NorthBridge Living',      initials: 'NB', color: '#075DE8', location: 'Manchester' },
  { name: 'HavenPath Housing',       initials: 'HP', color: '#6366F1', location: 'Bristol' },
  { name: 'Oakmere Support',         initials: 'OS', color: '#10B981', location: 'Leeds' },
  { name: 'Unity Housing Care',      initials: 'UH', color: '#F59E0B', location: 'Birmingham' },
  { name: 'Meridian Trust',          initials: 'MT', color: '#EF4444', location: 'London' },
  { name: 'Castleford Group',        initials: 'CG', color: '#15C6B8', location: 'Sheffield' },
  { name: 'Beacon Supported Living', initials: 'BS', color: '#8B5CF6', location: 'Cardiff' },
  { name: 'Compass Housing',         initials: 'CH', color: '#F97316', location: 'Liverpool' },
  { name: 'Thornfield Homes',        initials: 'TH', color: '#0EA5E9', location: 'Newcastle' },
  { name: 'Avon Care Group',         initials: 'AC', color: '#14B8A6', location: 'Bath' },
];

interface OrgCardProps {
  name: string;
  initials: string;
  color: string;
  location: string;
}

function OrgCard({ name, initials, color, location }: OrgCardProps) {
  return (
    <div
      className="flex items-center gap-3 px-5 py-3.5 rounded-2xl flex-shrink-0 mx-2.5 transition-all duration-300 hover:scale-105"
      style={{ background: '#F4F6FA', border: '1px solid #E4E8EF' }}
    >
      {/* Coloured initial badge */}
      <div
        className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
        style={{ background: `linear-gradient(135deg, ${color}, ${color}cc)` }}
      >
        {initials}
      </div>
      <div>
        <div className="text-sm font-semibold text-[#0F172A] leading-none mb-0.5">{name}</div>
        <div className="flex items-center gap-1 text-[10px] text-[#94A3B8] font-medium">
          <MapPin size={9} />
          {location}
        </div>
      </div>
    </div>
  );
}

function TrustBar() {
  const row1 = trustOrgs.slice(0, 6);
  const row2 = trustOrgs.slice(4);

  return (
    <section className="py-14 border-y overflow-hidden" style={{ background: '#F8FAFC', borderColor: '#E8ECF0' }}>
      {/* Header */}
      <div className="text-center mb-10 px-6">
        <p className="text-[10px] font-bold uppercase tracking-[0.22em] mb-3" style={{ color: '#B0BAC8' }}>
          Trusted by housing associations across England & Wales
        </p>
        <p className="text-sm font-medium" style={{ color: '#94A3B8' }}>
          200+ organisations. 15,000+ tenants supported. Zero missed compliance deadlines.
        </p>
      </div>

      {/* Row 1 — scrolls left */}
      <div className="relative mb-3">
        <div className="absolute left-0 top-0 bottom-0 w-24 pointer-events-none z-10"
          style={{ background: 'linear-gradient(to right, #F8FAFC, transparent)' }} />
        <div className="absolute right-0 top-0 bottom-0 w-24 pointer-events-none z-10"
          style={{ background: 'linear-gradient(to left, #F8FAFC, transparent)' }} />
        <div className="flex trust-marquee-ltr">
          {[...row1, ...row1, ...row1].map((org, i) => (
            <OrgCard key={i} {...org} />
          ))}
        </div>
      </div>

      {/* Row 2 — scrolls right */}
      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-24 pointer-events-none z-10"
          style={{ background: 'linear-gradient(to right, #F8FAFC, transparent)' }} />
        <div className="absolute right-0 top-0 bottom-0 w-24 pointer-events-none z-10"
          style={{ background: 'linear-gradient(to left, #F8FAFC, transparent)' }} />
        <div className="flex trust-marquee-rtl">
          {[...row2, ...row2, ...row2].map((org, i) => (
            <OrgCard key={i} {...org} />
          ))}
        </div>
      </div>

      {/* Bottom stat chips */}
      <div className="flex items-center justify-center gap-6 mt-10 flex-wrap px-6">
        {[
          { value: '200+', label: 'organisations', color: '#075DE8' },
          { value: '15k+', label: 'tenants supported', color: '#15C6B8' },
          { value: '98%', label: 'compliance rate', color: '#32E6A4' },
          { value: '40%', label: 'less admin time', color: '#6366F1' },
        ].map(s => (
          <div key={s.label} className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl" style={{ background: '#EEF2F8', border: '1px solid #E0E7F0' }}>
            <span className="text-lg font-bold leading-none" style={{ color: s.color }}>{s.value}</span>
            <span className="text-xs font-medium" style={{ color: '#64748B' }}>{s.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

const bentoFeatures = [
  {
    icon: <Users size={18} />,
    accent: '#075DE8',
    accentFrom: '#075DE8',
    accentTo: '#0797D8',
    label: 'TENANT CARE',
    title: 'Wellbeing & STAR',
    description: 'Complete STAR assessments, risk scoring, support session logs — every tenant journey tracked and auditable.',
    stat: '98%',
    statLabel: 'compliance rate',
    bullets: ['STAR wellbeing scoring & trend tracking', 'Below-threshold automated alerts', 'Support hour logs with compliance view'],
    wide: true,
  },
  {
    icon: <ShieldCheck size={18} />,
    accent: '#6366F1',
    accentFrom: '#6366F1',
    accentTo: '#8B5CF6',
    label: 'COMPLIANCE',
    title: 'Certificates & Safety',
    description: 'Automated expiry alerts for fire safety, gas, and inspection certificates across all properties.',
    stat: '0',
    statLabel: 'missed deadlines',
    bullets: [],
    wide: false,
  },
  {
    icon: <DollarSign size={18} />,
    accent: '#15C6B8',
    accentFrom: '#15C6B8',
    accentTo: '#32E6A4',
    label: 'FINANCIALS',
    title: 'Rent & Benefits',
    description: 'Housing benefit tracking, arrears dashboards, and invoice management in real time.',
    stat: '40%',
    statLabel: 'less admin time',
    bullets: [],
    wide: false,
  },
  {
    icon: <FileText size={18} />,
    accent: '#F59E0B',
    accentFrom: '#F59E0B',
    accentTo: '#EF4444',
    label: 'DOCUMENTS',
    title: 'GDPR-Ready Docs',
    description: 'Templated, e-signed, version-controlled documents with a full audit trail for every tenant.',
    stat: '50k+',
    statLabel: 'docs managed',
    bullets: [],
    wide: false,
  },
  {
    icon: <BarChart3 size={18} />,
    accent: '#10B981',
    accentFrom: '#10B981',
    accentTo: '#15C6B8',
    label: 'REPORTING',
    title: 'Board Reports',
    description: 'Commissioner-ready compliance summaries, ESA audits, and STAR progress — one click to export.',
    stat: '1-click',
    statLabel: 'board packs',
    bullets: [],
    wide: false,
  },
  {
    icon: <Sparkles size={18} />,
    accent: '#075DE8',
    accentFrom: '#075DE8',
    accentTo: '#15C6B8',
    label: 'AI INSIGHTS',
    title: 'Predictive Risk AI',
    description: 'AI scores every tenant for risk, surfaces who needs attention first, and recommends the next action — with the reasons behind it.',
    stat: 'Live',
    statLabel: 'risk scoring',
    bullets: [],
    wide: false,
  },
  {
    icon: <Brain size={18} />,
    accent: '#8B5CF6',
    accentFrom: '#8B5CF6',
    accentTo: '#0797D8',
    label: 'AI ASSISTANT',
    title: 'Ask Uphold AI',
    description: 'A built-in copilot that answers questions on arrears, compliance, occupancy and wellbeing — grounded in your live data, on every page.',
    stat: '24/7',
    statLabel: 'data copilot',
    bullets: [],
    wide: false,
  },
];

function FeatureBentoSection() {
  const { ref, isInView } = useReveal();

  return (
    <section className="relative overflow-hidden py-28 lg:py-36" style={{ background: '#060C1A' }}>
      {/* Minimal animated backdrop — top right blank space */}
      <div className="absolute top-0 right-0 w-[55%] lg:w-[45%] h-[460px] pointer-events-none hidden md:block" aria-hidden>
        <motion.div
          animate={{ x: [0, -28, 0], y: [0, 22, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' as const }}
          className="absolute -top-24 -right-16 w-[380px] h-[380px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(7,93,232,0.16) 0%, transparent 70%)' }}
        />
        <motion.div
          animate={{ x: [0, 26, 0], y: [0, -18, 0], scale: [1, 0.9, 1] }}
          transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' as const, delay: 4 }}
          className="absolute top-10 right-32 w-[280px] h-[280px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(21,198,184,0.12) 0%, transparent 70%)' }}
        />
        {/* Constellation */}
        <svg viewBox="0 0 480 460" className="absolute inset-0 w-full h-full">
          {[
            ['m', 360, 70, 300, 150], ['m', 300, 150, 410, 190], ['m', 410, 190, 360, 290],
            ['m', 300, 150, 230, 250], ['m', 360, 290, 230, 250],
          ].map(([, x1, y1, x2, y2], i) => (
            <motion.line
              key={i} x1={x1 as number} y1={y1 as number} x2={x2 as number} y2={y2 as number}
              stroke="#15C6B8" strokeWidth="1"
              animate={{ strokeOpacity: [0.08, 0.28, 0.08] }}
              transition={{ duration: 4, repeat: Infinity, delay: i * 0.5, ease: 'easeInOut' as const }}
            />
          ))}
          {[
            [360, 70, '#0797D8'], [300, 150, '#15C6B8'], [410, 190, '#32E6A4'],
            [360, 290, '#075DE8'], [230, 250, '#15C6B8'],
          ].map(([cx, cy, c], i) => (
            <motion.circle
              key={i} cx={cx as number} cy={cy as number} r="3" fill={c as string}
              animate={{ scale: [1, 1.6, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 3, repeat: Infinity, delay: i * 0.4, ease: 'easeInOut' as const }}
              style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
            />
          ))}
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div ref={ref} className="mb-16">
          <motion.div
            variants={fadeUp} initial="hidden" animate={isInView ? 'visible' : 'hidden'}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full mb-5"
            style={{ background: 'rgba(7,93,232,0.08)', border: '1px solid rgba(7,93,232,0.18)' }}
          >
            <Zap size={11} className="text-[#0797D8]" />
            <span className="text-xs text-white/55 font-semibold tracking-wide uppercase">Platform</span>
          </motion.div>
          <motion.h2
            variants={fadeUp} custom={1} initial="hidden" animate={isInView ? 'visible' : 'hidden'}
            className="text-4xl lg:text-5xl font-bold text-white tracking-tight leading-tight mb-4"
          >
            Everything in one{' '}
            <span className="text-uphold-gradient">unified platform</span>
          </motion.h2>
          <motion.p
            variants={fadeUp} custom={2} initial="hidden" animate={isInView ? 'visible' : 'hidden'}
            className="text-lg max-w-2xl leading-relaxed"
            style={{ color: 'rgba(255,255,255,0.45)' }}
          >
            Purpose-built for supported housing — from STAR wellbeing tracking to commissioner-ready compliance reports.
          </motion.p>
        </div>

        {/* Bento grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-auto">
          {bentoFeatures.map((f, i) => (
            <motion.div
              key={f.title}
              variants={fadeUp} custom={i * 0.08}
              initial="hidden" animate={isInView ? 'visible' : 'hidden'}
              whileHover={{ y: -2 }}
              className={`group relative rounded-2xl overflow-hidden transition-all duration-300 ${f.wide ? 'md:col-span-2' : ''}`}
              style={{ background: '#0A1628', border: '1px solid rgba(255,255,255,0.07)' }}
            >
              {/* Hover glow overlay */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl"
                style={{ background: `radial-gradient(ellipse at 20% 50%, ${f.accent}12 0%, transparent 60%)` }}
              />

              {/* Top accent line */}
              <div className="absolute top-0 left-0 right-0 h-[1.5px] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ background: `linear-gradient(90deg, ${f.accentFrom}, ${f.accentTo}, transparent)` }} />

              <div className="relative p-7">
                <div className="flex items-start justify-between mb-5">
                  {/* Icon */}
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
                    style={{ background: `linear-gradient(135deg, ${f.accentFrom}25, ${f.accentTo}15)`, border: `1px solid ${f.accent}30` }}>
                    <span style={{ color: f.accent }}>{f.icon}</span>
                  </div>

                  {/* Stat chip */}
                  <div className="text-right">
                    <div className="text-xl font-bold leading-none mb-0.5" style={{ color: f.accent }}>{f.stat}</div>
                    <div className="text-[9px] uppercase tracking-widest font-semibold" style={{ color: 'rgba(255,255,255,0.3)' }}>{f.statLabel}</div>
                  </div>
                </div>

                <div className="text-[9px] font-bold uppercase tracking-[0.18em] mb-2" style={{ color: f.accent }}>{f.label}</div>
                <h3 className="text-lg font-bold text-white mb-2.5 leading-snug">{f.title}</h3>
                <p className="text-sm leading-relaxed mb-4" style={{ color: 'rgba(255,255,255,0.45)' }}>{f.description}</p>

                {f.bullets.length > 0 && (
                  <ul className="space-y-2">
                    {f.bullets.map(b => (
                      <li key={b} className="flex items-start gap-2.5 text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>
                        <span className="mt-0.5 w-4 h-4 rounded-md flex items-center justify-center flex-shrink-0"
                          style={{ background: `${f.accent}18`, color: f.accent }}>
                          <CheckCircle size={9} />
                        </span>
                        {b}
                      </li>
                    ))}
                  </ul>
                )}

                <div className="flex items-center gap-1.5 mt-5 text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ color: f.accent }}>
                  Learn more
                  <ArrowRight size={12} />
                </div>
              </div>
            </motion.div>
          ))}

          {/* Final CTA card */}
          <motion.div
            variants={fadeUp} custom={0.45}
            initial="hidden" animate={isInView ? 'visible' : 'hidden'}
            className="relative rounded-2xl overflow-hidden p-7 flex flex-col justify-between"
            style={{ background: 'linear-gradient(135deg, rgba(7,93,232,0.15), rgba(21,198,184,0.08))', border: '1px solid rgba(7,93,232,0.2)' }}
          >
            <div className="absolute inset-0 pointer-events-none"
              style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(7,93,232,0.1) 0%, transparent 60%)' }} />
            <div className="relative">
              <div className="text-[9px] font-bold uppercase tracking-[0.18em] mb-3" style={{ color: '#0797D8' }}>ROLE-BASED ACCESS</div>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-5"
                style={{ background: 'rgba(7,93,232,0.15)', border: '1px solid rgba(7,93,232,0.25)' }}>
                <ShieldCheck size={18} className="text-[#0797D8]" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Scoped to every role</h3>
              <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.45)' }}>
                Super admin, admin, support staff, and board views — each person sees exactly what they need.
              </p>
            </div>
            <Link
              to="/features"
              className="relative inline-flex items-center gap-2 mt-5 text-sm font-semibold text-[#0797D8] hover:text-[#15C6B8] transition-colors"
            >
              View all features <ArrowRight size={14} />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function CTAStrip() {
  const { ref, isInView } = useReveal();
  const navigate = useNavigate();

  return (
    <section className="py-24 relative overflow-hidden" style={{ background: '#030710' }}>
      {/* Aurora background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.22, 0.15] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' as const }}
          className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full blur-[100px]"
          style={{ background: 'radial-gradient(circle, #075DE8, transparent)' }}
        />
        <motion.div
          animate={{ scale: [1, 0.9, 1], opacity: [0.1, 0.18, 0.1] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' as const, delay: 3 }}
          className="absolute top-1/2 right-1/4 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[350px] rounded-full blur-[100px]"
          style={{ background: 'radial-gradient(circle, #15C6B8, transparent)' }}
        />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'radial-gradient(rgba(255,255,255,0.4) 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
        />
      </div>

      <div ref={ref} className="relative z-10 max-w-4xl mx-auto px-6 lg:px-8 text-center">
        <motion.div
          variants={fadeUp} initial="hidden" animate={isInView ? 'visible' : 'hidden'}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full mb-8"
          style={{ background: 'rgba(50,230,164,0.08)', border: '1px solid rgba(50,230,164,0.18)' }}
        >
          <TrendingUp size={11} className="text-[#32E6A4]" />
          <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.5)' }}>Start today</span>
        </motion.div>

        <motion.h2
          variants={fadeUp} custom={1} initial="hidden" animate={isInView ? 'visible' : 'hidden'}
          className="text-4xl lg:text-[3.25rem] font-bold text-white mb-10 leading-tight tracking-tight"
        >
          Ready to modernise your{' '}
          <span className="text-uphold-gradient">housing management?</span>
        </motion.h2>

        <motion.div
          variants={fadeUp} custom={2} initial="hidden" animate={isInView ? 'visible' : 'hidden'}
          className="flex flex-col sm:flex-row items-center justify-center gap-3"
        >
          <motion.button
            whileHover={{ scale: 1.03, boxShadow: '0 8px 40px rgba(7,93,232,0.5)' }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/login')}
            className="flex items-center gap-2.5 px-8 py-4 text-base font-semibold text-white rounded-xl bg-uphold-gradient shadow-[0_4px_28px_rgba(7,93,232,0.4)]"
          >
            Start free trial
            <ArrowRight size={16} />
          </motion.button>
          <Link
            to="/pricing"
            className="flex items-center gap-2 px-8 py-4 text-base font-medium rounded-xl transition-all"
            style={{ color: 'rgba(255,255,255,0.65)', border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.03)' }}
          >
            View pricing
          </Link>
        </motion.div>

        <motion.div
          variants={fadeUp} custom={3} initial="hidden" animate={isInView ? 'visible' : 'hidden'}
          className="flex items-center justify-center gap-8 mt-10"
        >
          {['14-day free trial', 'No credit card needed', 'Cancel anytime'].map(t => (
            <div key={t} className="flex items-center gap-1.5 text-sm font-medium" style={{ color: 'rgba(255,255,255,0.35)' }}>
              <CheckCircle size={12} className="text-[#32E6A4]" />
              {t}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

export function HomePage() {
  return (
    <>
      <HeroSection />
      <TrustBar />
      <FeatureBentoSection />
      <CTAStrip />
    </>
  );
}
