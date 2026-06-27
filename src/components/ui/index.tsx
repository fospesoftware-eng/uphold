import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2 } from 'lucide-react';

// ── Badge ─────────────────────────────────────────────────────────────────────
type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'info' | 'muted';
interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

const badgeStyles: Record<BadgeVariant, string> = {
  default: 'bg-[#E6EEF5] text-[#0F172A] dark:bg-[#1E2D45] dark:text-[#F8FAFC]',
  success: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400',
  warning: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
  danger: 'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-400',
  info: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  muted: 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400',
};

export function Badge({ variant = 'default', children, className = '' }: BadgeProps) {
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${badgeStyles[variant]} ${className}`}>
      {children}
    </span>
  );
}

// ── StatusPill ────────────────────────────────────────────────────────────────
interface StatusPillProps {
  status: string;
  className?: string;
}

const statusConfig: Record<string, { label: string; variant: BadgeVariant; dot: string }> = {
  active: { label: 'Active', variant: 'success', dot: 'bg-emerald-500' },
  at_risk: { label: 'At Risk', variant: 'danger', dot: 'bg-rose-500' },
  pending: { label: 'Pending', variant: 'warning', dot: 'bg-amber-500' },
  moved_on: { label: 'Moved On', variant: 'muted', dot: 'bg-slate-400' },
  valid: { label: 'Valid', variant: 'success', dot: 'bg-emerald-500' },
  expiring_soon: { label: 'Expiring Soon', variant: 'warning', dot: 'bg-amber-500' },
  expired: { label: 'Expired', variant: 'danger', dot: 'bg-rose-500' },
  missing: { label: 'Missing', variant: 'danger', dot: 'bg-rose-500' },
  complete: { label: 'Complete', variant: 'success', dot: 'bg-emerald-500' },
  pending_signature: { label: 'Pending Signature', variant: 'warning', dot: 'bg-amber-500' },
  signed: { label: 'Signed', variant: 'success', dot: 'bg-emerald-500' },
  paid: { label: 'Paid', variant: 'success', dot: 'bg-emerald-500' },
  overdue: { label: 'Overdue', variant: 'danger', dot: 'bg-rose-500' },
  part_paid: { label: 'Part Paid', variant: 'warning', dot: 'bg-amber-500' },
  written_off: { label: 'Written Off', variant: 'muted', dot: 'bg-slate-400' },
  completed: { label: 'Completed', variant: 'success', dot: 'bg-emerald-500' },
  scheduled: { label: 'Scheduled', variant: 'info', dot: 'bg-blue-500' },
  in_progress: { label: 'In Progress', variant: 'warning', dot: 'bg-amber-500' },
  not_claimed: { label: 'Not Claimed', variant: 'muted', dot: 'bg-slate-400' },
  confirmed: { label: 'Confirmed', variant: 'success', dot: 'bg-emerald-500' },
};

export function StatusPill({ status, className = '' }: StatusPillProps) {
  const config = statusConfig[status] ?? { label: status, variant: 'muted' as BadgeVariant, dot: 'bg-slate-400' };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${badgeStyles[config.variant]} ${className}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {config.label}
    </span>
  );
}

// ── Card ──────────────────────────────────────────────────────────────────────
interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hover?: boolean;
  onClick?: () => void;
}

export function Card({ children, className = '', padding = 'md', hover = false, onClick }: CardProps) {
  const paddings = { none: '', sm: 'p-4', md: 'p-6', lg: 'p-8' };
  return (
    <div
      onClick={onClick}
      className={`bg-white dark:bg-[#111827] border border-[#E6EEF5] dark:border-[#1E2D45] rounded-xl shadow-[0_1px_2px_rgba(15,23,42,.06),0_8px_24px_rgba(15,23,42,.04)] ${paddings[padding]} ${hover ? 'cursor-pointer transition-all duration-200 hover:shadow-[0_4px_16px_rgba(7,93,232,.12)] hover:-translate-y-0.5' : ''} ${className}`}
    >
      {children}
    </div>
  );
}

// ── Button ────────────────────────────────────────────────────────────────────
type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

