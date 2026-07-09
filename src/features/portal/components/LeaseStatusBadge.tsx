import { motion } from 'framer-motion';
import { getLeaseInfo, type LeaseState } from '../lease';

const PALETTE: Record<LeaseState, { dot: string; text: string; bg: string; border: string; glow: string }> = {
  active: {
    dot: '#10B981', text: '#059669',
    bg: 'rgba(16,185,129,0.10)', border: 'rgba(16,185,129,0.28)', glow: 'rgba(16,185,129,0.55)',
  },
  expiring_soon: {
    dot: '#F59E0B', text: '#D97706',
    bg: 'rgba(245,158,11,0.12)', border: 'rgba(245,158,11,0.30)', glow: 'rgba(245,158,11,0.55)',
  },
  expired: {
    dot: '#F43F5E', text: '#E11D48',
    bg: 'rgba(244,63,94,0.12)', border: 'rgba(244,63,94,0.30)', glow: 'rgba(244,63,94,0.55)',
  },
};

interface Props {
  leaseEnd: string;
  /** 'pill' = full coloured pill with label + detail. 'inline' = dot + label only (for dark hero). */
  variant?: 'pill' | 'inline';
  /** Force light/dark text treatment for the inline variant. */
  tone?: 'auto' | 'light';
  showDetail?: boolean;
  className?: string;
}

export function LeaseStatusBadge({ leaseEnd, variant = 'pill', tone = 'auto', showDetail = true, className = '' }: Props) {
  const info = getLeaseInfo(leaseEnd);
  const c = PALETTE[info.state];

  // A gently pulsing status dot with an expanding glow ring — reused by both variants.
  const Dot = (
    <span className="relative inline-flex flex-shrink-0" style={{ width: 8, height: 8 }}>
      <motion.span
        className="absolute inset-0 rounded-full"
        style={{ background: c.dot }}
        animate={{ opacity: [0.6, 0, 0.6], scale: [1, 2.6, 1] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: 'easeOut' }}
      />
      <span className="relative rounded-full w-2 h-2" style={{ background: c.dot, boxShadow: `0 0 6px ${c.glow}` }} />
    </span>
  );

  if (variant === 'inline') {
    return (
      <motion.span
        initial={{ opacity: 0, x: -4 }} animate={{ opacity: 1, x: 0 }}
        className={`inline-flex items-center gap-1.5 text-sm ${className}`}
      >
        {Dot}
        <span className="font-semibold" style={{ color: tone === 'light' ? c.dot : c.text }}>{info.label}</span>
      </motion.span>
    );
  }

  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', stiffness: 320, damping: 24 }}
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full ${className}`}
      style={{ background: c.bg, border: `1px solid ${c.border}` }}
    >
      {Dot}
      <span className="text-xs font-bold" style={{ color: c.text }}>{info.shortLabel}</span>
      {showDetail && <span className="text-[11px] font-medium" style={{ color: c.text, opacity: 0.7 }}>· {info.detail}</span>}
    </motion.span>
  );
}
