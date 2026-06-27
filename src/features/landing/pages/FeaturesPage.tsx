import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Users, Building2, DollarSign, FileText, BarChart3, ShieldCheck,
  CheckCircle, ArrowRight, Zap,
} from 'lucide-react';
import { FeatureVisual } from '../FeatureVisuals';
import type { FeatureVisualVariant } from '../FeatureVisuals';

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.55, delay: i * 0.1, ease: 'easeOut' as const },
  }),
};

function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' } as Parameters<typeof useInView>[1]);
  return { ref, isInView };
}

const features = [
  {
    icon: <Users size={28} />,
    gradient: 'from-[#075DE8] to-[#0797D8]',
    glow: 'rgba(7,93,232,0.3)',
    visual: 'wellbeing' as FeatureVisualVariant,
    title: 'Tenant Wellbeing & STAR',
    tagline: 'Every tenant, fully visible.',
    points: [
      'STAR wellbeing assessments with scoring and trend tracking',
      'Risk level indicators and below-threshold automated alerts',
      'Support session logs with hours-per-week compliance view',
      'Full tenant profile with notes, documents, and history',
    ],
  },
  {
    icon: <Building2 size={28} />,
    gradient: 'from-[#0797D8] to-[#15C6B8]',
    glow: 'rgba(21,198,184,0.3)',
    visual: 'compliance' as FeatureVisualVariant,
    title: 'Property & Compliance',
    tagline: 'No certificate falls through the cracks.',
    points: [
      'Fire, gas, EPC, and EicR certificate management with expiry alerts',
      'Room-level occupancy and maintenance tracking',
      'Inspection scheduling and completion logging',
      'Multi-property dashboard for portfolio-wide compliance view',
    ],
  },
  {
    icon: <DollarSign size={28} />,
    gradient: 'from-[#15C6B8] to-[#32E6A4]',
    glow: 'rgba(50,230,164,0.25)',
    visual: 'financial' as FeatureVisualVariant,
    title: 'Rent & Financial Management',
    tagline: 'Your cash flow, crystal clear.',
    points: [
      'Housing benefit and personal contribution tracking',
      'Invoice generation and arrears dashboards',
      'Rent audit reports for commissioner submission',
      'Full transaction history with payment status',
    ],
  },
  {
    icon: <FileText size={28} />,
    gradient: 'from-[#6366F1] to-[#8B5CF6]',
    glow: 'rgba(99,102,241,0.3)',
    visual: 'documents' as FeatureVisualVariant,
    title: 'GDPR-Ready Documents',
    tagline: 'Paperwork that protects everyone.',
    points: [
      'Templated tenancy agreements, risk assessments, and support plans',
      'Digital e-signature with version control and audit trail',
      'Document library with tenant-level access control',
      'GDPR-compliant storage with UK data residency',
    ],
  },
  {
    icon: <BarChart3 size={28} />,
    gradient: 'from-[#F59E0B] to-[#EF4444]',
    glow: 'rgba(239,68,68,0.25)',
    visual: 'reports' as FeatureVisualVariant,
    title: 'Reports & Insights',
    tagline: 'Board-ready in one click.',
    points: [
      'ESA compliance reports for regulatory submission',
      'STAR wellbeing progress summaries by cohort',
      'Occupancy trend and rent collection analysis',
      'Exportable PDF and CSV formats for all reports',
    ],
  },
  {
    icon: <ShieldCheck size={28} />,
    gradient: 'from-[#10B981] to-[#15C6B8]',
    glow: 'rgba(16,185,129,0.3)',
    visual: 'access' as FeatureVisualVariant,
    title: 'Role-Based Access Control',
    tagline: 'Right people, right data.',
    points: [
      'Super admin, admin, support staff, and board-level permissions',
      'Granular visibility controls per module and property',
      'Two-factor authentication and full session audit log',
      'Role simulation for testing access before staff onboarding',
    ],
  },
];

const steps = [
  {
    num: '01',
    title: 'Import your data',
    body: 'Bring in existing tenants, properties, and documents from spreadsheets or your current system in minutes.',
  },
  {
    num: '02',
    title: 'Configure workflows',
    body: 'Set support thresholds, certificate reminders, document templates, and role permissions for your team.',
  },
  {
    num: '03',
    title: 'Manage with confidence',
    body: 'Your dashboard surfaces every risk, overdue task, and compliance gap — so nothing falls through the cracks.',
  },
];

