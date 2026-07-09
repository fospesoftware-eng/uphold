import { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import {
  Building2, Users, DollarSign, FileText, BarChart3,
  ShieldCheck, CheckCircle, ArrowRight, Star, Zap,
  Clock, Heart, ChevronRight, Globe, Lock, TrendingUp,
} from 'lucide-react';
import { LandingNav } from './LandingNav';

// ── Shared animation primitives ──────────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: 'easeOut' as const },
  }),
};

function useScrollReveal(margin = '-80px') {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin } as Parameters<typeof useInView>[1]);
  return { ref, isInView };
}

// ── Animated counter ─────────────────────────────────────────────────────────
function AnimatedCounter({ to, suffix = '', prefix = '' }: { to: number; suffix?: string; prefix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;
    const duration = 2000;
    const frames = Math.round(duration / 16);
    const step = to / frames;
    let current = 0;
    const timer = setInterval(() => {
      current += step;
      if (current >= to) { setCount(to); clearInterval(timer); }
      else setCount(Math.floor(current));
    }, 16);
    return () => clearInterval(timer);
  }, [isInView, to]);

  return <span ref={ref}>{prefix}{count.toLocaleString()}{suffix}</span>;
}

// ── Hero ─────────────────────────────────────────────────────────────────────
function HeroSection() {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-[#060B18] pt-16">
      {/* Animated gradient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
        <div className="orb orb-4" />
        {/* Grid overlay */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0djZoNnYtNmgtNnptNi02aDZ2NmgtNnYtNnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-40" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 text-center">
        {/* Badge */}
        <motion.div
          variants={fadeUp} initial="hidden" animate="visible" custom={0}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/15 bg-white/5 backdrop-blur-sm text-sm text-white/80 font-medium mb-8"
        >
          <span className="w-2 h-2 rounded-full bg-[#32E6A4] animate-pulse" />
          Trusted by 200+ UK housing associations
          <ChevronRight size={14} className="opacity-60" />
        </motion.div>

        {/* Headline */}
        <motion.h1
          variants={fadeUp} initial="hidden" animate="visible" custom={1}
          className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold font-display text-white leading-[1.05] tracking-tight mb-6"
        >
          Supporting people.{' '}
          <br />
          <span className="text-uphold-gradient">Simplifying compliance.</span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          variants={fadeUp} initial="hidden" animate="visible" custom={2}
          className="max-w-2xl mx-auto text-lg sm:text-xl text-white/60 leading-relaxed mb-10"
        >
          The UK's most comprehensive CRM for supported housing associations — STAR assessments,
          compliance tracking, rent management, and GDPR-ready documents in one unified platform.
        </motion.p>

        {/* CTAs */}
        <motion.div
          variants={fadeUp} initial="hidden" animate="visible" custom={3}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
        >
          <motion.button
            whileHover={{ scale: 1.03, boxShadow: '0 8px 40px rgba(7,93,232,0.6)' }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/login')}
            className="flex items-center gap-2.5 px-8 py-4 text-base font-semibold text-white rounded-2xl bg-uphold-gradient shadow-[0_4px_28px_rgba(7,93,232,0.45)] transition-all"
          >
            Start free trial
            <ArrowRight size={18} />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/login')}
            className="flex items-center gap-2.5 px-8 py-4 text-base font-semibold text-white/90 rounded-2xl border border-white/20 bg-white/5 backdrop-blur-sm hover:bg-white/10 hover:border-white/30 transition-all"
          >
            See it in action
            <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
              <div className="w-0 h-0 border-t-[4px] border-b-[4px] border-l-[7px] border-transparent border-l-white ml-0.5" />
            </div>
          </motion.button>
        </motion.div>

        {/* Dashboard preview */}
        <motion.div
          initial={{ opacity: 0, y: 60, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1, delay: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
          className="relative mx-auto max-w-5xl"
        >
          {/* Glow effect under screenshot */}
          <div className="absolute -inset-4 rounded-3xl bg-gradient-to-r from-[#075DE8]/30 via-[#15C6B8]/20 to-[#32E6A4]/30 blur-2xl" />
          <div className="relative rounded-2xl overflow-hidden border border-white/15 shadow-[0_32px_80px_rgba(0,0,0,0.6)]">
            {/* Browser chrome */}
            <div className="bg-[#111827] px-4 py-3 flex items-center gap-2 border-b border-white/10">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-[#F43F5E]" />
                <div className="w-3 h-3 rounded-full bg-[#F59E0B]" />
                <div className="w-3 h-3 rounded-full bg-[#10B981]" />
              </div>
              <div className="flex-1 mx-4 bg-white/5 rounded-md h-5 flex items-center px-3">
                <span className="text-xs text-white/40 font-mono">app.uphold.co.uk/dashboard</span>
              </div>
            </div>
            <img
              src="/uphold-dashboard-hero.webp"
              alt="Uphold dashboard preview"
              className="w-full object-cover object-top"
              style={{ maxHeight: '480px' }}
            />
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-xs text-white/40 font-medium tracking-widest uppercase">Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          className="w-5 h-8 rounded-full border border-white/20 flex items-start justify-center pt-1.5"
        >
          <div className="w-1 h-2 rounded-full bg-white/40" />
        </motion.div>
      </motion.div>
    </section>
  );
}

// ── Trust bar ─────────────────────────────────────────────────────────────────
function TrustBar() {
  const { ref, isInView } = useScrollReveal();
  const orgs = [
    'Granville Community Homes', 'HavenPath Housing', 'Oakmere Support', 'Unity Housing Care',
    'Meridian Trust', 'Castleford Group', 'Beacon Supported Living', 'Compass Housing',
  ];

  return (
    <section className="py-12 bg-white border-b border-[#E6EEF5]">
      <div ref={ref} className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.p
          variants={fadeUp} initial="hidden" animate={isInView ? 'visible' : 'hidden'}
          className="text-center text-sm text-[#64748B] font-medium mb-8 uppercase tracking-widest"
        >
          Trusted by housing associations across England & Wales
        </motion.p>
        <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
          {orgs.map((name, i) => (
            <motion.span
              key={name}
              variants={fadeUp} custom={i * 0.05}
              initial="hidden" animate={isInView ? 'visible' : 'hidden'}
              className="text-sm font-semibold text-[#94A3B8] hover:text-[#64748B] transition-colors cursor-default"
            >
              {name}
            </motion.span>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Features ─────────────────────────────────────────────────────────────────
const features = [
  {
    icon: <Users size={24} />,
    color: 'from-[#075DE8] to-[#0797D8]',
    title: 'Tenant Wellbeing',
    description: 'STAR assessments, risk tracking, support hour logs, and wellbeing monitoring — all in one place for every tenant.',
  },
  {
    icon: <Building2 size={24} />,
    color: 'from-[#0797D8] to-[#15C6B8]',
    title: 'Property & Compliance',
    description: 'Track certificates, rooms, inspections, and maintenance across all your properties with automated expiry alerts.',
  },
  {
    icon: <DollarSign size={24} />,
    color: 'from-[#15C6B8] to-[#32E6A4]',
    title: 'Rent & Financials',
    description: 'Housing benefit tracking, invoice management, arrears dashboards, and full transaction history at a glance.',
  },
  {
    icon: <FileText size={24} />,
    color: 'from-[#6366F1] to-[#8B5CF6]',
    title: 'GDPR-Ready Documents',
    description: 'Templated, digitally signed, and version-controlled documents with full audit trail for every tenant.',
  },
  {
    icon: <BarChart3 size={24} />,
    color: 'from-[#F59E0B] to-[#EF4444]',
    title: 'Reports & Insights',
    description: 'ESA compliance reports, rent audit reports, STAR progress summaries — export-ready for commissioners.',
  },
  {
    icon: <ShieldCheck size={24} />,
    color: 'from-[#10B981] to-[#15C6B8]',
    title: 'Role-Based Access',
    description: 'Super admin, admin, support staff, and board views — every person sees only what they need.',
  },
];

function FeaturesSection() {
  const { ref, isInView } = useScrollReveal();

  return (
    <section id="features" className="py-24 lg:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div ref={ref} className="text-center mb-16">
          <motion.div
            variants={fadeUp} initial="hidden" animate={isInView ? 'visible' : 'hidden'}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#EFF6FF] text-[#075DE8] text-sm font-semibold mb-4"
          >
            <Zap size={14} />
            Built for supported housing
          </motion.div>
          <motion.h2
            variants={fadeUp} custom={1}
            initial="hidden" animate={isInView ? 'visible' : 'hidden'}
            className="text-4xl lg:text-5xl font-bold font-display text-[#0F172A] mb-4"
          >
            Everything you need to stay{' '}
            <span className="text-uphold-gradient">compliant and caring</span>
          </motion.h2>
          <motion.p
            variants={fadeUp} custom={2}
            initial="hidden" animate={isInView ? 'visible' : 'hidden'}
            className="max-w-2xl mx-auto text-lg text-[#64748B] leading-relaxed"
          >
            One platform purpose-built for the complexities of supported housing — from STAR wellbeing to
            fire safety certificates.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              variants={fadeUp} custom={i * 0.08}
              initial="hidden" animate={isInView ? 'visible' : 'hidden'}
              whileHover={{ y: -4, boxShadow: '0 20px 60px rgba(7,93,232,0.12)' }}
              className="group p-6 rounded-2xl border border-[#E6EEF5] bg-white hover:border-[#075DE8]/30 transition-all duration-300 cursor-default"
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center text-white mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                {feature.icon}
              </div>
              <h3 className="text-lg font-bold font-display text-[#0F172A] mb-2">{feature.title}</h3>
              <p className="text-sm text-[#64748B] leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Metrics ───────────────────────────────────────────────────────────────────
const metrics = [
  { value: 200, suffix: '+', label: 'Housing associations', icon: <Building2 size={20} /> },
  { value: 15000, suffix: '+', label: 'Tenants supported', icon: <Heart size={20} /> },
  { value: 40, suffix: '%', label: 'Less admin time', icon: <Clock size={20} /> },
  { value: 99.9, suffix: '%', label: 'Platform uptime', icon: <TrendingUp size={20} /> },
];

function MetricsSection() {
  const { ref, isInView } = useScrollReveal();

  return (
    <section className="py-24 relative overflow-hidden bg-[#060B18]">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-[#075DE8]/15 blur-[80px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full bg-[#15C6B8]/15 blur-[80px]" />
      </div>
      <div ref={ref} className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {metrics.map((m, i) => (
            <motion.div
              key={m.label}
              variants={fadeUp} custom={i * 0.12}
              initial="hidden" animate={isInView ? 'visible' : 'hidden'}
              className="text-center"
            >
              <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-[#15C6B8] mx-auto mb-4">
                {m.icon}
              </div>
              <div className="text-4xl lg:text-5xl font-bold font-display text-uphold-gradient mb-2">
                {isInView && (
                  <AnimatedCounter
                    to={m.value}
                    suffix={m.suffix}
                  />
                )}
              </div>
              <p className="text-sm text-white/60 font-medium">{m.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── How it works ─────────────────────────────────────────────────────────────
const steps = [
  {
    num: '01',
    icon: <Users size={28} />,
    title: 'Import your data',
    description: 'Bring in your existing tenants, properties, and documents from spreadsheets or your current system in minutes.',
  },
  {
    num: '02',
    icon: <Zap size={28} />,
    title: 'Configure your workflows',
    description: 'Set up support thresholds, certificate reminders, document templates, and role permissions for your team.',
  },
  {
    num: '03',
    icon: <CheckCircle size={28} />,
    title: 'Manage with confidence',
    description: 'Your dashboard surfaces every risk, overdue task, and compliance gap — so nothing falls through the cracks.',
  },
];

function HowItWorksSection() {
  const { ref, isInView } = useScrollReveal();

  return (
    <section id="how-it-works" className="py-24 lg:py-32 bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div ref={ref} className="text-center mb-16">
          <motion.h2
            variants={fadeUp} initial="hidden" animate={isInView ? 'visible' : 'hidden'}
            className="text-4xl lg:text-5xl font-bold font-display text-[#0F172A] mb-4"
          >
            Up and running{' '}
            <span className="text-uphold-gradient">in a day</span>
          </motion.h2>
          <motion.p
            variants={fadeUp} custom={1}
            initial="hidden" animate={isInView ? 'visible' : 'hidden'}
            className="max-w-xl mx-auto text-lg text-[#64748B]"
          >
            No complex onboarding, no weeks of training. Most associations are fully operational within 24 hours.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative">
          {/* Connector lines */}
          <div className="hidden lg:block absolute top-16 left-[calc(33.33%-1px)] right-[calc(33.33%-1px)] h-px bg-gradient-to-r from-[#075DE8] via-[#15C6B8] to-[#32E6A4] opacity-30" />

          {steps.map((step, i) => (
            <motion.div
              key={step.num}
              variants={fadeUp} custom={i * 0.15}
              initial="hidden" animate={isInView ? 'visible' : 'hidden'}
              className="relative text-center p-8 rounded-2xl bg-white border border-[#E6EEF5] shadow-sm hover:shadow-lg hover:border-[#075DE8]/20 transition-all duration-300"
            >
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-uphold-gradient flex items-center justify-center text-white text-xs font-bold shadow-[0_4px_16px_rgba(7,93,232,0.4)]">
                {step.num.slice(1)}
              </div>
              <div className="w-16 h-16 rounded-2xl bg-uphold-gradient-subtle flex items-center justify-center text-[#075DE8] mx-auto mb-6 mt-4">
                {step.icon}
              </div>
              <h3 className="text-xl font-bold font-display text-[#0F172A] mb-3">{step.title}</h3>
              <p className="text-[#64748B] leading-relaxed">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Testimonials ─────────────────────────────────────────────────────────────
const testimonials = [
  {
    name: 'Claire Whitmore',
    role: 'Operations Manager',
    org: 'Granville Community Homes',
    initials: 'CW',
    quote: "Uphold completely transformed how we track STAR assessments and housing benefit. What used to take hours of spreadsheet work is now a two-minute daily check. Our compliance rate went from 74% to 98% in three months.",
    color: 'from-[#075DE8] to-[#0797D8]',
  },
  {
    name: 'Marcus Reid',
    role: 'CEO',
    org: 'HavenPath Housing',
    initials: 'MR',
    quote: "The board reporting feature alone is worth it. I can generate a commissioner-ready compliance summary with one click instead of spending a Friday afternoon pulling data from five different systems.",
    color: 'from-[#15C6B8] to-[#32E6A4]',
  },
  {
    name: 'Priya Kapoor',
    role: 'Support Worker Lead',
    org: 'Oakmere Support Services',
    initials: 'PK',
    quote: "Being able to log support sessions on my phone and have them sync instantly to the tenant profile is a game-changer. The below-threshold alerts mean we never miss a tenant who needs more attention.",
    color: 'from-[#6366F1] to-[#8B5CF6]',
  },
];

function TestimonialsSection() {
  const { ref, isInView } = useScrollReveal();

  return (
    <section className="py-24 lg:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div ref={ref} className="text-center mb-16">
          <motion.h2
            variants={fadeUp} initial="hidden" animate={isInView ? 'visible' : 'hidden'}
            className="text-4xl lg:text-5xl font-bold font-display text-[#0F172A] mb-4"
          >
            Loved by care teams{' '}
            <span className="text-uphold-gradient">across the UK</span>
          </motion.h2>
          <div className="flex items-center justify-center gap-1 mb-2">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={18} className="fill-[#F59E0B] text-[#F59E0B]" />
            ))}
          </div>
          <p className="text-sm text-[#64748B]">4.9 / 5 average rating · 340+ reviews</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              variants={fadeUp} custom={i * 0.1}
              initial="hidden" animate={isInView ? 'visible' : 'hidden'}
              whileHover={{ y: -4 }}
              className="p-6 rounded-2xl border border-[#E6EEF5] bg-white shadow-sm hover:shadow-xl hover:border-[#075DE8]/20 transition-all duration-300 flex flex-col gap-4"
            >
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, j) => (
                  <Star key={j} size={14} className="fill-[#F59E0B] text-[#F59E0B]" />
                ))}
              </div>
              <p className="text-[#334155] leading-relaxed text-sm flex-1">
                "{t.quote}"
              </p>
              <div className="flex items-center gap-3 pt-2 border-t border-[#E6EEF5]">
                <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${t.color} flex items-center justify-center text-white text-sm font-bold flex-shrink-0`}>
                  {t.initials}
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#0F172A]">{t.name}</p>
                  <p className="text-xs text-[#64748B]">{t.role} · {t.org}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Pricing ───────────────────────────────────────────────────────────────────
const plans = [
  {
    name: 'Starter',
    price: 49,
    period: 'per month',
    description: 'Perfect for small associations just getting started.',
    occupants: 'Up to 10 occupants',
    highlight: false,
    features: [
      'Tenant profiles & STAR assessments',
      'Document library (50 docs)',
      'Basic rent tracking',
      'Email support',
      '1 property',
    ],
  },
  {
    name: 'Professional',
    price: 149,
    period: 'per month',
    description: 'For growing associations managing multiple properties.',
    occupants: 'Up to 30 occupants',
    highlight: true,
    badge: 'Most popular',
    features: [
      'Everything in Starter',
      'Unlimited documents + e-signatures',
      'Full financial management',
      'STAR & compliance reports',
      'Up to 5 properties',
      'Priority support',
    ],
  },
  {
    name: 'Enterprise',
    price: null,
    period: 'custom pricing',
    description: 'For large associations with complex multi-site needs.',
    occupants: 'Unlimited occupants',
    highlight: false,
    features: [
      'Everything in Professional',
      'Unlimited properties',
      'SSO & custom roles',
      'API access',
      'Custom integrations',
      'Dedicated account manager',
      'SLA guarantee',
    ],
  },
];

function PricingSection() {
  const { ref, isInView } = useScrollReveal();
  const navigate = useNavigate();

  return (
    <section id="pricing" className="py-24 lg:py-32 bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div ref={ref} className="text-center mb-16">
          <motion.h2
            variants={fadeUp} initial="hidden" animate={isInView ? 'visible' : 'hidden'}
            className="text-4xl lg:text-5xl font-bold font-display text-[#0F172A] mb-4"
          >
            Simple, transparent{' '}
            <span className="text-uphold-gradient">pricing</span>
          </motion.h2>
          <motion.p
            variants={fadeUp} custom={1}
            initial="hidden" animate={isInView ? 'visible' : 'hidden'}
            className="max-w-xl mx-auto text-lg text-[#64748B]"
          >
            No hidden fees, no per-user charges. One flat monthly rate for your whole team.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              variants={fadeUp} custom={i * 0.12}
              initial="hidden" animate={isInView ? 'visible' : 'hidden'}
              whileHover={!plan.highlight ? { y: -4 } : {}}
              className={`relative rounded-2xl p-8 transition-all duration-300 ${
                plan.highlight
                  ? 'bg-[#060B18] text-white shadow-[0_24px_64px_rgba(7,93,232,0.35)] ring-1 ring-[#075DE8]/40 -mt-4'
                  : 'bg-white border border-[#E6EEF5] hover:shadow-lg'
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-bold text-white bg-uphold-gradient shadow-lg whitespace-nowrap">
                  {plan.badge}
                </div>
              )}

              <div className="mb-6">
                <h3 className={`text-xl font-bold font-display mb-1 ${plan.highlight ? 'text-white' : 'text-[#0F172A]'}`}>
                  {plan.name}
                </h3>
                <p className={`text-sm mb-4 ${plan.highlight ? 'text-white/60' : 'text-[#64748B]'}`}>
                  {plan.description}
                </p>
                <div className="flex items-baseline gap-2">
                  {plan.price ? (
                    <>
                      <span className={`text-4xl font-bold font-display ${plan.highlight ? 'text-uphold-gradient' : 'text-[#0F172A]'}`}>
                        £{plan.price}
                      </span>
                      <span className={`text-sm ${plan.highlight ? 'text-white/50' : 'text-[#64748B]'}`}>
                        {plan.period}
                      </span>
                    </>
                  ) : (
                    <span className={`text-4xl font-bold font-display ${plan.highlight ? 'text-white' : 'text-[#0F172A]'}`}>
                      Custom
                    </span>
                  )}
                </div>
                <p className={`text-xs mt-1 ${plan.highlight ? 'text-white/50' : 'text-[#64748B]'}`}>
                  {plan.occupants}
                </p>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/login')}
                className={`w-full py-3 rounded-xl text-sm font-semibold mb-6 transition-all ${
                  plan.highlight
                    ? 'bg-uphold-gradient text-white shadow-[0_4px_20px_rgba(7,93,232,0.5)] hover:shadow-[0_4px_28px_rgba(7,93,232,0.7)]'
                    : 'bg-[#F1F5F9] text-[#0F172A] hover:bg-[#E2E8F0]'
                }`}
              >
                {plan.price ? 'Start free trial' : 'Contact sales'}
              </motion.button>

              <ul className="space-y-3">
                {plan.features.map(f => (
                  <li key={f} className="flex items-start gap-2.5">
                    <CheckCircle size={15} className={`mt-0.5 flex-shrink-0 ${plan.highlight ? 'text-[#32E6A4]' : 'text-[#10B981]'}`} />
                    <span className={`text-sm ${plan.highlight ? 'text-white/80' : 'text-[#334155]'}`}>{f}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        <motion.p
          variants={fadeUp}
          initial="hidden" animate={isInView ? 'visible' : 'hidden'}
          className="text-center text-sm text-[#64748B] mt-8"
        >
          All plans include a 14-day free trial. No credit card required. Cancel anytime.
        </motion.p>
      </div>
    </section>
  );
}

// ── CTA ───────────────────────────────────────────────────────────────────────
function CTASection() {
  const { ref, isInView } = useScrollReveal();
  const navigate = useNavigate();

  return (
    <section id="about" className="py-24 lg:py-32 relative overflow-hidden bg-[#060B18]">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-uphold-gradient opacity-10" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#075DE8]/20 blur-[100px]" />
      </div>
      <div ref={ref} className="relative z-10 max-w-4xl mx-auto px-6 lg:px-8 text-center">
        <motion.div
          variants={fadeUp} initial="hidden" animate={isInView ? 'visible' : 'hidden'}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/15 bg-white/5 text-sm text-white/80 font-medium mb-8"
        >
          <Globe size={14} />
          ISO 27001 · GDPR Compliant · UK Data Residency
        </motion.div>
        <motion.h2
          variants={fadeUp} custom={1}
          initial="hidden" animate={isInView ? 'visible' : 'hidden'}
          className="text-4xl lg:text-6xl font-bold font-display text-white mb-6 leading-tight"
        >
          Ready to transform your{' '}
          <span className="text-uphold-gradient">housing management?</span>
        </motion.h2>
        <motion.p
          variants={fadeUp} custom={2}
          initial="hidden" animate={isInView ? 'visible' : 'hidden'}
          className="text-lg text-white/60 mb-10 max-w-2xl mx-auto leading-relaxed"
        >
          Join over 200 housing associations across England & Wales who use Uphold to deliver
          better care, stay compliant, and reduce admin burden.
        </motion.p>
        <motion.div
          variants={fadeUp} custom={3}
          initial="hidden" animate={isInView ? 'visible' : 'hidden'}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <motion.button
            whileHover={{ scale: 1.03, boxShadow: '0 8px 40px rgba(7,93,232,0.6)' }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/login')}
            className="flex items-center gap-2.5 px-8 py-4 text-base font-semibold text-white rounded-2xl bg-uphold-gradient shadow-[0_4px_28px_rgba(7,93,232,0.45)] transition-all"
          >
            Start your free trial
            <ArrowRight size={18} />
          </motion.button>
          <motion.a
            whileHover={{ scale: 1.02 }}
            href="mailto:hello@uphold.co.uk"
            className="flex items-center gap-2 px-8 py-4 text-base font-medium text-white/80 hover:text-white rounded-2xl border border-white/20 hover:bg-white/5 transition-all"
          >
            Talk to sales
          </motion.a>
        </motion.div>
        <motion.div
          variants={fadeUp} custom={4}
          initial="hidden" animate={isInView ? 'visible' : 'hidden'}
          className="flex items-center justify-center gap-6 mt-10"
        >
          {[
            { icon: <CheckCircle size={14} />, text: '14-day free trial' },
            { icon: <Lock size={14} />, text: 'No credit card needed' },
            { icon: <ShieldCheck size={14} />, text: 'Cancel anytime' },
          ].map(item => (
            <div key={item.text} className="flex items-center gap-1.5 text-sm text-white/50">
              <span className="text-[#32E6A4]">{item.icon}</span>
              {item.text}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// ── Footer ────────────────────────────────────────────────────────────────────
function LandingFooter() {
  const navigate = useNavigate();
  const footerLinks = {
    Product: ['Dashboard', 'Tenants', 'Properties', 'Financials', 'Documents', 'Reports'],
    Company: ['About us', 'Blog', 'Careers', 'Press', 'Contact'],
    Legal: ['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'GDPR Statement', 'Security'],
  };

  return (
    <footer className="bg-[#060B18] border-t border-white/10 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 mb-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl overflow-hidden ring-1 ring-white/20">
                <img src="/ChatGPT_Image_Jun_27,_2026,_12_40_41_PM.png" alt="Uphold" className="w-full h-full object-cover" />
              </div>
              <span className="text-xl font-bold font-display text-white">Uphold</span>
            </Link>
            <p className="text-sm text-white/50 leading-relaxed mb-6 max-w-xs">
              The UK's most trusted CRM for supported housing associations — built for care teams who need clarity, not complexity.
            </p>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10">
                <ShieldCheck size={12} className="text-[#32E6A4]" />
                <span className="text-xs text-white/60">ISO 27001</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10">
                <Lock size={12} className="text-[#15C6B8]" />
                <span className="text-xs text-white/60">GDPR Ready</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10">
                <Globe size={12} className="text-[#0797D8]" />
                <span className="text-xs text-white/60">UK Data</span>
              </div>
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-sm font-semibold text-white mb-4">{title}</h4>
              <ul className="space-y-3">
                {links.map(link => (
                  <li key={link}>
                    <button
                      onClick={() => navigate('/login')}
                      className="text-sm text-white/50 hover:text-white/80 transition-colors"
                    >
                      {link}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/40">
            © 2026 Uphold Technologies Ltd. All rights reserved. Registered in England & Wales.
          </p>
          <p className="text-xs text-white/30">
            Built with care for supported housing teams across the UK.
          </p>
        </div>
      </div>
    </footer>
  );
}

// ── Main export ───────────────────────────────────────────────────────────────
export function LandingPage() {
  return (
    <div className="min-h-screen overflow-x-hidden">
      <LandingNav />
      <HeroSection />
      <TrustBar />
      <FeaturesSection />
      <MetricsSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <PricingSection />
      <CTASection />
      <LandingFooter />
    </div>
  );
}
