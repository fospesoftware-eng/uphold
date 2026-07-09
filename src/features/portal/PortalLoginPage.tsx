import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Eye, EyeOff, ArrowRight, ShieldCheck, Lock, Globe,
  Wrench, CreditCard, Bell, Package, MapPin, FileText,
  CheckCircle, TrendingUp, Sparkles,
} from 'lucide-react';
import { useTenantPortal } from './context';
import { useAuth } from '../../lib/auth';
import { users } from '../../data/mockData';

const DEMO_ACCOUNTS = [
  { email: 'tenant1@demo.com',  name: 'James Thornton',  role: 'Maple House · Room 1',       color: 'from-[#075DE8] to-[#0797D8]',     initials: 'JT' },
  { email: 'tenant2@demo.com',  name: 'Emily Chang',     role: 'Birch Court · Unit 5',         color: 'from-violet-500 to-purple-600',   initials: 'EC' },
  { email: 'tenant3@demo.com',  name: 'Aisha Patel',     role: 'Oak Lodge · Flat 2A',          color: 'from-amber-500 to-orange-500',    initials: 'AP' },
  { email: 'tenant4@demo.com',  name: 'David Okafor',    role: 'Willow Grove · Room 7',        color: 'from-sky-500 to-cyan-500',        initials: 'DO' },
  { email: 'tenant5@demo.com',  name: 'Margaret Wilson', role: 'Cedar View · Studio 3',        color: 'from-emerald-500 to-teal-500',    initials: 'MW' },
  { email: 'tenant6@demo.com',  name: 'Raj Mehta',       role: 'Pine House · Flat 1B',         color: 'from-rose-500 to-pink-500',       initials: 'RM' },
  { email: 'manager@demo.com',  name: 'Sarah Mitchell',  role: 'Property Manager',             color: 'from-indigo-500 to-violet-600',   initials: 'SM' },
  { email: 'support@demo.com',  name: 'Lisa Carter',     role: 'Support Staff',                color: 'from-lime-500 to-green-500',      initials: 'LC' },
  { email: 'admin@demo.com',    name: 'Admin User',      role: 'System Administrator',         color: 'from-rose-500 to-red-600',        initials: 'AU' },
];

