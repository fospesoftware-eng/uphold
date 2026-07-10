// ─────────────────────────────────────────────────────────────────────────────
// PropertyArt — premium, self-contained SVG imagery for listings.
//
// No external images (CSP-safe on static hosting). Each artwork is deterministic
// from a `seed` + `variant`, producing an architectural, editorial-looking scene
// with layered gradients, sky, structure and foreground. Used for cover images
// and the detail-page gallery (Exterior / Living / Kitchen / Bedroom / etc.).
// ─────────────────────────────────────────────────────────────────────────────

import type { ListingTier } from './listings';

type Variant = 'exterior' | 'living' | 'kitchen' | 'bedroom' | 'bathroom' | 'view';

const PALETTES: Record<ListingTier, { sky: [string, string]; body: string; accent: string; roof: string }> = {
  luxury:     { sky: ['#1B2A4A', '#3E5C89'], body: '#E8EDF5', accent: '#C9A96A', roof: '#2A3A57' },
  premium:    { sky: ['#0E7490', '#38BDF8'], body: '#EAF2F7', accent: '#0EA5E9', roof: '#334155' },
  affordable: { sky: ['#F59E0B', '#FCD9A1'], body: '#F5EDE2', accent: '#B45309', roof: '#8B5E34' },
  commercial: { sky: ['#334155', '#64748B'], body: '#D9E0E8', accent: '#0F172A', roof: '#1E293B' },
  student:    { sky: ['#6D28D9', '#A78BFA'], body: '#EFEAF9', accent: '#7C3AED', roof: '#4C1D95' },
};

function rand(seed: number) {
  // deterministic pseudo-random in [0,1)
  const x = Math.sin(seed * 999.13) * 10000;
  return x - Math.floor(x);
}

function variantFromLabel(label?: string): Variant {
  const l = (label || '').toLowerCase();
  if (l.includes('living')) return 'living';
  if (l.includes('kitchen')) return 'kitchen';
  if (l.includes('bedroom')) return 'bedroom';
  if (l.includes('bath')) return 'bathroom';
  if (l.includes('balcony') || l.includes('view')) return 'view';
  return 'exterior';
}

interface Props {
  seed: number;
  tier: ListingTier;
  label?: string;
  className?: string;
  rounded?: boolean;
}