export function FeaturesPage() {
  const { ref: heroRef, isInView: heroInView } = useReveal();
  const { ref: stepsRef, isInView: stepsInView } = useReveal();
  const navigate = useNavigate();

  return (
    <div className="bg-white">
      {/* Page header */}
      <div className="bg-[#060B18] py-24 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-80 h-80 rounded-full bg-[#075DE8]/15 blur-[80px]" />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full bg-[#15C6B8]/15 blur-[80px]" />
        </div>
        <div ref={heroRef} className="relative z-10 max-w-4xl mx-auto px-6 lg:px-8 text-center pt-8">
          <motion.div
            variants={fadeUp} initial="hidden" animate={heroInView ? 'visible' : 'hidden'}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/15 bg-white/5 text-sm text-white/80 font-medium mb-6"
          >
            <Zap size={13} />
            Full platform overview
          </motion.div>
          <motion.h1
            variants={fadeUp} custom={1}
            initial="hidden" animate={heroInView ? 'visible' : 'hidden'}
            className="text-4xl lg:text-6xl font-bold font-display text-white mb-4"
          >
            Every feature your{' '}
            <span className="text-uphold-gradient">team needs</span>
          </motion.h1>
          <motion.p
            variants={fadeUp} custom={2}
            initial="hidden" animate={heroInView ? 'visible' : 'hidden'}
            className="text-lg text-white/60 max-w-xl mx-auto"
          >
            One platform for STAR, compliance, rent, documents, and reporting — with nothing bolted on as an afterthought.
          </motion.p>
        </div>
      </div>

      {/* Feature cards */}
      <div className="py-24 lg:py-32 max-w-7xl mx-auto px-6 lg:px-8">
        <div className="space-y-8">
          {features.map((f, i) => {
            const { ref, isInView } = useReveal();
            return (
              <motion.div
                key={f.title}
                ref={ref}
                variants={fadeUp} custom={0}
                initial="hidden" animate={isInView ? 'visible' : 'hidden'}
                className={`grid grid-cols-1 lg:grid-cols-2 gap-8 items-center p-8 rounded-3xl border border-[#E6EEF5] bg-white hover:shadow-xl transition-all duration-300 ${i % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}
              >
                {/* Left (or right on odd) */}
                <div className={i % 2 === 1 ? 'lg:order-2' : ''}>
                  <div
                    className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${f.gradient} flex items-center justify-center text-white mb-5`}
                    style={{ boxShadow: `0 8px 24px ${f.glow}` }}
                  >
                    {f.icon}
                  </div>
                  <p className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wider mb-1">{f.tagline}</p>
                  <h2 className="text-2xl font-bold font-display text-[#0F172A] mb-4">{f.title}</h2>
                  <ul className="space-y-2.5">
                    {f.points.map(p => (
                      <li key={p} className="flex items-start gap-2.5 text-sm text-[#64748B]">
                        <CheckCircle size={15} className="text-[#10B981] flex-shrink-0 mt-0.5" />
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Animated AI visual */}
                <div className={i % 2 === 1 ? 'lg:order-1' : ''}>
                  <FeatureVisual variant={f.visual} glow={f.glow} />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* How it works */}
      <div className="py-24 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div ref={stepsRef} className="text-center mb-16">
            <motion.h2
              variants={fadeUp} initial="hidden" animate={stepsInView ? 'visible' : 'hidden'}
              className="text-4xl font-bold font-display text-[#0F172A] mb-4"
            >
              Up and running{' '}
              <span className="text-uphold-gradient">in a day</span>
            </motion.h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative">
            <div className="hidden lg:block absolute top-12 left-[calc(33.33%)] right-[calc(33.33%)] h-px bg-gradient-to-r from-[#075DE8]/30 via-[#15C6B8]/30 to-[#32E6A4]/30" />
            {steps.map((step, i) => (
              <motion.div
                key={step.num}
                variants={fadeUp} custom={i * 0.12}
                initial="hidden" animate={stepsInView ? 'visible' : 'hidden'}
                className="relative text-center p-8 rounded-2xl bg-white border border-[#E6EEF5] shadow-sm"
              >
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-uphold-gradient flex items-center justify-center text-white text-xs font-bold shadow-[0_4px_16px_rgba(7,93,232,0.4)]">
                  {i + 1}
                </div>
                <h3 className="text-lg font-bold font-display text-[#0F172A] mt-4 mb-2">{step.title}</h3>
                <p className="text-sm text-[#64748B] leading-relaxed">{step.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="py-20 bg-[#060B18] text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-uphold-gradient opacity-10 pointer-events-none" />
        <div className="relative z-10 max-w-xl mx-auto px-6">
          <h2 className="text-3xl font-bold font-display text-white mb-6">
            See it all in action
          </h2>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/login')}
            className="inline-flex items-center gap-2 px-8 py-4 text-base font-semibold text-white rounded-2xl bg-uphold-gradient shadow-[0_4px_28px_rgba(7,93,232,0.45)]"
          >
            Start free trial <ArrowRight size={17} />
          </motion.button>
        </div>
      </div>
    </div>
  );
}
