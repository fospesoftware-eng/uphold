import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, LogIn, Sparkles, Building2, ShieldCheck, Smartphone } from 'lucide-react';
import { useTenantPortal } from './context';
import { useAuth } from '../../lib/auth';
import { users } from '../../data/mockData';

const DEMO_ACCOUNTS = [
  { email: 'tenant1@demo.com', name: 'James Thornton', role: 'Resident – Maple House', color: 'from-blue-500 to-indigo-600', initials: 'JT' },
  { email: 'tenant2@demo.com', name: 'Emily Chang',    role: 'Resident – Birch Court', color: 'from-violet-500 to-purple-600', initials: 'EC' },
  { email: 'manager@demo.com', name: 'Sarah Mitchell', role: 'Property Manager',        color: 'from-emerald-500 to-teal-600', initials: 'SM' },
  { email: 'admin@demo.com',   name: 'Admin User',     role: 'System Administrator',    color: 'from-rose-500 to-orange-500', initials: 'AU' },
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
      setError(result.error ?? 'Invalid credentials');
      setLoading(false);
      return;
    }
    if (result.redirect) {
      // Log into the main admin app for manager/admin
      const adminUser = users.find(u => u.email === email.replace('@demo.com', '@northbridge.org') || u.email === 'admin@northbridge.org');
      const fallbackUser = users[0];
      adminLogin(adminUser ?? fallbackUser);
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
    <div className="min-h-screen bg-gradient-to-br from-[#0A0F1E] via-[#0F1B3A] to-[#1A2550] flex flex-col">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-[#075DE8]/10 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-[#0EA5E9]/10 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#4F46E5]/5 blur-3xl" />
      </div>

      <div className="relative flex-1 flex flex-col items-center justify-center px-4 py-12">
        {/* Logo & hero */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#075DE8] to-[#0EA5E9] flex items-center justify-center shadow-lg shadow-blue-500/30">
              <Building2 size={24} className="text-white" />
            </div>
            <div className="text-left">
              <p className="text-white font-bold text-xl leading-none">NorthBridge</p>
              <p className="text-[#94A3B8] text-xs">Supported Living</p>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-white mb-1">Resident Portal</h1>
          <p className="text-[#94A3B8] text-sm">Your home, at your fingertips</p>
        </motion.div>

        {/* Feature pills */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex items-center gap-3 mb-8 flex-wrap justify-center"
        >
          {[
            { icon: Smartphone, label: 'Mobile First' },
            { icon: ShieldCheck, label: 'Secure' },
            { icon: Sparkles, label: 'All-in-One' },
          ].map(feat => (
            <div key={feat.label} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/10">
              <feat.icon size={13} className="text-[#60A5FA]" />
              <span className="text-white/80 text-xs font-medium">{feat.label}</span>
            </div>
          ))}
        </motion.div>

        {/* Login card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="w-full max-w-md"
        >
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-2xl">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white/80 mb-1.5">Email address</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full px-4 py-3 rounded-2xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#075DE8] focus:border-transparent transition-all text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/80 mb-1.5">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full px-4 py-3 pr-12 rounded-2xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#075DE8] focus:border-transparent transition-all text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-white/50 hover:text-white/80 transition-colors"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-rose-500/20 border border-rose-500/30"
                >
                  <span className="text-rose-300 text-sm">{error}</span>
                </motion.div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-gradient-to-r from-[#075DE8] to-[#0EA5E9] text-white font-semibold text-sm shadow-lg shadow-blue-500/30 hover:opacity-95 active:scale-[0.98] transition-all disabled:opacity-60"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <LogIn size={17} />
                    Sign In
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Demo accounts */}
          <div className="mt-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex-1 h-px bg-white/10" />
              <p className="text-white/40 text-xs font-medium uppercase tracking-wider">Demo Accounts</p>
              <div className="flex-1 h-px bg-white/10" />
            </div>
            <div className="grid grid-cols-2 gap-2">
              {DEMO_ACCOUNTS.map(acc => (
                <motion.button
                  key={acc.email}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => quickLogin(acc)}
                  className="flex items-center gap-2.5 p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all text-left"
                >
                  <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${acc.color} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
                    {acc.initials}
                  </div>
                  <div className="min-w-0">
                    <p className="text-white text-xs font-semibold truncate">{acc.name}</p>
                    <p className="text-white/40 text-[10px] truncate">{acc.role}</p>
                  </div>
                </motion.button>
              ))}
            </div>
            <p className="text-center text-white/30 text-[10px] mt-3">Password for all demo accounts: <span className="text-white/50 font-mono">password123</span></p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
