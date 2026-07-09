import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Eye, EyeOff, ArrowRight, ShieldCheck, Lock, Globe,
  Wrench, CreditCard, Bell, Package, MapPin, FileText,
  CheckCircle, TrendingUp,
} from 'lucide-react';
import { useTenantPortal } from './context';
import { useAuth } from '../../lib/auth';
import { users } from '../../data/mockData';

const DEMO_ACCOUNTS = [
  { email: 'tenant1@demo.com', name: 'James Thornton', role: 'Maple House · Room 1',  color: 'from-[#075DE8] to-[#0797D8]',   initials: 'JT' },
  { email: 'tenant2@demo.com', name: 'Emily Chang',    role: 'Birch Court · Unit 5',   color: 'from-violet-500 to-purple-600', initials: 'EC' },
  { email: 'manager@demo.com', name: 'Sarah Mitchell', role: 'Property Manager',        color: 'from-emerald-500 to-teal-500',  initials: 'SM' },
  { email: 'admin@demo.com',   name: 'Admin User',     role: 'System Administrator',    color: 'from-rose-500 to-orange-500',   initials: 'AU' },
];

const PREVIEW_STATS = [
  { icon: Wrench,     label: 'Open Tickets',  value: '2',  accent: '#F59E0B' },
  { icon: Package,    label: 'Parcels Ready', value: '1',  accent: '#3B82F6' },
  { icon: Bell,       label: 'Unread',        value: '3',  accent: '#8B5CF6' },
  { icon: TrendingUp, label: 'Rent Paid',     value: '✓',  accent: '#10B981' },
];

const FEATURES = [
  { icon: Wrench,     label: 'Maintenance',     desc: 'Log and track repairs in real-time' },
  { icon: CreditCard, label: 'Rent & Payments', desc: 'Pay rent and view full payment history' },
  { icon: MapPin,     label: 'Visitor Passes',  desc: 'Register guests and manage access' },
  { icon: FileText,   label: 'Documents',       desc: 'Tenancy docs, certs, and agreements' },
];

