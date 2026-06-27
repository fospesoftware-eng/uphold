import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, ArrowRight, ShieldCheck, Globe, Lock } from 'lucide-react';

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

const plans = [
  {
    name: 'Starter',
    price: 49,
    description: 'Perfect for small associations just getting started.',
    occupants: 'Up to 10 occupants · 1 property',
    highlight: false,
    features: [
      'Tenant profiles & STAR assessments',
      'Document library (50 docs)',
      'Basic rent tracking',
      'Email support',
    ],
  },
  {
    name: 'Professional',
    price: 149,
    description: 'For growing associations managing multiple properties.',
    occupants: 'Up to 30 occupants · 5 properties',
    highlight: true,
    badge: 'Most popular',
    features: [
      'Everything in Starter',
      'Unlimited documents + e-signatures',
      'Full financial management',
      'STAR & compliance reports',
      'Priority support',
    ],
  },
  {
    name: 'Enterprise',
    price: null,
    description: 'For large associations with complex multi-site needs.',
    occupants: 'Unlimited occupants & properties',
    highlight: false,
    features: [
      'Everything in Professional',
      'SSO & custom roles',
      'API access & integrations',
      'Dedicated account manager',
      'SLA guarantee',
    ],
  },
];

const faqs = [
  {
    q: 'Is there a free trial?',
    a: 'Yes — all plans include a 14-day free trial with no credit card required. You can cancel at any time.',
  },
  {
    q: 'Can I change plans later?',
    a: 'Absolutely. You can upgrade, downgrade, or cancel your plan at any time from your account settings.',
  },
  {
    q: 'Where is our data stored?',
    a: 'All data is stored in UK-based data centres. Uphold is ISO 27001 certified and GDPR compliant.',
  },
  {
    q: 'Is there training for our team?',
    a: 'Professional and Enterprise plans include onboarding sessions. We also provide a full knowledge base and video guides.',
  },
  {
    q: 'Do you support multi-site organisations?',
    a: 'Yes. Professional supports up to 5 properties; Enterprise is fully unlimited. All property data is available from a single dashboard.',
  },
];