const PREVIEW_STATS = [
  { icon: Wrench,     label: 'Open',    value: '2', accent: '#F59E0B' },
  { icon: Package,    label: 'Parcels', value: '1', accent: '#3B82F6' },
  { icon: Bell,       label: 'Unread',  value: '3', accent: '#8B5CF6' },
  { icon: TrendingUp, label: 'Paid',    value: '✓', accent: '#10B981' },
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
    await new Promise(r => setTimeout(r, 700));
    const result = login(email, password);
    if (!result.success) {
      setError(result.error ?? 'Invalid email or password');
      setLoading(false);
      return;
    }
    if (result.redirect) {
      const adminUser = users.find(u => u.email === 'admin@granvillehomes.org') ?? users[0];
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
    <div className="min-h-screen flex overflow-hidden" style={{ background: '#03070F' }}>

      {/* LEFT PANEL — dark, rich, animated */}
      <motion.aside
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.55, ease: [0.25, 0.1, 0.25, 1] }}
        className="hidden lg:flex flex-col w-[48%] xl:w-[44%] flex-shrink-0 relative overflow-hidden"
        style={{ background: 'linear-gradient(150deg, #04091A 0%, #060D22 40%, #071530 70%, #0A1D42 100%)' }}
      >
        {/* Ambient orbs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <motion.div
            animate={{ x: [0, 35, -20, 0], y: [0, -45, 22, 0], scale: [1, 1.12, 0.93, 1] }}
            transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -top-40 -left-40 w-[550px] h-[550px] rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(7,93,232,0.15) 0%, transparent 65%)' }}
          />
          <motion.div
            animate={{ x: [0, -28, 18, 0], y: [0, 32, -18, 0], scale: [1, 0.88, 1.12, 1] }}
            transition={{ duration: 28, repeat: Infinity, ease: 'easeInOut', delay: 5 }}
            className="absolute bottom-0 -right-20 w-[450px] h-[450px] rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(21,198,184,0.12) 0%, transparent 65%)' }}
          />
          <div className="absolute inset-0 opacity-[0.03]"
            style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.6) 1px, transparent 1px)', backgroundSize: '28px 28px' }}
          />
        </div>

        <div className="relative z-10 flex flex-col h-full px-9 py-8">

          {/* Logo */}
          <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }} className="mb-8">
            <img src="/granville-logo.svg" alt="Granville Community Homes" className="h-12 xl:h-14 w-auto object-contain" />
            <div className="flex items-center gap-2.5 mt-2">
              <div className="h-px flex-1" style={{ background: 'rgba(255,255,255,0.07)' }} />
              <span className="text-[9px] font-bold text-white/25 uppercase tracking-[0.22em]">Resident Portal</span>
              <div className="h-px flex-1" style={{ background: 'rgba(255,255,255,0.07)' }} />
            </div>
          </motion.div>

          {/* Headline — compact */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.5 }} className="mb-5">
            <h1 className="text-3xl xl:text-4xl font-bold leading-[1.08] text-white tracking-tight">
              Your home,<br />
              <span className="text-uphold-gradient-animated">at your fingertips.</span>
            </h1>
            <p className="text-white/35 text-[13px] leading-relaxed mt-3 max-w-[320px]">
              Manage your tenancy, report issues, track payments, and stay connected — all in one place.
            </p>
          </motion.div>

          {/* Mini-dashboard — tighter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.55 }}
            className="mb-5"
          >
            <motion.div
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
              className="rounded-xl overflow-hidden shadow-[0_16px_48px_rgba(0,0,0,0.45)]"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(16px)' }}
            >
              <div className="flex items-center gap-2 px-3 py-2 border-b" style={{ borderColor: 'rgba(255,255,255,0.07)', background: 'rgba(0,0,0,0.25)' }}>
                <div className="flex gap-1.5">
                  {['#FF5F57','#FFBD2E','#28C840'].map((c,i) => (
                    <div key={i} className="w-2 h-2 rounded-full" style={{ backgroundColor: c, opacity: 0.55 }} />
                  ))}
                </div>
                <div className="flex-1 mx-1.5 px-2 py-0.5 rounded" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <span className="text-[8px] text-white/20 font-mono">portal.uphold.co.uk</span>
                </div>
              </div>

              <div className="p-3">
                <div className="flex items-center justify-between mb-2.5">
                  <div>
                    <p className="text-[8px] text-white/30 uppercase tracking-wider">Good morning,</p>
                    <p className="text-white text-[13px] font-bold leading-none mt-0.5">James Thornton</p>
                  </div>
                  <div className="flex items-center gap-1 px-2 py-0.5 rounded-full" style={{ background: 'rgba(50,230,164,0.12)', border: '1px solid rgba(50,230,164,0.22)' }}>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#32E6A4] animate-pulse" />
                    <span className="text-[8px] text-[#32E6A4] font-semibold">Active</span>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-1.5 mb-2.5">
                  {PREVIEW_STATS.map((s, i) => (
                    <motion.div
                      key={s.label}
                      initial={{ opacity: 0, scale: 0.85 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.45 + i * 0.08, duration: 0.3 }}
                      className="flex flex-col items-center p-2 rounded-lg"
                      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}
                    >
                      <div className="w-5 h-5 rounded-md flex items-center justify-center mb-1" style={{ background: `${s.accent}20` }}>
                        <s.icon size={10} style={{ color: s.accent }} />
                      </div>
                      <p className="text-[11px] font-bold text-white">{s.value}</p>
                      <p className="text-[7px] text-white/30 text-center leading-tight">{s.label}</p>
                    </motion.div>
                  ))}
                </div>

                <div className="flex items-center gap-2.5 p-2 rounded-lg" style={{ background: 'rgba(7,93,232,0.1)', border: '1px solid rgba(7,93,232,0.16)' }}>
                  <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: 'rgba(7,93,232,0.2)' }}>
                    <CreditCard size={10} className="text-[#5BA4F5]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[7px] text-white/30 uppercase tracking-wide">Next Rent Due</p>
                    <p className="text-[10px] font-bold text-white leading-tight">£850.00 · 1 Aug</p>
                  </div>
                  <span className="text-[7px] font-bold px-1.5 py-0.5 rounded-full" style={{ background: 'rgba(50,230,164,0.15)', color: '#32E6A4' }}>ON TIME</span>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Features — compact row */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="grid grid-cols-2 gap-x-4 gap-y-2 mb-auto"
          >
            {[
              { icon: Wrench,     label: 'Maintenance',     desc: 'Log & track repairs' },
              { icon: CreditCard, label: 'Rent & Payments', desc: 'Pay rent & view history' },
              { icon: MapPin,     label: 'Visitor Passes',  desc: 'Register guests' },
              { icon: FileText,   label: 'Documents',       desc: 'Tenancy docs & certs' },
            ].map((f, i) => (
              <div key={f.label} className="flex items-center gap-2.5">
                <div className="w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(7,93,232,0.15)', border: '1px solid rgba(7,93,232,0.2)' }}>
                  <CheckCircle size={11} className="text-[#5BA4F5]" />
                </div>
                <span className="text-[12px] text-white/50 leading-tight">
                  <span className="font-semibold text-white/75">{f.label}</span> — {f.desc}
                </span>
              </div>
            ))}
          </motion.div>

          {/* Demo accounts — horizontal strip */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.55 }}
            className="mt-7 pt-6" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
            <div className="flex items-center justify-between mb-2">
              <p className="text-[9px] font-bold text-white/20 uppercase tracking-[0.2em]">Demo Accounts</p>
              <span className="text-[9px] text-white/15 font-mono">password123</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {DEMO_ACCOUNTS.map(acc => (
                <motion.button
                  key={acc.email}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => quickLogin(acc)}
                  className="flex items-center gap-2 p-2.5 rounded-xl text-left transition-all"
                  style={{
                    background: selectedDemo === acc.email ? 'rgba(7,93,232,0.15)' : 'rgba(255,255,255,0.04)',
                    border: `1px solid ${selectedDemo === acc.email ? 'rgba(7,93,232,0.38)' : 'rgba(255,255,255,0.07)'}`,
                  }}
                >
                  <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${acc.color} flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0 shadow-lg`}>
                    {acc.initials}
                  </div>
                  <div className="min-w-0 flex-1 hidden xl:block">
                    <p className="text-white text-[11px] font-semibold leading-tight truncate">{acc.name}</p>
                    <p className="text-white/35 text-[9px] leading-tight truncate">{acc.role}</p>
                  </div>
                  {selectedDemo === acc.email && <CheckCircle size={12} className="text-[#32E6A4] flex-shrink-0" />}
                </motion.button>
              ))}
            </div>
          </motion.div>

          <div className="mt-3 flex items-center gap-2 text-white/15 text-[10px]">
            <ShieldCheck size={10} />
            <span>GDPR Compliant · UK Data Residency</span>
          </div>
        </div>
      </motion.aside>

      {/* RIGHT PANEL — compact, tight form */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.45, delay: 0.12 }}
        className="flex-1 flex flex-col relative"
        style={{ background: '#060C1A' }}
      >
        <div className="h-[2px] bg-uphold-gradient flex-shrink-0" />
        <div className="absolute inset-0 pointer-events-none opacity-[0.018]"
          style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)', backgroundSize: '48px 48px' }}
        />

        <div className="flex-1 flex items-center justify-center px-6 sm:px-8 py-10 overflow-y-auto relative z-10">
          <div className="w-full max-w-[380px]">

            {/* Mobile logo */}
            <div className="flex lg:hidden flex-col items-center mb-6">
              <img src="/granville-logo.svg" alt="Granville Community Homes" className="h-11 w-auto object-contain mb-2" />
              <span className="text-[9px] font-bold text-white/25 uppercase tracking-[0.2em]">Resident Portal</span>
            </div>

            <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18 }} className="mb-5 text-center lg:text-left">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full mb-3" style={{ background: 'rgba(50,230,164,0.1)', border: '1px solid rgba(50,230,164,0.2)' }}>
                <Sparkles size={10} className="text-[#32E6A4]" />
                <span className="text-xs text-[#32E6A4] font-semibold">Portal Access</span>
              </div>
              <h2 className="text-2xl lg:text-3xl font-bold text-white leading-tight">Welcome back</h2>
              <p className="text-white/35 text-sm mt-1">Sign in to your resident account</p>
            </motion.div>

            {/* Mobile quick sign-in */}
            <div className="lg:hidden mb-5">
              <div className="grid grid-cols-2 gap-2">
                {DEMO_ACCOUNTS.map(acc => (
                  <button key={acc.email} onClick={() => quickLogin(acc)}
                    className="flex items-center gap-2 p-2.5 rounded-xl text-left transition-all"
                    style={{
                      background: selectedDemo === acc.email ? 'rgba(7,93,232,0.15)' : 'rgba(255,255,255,0.04)',
                      border: `1px solid ${selectedDemo === acc.email ? 'rgba(7,93,232,0.3)' : 'rgba(255,255,255,0.08)'}`,
                    }}>
                    <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${acc.color} flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0`}>
                      {acc.initials}
                    </div>
                    <div className="min-w-0">
                      <p className="text-white text-[11px] font-semibold leading-tight truncate">{acc.name}</p>
                      <p className="text-white/35 text-[9px] leading-tight truncate">{acc.role}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.24 }}>
              <form onSubmit={handleSubmit} className="rounded-2xl p-5 space-y-4" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>

                <div>
                  <label className="block text-[11px] font-semibold text-white/50 mb-1.5">Email</label>
                  <input
                    type="email" value={email}
                    onChange={e => { setEmail(e.target.value); setError(''); }}
                    placeholder="you@example.com" required autoComplete="email"
                    className="w-full px-3.5 py-3 rounded-xl text-white placeholder-white/20 text-[13px] transition-all focus:outline-none"
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.09)' }}
                    onFocus={e => { e.currentTarget.style.border = '1px solid rgba(7,93,232,0.55)'; e.currentTarget.style.background = 'rgba(7,93,232,0.08)'; }}
                    onBlur={e => { e.currentTarget.style.border = '1px solid rgba(255,255,255,0.09)'; e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-[11px] font-semibold text-white/50">Password</label>
                    <button type="button" className="text-[11px] font-medium text-[#5BA4F5] hover:text-[#38BDF8] transition-colors">Forgot?</button>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'} value={password}
                      onChange={e => { setPassword(e.target.value); setError(''); }}
                      placeholder="••••••••" required autoComplete="current-password"
                      className="w-full px-3.5 py-3 pr-11 rounded-xl text-white placeholder-white/20 text-[13px] transition-all focus:outline-none"
                      style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.09)' }}
                      onFocus={e => { e.currentTarget.style.border = '1px solid rgba(7,93,232,0.55)'; e.currentTarget.style.background = 'rgba(7,93,232,0.08)'; }}
                      onBlur={e => { e.currentTarget.style.border = '1px solid rgba(255,255,255,0.09)'; e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
                    />
                    <button type="button" onClick={() => setShowPassword(v => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg text-white/25 hover:text-white/50 transition-colors">
                      {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>

                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -4, height: 0 }} animate={{ opacity: 1, y: 0, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                      className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl"
                      style={{ background: 'rgba(244,63,94,0.1)', border: '1px solid rgba(244,63,94,0.22)' }}>
                      <div className="w-1 h-1 rounded-full bg-rose-500 flex-shrink-0" />
                      <p className="text-[12px] text-rose-400">{error}</p>
                    </motion.div>
                  )}
                </AnimatePresence>

                <motion.button
                  type="submit" disabled={loading}
                  whileHover={!loading ? { scale: 1.01, boxShadow: '0 8px 36px rgba(7,93,232,0.55)' } : {}}
                  whileTap={!loading ? { scale: 0.99 } : {}}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm text-white bg-uphold-gradient transition-all disabled:opacity-60 disabled:cursor-not-allowed shadow-[0_4px_20px_rgba(7,93,232,0.35)]"
                >
                  {loading ? <div className="w-4.5 h-4.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    : <><span>Sign In</span><ArrowRight size={15} /></>}
                </motion.button>
              </form>
            </motion.div>

            <div className="flex items-center justify-center gap-5 mt-4">
              {[
                { icon: ShieldCheck, label: 'Encrypted' },
                { icon: Lock, label: 'GDPR' },
                { icon: Globe, label: 'UK Data' },
              ].map(b => (
                <div key={b.label} className="flex items-center gap-1">
                  <b.icon size={11} className="text-white/18" />
                  <span className="text-[11px] text-white/18">{b.label}</span>
                </div>
              ))}
            </div>

            <p className="mt-3 text-[11px] text-center text-white/12">
              © 2026 Uphold Technologies Ltd · Granville Community Homes
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
