import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, ArrowRight, Building2, ShieldCheck, Smartphone, Sparkles, Users, Wrench, CreditCard } from 'lucide-react';
import { useTenantPortal } from './context';
import { useAuth } from '../../lib/auth';
import { users } from '../../data/mockData';

const DEMO_ACCOUNTS = [
  { email: 'tenant1@demo.com', name: 'James Thornton', role: 'Resident · Maple House', color: 'from-blue-500 to-indigo-600', initials: 'JT' },
  { email: 'tenant2@demo.com', name: 'Emily Chang',    role: 'Resident · Birch Court', color: 'from-violet-500 to-purple-600', initials: 'EC' },
  { email: 'manager@demo.com', name: 'Sarah Mitchell', role: 'Property Manager',        color: 'from-emerald-500 to-teal-600', initials: 'SM' },
  { email: 'admin@demo.com',   name: 'Admin User',     role: 'System Administrator',    color: 'from-rose-500 to-orange-500', initials: 'AU' },
];

const FEATURES = [
  { icon: Wrench,    label: 'Maintenance',  desc: 'Log and track repair requests' },
  { icon: CreditCard, label: 'Payments',    desc: 'Pay rent and view statements' },
  { icon: Users,     label: 'Community',   desc: 'Events, notices, and neighbours' },
];

