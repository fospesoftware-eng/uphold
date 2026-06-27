import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Upload, Settings2, Sparkles, BellRing, BarChart3,
  ArrowRight, Zap, CheckCircle, Clock, ShieldCheck, Headset,
} from 'lucide-react';

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

const steps = [
  {
    icon: <Upload size={22} />,
    gradient: 'from-[#075DE8] to-[#0797D8]',
    title: 'Import your data',
    body: 'Bring tenants, properties, certificates, and documents in from spreadsheets or your current system. Our guided importer maps fields automatically.',
    points: ['CSV & Excel import', 'Automatic field mapping', 'No data left behind'],
  },
  {
    icon: <Settings2 size={22} />,
    gradient: 'from-[#0797D8] to-[#15C6B8]',
    title: 'Configure your workflows',
    body: 'Set support-hour thresholds, certificate reminders, document templates, and role permissions to match how your service actually runs.',
    points: ['Custom support thresholds', 'Template library', 'Role-based permissions'],
  },
  {
    icon: <Sparkles size={22} />,
    gradient: 'from-[#15C6B8] to-[#32E6A4]',
    title: 'Let the AI watch over everything',
    body: 'Uphold AI continuously scores tenant risk, flags compliance gaps, and surfaces the actions that matter most — before they become problems.',
    points: ['Predictive risk scoring', 'Compliance forecasting', 'Daily AI briefings'],
  },
  {
    icon: <BellRing size={22} />,
    gradient: 'from-[#6366F1] to-[#8B5CF6]',
    title: 'Act on smart alerts',
    body: 'Your team gets the right nudge at the right time — overdue reviews, expiring certificates, arrears, and below-threshold support hours.',
    points: ['Real-time alerts', 'Prioritised action lists', 'Assistant on every page'],
  },
  {
    icon: <BarChart3 size={22} />,
    gradient: 'from-[#10B981] to-[#15C6B8]',
    title: 'Report with confidence',
    body: 'Generate commissioner-ready compliance summaries, STAR progress, and rent audits in one click — exportable to PDF or CSV.',
    points: ['Board-ready exports', 'ESA & STAR reports', 'Full audit trail'],
  },
];

const promises = [
  { icon: <Clock size={20} />, title: 'Live in a day', body: 'Most teams are up and running within a single working day.' },
  { icon: <Headset size={20} />, title: 'UK-based support', body: 'Real people who understand supported housing, not a ticket queue.' },
  { icon: <ShieldCheck size={20} />, title: 'Secure by default', body: 'ISO 27001, GDPR-compliant, with UK data residency.' },
];

export function HowItWorksPage() {
  const { ref: heroRef, isInView: heroInView } = useReveal();
  const { ref: promiseRef, isInView: promiseInView } = useReveal();
  const navigate = useNavigate();

  return (
    <div className="bg-white">
      {/* Hero */}
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
            <Zap size={13} /> How it works
          </motion.div>
          <motion.h1
            variants={fadeUp} custom={1} initial="hidden" animate={heroInView ? 'visible' : 'hidden'}
            className="text-4xl lg:text-6xl font-bold font-display text-white mb-4"
          >
            From spreadsheets to{' '}
            <span className="text-uphold-gradient">smart oversight</span>
          </motion.h1>
          <motion.p
            variants={fadeUp} custom={2} initial="hidden" animate={heroInView ? 'visible' : 'hidden'}
            className="text-lg text-white/60 max-w-xl mx-auto"
          >
            Five simple steps to a CRM that watches your portfolio for you — so your team can focus on people, not paperwork.
          </motion.p>
        </div>
      </div>

      {/* Steps timeline */}
      <div className="py-24 lg:py-32 max-w-4xl mx-auto px-6 lg:px-8">
        <div className="relative">
          {/* vertical line */}
          <div className="absolute left-[27px] top-4 bottom-4 w-px bg-gradient-to-b from-[#075DE8]/40 via-[#15C6B8]/40 to-[#10B981]/40 hidden sm:block" />
          <div className="space-y-10">
            {steps.map((s, i) => {
              const { ref, isInView } = useReveal();
              return (
                <motion.div
                  key={s.title}
                  ref={ref}
                  variants={fadeUp} initial="hidden" animate={isInView ? 'visible' : 'hidden'}
                  className="relative flex gap-5 sm:gap-8"
                >
                  <div className="flex-shrink-0 relative z-10">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${s.gradient} flex items-center justify-center text-white shadow-lg`}>
                      {s.icon}
                    </div>
                  </div>
                  <div className="flex-1 pt-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-[#94A3B8] tabular-nums">STEP {i + 1}</span>
                    </div>
                    <h2 className="text-xl font-bold font-display text-[#0F172A] mb-2">{s.title}</h2>
                    <p className="text-sm text-[#64748B] leading-relaxed mb-3 max-w-xl">{s.body}</p>
                    <div className="flex flex-wrap gap-2">
                      {s.points.map(p => (
                        <span key={p} className="inline-flex items-center gap-1.5 text-xs font-medium text-[#334155] bg-[#F1F5F9] border border-[#E6EEF5] rounded-full px-2.5 py-1">
                          <CheckCircle size={12} className="text-[#10B981]" /> {p}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Promises */}
      <div className="py-24 bg-[#F8FAFC]">
        <div ref={promiseRef} className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {promises.map((p, i) => (
              <motion.div
                key={p.title}
                variants={fadeUp} custom={i * 0.12} initial="hidden" animate={promiseInView ? 'visible' : 'hidden'}
                className="p-7 rounded-2xl bg-white border border-[#E6EEF5] shadow-sm text-center"
              >
                <div className="w-12 h-12 rounded-xl bg-uphold-gradient-subtle text-[#075DE8] flex items-center justify-center mx-auto mb-4">
                  {p.icon}
                </div>
                <h3 className="font-bold font-display text-[#0F172A] mb-1.5">{p.title}</h3>
                <p className="text-sm text-[#64748B] leading-relaxed">{p.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="py-20 bg-[#060B18] text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-uphold-gradient opacity-10 pointer-events-none" />
        <div className="relative z-10 max-w-xl mx-auto px-6">
          <h2 className="text-3xl font-bold font-display text-white mb-3">See it on your own data</h2>
          <p className="text-white/60 mb-6">Book a 30-minute demo and we'll walk you through it.</p>
          <motion.button
            whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/schedule-demo')}
            className="inline-flex items-center gap-2 px-8 py-4 text-base font-semibold text-white rounded-2xl bg-uphold-gradient shadow-[0_4px_28px_rgba(7,93,232,0.45)]"
          >
            Schedule a demo <ArrowRight size={17} />
          </motion.button>
        </div>
      </div>
    </div>
  );
}