export function PropertyArt({ seed, tier, label, className = '', rounded = false }: Props) {
  const p = PALETTES[tier];
  const v = variantFromLabel(label);
  const gid = `g${seed}${v}`;
  const r = (n: number) => rand(seed + n);

  return (
    <svg
      viewBox="0 0 400 300"
      preserveAspectRatio="xMidYMid slice"
      className={className}
      style={{ display: 'block', width: '100%', height: '100%', borderRadius: rounded ? 16 : 0 }}
      role="img"
      aria-label={label ? `${label} illustration` : 'Property illustration'}
    >
      <defs>
        <linearGradient id={`${gid}-sky`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={p.sky[0]} />
          <stop offset="100%" stopColor={p.sky[1]} />
        </linearGradient>
        <linearGradient id={`${gid}-body`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={p.body} />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0.65" />
        </linearGradient>
        <linearGradient id={`${gid}-glass`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.55" />
          <stop offset="100%" stopColor={p.accent} stopOpacity="0.25" />
        </linearGradient>
      </defs>

      {/* sky / backdrop */}
      <rect width="400" height="300" fill={`url(#${gid}-sky)`} />
      <circle cx={70 + r(1) * 260} cy={54 + r(2) * 30} r={26} fill="#ffffff" opacity="0.18" />
      <circle cx={40 + r(3) * 320} cy={80 + r(4) * 20} r={16} fill="#ffffff" opacity="0.12" />

      {v === 'exterior' && <Exterior gid={gid} p={p} r={r} />}
      {v === 'view' && <ViewScene gid={gid} p={p} r={r} />}
      {(v === 'living' || v === 'bedroom') && <Room gid={gid} p={p} r={r} kind={v} />}
      {v === 'kitchen' && <Kitchen gid={gid} p={p} r={r} />}
      {v === 'bathroom' && <Bathroom gid={gid} p={p} r={r} />}

      {/* subtle vignette for depth */}
      <rect width="400" height="300" fill="url(#vgn)" opacity="0.0" />
    </svg>
  );
}

type P = (typeof PALETTES)[ListingTier];

function Exterior({ gid, p, r }: { gid: string; p: P; r: (n: number) => number }) {
  const floors = 3 + Math.floor(r(5) * 4);
  const winCols = 3 + Math.floor(r(6) * 2);
  return (
    <>
      {/* ground */}
      <rect y="240" width="400" height="60" fill={p.roof} opacity="0.25" />
      {/* building */}
      <rect x="90" y={110} width="220" height="130" fill={`url(#${gid}-body)`} />
      <rect x="90" y={110} width="220" height="14" fill={p.roof} />
      {/* windows grid */}
      {Array.from({ length: floors }).map((_, fr) =>
        Array.from({ length: winCols }).map((_, c) => (
          <rect
            key={`${fr}-${c}`}
            x={110 + c * (200 / winCols)}
            y={132 + fr * 22}
            width={200 / winCols - 14}
            height={14}
            rx={2}
            fill={`url(#${gid}-glass)`}
            opacity={0.9}
          />
        ))
      )}
      {/* door */}
      <rect x="185" y="205" width="30" height="35" rx="3" fill={p.accent} />
      {/* accent tree */}
      <circle cx={340} cy={215} r={26} fill="#3f7a54" opacity="0.85" />
      <rect x={337} y={215} width={6} height={28} fill="#5b3a29" />
    </>
  );
}

function ViewScene({ gid, p, r }: { gid: string; p: P; r: (n: number) => number }) {
  return (
    <>
      {/* distant skyline */}
      {Array.from({ length: 8 }).map((_, i) => (
        <rect
          key={i}
          x={20 + i * 46}
          y={150 - r(i + 1) * 60}
          width={34}
          height={200}
          fill={p.roof}
          opacity={0.35 + r(i + 2) * 0.25}
        />
      ))}
      {/* water / horizon */}
      <rect y="210" width="400" height="90" fill={p.accent} opacity="0.35" />
      {/* balcony rail (foreground) */}
      <rect y="250" width="400" height="8" fill="#ffffff" opacity="0.7" />
      {Array.from({ length: 20 }).map((_, i) => (
        <rect key={i} x={i * 21} y={250} width={3} height={50} fill="#ffffff" opacity="0.55" />
      ))}
    </>
  );
}

function Room({ gid, p, r, kind }: { gid: string; p: P; r: (n: number) => number; kind: 'living' | 'bedroom' }) {
  return (
    <>
      {/* wall + floor */}
      <rect width="400" height="220" fill={`url(#${gid}-body)`} />
      <rect y="220" width="400" height="80" fill={p.roof} opacity="0.30" />
      {/* window with light */}
      <rect x="255" y="60" width="110" height="120" rx="6" fill={`url(#${gid}-glass)`} />
      <rect x="255" y="60" width="110" height="120" rx="6" fill="none" stroke={p.accent} strokeWidth="3" opacity="0.5" />
      {kind === 'living' ? (
        <>
          {/* sofa */}
          <rect x="40" y="170" width="150" height="50" rx="10" fill={p.accent} opacity="0.85" />
          <rect x="40" y="150" width="150" height="28" rx="8" fill={p.accent} opacity="0.65" />
          {/* rug + table */}
          <ellipse cx="150" cy="248" rx="120" ry="20" fill="#ffffff" opacity="0.35" />
          <rect x="120" y="228" width="70" height="16" rx="4" fill={p.roof} opacity="0.6" />
        </>
      ) : (
        <>
          {/* bed */}
          <rect x="40" y="165" width="180" height="55" rx="8" fill="#ffffff" opacity="0.9" />
          <rect x="40" y="150" width="180" height="22" rx="8" fill={p.accent} opacity="0.5" />
          <rect x="55" y="150" width="45" height="20" rx="6" fill="#ffffff" />
          <rect x="120" y="150" width="45" height="20" rx="6" fill="#ffffff" />
        </>
      )}
      {/* plant */}
      <circle cx={r(9) * 30 + 360} cy={190} r={18} fill="#3f7a54" opacity="0.8" />
    </>
  );
}

function Kitchen({ gid, p }: { gid: string; p: P; r: (n: number) => number }) {
  return (
    <>
      <rect width="400" height="220" fill={`url(#${gid}-body)`} />
      <rect y="220" width="400" height="80" fill={p.roof} opacity="0.30" />
      {/* upper cabinets */}
      <rect x="30" y="70" width="200" height="34" rx="4" fill={p.roof} opacity="0.55" />
      {/* counter */}
      <rect x="20" y="180" width="360" height="20" rx="4" fill="#ffffff" opacity="0.9" />
      <rect x="20" y="200" width="360" height="40" fill={p.accent} opacity="0.75" />
      {/* island */}
      <rect x="250" y="150" width="120" height="20" rx="4" fill="#ffffff" opacity="0.9" />
      {/* pendant lights */}
      {[280, 320].map((x) => (
        <g key={x}>
          <line x1={x} y1="70" x2={x} y2="120" stroke={p.roof} strokeWidth="2" />
          <circle cx={x} cy="126" r="7" fill={p.accent} />
        </g>
      ))}
      {/* window */}
      <rect x="270" y="70" width="100" height="60" rx="4" fill={`url(#${gid}-glass)`} />
    </>
  );
}

function Bathroom({ gid, p }: { gid: string; p: P; r: (n: number) => number }) {
  return (
    <>
      <rect width="400" height="220" fill={`url(#${gid}-body)`} />
      {/* tiles */}
      {Array.from({ length: 6 }).map((_, r2) =>
        Array.from({ length: 10 }).map((_, c) => (
          <rect key={`${r2}-${c}`} x={c * 40} y={r2 * 20} width={38} height={18} fill="#ffffff" opacity="0.10" />
        ))
      )}
      <rect y="220" width="400" height="80" fill={p.roof} opacity="0.30" />
      {/* tub */}
      <rect x="40" y="180" width="180" height="50" rx="24" fill="#ffffff" opacity="0.95" />
      {/* mirror + basin */}
      <rect x="270" y="80" width="80" height="60" rx="6" fill={`url(#${gid}-glass)`} />
      <rect x="280" y="180" width="60" height="18" rx="6" fill="#ffffff" opacity="0.95" />
      <rect x="300" y="150" width="20" height="34" fill={p.accent} opacity="0.6" />
    </>
  );
}
