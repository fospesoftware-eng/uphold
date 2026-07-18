import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Star, Heart, Shield, Users } from 'lucide-react';

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

const values = [
  {
    icon: <Heart size={22} />,
    gradient: 'from-[#F43F5E] to-[#EF4444]',
    title: 'People first',
    body: 'Every feature we build starts with the tenant or care worker who uses it — not the administrator who reports on it.',
  },
  {
    icon: <Shield size={22} />,
    gradient: 'from-[#075DE8] to-[#0797D8]',
    title: 'Compliance by design',
    body: 'GDPR, ISO 27001, and supported housing legislation isn\'t bolted on — it\'s baked into every workflow.',
  },
  {
    icon: <Users size={22} />,
    gradient: 'from-[#15C6B8] to-[#32E6A4]',
    title: 'Built with the sector',
    body: 'We co-design every feature with housing association staff, support workers, and compliance leads.',
  },
];

const testimonials = [
  {
    initials: 'CW',
    name: 'Claire Whitmore',
    role: 'Operations Manager · Granville Community Homes',
    color: 'from-[#075DE8] to-[#0797D8]',
    quote: "Uphold completely transformed how we track STAR assessments and housing benefit. What used to take hours of spreadsheet work is now a two-minute daily check. Our compliance rate went from 74% to 98% in three months.",
  },
  {
    initials: 'MR',
    name: 'Marcus Reid',
    role: 'CEO · HavenPath Housing',
    color: 'from-[#15C6B8] to-[#32E6A4]',
    quote: "The board reporting feature alone is worth it. I can generate a commissioner-ready compliance summary with one click instead of spending a Friday afternoon pulling data from five different systems.",
  },
  {
    initials: 'PK',
    name: 'Priya Kapoor',
    role: 'Support Worker Lead · Oakmere Support Services',
    color: 'from-[#6366F1] to-[#8B5CF6]',
    quote: "Logging support sessions on my phone and having them sync instantly to the tenant profile is a game-changer. The below-threshold alerts mean we never miss a tenant who needs more attention.",
  },
];