const btnVariants: Record<ButtonVariant, string> = {
  primary: 'bg-uphold-gradient text-white hover:opacity-90 shadow-[0_2px_8px_rgba(7,93,232,.3)]',
  secondary: 'bg-[#E6EEF5] dark:bg-[#1E2D45] text-[#0F172A] dark:text-[#F8FAFC] hover:bg-[#D1E2F0] dark:hover:bg-[#253557]',
  ghost: 'bg-transparent text-[#334155] dark:text-[#CBD5E1] hover:bg-[#F8FAFC] dark:hover:bg-[#1E2D45]',
  danger: 'bg-rose-500 text-white hover:bg-rose-600',
  outline: 'border border-[#E6EEF5] dark:border-[#1E2D45] bg-transparent text-[#334155] dark:text-[#CBD5E1] hover:bg-[#F8FAFC] dark:hover:bg-[#1E2D45]',
};

const btnSizes: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-xs gap-1.5',
  md: 'px-4 py-2 text-sm gap-2',
  lg: 'px-6 py-3 text-base gap-2.5',
};

export function Button({
  variant = 'primary', size = 'md', loading, leftIcon, rightIcon, fullWidth,
  children, className = '', disabled, ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center font-medium rounded-[10px] transition-all duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#15C6B8] disabled:opacity-50 disabled:cursor-not-allowed ${btnVariants[variant]} ${btnSizes[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
    >
      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : leftIcon}
      {children}
      {!loading && rightIcon}
    </button>
  );
}

// ── Input ─────────────────────────────────────────────────────────────────────
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftElement?: React.ReactNode;
  rightElement?: React.ReactNode;
}

export function Input({ label, error, hint, leftElement, rightElement, className = '', id, ...props }: InputProps) {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-');
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-[#334155] dark:text-[#CBD5E1]">
          {label}{props.required && <span className="text-rose-500 ml-0.5">*</span>}
        </label>
      )}
      <div className="relative">
        {leftElement && <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#64748B]">{leftElement}</div>}
        <input
          id={inputId}
          {...props}
          className={`w-full rounded-[10px] border border-[#E6EEF5] dark:border-[#1E2D45] bg-white dark:bg-[#111827] text-[#0F172A] dark:text-[#F8FAFC] placeholder:text-[#64748B] text-sm py-2.5 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-[#15C6B8] focus:border-transparent disabled:opacity-50 ${leftElement ? 'pl-10' : 'px-3.5'} ${rightElement ? 'pr-10' : 'pr-3.5'} ${error ? 'border-rose-400 focus:ring-rose-400' : ''} ${className}`}
        />
        {rightElement && <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748B]">{rightElement}</div>}
      </div>
      {error && <p className="text-xs text-rose-500">{error}</p>}
      {hint && !error && <p className="text-xs text-[#64748B]">{hint}</p>}
    </div>
  );
}

// ── Select ────────────────────────────────────────────────────────────────────
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
}

export function Select({ label, error, options, className = '', id, ...props }: SelectProps) {
  const selectId = id ?? label?.toLowerCase().replace(/\s+/g, '-');
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={selectId} className="text-sm font-medium text-[#334155] dark:text-[#CBD5E1]">
          {label}{props.required && <span className="text-rose-500 ml-0.5">*</span>}
        </label>
      )}
      <select
        id={selectId}
        {...props}
        className={`w-full rounded-[10px] border border-[#E6EEF5] dark:border-[#1E2D45] bg-white dark:bg-[#111827] text-[#0F172A] dark:text-[#F8FAFC] text-sm px-3.5 py-2.5 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-[#15C6B8] focus:border-transparent disabled:opacity-50 ${error ? 'border-rose-400' : ''} ${className}`}
      >
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      {error && <p className="text-xs text-rose-500">{error}</p>}
    </div>
  );
}

// ── Textarea ──────────────────────────────────────────────────────────────────
interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export function Textarea({ label, error, hint, className = '', id, ...props }: TextareaProps) {
  const taId = id ?? label?.toLowerCase().replace(/\s+/g, '-');
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={taId} className="text-sm font-medium text-[#334155] dark:text-[#CBD5E1]">
          {label}{props.required && <span className="text-rose-500 ml-0.5">*</span>}
        </label>
      )}
      <textarea
        id={taId}
        {...props}
        className={`w-full rounded-[10px] border border-[#E6EEF5] dark:border-[#1E2D45] bg-white dark:bg-[#111827] text-[#0F172A] dark:text-[#F8FAFC] placeholder:text-[#64748B] text-sm px-3.5 py-2.5 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-[#15C6B8] focus:border-transparent resize-y min-h-[100px] ${error ? 'border-rose-400' : ''} ${className}`}
      />
      {error && <p className="text-xs text-rose-500">{error}</p>}
      {hint && !error && <p className="text-xs text-[#64748B]">{hint}</p>}
    </div>
  );
}

