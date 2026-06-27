import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

export type FeatureVisualVariant =
  | 'wellbeing' | 'compliance' | 'financial' | 'documents' | 'reports' | 'access';

const C = {
  blue: '#075DE8', sky: '#0797D8', teal: '#15C6B8', mint: '#32E6A4',
  indigo: '#6366F1', violet: '#8B5CF6', amber: '#F59E0B', red: '#EF4444', green: '#10B981',
};

function Shell({ glow, children }: { glow: string; children: React.ReactNode }) {
  return (
    <div className="relative h-48 lg:h-56 rounded-2xl overflow-hidden bg-[#07101F] border border-white/10">
      {/* glow */}
      <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse at 32% 18%, ${glow}, transparent 62%)` }} />
      {/* grid texture */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.06]" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="grid" width="28" height="28" patternUnits="userSpaceOnUse">
            <path d="M28 0H0V28" fill="none" stroke="#fff" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>
      {/* AI chip */}
      <span className="absolute top-3 left-3 z-10 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/10 border border-white/15 text-[10px] font-semibold text-white/80 backdrop-blur-sm">
        <Sparkles size={9} className="text-[#32E6A4]" /> AI-powered
      </span>
      {children}
    </div>
  );
}

const pulse = (delay: number) => ({
  animate: { scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] },
  transition: { duration: 2, repeat: Infinity, delay, ease: 'easeInOut' as const },
});

function Wellbeing() {
  const nodes = [
    { x: 110, y: 70, c: C.teal }, { x: 300, y: 60, c: C.mint },
    { x: 320, y: 150, c: C.sky }, { x: 90, y: 160, c: C.blue },
    { x: 200, y: 40, c: C.mint }, { x: 200, y: 185, c: C.teal },
  ];
  return (
    <svg viewBox="0 0 400 224" className="absolute inset-0 w-full h-full">
      <defs>
        <linearGradient id="wSweep" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={C.teal} stopOpacity="0" />
          <stop offset="100%" stopColor={C.teal} stopOpacity="0.45" />
        </linearGradient>
      </defs>
      {[40, 74, 108].map(r => (
        <circle key={r} cx="200" cy="112" r={r} fill="none" stroke={C.teal} strokeOpacity="0.22" strokeWidth="1" />
      ))}
      {nodes.map((n, i) => (
        <line key={`l${i}`} x1="200" y1="112" x2={n.x} y2={n.y} stroke={C.sky} strokeOpacity="0.18" strokeWidth="1" />
      ))}
      <motion.g
        style={{ transformBox: 'view-box', transformOrigin: '200px 112px' }}
        animate={{ rotate: 360 }}
        transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
      >
        <path d="M200 112 L200 4 A108 108 0 0 1 308 112 Z" fill="url(#wSweep)" />
      </motion.g>
      {nodes.map((n, i) => (
        <motion.circle key={i} cx={n.x} cy={n.y} r="5" fill={n.c} {...pulse(i * 0.3)} />
      ))}
      <circle cx="200" cy="112" r="9" fill={C.blue} />
      <circle cx="200" cy="112" r="9" fill="none" stroke="#fff" strokeOpacity="0.5" strokeWidth="1" />
    </svg>
  );
}

function Compliance() {
  const checks = [{ x: 150, y: 95 }, { x: 250, y: 95 }, { x: 150, y: 140 }, { x: 250, y: 140 }];
  return (
    <svg viewBox="0 0 400 224" className="absolute inset-0 w-full h-full">
      <path d="M200 40 L260 64 V120 C260 160 232 182 200 196 C168 182 140 160 140 120 V64 Z"
        fill={C.indigo} fillOpacity="0.14" stroke={C.violet} strokeOpacity="0.5" strokeWidth="1.5" />
      {checks.map((c, i) => (
        <motion.g key={i} initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: [0, 1.2, 1], opacity: [0, 1, 1] }}
          transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2.6, delay: i * 0.35 }}
          style={{ transformBox: 'fill-box', transformOrigin: 'center' }}>
          <circle cx={c.x} cy={c.y} r="11" fill={C.violet} fillOpacity="0.18" stroke={C.violet} strokeWidth="1" />
          <path d={`M${c.x - 4} ${c.y} l3 3 l5 -6`} fill="none" stroke={C.mint} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </motion.g>
      ))}
      <motion.line x1="130" x2="270" stroke={C.teal} strokeWidth="2" strokeOpacity="0.8"
        animate={{ y1: [56, 196, 56], y2: [56, 196, 56] }}
        transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }} />
    </svg>
  );
}

function Financial() {
  const bars = [60, 100, 80, 140, 120, 170];
  return (
    <svg viewBox="0 0 400 224" className="absolute inset-0 w-full h-full">
      {bars.map((h, i) => (
        <motion.rect key={i} x={70 + i * 45} width="26" rx="4" fill={i === bars.length - 1 ? C.mint : C.teal} fillOpacity={i === bars.length - 1 ? 0.95 : 0.55}
          initial={{ height: 0, y: 190 }}
          animate={{ height: [0, h, h], y: [190, 190 - h, 190 - h] }}
          transition={{ duration: 1, repeat: Infinity, repeatDelay: 2.2, delay: i * 0.12, ease: 'easeOut' }} />
      ))}
      <motion.path d="M83 150 L128 120 L173 132 L218 80 L263 95 L308 50"
        fill="none" stroke={C.mint} strokeWidth="2.5" strokeLinecap="round"
        initial={{ pathLength: 0 }} animate={{ pathLength: [0, 1, 1] }}
        transition={{ duration: 1.6, repeat: Infinity, repeatDelay: 1.8 }} />
      {[150, 120, 132, 80, 95, 50].map((y, i) => (
        <motion.circle key={i} cx={83 + i * 45} cy={y} r="3.5" fill="#fff" {...pulse(i * 0.2)} />
      ))}
    </svg>
  );
}

function Documents() {
  const lines = [60, 76, 92, 108, 124, 140];
  return (
    <svg viewBox="0 0 400 224" className="absolute inset-0 w-full h-full">
      <rect x="130" y="36" width="140" height="160" rx="10" fill="#0E1B30" stroke={C.indigo} strokeOpacity="0.5" strokeWidth="1.5" />
      {lines.map((y, i) => (
        <rect key={i} x="150" y={y} width={i % 2 ? 80 : 100} height="6" rx="3" fill="#fff" fillOpacity="0.16" />
      ))}
      {/* signature */}
      <motion.path d="M152 168 q10 -16 20 0 t20 0 q8 -10 18 -2"
        fill="none" stroke={C.violet} strokeWidth="2.5" strokeLinecap="round"
        initial={{ pathLength: 0 }} animate={{ pathLength: [0, 1, 1] }}
        transition={{ duration: 1.4, repeat: Infinity, repeatDelay: 2 }} />
      {/* scan line */}
      <motion.rect x="130" width="140" height="3" fill={C.teal} fillOpacity="0.85"
        animate={{ y: [36, 196, 36] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }} />
      <motion.circle cx="270" cy="36" r="14" fill={C.mint} fillOpacity="0.18" stroke={C.mint} strokeWidth="1.5" {...pulse(0)} />
    </svg>
  );
}

function Reports() {
  return (
    <svg viewBox="0 0 400 224" className="absolute inset-0 w-full h-full">
      <defs>
        <linearGradient id="rArea" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={C.amber} stopOpacity="0.35" />
          <stop offset="100%" stopColor={C.amber} stopOpacity="0" />
        </linearGradient>
      </defs>
      {[60, 100, 140, 180].map(y => (
        <line key={y} x1="50" y1={y} x2="350" y2={y} stroke="#fff" strokeOpacity="0.07" strokeWidth="1" />
      ))}
      <motion.path d="M50 170 L110 130 L170 150 L230 90 L290 110 L350 60 L350 196 L50 196 Z"
        fill="url(#rArea)" initial={{ opacity: 0 }} animate={{ opacity: [0, 1, 1] }} transition={{ duration: 1.4, repeat: Infinity, repeatDelay: 2 }} />
      <motion.path d="M50 170 L110 130 L170 150 L230 90 L290 110 L350 60"
        fill="none" stroke={C.amber} strokeWidth="2.5" strokeLinecap="round"
        initial={{ pathLength: 0 }} animate={{ pathLength: [0, 1, 1] }} transition={{ duration: 1.6, repeat: Infinity, repeatDelay: 1.8 }} />
      {[170, 130, 150, 90, 110, 60].map((y, i) => (
        <motion.circle key={i} cx={50 + i * 60} cy={y} r="3.5" fill="#fff" {...pulse(i * 0.2)} />
      ))}
    </svg>
  );
}

function Access() {
  const nodes = [
    { x: 90, y: 70 }, { x: 310, y: 70 }, { x: 90, y: 160 }, { x: 310, y: 160 },
  ];
  return (
    <svg viewBox="0 0 400 224" className="absolute inset-0 w-full h-full">
      {nodes.map((n, i) => (
        <motion.line key={i} x1="200" y1="112" x2={n.x} y2={n.y} stroke={C.green} strokeWidth="1.5"
          animate={{ strokeOpacity: [0.15, 0.6, 0.15] }} transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }} />
      ))}
      {nodes.map((n, i) => (
        <g key={i}>
          <motion.circle cx={n.x} cy={n.y} r="16" fill="#0E1B30" stroke={C.green} strokeOpacity="0.5" strokeWidth="1.5" {...pulse(i * 0.25)} />
          <circle cx={n.x} cy={n.y} r="6" fill={C.teal} fillOpacity="0.8" />
        </g>
      ))}
      {/* central lock */}
      <circle cx="200" cy="112" r="26" fill={C.green} fillOpacity="0.16" stroke={C.green} strokeOpacity="0.6" strokeWidth="1.5" />
      <rect x="188" y="108" width="24" height="20" rx="4" fill={C.mint} />
      <path d="M192 108 v-6 a8 8 0 0 1 16 0 v6" fill="none" stroke={C.mint} strokeWidth="2.5" />
    </svg>
  );
}

const variants: Record<FeatureVisualVariant, () => React.ReactElement> = {
  wellbeing: Wellbeing, compliance: Compliance, financial: Financial,
  documents: Documents, reports: Reports, access: Access,
};

export function FeatureVisual({ variant, glow }: { variant: FeatureVisualVariant; glow: string }) {
  const Visual = variants[variant];
  return <Shell glow={glow}><Visual /></Shell>;
}
