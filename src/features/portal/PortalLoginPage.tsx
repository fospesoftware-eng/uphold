import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Eye, EyeOff, ArrowRight, Building2, ShieldCheck,
  Wrench, CreditCard, Bell, Package, MapPin, FileText,
  CheckCircle, TrendingUp,
} from 'lucide-react';
import { useTenantPortal } from './context';
import { useAuth } from '../../lib/auth';
import { users } from '../../data/mockData';

const DEMO_ACCOUNTS = [
  { email: 'tenant1@demo.com', name: 'James Thornton', role: 'Resident · Maple House',  color: 'from-[#075DE8] to-[#0EA5E9]', initials: 'JT' },
  { email: 'tenant2@demo.com', name: 'Emily Chang',    role: 'Resident · Birch Court',  color: 'from-violet-500 to-purple-600', initials: 'EC' },
  { email: 'manager@demo.com', name: 'Sarah Mitchell', role: 'Property Manager',         color: 'from-emerald-500 to-teal-600', initials: 'SM' },
  { email: 'admin@demo.com',   name: 'Admin User',     role: 'System Administrator',     color: 'from-rose-500 to-orange-500',  initials: 'AU' },
];

// Simulated dashboard preview cards shown in left panel
const PREVIEW_STATS = [
  { icon: Wrench,   label: 'Open Tickets',    value: '2',  color: 'text-amber-400',  bg: 'bg-amber-400/15' },
  { icon: Package,  label: 'Parcels Ready',   value: '1',  color: 'text-blue-300',   bg: 'bg-blue-300/15' },
  { icon: Bell,     label: 'Unread',          value: '1',  color: 'text-violet-300', bg: 'bg-violet-300/15' },
  { icon: TrendingUp, label: 'Rent Paid',     value: '✓',  color: 'text-emerald-300', bg: 'bg-emerald-300/15' },
];

const FEATURES = [
  { icon: Wrench,   label: 'Maintenance',  desc: 'Log and track repair requests in real-time' },
  { icon: CreditCard, label: 'Payments',  desc: 'Pay rent and view payment history' },
  { icon: MapPin,   label: 'Visitors',    desc: 'Register guests and manage access passes' },
  { icon: FileText, label: 'Documents',   desc: 'Access your tenancy docs and certificates' },
];