export function PortalLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useTenantPortal();
  const { login: adminLogin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    await new Promise(r => setTimeout(r, 600));
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
    setEmail(acc.email);
    setPassword('password123');
  };

  return (
    <div className="min-h-screen flex bg-[#F8FAFC] dark:bg-[#0A0F1E]">
      {/* ── Left hero panel ── */}
      <motion.aside
        initial={{ opacity: 0, x: -24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.45 }}
        className="hidden lg:flex flex-col w-[460px] xl:w-[520px] flex-shrink-0 bg-[linear-gradient(150deg,#06122A_0%,#082140_48%,#0A2E4A_100%)] p-10 text-white relative overflow-hidden"
      >
        {/* Decorative orbs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-[#075DE8]/15 blur-3xl" />
          <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-[#0EA5E9]/10 blur-3xl" />
        </div>

        <div className="relative z-10 flex flex-col h-full">
          {/* Brand */}
          <div className="flex items-center gap-3 mb-14">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#075DE8] to-[#0EA5E9] flex items-center justify-center shadow-lg shadow-blue-500/30 flex-shrink-0">
              <Building2 size={20} className="text-white" />
            </div>
            <div>
              <p className="font-bold text-base leading-tight">NorthBridge</p>
              <p className="text-white/50 text-xs">Supported Living</p>
            </div>
          </div>

          {/* Headline */}
          <div className="mb-10">
            <h1 className="text-4xl font-bold leading-tight mb-3">
              Your home,<br />at your<br />fingertips.
            </h1>
            <p className="text-white/65 text-sm leading-relaxed">
              Everything you need to manage your tenancy, report issues, and stay connected — in one place.
            </p>
          </div>

          {/* Feature list */}
          <div className="space-y-3 mb-auto">
            {FEATURES.map((f, i) => (
              <motion.div
                key={f.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="flex items-center gap-3.5 p-3.5 rounded-xl bg-white/8 border border-white/10 backdrop-blur-sm"
              >
                <div className="w-9 h-9 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center flex-shrink-0">
                  <f.icon size={16} className="text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{f.label}</p>
                  <p className="text-xs text-white/55">{f.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Demo accounts */}
          <div className="mt-10">
            <p className="text-[11px] font-semibold text-white/40 uppercase tracking-wider mb-3">Demo accounts · click to fill</p>
            <div className="grid grid-cols-2 gap-2">
              {DEMO_ACCOUNTS.map(acc => (
                <motion.button
                  key={acc.email}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => quickLogin(acc)}
                  className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all text-left"
                >
                  <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${acc.color} flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0`}>
                    {acc.initials}
                  </div>
                  <div className="min-w-0">
                    <p className="text-white text-[11px] font-semibold leading-tight truncate">{acc.name}</p>
                    <p className="text-white/40 text-[10px] leading-tight truncate">{acc.role}</p>
                  </div>
                </motion.button>
              ))}
            </div>
            <p className="text-white/30 text-[10px] mt-2.5 text-center">
              Password: <span className="font-mono text-white/45">password123</span>
            </p>
          </div>

          <div className="mt-6 flex items-center gap-1.5 text-white/35 text-xs">
            <ShieldCheck size={13} />
            <span>GDPR Compliant · UK Data Residency</span>
          </div>
        </div>
      </motion.aside>

      {/* ── Right form panel ── */}
      <motion.div
        initial={{ opacity: 0, x: 24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.45 }}
        className="flex-1 flex items-center justify-center px-6 py-12 bg-white dark:bg-[#0F172A]"
      >
        <div className="w-full max-w-sm">
          {/* Mobile brand */}
          <div className="flex lg:hidden items-center gap-3 mb-8">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#075DE8] to-[#0EA5E9] flex items-center justify-center shadow-md shadow-blue-500/20 flex-shrink-0">
              <Building2 size={17} className="text-white" />
            </div>
            <div>
              <p className="font-bold text-[#0F172A] dark:text-white text-sm leading-tight">NorthBridge</p>
              <p className="text-[#94A3B8] text-[11px]">Supported Living</p>
            </div>
          </div>

          {/* Heading */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-[#0F172A] dark:text-white">Resident Portal</h2>
            <p className="text-[#64748B] dark:text-[#94A3B8] text-sm mt-1">Sign in to access your account</p>
          </div>

          {/* Mobile quick-login */}
          <div className="lg:hidden mb-6">
            <p className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wider mb-2.5">Demo accounts</p>
            <div className="grid grid-cols-2 gap-2">
              {DEMO_ACCOUNTS.map(acc => (
                <button
                  key={acc.email}
                  onClick={() => quickLogin(acc)}
                  className="flex items-center gap-2 p-2.5 rounded-xl border border-[#E6EEF5] dark:border-[#1E2D45] hover:border-[#075DE8]/40 hover:bg-[#EFF6FF] dark:hover:bg-[#1E2D45] transition-all text-left"
                >
                  <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${acc.color} flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0`}>
                    {acc.initials}
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] font-semibold text-[#334155] dark:text-[#CBD5E1] leading-tight truncate">{acc.name}</p>
                    <p className="text-[#94A3B8] text-[10px] leading-tight truncate">{acc.role}</p>
                  </div>
                </button>
              ))}
            </div>
            <p className="text-[#94A3B8] text-[10px] mt-2 text-center">
              Password: <span className="font-mono">password123</span>
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-[#334155] dark:text-[#CBD5E1] mb-1.5">
                Email address
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                autoComplete="email"
                className="w-full px-4 py-3 rounded-xl border border-[#E6EEF5] dark:border-[#1E2D45] bg-white dark:bg-[#111827] text-[#0F172A] dark:text-white placeholder-[#CBD5E1] dark:placeholder-[#475569] focus:outline-none focus:ring-2 focus:ring-[#075DE8] focus:border-transparent transition-all text-sm"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-sm font-medium text-[#334155] dark:text-[#CBD5E1]">
                  Password
                </label>
                <button type="button" className="text-xs text-[#075DE8] hover:underline">
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                  className="w-full px-4 py-3 pr-11 rounded-xl border border-[#E6EEF5] dark:border-[#1E2D45] bg-white dark:bg-[#111827] text-[#0F172A] dark:text-white placeholder-[#CBD5E1] dark:placeholder-[#475569] focus:outline-none focus:ring-2 focus:ring-[#075DE8] focus:border-transparent transition-all text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-[#94A3B8] hover:text-[#64748B] dark:hover:text-[#CBD5E1] transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800/50 rounded-xl px-4 py-3"
              >
                {error}
              </motion.p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-[#075DE8] hover:bg-[#0650CC] active:scale-[0.98] text-white font-semibold text-sm shadow-lg shadow-blue-500/25 transition-all disabled:opacity-60"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Sign In
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          {/* Feature pills — mobile */}
          <div className="lg:hidden flex items-center gap-2 flex-wrap justify-center mt-8">
            {[
              { icon: Smartphone, label: 'Mobile First' },
              { icon: ShieldCheck, label: 'Secure' },
              { icon: Sparkles, label: 'All-in-One' },
            ].map(feat => (
              <div key={feat.label} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#F1F5F9] dark:bg-[#1E2D45] border border-[#E6EEF5] dark:border-[#1E2D45]">
                <feat.icon size={12} className="text-[#075DE8]" />
                <span className="text-[11px] font-medium text-[#64748B] dark:text-[#94A3B8]">{feat.label}</span>
              </div>
            ))}
          </div>

          <p className="mt-8 text-xs text-center text-[#94A3B8] dark:text-[#475569]">
            © 2026 NorthBridge Housing Ltd. All rights reserved.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