// ── Avatar ────────────────────────────────────────────────────────────────────
interface AvatarProps {
  name: string;
  src?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const avatarSizes = { xs: 'w-6 h-6 text-[10px]', sm: 'w-8 h-8 text-xs', md: 'w-10 h-10 text-sm', lg: 'w-12 h-12 text-base', xl: 'w-16 h-16 text-lg' };
const gradients = ['from-[#075DE8] to-[#15C6B8]', 'from-[#0797D8] to-[#32E6A4]', 'from-[#15C6B8] to-[#075DE8]', 'from-purple-500 to-[#0797D8]', 'from-[#32E6A4] to-[#0797D8]'];

export function Avatar({ name, src, size = 'md', className = '' }: AvatarProps) {
  const initials = name.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase();
  const gradientIndex = name.charCodeAt(0) % gradients.length;
  if (src) return <img src={src} alt={name} className={`rounded-full object-cover ${avatarSizes[size]} ${className}`} />;
  return (
    <div className={`rounded-full bg-gradient-to-br ${gradients[gradientIndex]} flex items-center justify-center text-white font-semibold flex-shrink-0 ${avatarSizes[size]} ${className}`}>
      {initials}
    </div>
  );
}

// ── Skeleton ──────────────────────────────────────────────────────────────────
interface SkeletonProps {
  className?: string;
  lines?: number;
}

export function Skeleton({ className = '' }: SkeletonProps) {
  return <div className={`skeleton rounded-lg ${className}`} aria-hidden />;
}

export function SkeletonCard() {
  return (
    <Card>
      <div className="space-y-3">
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="h-3 w-1/2" />
      </div>
    </Card>
  );
}

// ── Progress Bar ──────────────────────────────────────────────────────────────
interface ProgressBarProps {
  value: number;
  max?: number;
  className?: string;
  showLabel?: boolean;
  variant?: 'default' | 'success' | 'warning' | 'danger';
  animated?: boolean;
}

const progressColors = {
  default: 'bg-uphold-gradient',
  success: 'bg-emerald-500',
  warning: 'bg-amber-500',
  danger: 'bg-rose-500',
};

export function ProgressBar({ value, max = 100, className = '', showLabel, variant = 'default', animated }: ProgressBarProps) {
  const pct = Math.min(100, Math.round((value / max) * 100));
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="flex-1 h-2 bg-[#E6EEF5] dark:bg-[#1E2D45] rounded-full overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${progressColors[variant]} ${animated ? 'gradient-animate' : ''}`}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.1 }}
        />
      </div>
      {showLabel && <span className="text-xs text-[#64748B] tabular-nums w-8 text-right">{pct}%</span>}
    </div>
  );
}

// ── Progress Ring ─────────────────────────────────────────────────────────────
interface ProgressRingProps {
  value: number;
  size?: number;
  strokeWidth?: number;
  children?: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger';
}

const ringColors = {
  default: 'stroke-[#075DE8]',
  success: 'stroke-emerald-500',
  warning: 'stroke-amber-500',
  danger: 'stroke-rose-500',
};

export function ProgressRing({ value, size = 80, strokeWidth = 6, children, variant = 'default' }: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;
  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} strokeWidth={strokeWidth} className="stroke-[#E6EEF5] dark:stroke-[#1E2D45] fill-none" />
        <motion.circle
          cx={size / 2} cy={size / 2} r={radius} strokeWidth={strokeWidth}
          className={`${ringColors[variant]} fill-none`}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
        />
      </svg>
      {children && <div className="absolute inset-0 flex items-center justify-center">{children}</div>}
    </div>
  );
}

// ── Stat Card ─────────────────────────────────────────────────────────────────
interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  trend?: { value: number; label: string };
  variant?: 'default' | 'gradient' | 'warning' | 'danger' | 'success';
  className?: string;
}