export function PricingPage() {
  const { ref: heroRef, isInView: heroInView } = useReveal();
  const { ref: faqRef, isInView: faqInView } = useReveal();
  const navigate = useNavigate();

  return (
    <div>
      {/* Header */}
      <div className="bg-[#060B18] py-24 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-1/4 w-80 h-80 rounded-full bg-[#075DE8]/15 blur-[80px]" />
          <div className="absolute bottom-0 left-1/4 w-80 h-80 rounded-full bg-[#32E6A4]/10 blur-[80px]" />
        </div>
        <div ref={heroRef} className="relative z-10 max-w-4xl mx-auto px-6 text-center pt-8">
          <motion.h1
            variants={fadeUp} initial="hidden" animate={heroInView ? 'visible' : 'hidden'}
            className="text-4xl lg:text-6xl font-bold font-display text-white mb-4"
          >
            Simple, transparent{' '}
            <span className="text-uphold-gradient">pricing</span>
          </motion.h1>
          <motion.p
            variants={fadeUp} custom={1}
            initial="hidden" animate={heroInView ? 'visible' : 'hidden'}
            className="text-lg text-white/60 max-w-xl mx-auto"
          >
            No hidden fees, no per-user charges. One flat monthly rate for your whole team.
          </motion.p>
        </div>
      </div>

      {/* Pricing cards */}
      <div className="bg-[#F8FAFC] py-24">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            {plans.map((plan, i) => {
              const { ref, isInView } = useReveal();
              return (
                <motion.div
                  key={plan.name}
                  ref={ref}
                  variants={fadeUp} custom={i * 0.12}
                  initial="hidden" animate={isInView ? 'visible' : 'hidden'}
                  className={`relative rounded-2xl p-8 transition-all duration-300 ${
                    plan.highlight
                      ? 'bg-[#060B18] text-white shadow-[0_24px_64px_rgba(7,93,232,0.3)] ring-1 ring-[#075DE8]/40 -mt-4'
                      : 'bg-white border border-[#E6EEF5] hover:shadow-lg'
                  }`}
                >
                  {plan.badge && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-bold text-white bg-uphold-gradient shadow-lg whitespace-nowrap">
                      {plan.badge}
                    </div>
                  )}
                  <h3 className={`text-xl font-bold font-display mb-1 ${plan.highlight ? 'text-white' : 'text-[#0F172A]'}`}>
                    {plan.name}
                  </h3>
                  <p className={`text-sm mb-5 ${plan.highlight ? 'text-white/60' : 'text-[#64748B]'}`}>
                    {plan.description}
                  </p>
                  <div className="flex items-baseline gap-2 mb-1">
                    {plan.price ? (
                      <>
                        <span className={`text-4xl font-bold font-display ${plan.highlight ? 'text-uphold-gradient' : 'text-[#0F172A]'}`}>
                          £{plan.price}
                        </span>
                        <span className={`text-sm ${plan.highlight ? 'text-white/50' : 'text-[#64748B]'}`}>/ month</span>
                      </>
                    ) : (
                      <span className={`text-4xl font-bold font-display ${plan.highlight ? 'text-white' : 'text-[#0F172A]'}`}>Custom</span>
                    )}
                  </div>
                  <p className={`text-xs mb-6 ${plan.highlight ? 'text-white/50' : 'text-[#64748B]'}`}>{plan.occupants}</p>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => navigate('/login')}
                    className={`w-full py-3 rounded-xl text-sm font-semibold mb-6 transition-all ${
                      plan.highlight
                        ? 'bg-uphold-gradient text-white shadow-[0_4px_20px_rgba(7,93,232,0.5)]'
                        : 'bg-[#F1F5F9] text-[#0F172A] hover:bg-[#E2E8F0]'
                    }`}
                  >
                    {plan.price ? 'Start free trial' : 'Contact sales'}
                  </motion.button>
                  <ul className="space-y-3">
                    {plan.features.map(f => (
                      <li key={f} className="flex items-start gap-2.5">
                        <CheckCircle size={14} className={`mt-0.5 flex-shrink-0 ${plan.highlight ? 'text-[#32E6A4]' : 'text-[#10B981]'}`} />
                        <span className={`text-sm ${plan.highlight ? 'text-white/80' : 'text-[#334155]'}`}>{f}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              );
            })}
          </div>

          <p className="text-center text-sm text-[#94A3B8] mt-8">
            All plans include a 14-day free trial. No credit card required.
          </p>

          {/* Trust badges */}
          <div className="flex items-center justify-center gap-4 mt-8 flex-wrap">
            {[
              { icon: <ShieldCheck size={14} className="text-[#10B981]" />, label: 'ISO 27001 Certified' },
              { icon: <Lock size={14} className="text-[#075DE8]" />, label: 'GDPR Compliant' },
              { icon: <Globe size={14} className="text-[#0797D8]" />, label: 'UK Data Residency' },
            ].map(b => (
              <div key={b.label} className="flex items-center gap-2 px-3 py-2 rounded-lg border border-[#E6EEF5] bg-white text-sm text-[#64748B]">
                {b.icon}
                {b.label}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div className="py-24 bg-white">
        <div className="max-w-3xl mx-auto px-6">
          <div ref={faqRef} className="text-center mb-12">
            <motion.h2
              variants={fadeUp} initial="hidden" animate={faqInView ? 'visible' : 'hidden'}
              className="text-3xl font-bold font-display text-[#0F172A]"
            >
              Frequently asked questions
            </motion.h2>
          </div>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <motion.div
                key={faq.q}
                variants={fadeUp} custom={i * 0.08}
                initial="hidden" animate={faqInView ? 'visible' : 'hidden'}
                className="p-6 rounded-2xl border border-[#E6EEF5] hover:border-[#075DE8]/20 hover:shadow-md transition-all"
              >
                <h3 className="text-sm font-semibold text-[#0F172A] mb-2">{faq.q}</h3>
                <p className="text-sm text-[#64748B] leading-relaxed">{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="py-16 bg-[#060B18] text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-uphold-gradient opacity-10 pointer-events-none" />
        <div className="relative z-10 max-w-xl mx-auto px-6">
          <h2 className="text-3xl font-bold font-display text-white mb-6">
            Still have questions?
          </h2>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate('/login')}
              className="inline-flex items-center gap-2 px-7 py-3.5 text-sm font-semibold text-white rounded-2xl bg-uphold-gradient"
            >
              Start free trial <ArrowRight size={15} />
            </motion.button>
            <a
              href="mailto:hello@uphold.co.uk"
              className="px-7 py-3.5 text-sm font-medium text-white/80 hover:text-white rounded-2xl border border-white/20 hover:bg-white/5 transition-all"
            >
              Talk to sales
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
