import { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, ShieldCheck, ArrowRight, Building2, HeartHandshake, FileCheck2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button, Input, Card } from '../../components/ui';
import { useAuth } from '../../lib/auth';
import { authService } from '../../services';
import { users, organisations } from '../../data/mockData';
import type { User } from '../../types';

type AuthStep = 'login' | 'twofa' | 'org';

export function AuthPage() {
  const [step, setStep] = useState<AuthStep>('login');
  const [email, setEmail] = useState('sarah.johnson@granvillehomes.org.uk');
  const [password, setPassword] = useState('Password123!');
  const [code, setCode] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [pendingUser, setPendingUser] = useState<User | null>(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const result = await authService.login(email, password);
      setPendingUser(result.user);
      if (result.requiresTwoFactor) setStep('twofa');
      else setStep('org');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleTwoFA = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authService.verifyTwoFactor(code);
      setStep('org');
    } catch {
      setError('Invalid code');
    } finally {
      setLoading(false);
    }
  };

  const handleOrgSelect = (user: User) => {
    login(user);
    navigate('/dashboard');
  };

  const heroPanelVariants = {
    hidden: { opacity: 0, x: -30 },
    visible: { opacity: 1, x: 0 },
  };

  const formVariants = {
    hidden: { opacity: 0, x: 30 },
    visible: { opacity: 1, x: 0 },
  };

  return (
    <div className="min-h-screen flex bg-[#F8FAFC] dark:bg-[#0A0F1E]">
      {/* Hero Panel */}
      <motion.div
        variants={heroPanelVariants}
        initial="hidden"
        animate="visible"
        className="hidden lg:flex flex-col w-[480px] xl:w-[560px] bg-[linear-gradient(150deg,#06122A_0%,#082140_42%,#06302F_100%)] p-10 text-white relative overflow-hidden flex-shrink-0"
      >
        {/* Animated gradient orbs */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-white/5 blur-3xl" />
        </div>

        <div className="relative z-10 flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-16">
            <img src="/uphold-logo-wordmark.png" alt="Uphold" className="h-8 w-auto object-contain" />
          </div>

          {/* Tagline */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold font-display leading-tight mb-4">
              Supporting people.<br />Simplifying compliance.
            </h1>
            <p className="text-white/80 text-base leading-relaxed">
              The UK's most trusted CRM for supported housing associations — built for care teams who need clarity, not complexity.
            </p>
          </div>

          {/* Feature cards */}
          <div className="space-y-3 mb-auto">
            {[
              { Icon: Building2, title: 'Property & Compliance', desc: 'Certificates, rooms, and inspections in one place.' },
              { Icon: HeartHandshake, title: 'Tenant Wellbeing', desc: 'STAR assessments, support logs, and risk tracking.' },
              { Icon: FileCheck2, title: 'GDPR-Ready Documents', desc: 'Templated, signed, and version-controlled.' },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.12, duration: 0.4 }}
                whileHover={{ scale: 1.02, x: 4 }}
                className="flex items-center gap-3.5 p-3.5 bg-white/10 rounded-xl backdrop-blur-sm border border-white/10"
              >
                <motion.div
                  animate={{ y: [0, -4, 0] }}
                  transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut', delay: i * 0.4 }}
                  className="flex-shrink-0 w-10 h-10 rounded-xl bg-white/15 border border-white/20 flex items-center justify-center"
                >
                  <item.Icon size={20} strokeWidth={2} className="text-white" />
                </motion.div>
                <div>
                  <p className="text-sm font-semibold text-white">{item.title}</p>
                  <p className="text-xs text-white/70">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-8 flex items-center gap-2 text-white/60 text-xs">
            <ShieldCheck size={14} />
            <span>ISO 27001 · GDPR Compliant · UK Data Residency</span>
          </div>
        </div>
      </motion.div>

      {/* Form Panel */}
      <motion.div
        variants={formVariants}
        initial="hidden"
        animate="visible"
        className="flex-1 flex items-center justify-center p-8"
      >
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-3 mb-8">
            <img src="/uphold-logo-wordmark.png" alt="Uphold" className="h-7 w-auto object-contain" />
          </div>

          {step === 'login' && (
            <div>
              <div className="mb-8">
                <h2 className="text-2xl font-bold font-display text-[#0F172A] dark:text-[#F8FAFC]">Welcome back</h2>
                <p className="text-[#64748B] mt-1">Sign in to your Uphold account</p>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                <Input
                  label="Email address"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@organisation.org.uk"
                  required
                  autoComplete="email"
                />
                <Input
                  label="Password"
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                  rightElement={
                    <button type="button" onClick={() => setShowPass(v => !v)}>
                      {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  }
                />

                {error && <p className="text-sm text-rose-500 bg-rose-50 rounded-lg px-3 py-2">{error}</p>}

                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="rounded accent-[#075DE8]" />
                    <span className="text-sm text-[#334155] dark:text-[#CBD5E1]">Remember me</span>
                  </label>
                  <button type="button" className="text-sm text-[#075DE8] hover:underline">Forgot password?</button>
                </div>

                <Button type="submit" fullWidth loading={loading} size="lg">
                  Sign in <ArrowRight size={16} />
                </Button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-[#E6EEF5] dark:border-[#1E2D45]" />
                  </div>
                  <div className="relative flex justify-center">
                    <span className="px-3 text-xs text-[#64748B] bg-[#F8FAFC] dark:bg-[#0A0F1E]">or</span>
                  </div>
                </div>

                <Button type="button" variant="outline" fullWidth>
                  <svg className="w-4 h-4" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                  Continue with SSO
                </Button>
              </form>

              <p className="mt-6 text-xs text-center text-[#64748B]">
                By signing in you agree to our Terms of Service and Privacy Policy.<br />
                Your data is stored securely in UK data centres.
              </p>
            </div>
          )}

          {step === 'twofa' && (
            <div>
              <div className="mb-8">
                <div className="w-12 h-12 rounded-xl bg-uphold-gradient-subtle flex items-center justify-center mb-4">
                  <ShieldCheck size={24} className="text-[#075DE8]" />
                </div>
                <h2 className="text-2xl font-bold font-display text-[#0F172A] dark:text-[#F8FAFC]">Two-factor verification</h2>
                <p className="text-[#64748B] mt-1">Enter the 6-digit code from your authenticator app</p>
              </div>

              <form onSubmit={handleTwoFA} className="space-y-4">
                <div className="flex gap-2 justify-center">
                  {[...Array(6)].map((_, i) => (
                    <input
                      key={i}
                      type="text"
                      maxLength={1}
                      value={code[i] ?? ''}
                      onChange={e => {
                        const newCode = code.split('');
                        newCode[i] = e.target.value;
                        setCode(newCode.join(''));
                        if (e.target.value && i < 5) {
                          const next = e.target.nextElementSibling as HTMLInputElement;
                          next?.focus();
                        }
                      }}
                      className="w-12 h-14 text-center text-xl font-bold rounded-xl border border-[#E6EEF5] dark:border-[#1E2D45] bg-white dark:bg-[#111827] text-[#0F172A] dark:text-[#F8FAFC] focus:outline-none focus:ring-2 focus:ring-[#15C6B8]"
                    />
                  ))}
                </div>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="rounded accent-[#075DE8]" />
                  <span className="text-sm text-[#334155] dark:text-[#CBD5E1]">Trust this device for 30 days</span>
                </label>

                <Button type="submit" fullWidth loading={loading} size="lg">Verify</Button>

                <button type="button" className="w-full text-sm text-[#075DE8] hover:underline">
                  Use a backup code instead
                </button>
                <button type="button" className="w-full text-sm text-[#64748B] hover:underline">
                  Resend code
                </button>
              </form>
            </div>
          )}

          {step === 'org' && (
            <div>
              <div className="mb-8">
                <h2 className="text-2xl font-bold font-display text-[#0F172A] dark:text-[#F8FAFC]">Select organisation</h2>
                <p className="text-[#64748B] mt-1">Choose which organisation to access</p>
              </div>

              <div className="space-y-3">
                {[pendingUser ? users.find(u => u.id === pendingUser.id) : null].filter(Boolean).map(u => {
                  const org = organisations.find(o => o.id === u!.organisationId);
                  if (!org) return null;
                  return (
                    <motion.button
                      key={org.id}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={() => handleOrgSelect(u!)}
                      className="w-full p-4 rounded-xl border border-[#E6EEF5] dark:border-[#1E2D45] bg-white dark:bg-[#111827] hover:border-[#075DE8] hover:shadow-[0_4px_16px_rgba(7,93,232,.12)] transition-all text-left group"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-[#0F172A] dark:text-[#F8FAFC]">{org.name}</p>
                          <p className="text-sm text-[#64748B] mt-0.5">{org.tenantCount} tenants · {u!.role.replace(/_/g, ' ')}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="px-2 py-0.5 text-xs rounded-full bg-uphold-gradient-subtle text-[#075DE8] font-medium capitalize">{org.plan}</span>
                          <ArrowRight size={16} className="text-[#64748B] group-hover:text-[#075DE8] transition-colors" />
                        </div>
                      </div>
                    </motion.button>
                  );
                })}

                {/* Demo: show all orgs */}
                <div className="pt-2">
                  <p className="text-xs text-[#64748B] mb-2 font-medium">Demo — all organisations</p>
                  {organisations.map(org => (
                    <motion.button
                      key={org.id}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={() => {
                        const adminUser = users.find(u => u.organisationId === org.id && u.role === 'admin') ?? users[0];
                        handleOrgSelect(adminUser);
                      }}
                      className="w-full p-4 mb-2 rounded-xl border border-[#E6EEF5] dark:border-[#1E2D45] bg-white dark:bg-[#111827] hover:border-[#075DE8] hover:shadow-[0_4px_16px_rgba(7,93,232,.12)] transition-all text-left group"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-[#0F172A] dark:text-[#F8FAFC]">{org.name}</p>
                          <p className="text-sm text-[#64748B] mt-0.5">{org.tenantCount} tenants · {org.status}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="px-2 py-0.5 text-xs rounded-full bg-uphold-gradient-subtle text-[#075DE8] font-medium capitalize">{org.plan}</span>
                          <ArrowRight size={16} className="text-[#64748B] group-hover:text-[#075DE8] transition-colors" />
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