export function StatCard({ title, value, subtitle, icon, trend, variant = 'default', className = '' }: StatCardProps) {
  const isGradient = variant === 'gradient';
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className={`rounded-xl border shadow-[0_1px_2px_rgba(15,23,42,.06),0_8px_24px_rgba(15,23,42,.04)] p-6 ${
        isGradient
          ? 'bg-uphold-gradient border-transparent text-white'
          : variant === 'warning'
          ? 'bg-amber-50 dark:bg-amber-900/10 border-amber-200 dark:border-amber-900/30'
          : variant === 'danger'
          ? 'bg-rose-50 dark:bg-rose-900/10 border-rose-200 dark:border-rose-900/30'
          : variant === 'success'
          ? 'bg-emerald-50 dark:bg-emerald-900/10 border-emerald-200 dark:border-emerald-900/30'
          : 'bg-white dark:bg-[#111827] border-[#E6EEF5] dark:border-[#1E2D45]'
      } ${className}`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className={`text-sm font-medium mb-1 ${isGradient ? 'text-white/80' : 'text-[#64748B] dark:text-[#94A3B8]'}`}>{title}</p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className={`text-2xl font-bold font-display count-up ${isGradient ? 'text-white' : 'text-[#0F172A] dark:text-[#F8FAFC]'}`}
          >
            {value}
          </motion.p>
          {subtitle && <p className={`text-xs mt-1 ${isGradient ? 'text-white/70' : 'text-[#64748B]'}`}>{subtitle}</p>}
          {trend && (
            <div className={`flex items-center gap-1 mt-2 text-xs font-medium ${
              trend.value >= 0
                ? isGradient ? 'text-white/80' : 'text-emerald-600'
                : 'text-rose-500'
            }`}>
              <span>{trend.value >= 0 ? '↑' : '↓'} {Math.abs(trend.value)}%</span>
              <span className={`font-normal ${isGradient ? 'text-white/60' : 'text-[#64748B]'}`}>{trend.label}</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-xl ${isGradient ? 'bg-white/20' : 'bg-uphold-gradient-subtle'}`}>
          <div className={isGradient ? 'text-white' : 'text-[#075DE8]'}>{icon}</div>
        </div>
      </div>
    </motion.div>
  );
}

// ── Empty State ───────────────────────────────────────────────────────────────
interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({ icon, title, description, action, className = '' }: EmptyStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center py-16 text-center ${className}`}>
      {icon && <div className="w-16 h-16 rounded-2xl bg-uphold-gradient-subtle flex items-center justify-center text-[#075DE8] mb-4">{icon}</div>}
      <p className="text-base font-semibold text-[#0F172A] dark:text-[#F8FAFC] mb-1">{title}</p>
      {description && <p className="text-sm text-[#64748B] max-w-xs mb-4">{description}</p>}
      {action}
    </div>
  );
}

// ── Page Header ───────────────────────────────────────────────────────────────
interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  breadcrumb?: { label: string; href?: string }[];
}

export function PageHeader({ title, subtitle, actions, breadcrumb }: PageHeaderProps) {
  return (
    <div className="flex items-start justify-between mb-6">
      <div>
        {breadcrumb && (
          <div className="flex items-center gap-1.5 text-xs text-[#64748B] mb-2">
            {breadcrumb.map((crumb, i) => (
              <React.Fragment key={i}>
                {i > 0 && <span>/</span>}
                <span className={i === breadcrumb.length - 1 ? 'text-[#0F172A] dark:text-[#F8FAFC] font-medium' : 'hover:text-[#075DE8] cursor-pointer'}>
                  {crumb.label}
                </span>
              </React.Fragment>
            ))}
          </div>
        )}
        <h1 className="text-2xl font-bold font-display text-[#0F172A] dark:text-[#F8FAFC]">{title}</h1>
        {subtitle && <p className="text-sm text-[#64748B] mt-0.5">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-3 flex-shrink-0 ml-4">{actions}</div>}
    </div>
  );
}

// ── Tabs ──────────────────────────────────────────────────────────────────────
interface TabsProps {
  tabs: { id: string; label: string; count?: number; icon?: React.ReactNode }[];
  active: string;
  onChange: (id: string) => void;
  className?: string;
}

export function Tabs({ tabs, active, onChange, className = '' }: TabsProps) {
  return (
    <div className={`flex border-b border-[#E6EEF5] dark:border-[#1E2D45] overflow-x-auto ${className}`}>
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={`relative flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#15C6B8] ${
            active === tab.id
              ? 'text-[#075DE8]'
              : 'text-[#64748B] hover:text-[#334155] dark:hover:text-[#CBD5E1]'
          }`}
        >
          {tab.icon}
          {tab.label}
          {tab.count !== undefined && (
            <span className={`px-1.5 py-0.5 rounded-full text-xs ${active === tab.id ? 'bg-[#E6EEF5] dark:bg-[#1E2D45] text-[#075DE8]' : 'bg-[#F1F5F9] dark:bg-[#1E2D45] text-[#64748B]'}`}>
              {tab.count}
            </span>
          )}
          {active === tab.id && (
            <motion.div
              layoutId="tab-indicator"
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-uphold-gradient rounded-full"
            />
          )}
        </button>
      ))}
    </div>
  );
}

