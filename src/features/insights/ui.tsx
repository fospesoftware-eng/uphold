import {
  AlertOctagon, AlertTriangle, TrendingUp, CheckCircle2, Info,
  Building2, DollarSign, ShieldCheck, Users, Wrench, HeartHandshake,
} from 'lucide-react';
import type { InsightSeverity, InsightCategory } from './insightsData';

export const SEVERITY: Record<InsightSeverity, {
  label: string; icon: React.ReactNode; text: string; bg: string; dot: string; ring: string;
}> = {
  critical:    { label: 'Critical',    icon: <AlertOctagon size={15} />,  text: 'text-rose-700 dark:text-rose-300',    bg: 'bg-rose-50 dark:bg-rose-900/20',    dot: 'bg-rose-500',    ring: 'border-rose-200 dark:border-rose-900/40' },
  warning:     { label: 'Warning',     icon: <AlertTriangle size={15} />, text: 'text-amber-700 dark:text-amber-300',  bg: 'bg-amber-50 dark:bg-amber-900/20',  dot: 'bg-amber-500',   ring: 'border-amber-200 dark:border-amber-900/40' },
  opportunity: { label: 'Opportunity', icon: <TrendingUp size={15} />,    text: 'text-violet-700 dark:text-violet-300', bg: 'bg-violet-50 dark:bg-violet-900/20', dot: 'bg-violet-500', ring: 'border-violet-200 dark:border-violet-900/40' },
  positive:    { label: 'On track',    icon: <CheckCircle2 size={15} />,  text: 'text-emerald-700 dark:text-emerald-300', bg: 'bg-emerald-50 dark:bg-emerald-900/20', dot: 'bg-emerald-500', ring: 'border-emerald-200 dark:border-emerald-900/40' },
  info:        { label: 'Info',        icon: <Info size={15} />,          text: 'text-blue-700 dark:text-blue-300',    bg: 'bg-blue-50 dark:bg-blue-900/20',    dot: 'bg-blue-500',    ring: 'border-blue-200 dark:border-blue-900/40' },
};

export const CATEGORY_ICON: Record<InsightCategory, React.ReactNode> = {
  occupancy: <Building2 size={14} />,
  finance: <DollarSign size={14} />,
  compliance: <ShieldCheck size={14} />,
  risk: <Users size={14} />,
  maintenance: <Wrench size={14} />,
  support: <HeartHandshake size={14} />,
};

export function healthColor(score: number): string {
  return score >= 80 ? '#10B981' : score >= 65 ? '#F59E0B' : '#F43F5E';
}