export function PortalLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedDemo, setSelectedDemo] = useState<string | null>(null);
  const { login } = useTenantPortal();
  const { login: adminLogin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    await new Promise(r => setTimeout(r, 700));
    const result = login(email, password);
    if (!result.success) {
      setError(result.error ?? 'Invalid email or password');
      setLoading(false);
      return;
    }
    if (result.redirect) {
      const adminUser = users.find(u => u.email === email.replace('@demo.com', '@northbridge.org') || u.email === 'admin@northbridge.org');
      adminLogin(adminUser ?? users[0]);
      navigate(result.redirect, { replace: true });
    } else {
      navigate('/portal/dashboard', { replace: true });
    }
    setLoading(false);
  };

  const quickLogin = (acc: typeof DEMO_ACCOUNTS[0]) => {
    setSelectedDemo(acc.email);
    setEmail(acc.email);
    setPassword('password123');
    setError('');
  };

  return (
    <div className="min-h-screen flex bg-white dark:bg-[#0A0F1E] overflow-hidden">

      {/* ── LEFT: Hero panel — 50% on desktop ── */}
      <motion.aside
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
        className="hidden lg:flex flex-col w-1/2 flex-shrink-0 relative overflow-hidden"
        style={{ background: 'linear-gradient(145deg, #040D20 0%, #061830 35%, #08234A 65%, #0A2E5C 100%)' }}
      >
        {/* Ambient glow blobs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/4 right-0 w-[500px] h-[500px] rounded-full bg-[#075DE8]/20 blur-[120px]" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-[#0EA5E9]/12 blur-[100px]" />
          <div className="absolute top-0 left-1/3 w-64 h-64 rounded-full bg-[#6366F1]/10 blur-[80px]" />
          {/* Grid pattern */}
          <div className="absolute inset-0 opacity-[0.03]"
            style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '48px 48px' }} />
        </div>

        <div className="relative z-10 flex flex-col h-full px-12 xl:px-16 py-12">
          {/* Brand */}
          <div className="flex items-center gap-3 mb-16">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#075DE8] to-[#0EA5E9] flex items-center justify-center shadow-xl shadow-blue-500/30 flex-shrink-0">
              <Building2 size={20} className="text-white" />
            </div>
            <div>
              <p className="font-bold text-white text-base leading-tight">NorthBridge</p>
              <p className="text-white/45 text-xs leading-tight">Resident Portal</p>
            </div>
          </div>

          {/* Headline */}
          <div className="mb-10">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-4xl xl:text-5xl font-bold leading-[1.15] text-white mb-4"
            >
              Your home,<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5BA4F5] to-[#38BDF8]">
                at your fingertips.
              </span>
            </motion.h1>
            <p className="text-white/55 text-sm xl:text-base leading-relaxed max-w-[380px]">
              Everything you need to manage your tenancy, report issues, and stay connected — in one place.
            </p>
          </div>

          {/* Dashboard preview widget */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.5 }}
            className="mb-10 p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm"
          >
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-white/50 text-xs">Good morning,</p>
                <p className="text-white font-semibold text-sm">James Thornton</p>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-400/15 border border-emerald-400/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]" />
                <span className="text-emerald-300 text-[11px] font-medium">Lease Active</span>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {PREVIEW_STATS.map(s => (
                <div key={s.label} className="flex flex-col items-center p-2.5 rounded-xl bg-white/5 border border-white/8">
                  <div className={`w-7 h-7 rounded-lg ${s.bg} flex items-center justify-center mb-1.5`}>
                    <s.icon size={13} className={s.color} />
                  </div>
                  <p className={`text-base font-bold ${s.color}`}>{s.value}</p>
                  <p className="text-white/35 text-[9px] text-center leading-tight mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Feature list */}
          <div className="space-y-2.5 mb-auto">
            {FEATURES.map((f, i) => (
              <motion.div
                key={f.label}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.08 }}
                className="flex items-center gap-3 group"
              >
                <div className="w-7 h-7 rounded-lg bg-white/8 border border-white/10 flex items-center justify-center flex-shrink-0">
                  <CheckCircle size={13} className="text-[#38BDF8]" />
                </div>
                <div>
                  <span className="text-white text-sm font-medium">{f.label}</span>
                  <span className="text-white/40 text-sm"> — {f.desc}</span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Demo accounts */}
          <div className="mt-12">
            <p className="text-[11px] font-bold text-white/35 uppercase tracking-widest mb-3">
              Demo Accounts · Click to fill
            </p>
            <div className="grid grid-cols-2 gap-2">
              {DEMO_ACCOUNTS.map(acc => (
                <motion.button
                  key={acc.email}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => quickLogin(acc)}
                  className={`flex items-center gap-2.5 p-3 rounded-xl border transition-all text-left ${
                    selectedDemo === acc.email
                      ? 'bg-white/12 border-white/25'
                      : 'bg-white/5 border-white/8 hover:bg-white/10 hover:border-white/18'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${acc.color} flex items-center justify-center text-white text-[11px] font-bold flex-shrink-0`}>
                    {acc.initials}
                  </div>
                  <div className="min-w-0">
                    <p className="text-white text-[12px] font-semibold leading-tight truncate">{acc.name}</p>
                    <p className="text-white/40 text-[10px] leading-tight truncate">{acc.role}</p>
                  </div>
                  {selectedDemo === acc.email && (
                    <CheckCircle size={13} className="text-emerald-400 flex-shrink-0 ml-auto" />
                  )}
                </motion.button>
              ))}
            </div>
            <p className="text-white/30 text-[10px] mt-2 text-center">
              All accounts use password: <span className="font-mono text-white/50 font-semibold">password123</span>
            </p>
          </div>

          {/* Footer */}
          <div className="mt-6 pt-5 border-t border-white/8 flex items-center gap-2 text-white/30 text-xs">
            <ShieldCheck size={12} />
            <span>GDPR Compliant · UK Data Residency · SOC 2 Ready</span>
          </div>
        </div>
      </motion.aside>

      {/* ── RIGHT: Form panel — 50% on desktop, full on mobile ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="flex-1 flex flex-col bg-[#F8FAFC] dark:bg-[#0F172A]"
      >
        {/* Top gradient strip */}
        <div className="h-1 bg-gradient-to-r from-[#075DE8] via-[#0EA5E9] to-[#38BDF8] flex-shrink-0" />

        <div className="flex-1 flex items-center justify-center px-6 sm:px-8 py-12 overflow-y-auto">
          <div className="w-full max-w-[420px]">

            {/* Mobile brand */}
            <div className="flex lg:hidden items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#075DE8] to-[#0EA5E9] flex items-center justify-center shadow-lg shadow-blue-500/25">
                <Building2 size={20} className="text-white" />
              </div>
              <div>
                <p className="font-bold text-[#0F172A] dark:text-white text-sm leading-tight">NorthBridge</p>
                <p className="text-[#94A3B8] text-xs">Resident Portal</p>
              </div>
            </div>

            {/* Heading */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.4 }}
              className="mb-8"
            >
              <h2 className="text-3xl font-bold text-[#0F172A] dark:text-white leading-tight">
                Welcome back
              </h2>
              <p className="text-[#64748B] dark:text-[#94A3B8] text-sm mt-1.5">
                Sign in to your resident account
              </p>
            </motion.div>

            {/* Mobile demo accounts */}
            <div className="lg:hidden mb-7">
              <p className="text-xs font-bold text-[#94A3B8] uppercase tracking-wider mb-3">Quick Sign-In</p>
              <div className="grid grid-cols-2 gap-2">
                {DEMO_ACCOUNTS.map(acc => (
                  <button
                    key={acc.email}
                    onClick={() => quickLogin(acc)}
                    className={`flex items-center gap-2.5 p-3 rounded-xl border transition-all text-left ${
                      selectedDemo === acc.email
                        ? 'border-[#075DE8]/40 bg-[#EFF6FF] dark:bg-[#1E2D45]'
                        : 'border-[#E6EEF5] dark:border-[#1E2D45] hover:border-[#075DE8]/30 hover:bg-[#F8FAFF] dark:hover:bg-[#1A2640]'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${acc.color} flex items-center justify-center text-white text-[11px] font-bold flex-shrink-0 shadow-sm`}>
                      {acc.initials}
                    </div>
                    <div className="min-w-0">
                      <p className="text-[12px] font-semibold text-[#334155] dark:text-[#CBD5E1] leading-tight truncate">{acc.name}</p>
                      <p className="text-[#94A3B8] text-[10px] leading-tight truncate">{acc.role}</p>
                    </div>
                  </button>
                ))}
              </div>
              <p className="text-[#94A3B8] text-xs mt-2.5 text-center">
                Password: <span className="font-mono font-semibold text-[#64748B]">password123</span>
              </p>
            </div>

            {/* Form card */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.4 }}
              className="bg-white dark:bg-[#111827] rounded-2xl border border-[#E6EEF5] dark:border-[#1E2D45] p-7 shadow-sm shadow-slate-200/60 dark:shadow-none"
            >
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Email */}
                <div>
                  <label className="block text-sm font-semibold text-[#334155] dark:text-[#CBD5E1] mb-2">
                    Email address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => { setEmail(e.target.value); setError(''); }}
                    placeholder="you@example.com"
                    required
                    autoComplete="email"
                    className="w-full px-4 py-3.5 rounded-xl border border-[#E2E8F0] dark:border-[#1E2D45] bg-[#F8FAFC] dark:bg-[#0F172A] text-[#0F172A] dark:text-white placeholder-[#CBD5E1] dark:placeholder-[#475569] focus:outline-none focus:ring-2 focus:ring-[#075DE8]/40 focus:border-[#075DE8] transition-all text-sm"
                  />
                </div>

                {/* Password */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-semibold text-[#334155] dark:text-[#CBD5E1]">
                      Password
                    </label>
                    <button type="button" className="text-xs font-medium text-[#075DE8] hover:text-[#0650CC] transition-colors">
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={e => { setPassword(e.target.value); setError(''); }}
                      placeholder="••••••••"
                      required
                      autoComplete="current-password"
                      className="w-full px-4 py-3.5 pr-12 rounded-xl border border-[#E2E8F0] dark:border-[#1E2D45] bg-[#F8FAFC] dark:bg-[#0F172A] text-[#0F172A] dark:text-white placeholder-[#CBD5E1] dark:placeholder-[#475569] focus:outline-none focus:ring-2 focus:ring-[#075DE8]/40 focus:border-[#075DE8] transition-all text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(v => !v)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-[#94A3B8] hover:text-[#64748B] dark:hover:text-[#CBD5E1] transition-colors"
                    >
                      {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                    </button>
                  </div>
                </div>

                {/* Error */}
                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -4, height: 0 }}
                      animate={{ opacity: 1, y: 0, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800/50"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-rose-500 flex-shrink-0" />
                      <p className="text-sm text-rose-600 dark:text-rose-400">{error}</p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2.5 py-4 rounded-xl bg-[#075DE8] hover:bg-[#0650CC] active:scale-[0.98] text-white font-semibold text-sm shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      Sign In
                      <ArrowRight size={17} />
                    </>
                  )}
                </button>
              </form>
            </motion.div>

            {/* Trust badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.4 }}
              className="flex items-center justify-center gap-4 mt-7"
            >
              {[
                { icon: ShieldCheck, label: 'Secure & Encrypted' },
                { icon: Building2,   label: 'GDPR Compliant' },
              ].map(b => (
                <div key={b.label} className="flex items-center gap-1.5">
                  <b.icon size={13} className="text-[#94A3B8]" />
                  <span className="text-xs text-[#94A3B8]">{b.label}</span>
                </div>
              ))}
            </motion.div>

            <p className="mt-6 text-xs text-center text-[#CBD5E1] dark:text-[#334155]">
              © 2026 NorthBridge Housing Ltd. All rights reserved.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