export function PortalLoginPage() {
  const [email, setEmail]             = useState('');
  const [password, setPassword]       = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError]             = useState('');
  const [loading, setLoading]         = useState(false);
  const [selectedDemo, setSelectedDemo] = useState<string | null>(null);
  const { login }             = useTenantPortal();
  const { login: adminLogin } = useAuth();
  const navigate              = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    const result = login(email, password);
    if (!result.success) {
      setError(result.error ?? 'Invalid email or password');
      setLoading(false);
      return;
    }
    if (result.redirect) {
      const adminUser = users.find(u => u.email === 'admin@northbridge.org') ?? users[0];
      adminLogin(adminUser);
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
    <div className="min-h-screen flex overflow-hidden" style={{ background: '#030810' }}>

      {/* ── LEFT PANEL ──────────────────────────────────────────────────── */}
      <motion.aside
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.65, ease: [0.25, 0.1, 0.25, 1] }}
        className="hidden lg:flex flex-col w-[54%] flex-shrink-0 relative overflow-hidden"
        style={{ background: 'linear-gradient(150deg, #04091A 0%, #060D22 40%, #071530 70%, #0A1D42 100%)' }}
      >
        {/* Animated ambient blobs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <motion.div
            animate={{ x: [0, 35, -20, 0], y: [0, -45, 22, 0], scale: [1, 1.12, 0.93, 1] }}
            transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -top-40 -left-40 w-[650px] h-[650px] rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(7,93,232,0.18) 0%, transparent 65%)' }}
          />
          <motion.div
            animate={{ x: [0, -28, 18, 0], y: [0, 32, -18, 0], scale: [1, 0.88, 1.12, 1] }}
            transition={{ duration: 28, repeat: Infinity, ease: 'easeInOut', delay: 5 }}
            className="absolute bottom-0 -right-20 w-[550px] h-[550px] rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(21,198,184,0.15) 0%, transparent 65%)' }}
          />
          <motion.div
            animate={{ x: [0, 18, -14, 0], y: [0, -18, 28, 0] }}
            transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[380px] h-[380px] rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.09) 0%, transparent 65%)' }}
          />
          {/* Dot grid */}
          <div className="absolute inset-0 opacity-[0.04]"
            style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.6) 1px, transparent 1px)', backgroundSize: '28px 28px' }}
          />
          <div className="hero-scan absolute inset-0" />
        </div>

        <div className="relative z-10 flex flex-col h-full px-10 xl:px-14 py-10">

          {/* Uphold logo */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.5 }}
            className="mb-10"
          >
            <img src="/uphold-logo-transparent.png" alt="Uphold" className="h-12 w-auto object-contain" />
            <div className="flex items-center gap-3 mt-2.5">
              <div className="h-px flex-1" style={{ background: 'rgba(255,255,255,0.08)' }} />
              <span className="text-[10px] font-bold text-white/25 uppercase tracking-[0.22em]">Resident Portal</span>
              <div className="h-px flex-1" style={{ background: 'rgba(255,255,255,0.08)' }} />
            </div>
          </motion.div>

          {/* Headline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.6 }}
            className="mb-7"
          >
            <h1 className="text-4xl xl:text-[2.75rem] font-bold leading-[1.1] text-white tracking-tight">
              Your home,<br />
              <span className="text-uphold-gradient-animated">at your fingertips.</span>
            </h1>
            <p className="text-white/40 text-sm xl:text-[0.9rem] leading-relaxed mt-4 max-w-[360px]">
              Manage your tenancy, report issues, track payments, and stay connected — all in one place.
            </p>
          </motion.div>

          {/* Floating mini-dashboard preview */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.38, duration: 0.65 }}
            className="mb-7"
          >
            <motion.div
              animate={{ y: [0, -7, 0] }}
              transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
              className="rounded-2xl overflow-hidden shadow-[0_24px_64px_rgba(0,0,0,0.5)]"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(16px)' }}
            >
              {/* Chrome bar */}
              <div className="flex items-center gap-2 px-4 py-2.5 border-b" style={{ borderColor: 'rgba(255,255,255,0.07)', background: 'rgba(0,0,0,0.25)' }}>
                <div className="flex gap-1.5">
                  {['#FF5F57','#FFBD2E','#28C840'].map((c,i) => (
                    <div key={i} className="w-2 h-2 rounded-full" style={{ backgroundColor: c, opacity: 0.65 }} />
                  ))}
                </div>
                <div className="flex-1 mx-2 px-2.5 py-0.5 rounded" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <span className="text-[9px] text-white/20 font-mono">portal.uphold.co.uk / dashboard</span>
                </div>
              </div>

              <div className="p-4">
                {/* Header row */}
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-[9px] text-white/30 uppercase tracking-wider">Good morning,</p>
                    <p className="text-white text-sm font-bold leading-none mt-0.5">James Thornton</p>
                  </div>
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full" style={{ background: 'rgba(50,230,164,0.12)', border: '1px solid rgba(50,230,164,0.22)' }}>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#32E6A4] animate-pulse" />
                    <span className="text-[9px] text-[#32E6A4] font-semibold">Lease Active</span>
                  </div>
                </div>

                {/* Stat cards */}
                <div className="grid grid-cols-4 gap-2 mb-3">
                  {PREVIEW_STATS.map((s, i) => (
                    <motion.div
                      key={s.label}
                      initial={{ opacity: 0, scale: 0.85 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.55 + i * 0.1, duration: 0.3 }}
                      className="flex flex-col items-center p-2.5 rounded-xl"
                      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}
                    >
                      <div className="w-6 h-6 rounded-lg flex items-center justify-center mb-1.5" style={{ background: `${s.accent}20` }}>
                        <s.icon size={11} style={{ color: s.accent }} />
                      </div>
                      <p className="text-xs font-bold text-white">{s.value}</p>
                      <p className="text-[7.5px] text-white/30 text-center leading-tight mt-0.5">{s.label}</p>
                    </motion.div>
                  ))}
                </div>

                {/* Payment bar */}
                <div className="flex items-center gap-3 p-2.5 rounded-xl" style={{ background: 'rgba(7,93,232,0.1)', border: '1px solid rgba(7,93,232,0.16)' }}>
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'rgba(7,93,232,0.2)' }}>
                    <CreditCard size={12} className="text-[#5BA4F5]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[8px] text-white/35 uppercase tracking-wide">Next Rent Due</p>
                    <p className="text-[11px] font-bold text-white leading-tight">£850.00 · 1 August 2026</p>
                  </div>
                  <span className="text-[8px] font-bold px-2 py-0.5 rounded-full" style={{ background: 'rgba(50,230,164,0.15)', color: '#32E6A4' }}>ON TIME</span>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Feature list */}
          <div className="space-y-2.5 mb-auto">
            {FEATURES.map((f, i) => (
              <motion.div
                key={f.label}
                initial={{ opacity: 0, x: -14 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + i * 0.08 }}
                className="flex items-center gap-3"
              >
                <div className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(7,93,232,0.15)', border: '1px solid rgba(7,93,232,0.2)' }}>
                  <CheckCircle size={12} className="text-[#5BA4F5]" />
                </div>
                <span className="text-[13px] text-white/55 leading-tight">
                  <span className="font-semibold text-white/80">{f.label}</span> — {f.desc}
                </span>
              </motion.div>
            ))}
          </div>

          {/* Demo accounts */}
          <div className="mt-10 pt-8" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
            <p className="text-[10px] font-bold text-white/22 uppercase tracking-[0.22em] mb-3">
              Demo Accounts · Click to fill
            </p>
            <div className="grid grid-cols-2 gap-2">
              {DEMO_ACCOUNTS.map(acc => (
                <motion.button
                  key={acc.email}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => quickLogin(acc)}
                  className="flex items-center gap-2.5 p-3 rounded-xl text-left transition-all"
                  style={{
                    background: selectedDemo === acc.email ? 'rgba(7,93,232,0.15)' : 'rgba(255,255,255,0.04)',
                    border: `1px solid ${selectedDemo === acc.email ? 'rgba(7,93,232,0.38)' : 'rgba(255,255,255,0.07)'}`,
                  }}
                >
                  <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${acc.color} flex items-center justify-center text-white text-[11px] font-bold flex-shrink-0 shadow-lg`}>
                    {acc.initials}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-white text-[12px] font-semibold leading-tight truncate">{acc.name}</p>
                    <p className="text-white/35 text-[10px] leading-tight truncate mt-0.5">{acc.role}</p>
                  </div>
                  {selectedDemo === acc.email && (
                    <CheckCircle size={13} className="text-[#32E6A4] flex-shrink-0" />
                  )}
                </motion.button>
              ))}
            </div>
            <p className="text-white/18 text-[10px] mt-2.5 text-center">
              All accounts use password:{' '}
              <span className="font-mono text-white/35 font-semibold">password123</span>
            </p>
          </div>

          {/* Trust line */}
          <div className="mt-5 flex items-center gap-2.5 text-white/18 text-xs">
            <ShieldCheck size={11} />
            <span>GDPR Compliant · ISO 27001 Certified · UK Data Residency</span>
          </div>
        </div>
      </motion.aside>

      {/* ── RIGHT PANEL (form) ──────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.15 }}
        className="flex-1 flex flex-col relative"
        style={{ background: '#060C1A' }}
      >
        {/* Top gradient bar */}
        <div className="h-[2px] bg-uphold-gradient flex-shrink-0" />

        {/* Subtle grid */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.022]"
          style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)', backgroundSize: '48px 48px' }}
        />

        <div className="flex-1 flex items-center justify-center px-7 sm:px-10 py-12 overflow-y-auto relative z-10">
          <div className="w-full max-w-[400px]">

            {/* Mobile logo */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex lg:hidden flex-col items-center mb-8"
            >
              <img src="/uphold-logo-transparent.png" alt="Uphold" className="h-12 w-auto object-contain mb-2" />
              <span className="text-[10px] font-bold text-white/25 uppercase tracking-[0.2em]">Resident Portal</span>
            </motion.div>

            {/* Heading */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.22, duration: 0.5 }}
              className="mb-8"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-4" style={{ background: 'rgba(50,230,164,0.1)', border: '1px solid rgba(50,230,164,0.2)' }}>
                <span className="w-1.5 h-1.5 rounded-full bg-[#32E6A4] animate-pulse" />
                <span className="text-xs text-[#32E6A4] font-semibold">Portal Access</span>
              </div>
              <h2 className="text-3xl font-bold text-white leading-tight">Welcome back</h2>
              <p className="text-white/35 text-sm mt-1.5">Sign in to your resident account</p>
            </motion.div>

            {/* Mobile demo accounts */}
            <div className="lg:hidden mb-7">
              <p className="text-[10px] font-bold text-white/25 uppercase tracking-wider mb-3">Quick Sign-In</p>
              <div className="grid grid-cols-2 gap-2">
                {DEMO_ACCOUNTS.map(acc => (
                  <button
                    key={acc.email}
                    onClick={() => quickLogin(acc)}
                    className="flex items-center gap-2.5 p-3 rounded-xl text-left transition-all"
                    style={{
                      background: selectedDemo === acc.email ? 'rgba(7,93,232,0.15)' : 'rgba(255,255,255,0.04)',
                      border: `1px solid ${selectedDemo === acc.email ? 'rgba(7,93,232,0.3)' : 'rgba(255,255,255,0.08)'}`,
                    }}
                  >
                    <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${acc.color} flex items-center justify-center text-white text-[11px] font-bold flex-shrink-0`}>
                      {acc.initials}
                    </div>
                    <div className="min-w-0">
                      <p className="text-white text-[12px] font-semibold leading-tight truncate">{acc.name}</p>
                      <p className="text-white/35 text-[10px] leading-tight truncate">{acc.role}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Form card */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.28, duration: 0.5 }}
            >
              <form
                onSubmit={handleSubmit}
                className="rounded-2xl p-6 space-y-5"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
              >
                {/* Email */}
                <div>
                  <label className="block text-sm font-semibold text-white/60 mb-2">Email address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => { setEmail(e.target.value); setError(''); }}
                    placeholder="you@example.com"
                    required
                    autoComplete="email"
                    className="w-full px-4 py-3.5 rounded-xl text-white placeholder-white/20 text-sm transition-all focus:outline-none"
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.09)' }}
                    onFocus={e => { (e.target as HTMLInputElement).style.border = '1px solid rgba(7,93,232,0.55)'; (e.target as HTMLInputElement).style.background = 'rgba(7,93,232,0.08)'; }}
                    onBlur={e => { (e.target as HTMLInputElement).style.border = '1px solid rgba(255,255,255,0.09)'; (e.target as HTMLInputElement).style.background = 'rgba(255,255,255,0.05)'; }}
                  />
                </div>

                {/* Password */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-semibold text-white/60">Password</label>
                    <button type="button" className="text-xs font-medium text-[#5BA4F5] hover:text-[#38BDF8] transition-colors">
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
                      className="w-full px-4 py-3.5 pr-12 rounded-xl text-white placeholder-white/20 text-sm transition-all focus:outline-none"
                      style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.09)' }}
                      onFocus={e => { (e.target as HTMLInputElement).style.border = '1px solid rgba(7,93,232,0.55)'; (e.target as HTMLInputElement).style.background = 'rgba(7,93,232,0.08)'; }}
                      onBlur={e => { (e.target as HTMLInputElement).style.border = '1px solid rgba(255,255,255,0.09)'; (e.target as HTMLInputElement).style.background = 'rgba(255,255,255,0.05)'; }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(v => !v)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-white/30 hover:text-white/60 transition-colors"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {/* Error */}
                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -6, height: 0 }}
                      animate={{ opacity: 1, y: 0, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="flex items-center gap-2.5 px-4 py-3 rounded-xl"
                      style={{ background: 'rgba(244,63,94,0.1)', border: '1px solid rgba(244,63,94,0.25)' }}
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-rose-500 flex-shrink-0" />
                      <p className="text-sm text-rose-400">{error}</p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Submit */}
                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={!loading ? { scale: 1.01, boxShadow: '0 8px 40px rgba(7,93,232,0.55)' } : {}}
                  whileTap={!loading ? { scale: 0.99 } : {}}
                  className="w-full flex items-center justify-center gap-2.5 py-4 rounded-xl font-semibold text-sm text-white bg-uphold-gradient transition-all disabled:opacity-60 disabled:cursor-not-allowed shadow-[0_4px_24px_rgba(7,93,232,0.35)]"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      Sign In to Portal
                      <ArrowRight size={16} />
                    </>
                  )}
                </motion.button>
              </form>
            </motion.div>

            {/* Trust badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.45 }}
              className="flex items-center justify-center gap-5 mt-6"
            >
              {[
                { icon: ShieldCheck, label: 'Encrypted' },
                { icon: Lock,        label: 'GDPR Compliant' },
                { icon: Globe,       label: 'UK Data' },
              ].map(b => (
                <div key={b.label} className="flex items-center gap-1.5">
                  <b.icon size={12} className="text-white/22" />
                  <span className="text-xs text-white/22">{b.label}</span>
                </div>
              ))}
            </motion.div>

            <p className="mt-5 text-xs text-center text-white/14">
              © 2026 Uphold Technologies Ltd · NorthBridge Housing
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