export function AboutPage() {
  const { ref: heroRef, isInView: heroInView } = useReveal();
  const { ref: valuesRef, isInView: valuesInView } = useReveal();
  const { ref: testimonialsRef, isInView: testimonialsInView } = useReveal();
  const { ref: leadershipRef, isInView: leadershipInView } = useReveal();
  const { ref: visionRef, isInView: visionInView } = useReveal();
  const { ref: locationsRef, isInView: locationsInView } = useReveal();
  const navigate = useNavigate();

  return (
    <div>
      {/* Header */}
      <div className="bg-[#060B18] py-28 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="orb orb-1" style={{ opacity: 0.5 }} />
          <div className="orb orb-3" style={{ opacity: 0.5 }} />
        </div>
        <div ref={heroRef} className="relative z-10 max-w-4xl mx-auto px-6 text-center pt-8">
          <motion.div
            variants={fadeUp} initial="hidden" animate={heroInView ? 'visible' : 'hidden'}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/15 bg-white/5 text-sm text-white/80 font-medium mb-6"
          >
            <Heart size={13} className="text-[#F43F5E]" />
            Our mission
          </motion.div>
          <motion.h1
            variants={fadeUp} custom={1}
            initial="hidden" animate={heroInView ? 'visible' : 'hidden'}
            className="text-4xl lg:text-6xl font-bold font-display text-white mb-6 leading-tight"
          >
            Technology built for{' '}
            <span className="text-uphold-gradient">supported housing</span>
          </motion.h1>
          <motion.p
            variants={fadeUp} custom={2}
            initial="hidden" animate={heroInView ? 'visible' : 'hidden'}
            className="text-lg text-white/60 max-w-2xl mx-auto leading-relaxed"
          >
            We built Uphold because every housing association we spoke to was drowning in spreadsheets,
            paper trails, and compliance gaps. We believed there had to be a better way — and we built it.
          </motion.p>
        </div>
      </div>

      {/* Mission statement */}
      <div className="bg-white py-24">
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="w-14 h-14 flex items-center justify-center mb-6">
                <img src="/uphold-logo-transparent.png" alt="Uphold" className="w-full h-full object-contain" />
              </div>
              <h2 className="text-3xl font-bold font-display text-[#0F172A] mb-4">
                Why we exist
              </h2>
              <p className="text-[#64748B] leading-relaxed mb-4">
                Supporting vulnerable people requires meticulous care — and meticulous record-keeping.
                Housing associations are held to strict standards for STAR assessments, safety certificates,
                benefit management, and documentation, yet most still manage all of this through spreadsheets.
              </p>
              <p className="text-[#64748B] leading-relaxed">
                Uphold gives care teams back the time they should be spending with tenants, not chasing
                paperwork. We are Registered in England & Wales, ISO 27001 certified, and fully UK-data resident.
              </p>
            </div>
            <div className="bg-[#F8FAFC] rounded-3xl p-8 border border-[#E6EEF5]">
              <div className="grid grid-cols-2 gap-6">
                {[
                  { value: '200+', label: 'Housing associations' },
                  { value: '15k+', label: 'Tenants supported' },
                  { value: '40%', label: 'Less admin time' },
                  { value: '99.9%', label: 'Platform uptime' },
                ].map(stat => (
                  <div key={stat.label} className="text-center p-4 bg-white rounded-xl border border-[#E6EEF5]">
                    <div className="text-2xl font-bold font-display text-uphold-gradient mb-1">{stat.value}</div>
                    <div className="text-xs text-[#64748B] font-medium">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Values */}
      <div className="py-24 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div ref={valuesRef} className="text-center mb-12">
            <motion.h2
              variants={fadeUp} initial="hidden" animate={valuesInView ? 'visible' : 'hidden'}
              className="text-3xl font-bold font-display text-[#0F172A]"
            >
              What drives us
            </motion.h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {values.map((v, i) => (
              <motion.div
                key={v.title}
                variants={fadeUp} custom={i * 0.1}
                initial="hidden" animate={valuesInView ? 'visible' : 'hidden'}
                className="p-6 bg-white rounded-2xl border border-[#E6EEF5] hover:shadow-lg transition-all"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${v.gradient} flex items-center justify-center text-white mb-4 shadow-md`}>
                  {v.icon}
                </div>
                <h3 className="text-lg font-bold text-[#0F172A] mb-2">{v.title}</h3>
                <p className="text-sm text-[#64748B] leading-relaxed">{v.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div ref={testimonialsRef} className="text-center mb-12">
            <motion.h2
              variants={fadeUp} initial="hidden" animate={testimonialsInView ? 'visible' : 'hidden'}
              className="text-3xl font-bold font-display text-[#0F172A] mb-2"
            >
              Loved by care teams
            </motion.h2>
            <div className="flex items-center justify-center gap-1 mb-1">
              {[...Array(5)].map((_, i) => <Star key={i} size={16} className="fill-[#F59E0B] text-[#F59E0B]" />)}
            </div>
            <p className="text-sm text-[#94A3B8]">4.9 / 5 · 340+ reviews</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                variants={fadeUp} custom={i * 0.1}
                initial="hidden" animate={testimonialsInView ? 'visible' : 'hidden'}
                whileHover={{ y: -4 }}
                className="p-6 rounded-2xl border border-[#E6EEF5] hover:shadow-xl transition-all flex flex-col gap-4"
              >
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, j) => <Star key={j} size={13} className="fill-[#F59E0B] text-[#F59E0B]" />)}
                </div>
                <p className="text-sm text-[#334155] leading-relaxed flex-1">"{t.quote}"</p>
                <div className="flex items-center gap-3 pt-2 border-t border-[#E6EEF5]">
                  <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${t.color} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
                    {t.initials}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#0F172A]">{t.name}</p>
                    <p className="text-xs text-[#64748B]">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Leadership Section */}
      <div id="leadership" className="py-24 bg-[#F8FAFC] border-t border-[#E6EEF5]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div ref={leadershipRef} className="text-center mb-16">
            <motion.h2
              variants={fadeUp} initial="hidden" animate={leadershipInView ? 'visible' : 'hidden'}
              className="text-3xl font-bold font-display text-[#0F172A]"
            >
              Our Leadership Team
            </motion.h2>
            <motion.p
              variants={fadeUp} custom={1} initial="hidden" animate={leadershipInView ? 'visible' : 'hidden'}
              className="text-[#64748B] max-w-xl mx-auto mt-3 text-sm leading-relaxed"
            >
              Meet the specialists leading Uphold in bridging the gap between care work and compliance technology.
            </motion.p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: 'Alex Patel',
                role: 'CEO & Co-Founder',
                bio: 'Formerly built housing compliance tools for UK councils. Passionate about sector efficiency and security.',
                initials: 'AP',
                color: 'from-[#075DE8] to-[#0797D8]'
              },
              {
                name: 'Dorota Dominika',
                role: 'Head of Compliance & Co-Founder',
                bio: '15+ years managing supported housing associations. Ex-commissioner for Manchester City Council.',
                initials: 'DD',
                color: 'from-[#15C6B8] to-[#32E6A4]'
              },
              {
                name: 'Sarah Mitchell',
                role: 'Head of Product',
                bio: 'Designed customer experiences at leading UK SaaS companies. Focused on care team empowerment.',
                initials: 'SM',
                color: 'from-[#6366F1] to-[#8B5CF6]'
              }
            ].map((member, i) => (
              <motion.div
                key={member.name}
                variants={fadeUp} custom={i * 0.1}
                initial="hidden" animate={leadershipInView ? 'visible' : 'hidden'}
                className="p-6 bg-white rounded-2xl border border-[#E6EEF5] hover:shadow-lg transition-all"
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${member.color} flex items-center justify-center text-white text-lg font-bold mb-4 shadow-md`}>
                  {member.initials}
                </div>
                <h3 className="text-lg font-bold text-[#0F172A]">{member.name}</h3>
                <p className="text-xs font-semibold text-[#075DE8] mt-0.5">{member.role}</p>
                <p className="text-sm text-[#64748B] leading-relaxed mt-3">{member.bio}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Vision Section */}
      <div id="vision" className="py-24 bg-white border-t border-[#E6EEF5]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div ref={visionRef} className="text-center mb-16">
            <motion.h2
              variants={fadeUp} initial="hidden" animate={visionInView ? 'visible' : 'hidden'}
              className="text-3xl font-bold font-display text-[#0F172A]"
            >
              Vision 2030
            </motion.h2>
            <motion.p
              variants={fadeUp} custom={1} initial="hidden" animate={visionInView ? 'visible' : 'hidden'}
              className="text-[#64748B] max-w-xl mx-auto mt-3 text-sm leading-relaxed"
            >
              Our roadmap is built in close alignment with housing legislation, providing automated care pathways.
            </motion.p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                phase: 'Q3 2026',
                title: 'AI Risk Insights',
                desc: 'Automated predictive warnings for tenant risk profiles and STAR score drop-offs.'
              },
              {
                phase: 'Q4 2026',
                title: 'Offline Field Access',
                desc: 'Mobile support session logging with offline database syncing for remote staff.'
              },
              {
                phase: 'Q1 2027',
                title: 'Commissioner Portal',
                desc: 'Read-only dashboard for local authorities to check audit logs instantly.'
              }
            ].map((step, i) => (
              <motion.div
                key={step.title}
                variants={fadeUp} custom={i * 0.1}
                initial="hidden" animate={visionInView ? 'visible' : 'hidden'}
                className="p-6 bg-[#F8FAFC] rounded-2xl border border-[#E6EEF5] hover:shadow-md transition-all relative overflow-hidden"
              >
                <span className="absolute top-4 right-4 text-[10px] font-bold text-[#075DE8] bg-blue-50 px-2 py-1 rounded-full uppercase tracking-wider">
                  {step.phase}
                </span>
                <h3 className="text-lg font-bold text-[#0F172A] mt-2">{step.title}</h3>
                <p className="text-sm text-[#64748B] leading-relaxed mt-3">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Locations Section */}
      <div id="locations" className="py-24 bg-[#F8FAFC] border-t border-[#E6EEF5]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div ref={locationsRef} className="text-center mb-16">
            <motion.h2
              variants={fadeUp} initial="hidden" animate={locationsInView ? 'visible' : 'hidden'}
              className="text-3xl font-bold font-display text-[#0F172A]"
            >
              Location
            </motion.h2>
            <motion.p
              variants={fadeUp} custom={1} initial="hidden" animate={locationsInView ? 'visible' : 'hidden'}
              className="text-[#64748B] max-w-xl mx-auto mt-3 text-sm leading-relaxed"
            >
              We support housing associations and local care teams from regional hubs across the UK.
            </motion.p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                city: 'London HQ',
                address: '88 Kingsway, London, WC2B 6AA',
                desc: 'Central administration, sales, and executive team.'
              },
              {
                city: 'Manchester Office',
                address: '14 Maple Avenue, Manchester, M4 1AB',
                desc: 'Engineering, customer support, and local training hub.'
              },
              {
                city: 'Birmingham Hub',
                address: '22 Oak Street, Birmingham, B1 2WE',
                desc: 'Compliance consulting and regional customer success.'
              }
            ].map((loc, i) => (
              <motion.div
                key={loc.city}
                variants={fadeUp} custom={i * 0.1}
                initial="hidden" animate={locationsInView ? 'visible' : 'hidden'}
                className="p-6 bg-white rounded-2xl border border-[#E6EEF5] hover:shadow-lg transition-all"
              >
                <h3 className="text-lg font-bold text-[#0F172A]">{loc.city}</h3>
                <p className="text-xs text-[#075DE8] font-semibold mt-1">{loc.address}</p>
                <p className="text-sm text-[#64748B] leading-relaxed mt-3">{loc.desc}</p>
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
            Join us in redefining{' '}
            <span className="text-uphold-gradient">supported housing</span>
          </h2>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/login')}
            className="inline-flex items-center gap-2 px-8 py-4 text-base font-semibold text-white rounded-2xl bg-uphold-gradient shadow-[0_4px_28px_rgba(7,93,232,0.45)]"
          >
            Get started free <ArrowRight size={17} />
          </motion.button>
        </div>
      </div>
    </div>
  );
}