// ── Modal ─────────────────────────────────────────────────────────────────────
interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const modalSizes = { sm: 'max-w-md', md: 'max-w-lg', lg: 'max-w-2xl', xl: 'max-w-4xl' };

export function Modal({ open, onClose, title, children, footer, size = 'md' }: ModalProps) {
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal aria-labelledby="modal-title">
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className={`relative z-10 w-full ${modalSizes[size]} bg-white dark:bg-[#111827] rounded-2xl shadow-[0_25px_60px_rgba(15,23,42,.25)] flex flex-col max-h-[90vh]`}
          >
            <div className="flex items-center justify-between p-6 border-b border-[#E6EEF5] dark:border-[#1E2D45]">
              <h2 id="modal-title" className="text-lg font-semibold font-display text-[#0F172A] dark:text-[#F8FAFC]">{title}</h2>
              <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-[#F8FAFC] dark:hover:bg-[#1E2D45] text-[#64748B] transition-colors">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6">{children}</div>
            {footer && <div className="p-6 border-t border-[#E6EEF5] dark:border-[#1E2D45]">{footer}</div>}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

// ── Drawer ────────────────────────────────────────────────────────────────────
interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  side?: 'right' | 'left';
  size?: 'sm' | 'md' | 'lg';
}

const drawerSizes = { sm: 'w-full sm:w-96', md: 'w-full sm:w-[480px]', lg: 'w-full sm:w-[640px]' };

export function Drawer({ open, onClose, title, children, footer, side = 'right', size = 'md' }: DrawerProps) {
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex" role="dialog" aria-modal aria-labelledby="drawer-title">
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
          />
          <div className={`relative z-10 ml-auto flex flex-col ${drawerSizes[size]} bg-white dark:bg-[#111827] shadow-[0_0_60px_rgba(15,23,42,.25)]`}>
            <motion.div
              initial={{ x: side === 'right' ? '100%' : '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: side === 'right' ? '100%' : '-100%' }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="flex flex-col h-full"
            >
              <div className="flex items-center justify-between p-6 border-b border-[#E6EEF5] dark:border-[#1E2D45]">
                <h2 id="drawer-title" className="text-lg font-semibold font-display text-[#0F172A] dark:text-[#F8FAFC]">{title}</h2>
                <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-[#F8FAFC] dark:hover:bg-[#1E2D45] text-[#64748B] transition-colors">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-6">{children}</div>
              {footer && <div className="p-6 border-t border-[#E6EEF5] dark:border-[#1E2D45]">{footer}</div>}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}

// ── Toast ─────────────────────────────────────────────────────────────────────
interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info' | 'warning';
  onClose?: () => void;
}

export function Toast({ message, type = 'success', onClose }: ToastProps) {
  const colors = {
    success: 'bg-emerald-50 border-emerald-200 text-emerald-800',
    error: 'bg-rose-50 border-rose-200 text-rose-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800',
    warning: 'bg-amber-50 border-amber-200 text-amber-800',
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 16, scale: 0.95 }}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg text-sm font-medium ${colors[type]}`}
    >
      {message}
      {onClose && (
        <button onClick={onClose} className="ml-2 opacity-60 hover:opacity-100">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      )}
    </motion.div>
  );
}

// ── Stepper ───────────────────────────────────────────────────────────────────
interface StepperProps {
  steps: string[];
  current: number;
}

export function Stepper({ steps, current }: StepperProps) {
  return (
    <div className="flex items-center gap-0" aria-label="Progress">
      {steps.map((step, i) => (
        <React.Fragment key={i}>
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all duration-300 ${
              i < current ? 'bg-uphold-gradient text-white' : i === current ? 'bg-uphold-gradient text-white ring-4 ring-[#E6EEF5]' : 'bg-[#E6EEF5] dark:bg-[#1E2D45] text-[#64748B]'
            }`}>
              {i < current ? '✓' : i + 1}
            </div>
            <span className={`text-xs font-medium hidden sm:block ${i === current ? 'text-[#075DE8]' : i < current ? 'text-[#334155] dark:text-[#CBD5E1]' : 'text-[#64748B]'}`}>
              {step}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div className={`flex-1 h-px mx-2 sm:mx-4 transition-all duration-300 ${i < current ? 'bg-[#075DE8]' : 'bg-[#E6EEF5] dark:bg-[#1E2D45]'}`} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

// ── DataTable ─────────────────────────────────────────────────────────────────
interface Column<T> {
  key: keyof T | string;
  header: string;
  render?: (row: T) => React.ReactNode;
  sortable?: boolean;
  width?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  emptyState?: React.ReactNode;
  onRowClick?: (row: T) => void;
  keyExtractor: (row: T) => string;
  selectable?: boolean;
  selected?: string[];
  onSelect?: (keys: string[]) => void;
}

export function DataTable<T>({
  columns, data, loading, emptyState, onRowClick, keyExtractor,
  selectable, selected = [], onSelect
}: DataTableProps<T>) {
  const toggleSelect = (key: string) => {
    if (!onSelect) return;
    onSelect(selected.includes(key) ? selected.filter(k => k !== key) : [...selected, key]);
  };

  if (loading) return (
    <div className="space-y-2 p-4">
      {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-12" />)}
    </div>
  );

  if (!data.length && emptyState) return <>{emptyState}</>;

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm" role="grid">
        <thead>
          <tr className="border-b border-[#E6EEF5] dark:border-[#1E2D45]">
            {selectable && (
              <th className="px-4 py-3 text-left w-8">
                <input
                  type="checkbox"
                  className="rounded border-[#E6EEF5] accent-[#075DE8]"
                  checked={selected.length === data.length && data.length > 0}
                  onChange={() => onSelect?.(selected.length === data.length ? [] : data.map(keyExtractor))}
                />
              </th>
            )}
            {columns.map(col => (
              <th key={String(col.key)} className={`px-4 py-3 text-left font-semibold text-[#64748B] text-xs uppercase tracking-wide ${col.width ?? ''}`}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <motion.tr
              key={keyExtractor(row)}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03, duration: 0.2 }}
              className={`border-b border-[#E6EEF5] dark:border-[#1E2D45] table-row-hover transition-colors ${onRowClick ? 'cursor-pointer' : ''}`}
              onClick={() => onRowClick?.(row)}
            >
              {selectable && (
                <td className="px-4 py-3.5" onClick={e => e.stopPropagation()}>
                  <input
                    type="checkbox"
                    className="rounded border-[#E6EEF5] accent-[#075DE8]"
                    checked={selected.includes(keyExtractor(row))}
                    onChange={() => toggleSelect(keyExtractor(row))}
                  />
                </td>
              )}
              {columns.map(col => (
                <td key={String(col.key)} className="px-4 py-3.5 text-[#334155] dark:text-[#CBD5E1]">
                  {col.render ? col.render(row) : String((row as Record<string, unknown>)[String(col.key)] ?? '')}
                </td>
              ))}
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ── FilterBar ─────────────────────────────────────────────────────────────────
interface FilterBarProps {
  search: string;
  onSearch: (v: string) => void;
  placeholder?: string;
  filters?: React.ReactNode;
  actions?: React.ReactNode;
}

export function FilterBar({ search, onSearch, placeholder = 'Search...', filters, actions }: FilterBarProps) {
  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-4">
      <div className="relative flex-1">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="search"
          placeholder={placeholder}
          value={search}
          onChange={e => onSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-[10px] border border-[#E6EEF5] dark:border-[#1E2D45] bg-white dark:bg-[#111827] text-sm text-[#0F172A] dark:text-[#F8FAFC] placeholder:text-[#64748B] focus:outline-none focus:ring-2 focus:ring-[#15C6B8]"
        />
      </div>
      {filters}
      {actions}
    </div>
  );
}

// ── Tooltip ───────────────────────────────────────────────────────────────────
interface TooltipProps {
  content: string;
  children: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

export function Tooltip({ content, children, position = 'top' }: TooltipProps) {
  const [show, setShow] = useState(false);
  const pos = { top: 'bottom-full mb-2', bottom: 'top-full mt-2', left: 'right-full mr-2', right: 'left-full ml-2' };
  return (
    <div className="relative inline-flex" onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
      {children}
      <AnimatePresence>
        {show && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.1 }}
            className={`absolute left-1/2 -translate-x-1/2 ${pos[position]} z-50 px-2.5 py-1.5 bg-[#0F172A] text-white text-xs rounded-lg whitespace-nowrap pointer-events-none`}
          >
            {content}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function useState<T>(init: T): [T, (v: T) => void] {
  return React.useState(init);
}
