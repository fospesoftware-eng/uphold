import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Search, MapPin, Home, ChevronDown, ShieldCheck, Sparkles, Clock,
  BadgeCheck, Star, ArrowRight, Plus, Minus,
} from 'lucide-react';
import { ListingCard } from '../components/ListingCard';
import { PropertyArt } from '../PropertyArt';
import { useLiveListings } from '../useMarketplace';
import { POPULAR_CITIES, TESTIMONIALS, FAQS } from '../listings';
import { gbp } from '../format';

const TYPES = [
  { value: '', label: 'Any type' },
  { value: 'self_contained', label: 'Apartment / Home' },
  { value: 'shared_house', label: 'Shared House' },
  { value: 'supported_living', label: 'Supported Living' },
];

export function MarketplaceHome() {
  const navigate = useNavigate();
  const listings = useLiveListings();
  const [city, setCity] = useState('');
  const [type, setType] = useState('');
  const [beds, setBeds] = useState('');
  const [isWide, setIsWide] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    const on = () => setIsWide(mq.matches);
    on();
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);

  const featured = listings.filter((l) => l.featured).slice(0, 6);
  const latest = listings.slice(0, 8);
  const cityCount = new Set(listings.map((l) => l.property.city)).size;
  const avgRating = listings.length
    ? (listings.reduce((s, l) => s + l.meta.rating, 0) / listings.length).toFixed(1)
    : '—';

  const submit = () => {
    const q = new URLSearchParams();
    if (city) q.set('city', city);
    if (type) q.set('type', type);
    if (beds) q.set('beds', beds);
    navigate(`/marketplace/search?${q.toString()}`);
  };

  return (
    <div>
      {/* ── Hero ── */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-[#0B1B3A] via-[#0E2E5A] to-[#0A6B8F]" />
          <div className="absolute inset-0 opacity-25">
            <PropertyArt seed={9001} tier="luxury" label="view" />
          </div>
          {/* dark scrim keeps hero copy legible */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#081228]/70 via-[#081228]/30 to-transparent" />
          {/* soft fade into the page only at the very bottom */}
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#F7F9FC] dark:from-[#0A0F1C] to-transparent" />
        </div>

        <div className="relative z-10 max-w-[1200px] mx-auto px-5 pt-20 pb-28 sm:pt-24 sm:pb-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-white/10 text-white backdrop-blur border border-white/20">
              <Sparkles size={13} /> {listings.length} verified homes available now
            </span>
            <h1 className="mt-5 text-4xl sm:text-6xl font-bold text-white leading-[1.05] tracking-tight">
              Find a home that<br />feels like <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7DD3FC] to-[#A7F3D0]">yours</span>.
            </h1>
            <p className="mt-5 text-lg text-white/80 max-w-xl">
              Premium, verified rentals across the UK — published live the moment they become available. No fake listings, no surprises.
            </p>

            {/* social proof */}
            <div className="mt-6 flex items-center gap-3">
              <div className="flex -space-x-2.5">
                {['#6366F1', '#0EA5E9', '#10B981', '#F59E0B'].map((c, i) => (
                  <span key={i} className="w-8 h-8 rounded-full border-2 border-[#0B1B3A] flex items-center justify-center text-[11px] font-bold text-white" style={{ background: c }}>
                    {['A', 'M', 'P', 'J'][i]}
                  </span>
                ))}
              </div>
              <div className="text-sm">
                <span className="inline-flex items-center gap-1 text-[#FBBF24] font-semibold">
                  {[0, 1, 2, 3, 4].map((s) => <Star key={s} size={13} fill="#FBBF24" />)}
                  <span className="ml-1 text-white">4.7</span>
                </span>
                <span className="block text-white/60 text-xs">Trusted by 2,000+ renters this year</span>
              </div>
            </div>
          </motion.div>

          {/* floating preview cards (large screens) */}
          {isWide && (
          <div className="absolute top-10 right-4 w-[300px] h-[380px] pointer-events-none z-10">
            {featured.slice(0, 2).map((l, i) => (
              <motion.div
                key={l.id}
                initial={{ opacity: 0, y: 30, rotate: i === 0 ? 6 : -6 }}
                animate={{ opacity: 1, y: 0, rotate: i === 0 ? 4 : -5 }}
                transition={{ duration: 0.7, delay: 0.3 + i * 0.15 }}
                className={`absolute w-56 rounded-2xl overflow-hidden bg-white shadow-2xl border border-white/50 ${i === 0 ? 'top-0 right-8' : 'top-44 right-28'}`}
              >
                <div className="h-28">
                  <PropertyArt seed={l.meta.gallerySeeds[0].seed} tier={l.meta.tier} label="exterior" />
                </div>
                <div className="p-3">
                  <p className="text-sm font-bold text-[#0F172A]">{gbp(l.priceMonthly)}<span className="text-[10px] font-medium text-[#94A3B8]"> /mo</span></p>
                  <p className="text-[11px] text-[#64748B] truncate">{l.property.city} · {l.meta.bedrooms || 'Studio'}{l.meta.bedrooms ? ' bed' : ''}</p>
                </div>
              </motion.div>
            ))}
          </div>
          )}

          {/* Search box */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="mt-10 max-w-4xl"
          >
            <div className="bg-white/95 dark:bg-white/[0.06] backdrop-blur-2xl rounded-3xl p-3 shadow-[0_20px_60px_rgba(2,12,40,0.35)] border border-white/60 dark:border-white/10">
              <div className="grid grid-cols-1 sm:grid-cols-[1.4fr_1fr_0.9fr_auto] gap-2">
                <Field icon={<MapPin size={16} />} label="Location">
                  <input
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && submit()}
                    placeholder="City, area or postcode"
                    className="w-full bg-transparent outline-none text-sm font-medium text-[#0F172A] dark:text-white placeholder-[#94A3B8]"
                  />
                </Field>
                <Field icon={<Home size={16} />} label="Property type">
                  <SelectRaw value={type} onChange={setType} options={TYPES} />
                </Field>
                <Field icon={<ChevronDown size={16} />} label="Bedrooms">
                  <SelectRaw
                    value={beds}
                    onChange={setBeds}
                    options={[
                      { value: '', label: 'Any' },
                      { value: '0', label: 'Studio' },
                      { value: '1', label: '1+' },
                      { value: '2', label: '2+' },
                      { value: '3', label: '3+' },
                    ]}
                  />
                </Field>
                <button
                  onClick={submit}
                  className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-[#075DE8] hover:bg-[#0650CC] text-white text-sm font-semibold shadow-lg shadow-blue-500/30 transition-colors"
                >
                  <Search size={16} /> Search
                </button>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-white/70">
              <span className="inline-flex items-center gap-1.5"><ShieldCheck size={14} /> Verified listings</span>
              <span className="inline-flex items-center gap-1.5"><Clock size={14} /> Instant viewing booking</span>
              <span className="inline-flex items-center gap-1.5"><BadgeCheck size={14} /> No hidden fees</span>
            </div>

            {/* popular city quick links */}
            <div className="mt-6 flex flex-wrap items-center gap-2">
              <span className="text-xs font-medium text-white/50 mr-1">Popular:</span>
              {POPULAR_CITIES.slice(0, 5).map((c) => (
                <button
                  key={c.name}
                  onClick={() => navigate(`/marketplace/search?city=${encodeURIComponent(c.name)}`)}
                  className="px-3 py-1.5 rounded-full text-xs font-medium bg-white/10 hover:bg-white/20 text-white border border-white/15 backdrop-blur transition-colors"
                >
                  {c.name}
                </button>
              ))}
            </div>
          </motion.div>
        </div>

        {/* stats band — bridges the hero into the content */}
        <div className="relative z-20 max-w-[1100px] mx-auto px-5 -mt-8 sm:-mt-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="rounded-3xl bg-white dark:bg-[#111827] border border-[#E6EEF5] dark:border-white/10 shadow-[0_20px_60px_rgba(2,12,40,0.18)] grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-[#E6EEF5] dark:divide-white/10 overflow-hidden"
          >
            {[
              { icon: <Home size={18} />, value: `${listings.length}`, label: 'Homes available' },
              { icon: <MapPin size={18} />, value: `${cityCount}`, label: 'Cities covered' },
              { icon: <Star size={18} />, value: avgRating, label: 'Average rating' },
              { icon: <Clock size={18} />, value: '48h', label: 'Avg. to move-in' },
            ].map((s) => (
              <div key={s.label} className="flex items-center gap-3 px-5 py-5 sm:px-6">
                <span className="w-10 h-10 rounded-xl bg-[#075DE8]/10 text-[#075DE8] flex items-center justify-center shrink-0">{s.icon}</span>
                <div>
                  <p className="text-xl font-bold text-[#0F172A] dark:text-white leading-none">{s.value}</p>
                  <p className="mt-1 text-xs text-[#64748B] dark:text-[#94A3B8]">{s.label}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Featured ── */}
      <Section
        eyebrow="Handpicked"
        title="Featured properties"
        subtitle="Our finest homes, chosen by the team"
        action={<Link to="/marketplace/search" className="text-sm font-semibold text-[#075DE8] hover:text-[#0650CC] inline-flex items-center gap-1">View all <ArrowRight size={14} /></Link>}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featured.map((l, i) => <ListingCard key={l.id} listing={l} index={i} />)}
        </div>
      </Section>

      {/* ── Why choose us ── */}
      <section className="max-w-[1200px] mx-auto px-5 py-16">
        <div className="rounded-[32px] bg-gradient-to-br from-[#0B1B3A] to-[#0A6B8F] p-10 sm:p-14 text-white overflow-hidden relative">
          <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-white/5" />
          <div className="absolute -left-10 -bottom-10 w-52 h-52 rounded-full bg-white/5" />
          <div className="relative">
            <h2 className="text-2xl sm:text-3xl font-bold">Why renters choose Granville</h2>
            <p className="mt-2 text-white/70 max-w-lg">A modern rental experience built on trust, speed and transparency.</p>
            <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-8">
              {[
                { icon: <ShieldCheck size={22} />, h: 'Always verified', p: 'Every listing is published directly from our property system — real availability, real prices.' },
                { icon: <Clock size={22} />, h: 'Move in faster', p: 'Book viewings, apply and reserve entirely online with instant confirmations.' },
                { icon: <Sparkles size={22} />, h: 'Premium homes', p: 'Professionally managed properties held to a high standard of quality and care.' },
              ].map((f) => (
                <div key={f.h}>
                  <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center mb-4">{f.icon}</div>
                  <h3 className="font-semibold text-lg">{f.h}</h3>
                  <p className="mt-1.5 text-sm text-white/70">{f.p}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Latest listings ── */}
      <Section eyebrow="Just added" title="Latest listings" subtitle="Fresh homes on the market">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {latest.map((l, i) => <ListingCard key={l.id} listing={l} index={i} />)}
        </div>
      </Section>

      {/* ── Popular cities ── */}
      <Section eyebrow="Explore" title="Popular cities" subtitle="Find your next home in these thriving locations">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
          {POPULAR_CITIES.map((c, i) => {
            const count = listings.filter((l) => l.property.city === c.name).length;
            return (
              <motion.button
                key={c.name}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                onClick={() => navigate(`/marketplace/search?city=${encodeURIComponent(c.name)}`)}
                className="group relative h-40 rounded-3xl overflow-hidden text-left shadow-sm hover:shadow-xl transition-all"
              >
                <div className="absolute inset-0 transition-transform duration-500 group-hover:scale-110">
                  <PropertyArt seed={c.seed} tier="premium" label="exterior" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-4 left-4 text-white">
                  <p className="text-lg font-bold">{c.name}</p>
                  <p className="text-xs text-white/80">{count} {count === 1 ? 'home' : 'homes'} available</p>
                </div>
              </motion.button>
            );
          })}
        </div>
      </Section>

      {/* ── Testimonials ── */}
      <Section eyebrow="Loved by renters" title="What our tenants say">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, i) => (
            <motion.figure
              key={t.name}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="rounded-3xl bg-white dark:bg-white/[0.04] border border-[#E6EEF5] dark:border-white/10 p-7 shadow-sm"
            >
              <div className="flex gap-0.5 text-[#F59E0B] mb-4">
                {Array.from({ length: t.rating }).map((_, s) => <Star key={s} size={16} fill="#F59E0B" />)}
              </div>
              <blockquote className="text-sm text-[#334155] dark:text-[#CBD5E1] leading-relaxed">“{t.quote}”</blockquote>
              <figcaption className="mt-5 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#075DE8] to-[#0EA5E9] flex items-center justify-center text-white text-sm font-bold">
                  {t.name[0]}
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#0F172A] dark:text-white">{t.name}</p>
                  <p className="text-xs text-[#94A3B8]">{t.role}</p>
                </div>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </Section>

      {/* ── FAQ ── */}
      <Section eyebrow="Good to know" title="Frequently asked questions">
        <div className="max-w-3xl mx-auto space-y-3">
          {FAQS.map((f, i) => <FaqItem key={i} q={f.q} a={f.a} />)}
        </div>
      </Section>

      {/* ── CTA ── */}
      <section className="max-w-[1200px] mx-auto px-5 pb-8">
        <div className="rounded-[32px] bg-[#075DE8] p-10 sm:p-14 text-center text-white">
          <h2 className="text-2xl sm:text-3xl font-bold">Ready to find your next home?</h2>
          <p className="mt-2 text-white/80">Browse verified listings and book a viewing in minutes.</p>
          <button
            onClick={() => navigate('/marketplace/search')}
            className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-[#075DE8] text-sm font-semibold hover:bg-white/90 transition-colors"
          >
            <Search size={16} /> Start searching
          </button>
        </div>
      </section>
    </div>
  );
}

// ── helpers ─────────────────────────────────────────────────────────────────
function Field({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl hover:bg-[#F1F5F9] dark:hover:bg-white/5 transition-colors">
      <span className="text-[#075DE8]">{icon}</span>
      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-[#94A3B8]">{label}</p>
        {children}
      </div>
    </div>
  );
}

function SelectRaw({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: { value: string; label: string }[] }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full bg-transparent outline-none text-sm font-medium text-[#0F172A] dark:text-white cursor-pointer -ml-0.5"
    >
      {options.map((o) => (
        <option key={o.value} value={o.value} className="text-[#0F172A]">{o.label}</option>
      ))}
    </select>
  );
}

function Section({ eyebrow, title, subtitle, action, children }: {
  eyebrow?: string; title: string; subtitle?: string; action?: React.ReactNode; children: React.ReactNode;
}) {
  return (
    <section className="max-w-[1200px] mx-auto px-5 py-14">
      <div className="flex items-end justify-between gap-4 mb-8">
        <div>
          {eyebrow && <p className="text-xs font-bold uppercase tracking-wider text-[#075DE8] mb-1.5">{eyebrow}</p>}
          <h2 className="text-2xl sm:text-3xl font-bold text-[#0F172A] dark:text-white tracking-tight">{title}</h2>
          {subtitle && <p className="mt-1 text-sm text-[#64748B] dark:text-[#94A3B8]">{subtitle}</p>}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-2xl border border-[#E6EEF5] dark:border-white/10 bg-white dark:bg-white/[0.04] overflow-hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
      >
        <span className="text-sm font-semibold text-[#0F172A] dark:text-white">{q}</span>
        <span className="shrink-0 text-[#075DE8]">{open ? <Minus size={18} /> : <Plus size={18} />}</span>
      </button>
      {open && <p className="px-5 pb-5 text-sm text-[#64748B] dark:text-[#94A3B8] leading-relaxed">{a}</p>}
    </div>
  );
}
