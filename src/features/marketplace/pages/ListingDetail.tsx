import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  MapPin, BedDouble, Bath, Maximize, Star, ShieldCheck, Heart, Share2,
  Calendar, CheckCircle, ArrowLeft, Car, Sofa, PawPrint, Zap, Home,
  Building2, GraduationCap, Stethoscope, Bus, Utensils, TreePine,
  Wifi, Camera, Play, FileText, ChevronLeft, ChevronRight, X,
} from 'lucide-react';
import { PropertyArt } from '../PropertyArt';
import { BookViewingModal } from '../components/BookViewingModal';
import { useListing, marketplaceStore } from '../useMarketplace';
import { gbp, shortDate, tierLabel } from '../format';
import { labelForType, AVAILABILITY_LABEL } from '../listings';

export function ListingDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isPreview = searchParams.get('preview') === '1';
  const listing = useListing(id);
  const [activeImg, setActiveImg] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const [saved, setSaved] = useState(false);
  const [booking, setBooking] = useState(false);

  // count a view once on mount (skip in admin preview)
  useEffect(() => { if (id && !isPreview) marketplaceStore.bumpViews(id); }, [id, isPreview]);

  // Not found, or unpublished/occupied and not being previewed by an admin →
  // the public must see it as unavailable (auto-hide when occupied).
  if (!listing || (!listing.isLive && !isPreview)) {
    return (
      <div className="max-w-[1200px] mx-auto px-5 py-24 text-center">
        <Building2 size={40} className="mx-auto text-[#94A3B8]" />
        <p className="mt-4 text-lg font-semibold">This home isn’t available right now</p>
        <p className="mt-1 text-sm text-[#64748B] dark:text-[#94A3B8]">It may have been let or taken off the market. Browse other available homes.</p>
        <Link to="/marketplace/search" className="mt-4 inline-block text-sm font-semibold text-[#075DE8]">← Back to search</Link>
      </div>
    );
  }

  const m = listing.meta;
  const p = listing.property;
  const gallery = m.gallerySeeds;
  const monthly = listing.priceMonthly;
  const firstMonth = monthly;
  const holdingFee = Math.round(monthly / 4);
  const moveInTotal = firstMonth + m.deposit + holdingFee;

  const nearby = [
    { icon: <GraduationCap size={16} />, label: 'Schools', detail: '4 within 1 mile' },
    { icon: <Stethoscope size={16} />, label: 'Healthcare', detail: 'GP & pharmacy 0.3mi' },
    { icon: <Bus size={16} />, label: 'Transport', detail: '2 min to bus, 8 min to rail' },
    { icon: <Utensils size={16} />, label: 'Dining', detail: '20+ cafés & restaurants' },
    { icon: <TreePine size={16} />, label: 'Green space', detail: 'Park 4 min walk' },
    { icon: <Camera size={16} />, label: 'Leisure', detail: 'Gym & cinema nearby' },
  ];

  return (
    <div className="max-w-[1200px] mx-auto px-5 py-6">
      {/* admin preview banner */}
      {isPreview && !listing.isLive && (
        <div className="mb-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-900/40 px-4 py-2.5 text-sm text-amber-800 dark:text-amber-300 flex items-center gap-2">
          <ShieldCheck size={15} /> Preview mode — this listing is not currently live on the public marketplace.
        </div>
      )}

      {/* breadcrumb */}
      <button onClick={() => navigate(-1)} className="inline-flex items-center gap-1.5 text-sm text-[#64748B] hover:text-[#075DE8] mb-4 transition-colors">
        <ArrowLeft size={15} /> Back to results
      </button>

      {/* ── Gallery ── */}
      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-3 h-[420px]">
        <button onClick={() => setLightbox(true)} className="relative rounded-3xl overflow-hidden group">
          <PropertyArt seed={gallery[activeImg].seed} tier={m.tier} label={gallery[activeImg].label} />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-60" />
          <span className="absolute bottom-4 left-4 px-3 py-1.5 rounded-full text-xs font-semibold bg-white/90 text-[#334155] backdrop-blur">
            {gallery[activeImg].label}
          </span>
          <span className="absolute bottom-4 right-4 px-3 py-1.5 rounded-full text-xs font-semibold bg-black/50 text-white backdrop-blur inline-flex items-center gap-1.5">
            <Camera size={13} /> {gallery.length} photos
          </span>
        </button>
        <div className="hidden lg:grid grid-rows-2 gap-3">
          <div className="relative rounded-3xl overflow-hidden">
            <PropertyArt seed={gallery[1].seed} tier={m.tier} label={gallery[1].label} />
            <span className="absolute inset-0 flex items-center justify-center bg-black/30 text-white opacity-0 hover:opacity-100 transition-opacity">
              <Play size={28} />
            </span>
            <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-black/50 text-white backdrop-blur inline-flex items-center gap-1"><Play size={11} /> Video tour</span>
          </div>
          <button onClick={() => setLightbox(true)} className="relative rounded-3xl overflow-hidden">
            <PropertyArt seed={gallery[2].seed} tier={m.tier} label={gallery[2].label} />
            <span className="absolute inset-0 flex items-center justify-center bg-black/45 text-white text-sm font-semibold">
              + View all {gallery.length}
            </span>
          </button>
        </div>
      </div>

      {/* thumbnail strip */}
      <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
        {gallery.map((g, i) => (
          <button key={i} onClick={() => setActiveImg(i)}
            className={`relative shrink-0 w-24 h-16 rounded-xl overflow-hidden border-2 transition-all ${activeImg === i ? 'border-[#075DE8]' : 'border-transparent opacity-70 hover:opacity-100'}`}>
            <PropertyArt seed={g.seed} tier={m.tier} label={g.label} />
          </button>
        ))}
      </div>

      {/* ── Body ── */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8">
        {/* left */}
        <div>
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold text-white ${listing.publicAvailability === 'reserved' ? 'bg-amber-500' : 'bg-emerald-500'}`}>
                  {AVAILABILITY_LABEL[listing.publicAvailability]}
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#075DE8]/10 text-[#075DE8]"><ShieldCheck size={12} /> Verified listing</span>
                <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#F1F5F9] dark:bg-white/5 text-[#475569] dark:text-[#CBD5E1]">{tierLabel[m.tier]}</span>
              </div>
              <h1 className="mt-3 text-2xl sm:text-3xl font-bold text-[#0F172A] dark:text-white tracking-tight">{m.headline}</h1>
              <p className="mt-2 flex items-center gap-1.5 text-sm text-[#64748B] dark:text-[#94A3B8]">
                <MapPin size={15} /> {p.address}, {p.city}, {p.postcode}
              </p>
            </div>
            <div className="flex gap-2 shrink-0">
              <button onClick={() => setSaved((s) => !s)} className="w-10 h-10 rounded-full border border-[#E6EEF5] dark:border-white/10 flex items-center justify-center hover:border-rose-300 transition-colors">
                <Heart size={17} fill={saved ? '#f43f5e' : 'none'} color={saved ? '#f43f5e' : 'currentColor'} />
              </button>
              <button className="w-10 h-10 rounded-full border border-[#E6EEF5] dark:border-white/10 flex items-center justify-center hover:border-[#075DE8]/40 transition-colors">
                <Share2 size={16} />
              </button>
            </div>
          </div>

          {/* key specs */}
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { icon: <BedDouble size={18} />, label: 'Bedrooms', value: m.bedrooms === 0 ? 'Studio' : m.bedrooms },
              { icon: <Bath size={18} />, label: 'Bathrooms', value: m.bathrooms },
              { icon: <Maximize size={18} />, label: 'Area', value: `${m.areaSqft} ft²` },
              { icon: <Home size={18} />, label: 'Type', value: labelForType(p.type) },
            ].map((s) => (
              <div key={s.label} className="rounded-2xl border border-[#E6EEF5] dark:border-white/10 bg-white dark:bg-white/[0.04] p-4">
                <span className="text-[#075DE8]">{s.icon}</span>
                <p className="mt-2 text-sm font-bold text-[#0F172A] dark:text-white">{s.value}</p>
                <p className="text-[11px] text-[#94A3B8]">{s.label}</p>
              </div>
            ))}
          </div>

          <Block title="About this home">
            <p className="text-sm text-[#475569] dark:text-[#CBD5E1] leading-relaxed">{m.description}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {m.furnished && <Chip icon={<Sofa size={13} />}>Furnished</Chip>}
              {m.parking && <Chip icon={<Car size={13} />}>Parking</Chip>}
              {m.petFriendly && <Chip icon={<PawPrint size={13} />}>Pet friendly</Chip>}
              <Chip icon={<Zap size={13} />}>EPC {m.energyRating}</Chip>
              <Chip icon={<Wifi size={13} />}>{m.utilitiesIncluded.length} utilities incl.</Chip>
            </div>
          </Block>

          <Block title="Amenities">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-3 gap-x-4">
              {m.amenities.map((a) => (
                <span key={a} className="flex items-center gap-2 text-sm text-[#334155] dark:text-[#CBD5E1]">
                  <CheckCircle size={15} className="text-emerald-500 shrink-0" /> {a}
                </span>
              ))}
            </div>
          </Block>

          <Block title="Lease & move-in costs">
            <div className="rounded-2xl border border-[#E6EEF5] dark:border-white/10 overflow-hidden">
              {[
                { label: 'Monthly rent', value: gbp(monthly) },
                { label: 'First month in advance', value: gbp(firstMonth) },
                { label: 'Security deposit', value: gbp(m.deposit) },
                { label: 'Holding fee', value: gbp(holdingFee) },
              ].map((row, i) => (
                <div key={row.label} className={`flex items-center justify-between px-4 py-3 text-sm ${i % 2 ? 'bg-[#F8FAFC] dark:bg-white/[0.02]' : ''}`}>
                  <span className="text-[#64748B] dark:text-[#94A3B8]">{row.label}</span>
                  <span className="font-semibold text-[#0F172A] dark:text-white">{row.value}</span>
                </div>
              ))}
              <div className="flex items-center justify-between px-4 py-3.5 bg-[#075DE8]/5 border-t border-[#075DE8]/20">
                <span className="text-sm font-semibold text-[#075DE8]">Total to move in</span>
                <span className="text-base font-bold text-[#075DE8]">{gbp(moveInTotal)}</span>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
              {[
                { label: 'Available from', value: shortDate(m.availableFrom) },
                { label: 'Min. lease', value: `${m.minLeaseMonths} months` },
                { label: 'Max occupancy', value: `${m.maxOccupancy} people` },
                { label: 'Utilities incl.', value: m.utilitiesIncluded.join(', ') },
              ].map((d) => (
                <div key={d.label}>
                  <p className="text-[11px] text-[#94A3B8] uppercase tracking-wide">{d.label}</p>
                  <p className="mt-0.5 font-medium text-[#0F172A] dark:text-white">{d.value}</p>
                </div>
              ))}
            </div>
          </Block>

          <Block title="What's nearby">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {nearby.map((n) => (
                <div key={n.label} className="rounded-2xl border border-[#E6EEF5] dark:border-white/10 p-4">
                  <span className="text-[#075DE8]">{n.icon}</span>
                  <p className="mt-2 text-sm font-semibold text-[#0F172A] dark:text-white">{n.label}</p>
                  <p className="text-xs text-[#94A3B8]">{n.detail}</p>
                </div>
              ))}
            </div>
            {/* scores */}
            <div className="mt-4 grid grid-cols-2 gap-3">
              {[{ label: 'Walk Score', value: m.walkScore }, { label: 'Transit Score', value: m.transitScore }].map((s) => (
                <div key={s.label} className="rounded-2xl border border-[#E6EEF5] dark:border-white/10 p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[#64748B] dark:text-[#94A3B8]">{s.label}</span>
                    <span className="text-sm font-bold text-[#075DE8]">{s.value}/100</span>
                  </div>
                  <div className="mt-2 h-2 rounded-full bg-[#F1F5F9] dark:bg-white/10 overflow-hidden">
                    <div className="h-full rounded-full bg-gradient-to-r from-[#075DE8] to-[#0EA5E9]" style={{ width: `${s.value}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </Block>

          <Block title="Location">
            <div className="relative h-64 rounded-2xl overflow-hidden border border-[#E6EEF5] dark:border-white/10 bg-gradient-to-br from-[#E8EFF7] to-[#D6E4F2] dark:from-white/5 dark:to-white/[0.02] flex items-center justify-center">
              {/* faux map grid */}
              <div className="absolute inset-0 opacity-40" style={{ backgroundImage: 'linear-gradient(#c7d6e8 1px, transparent 1px), linear-gradient(90deg, #c7d6e8 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
              <div className="relative text-center">
                <div className="mx-auto w-12 h-12 rounded-full bg-[#075DE8] flex items-center justify-center text-white shadow-lg animate-pulse">
                  <MapPin size={22} />
                </div>
                <p className="mt-3 text-sm font-semibold text-[#334155] dark:text-[#CBD5E1]">{p.address}</p>
                <p className="text-xs text-[#94A3B8]">{p.city}, {p.postcode} · Interactive map</p>
              </div>
            </div>
          </Block>

          <Block title="Downloads">
            <div className="flex flex-wrap gap-3">
              {['Brochure PDF', 'Floor plan', 'EPC certificate', 'Tenancy terms'].map((d) => (
                <button key={d} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#E6EEF5] dark:border-white/10 text-sm font-medium text-[#334155] dark:text-[#CBD5E1] hover:border-[#075DE8]/40 hover:text-[#075DE8] transition-colors">
                  <FileText size={15} /> {d}
                </button>
              ))}
            </div>
          </Block>
        </div>

        {/* right — sticky booking card */}
        <aside>
          <div className="sticky top-24 space-y-4">
            <div className="rounded-3xl border border-[#E6EEF5] dark:border-white/10 bg-white dark:bg-white/[0.04] p-6 shadow-lg shadow-slate-200/50 dark:shadow-none">
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl font-bold text-[#0F172A] dark:text-white">{gbp(monthly)}</span>
                <span className="text-sm text-[#64748B]">/ month</span>
              </div>
              <p className="mt-1 flex items-center gap-1 text-[#F59E0B] text-sm">
                <Star size={14} fill="#F59E0B" /> <span className="font-semibold text-[#334155] dark:text-[#CBD5E1]">{m.rating.toFixed(1)}</span>
                <span className="text-[#94A3B8]">· {m.reviewsCount} reviews</span>
              </p>

              <div className="mt-5 space-y-2.5">
                <button
                  onClick={() => setBooking(true)}
                  disabled={listing.publicAvailability !== 'available'}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-[#075DE8] hover:bg-[#0650CC] disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold transition-colors"
                >
                  <Calendar size={16} /> Book a viewing
                </button>
                <button
                  disabled={listing.publicAvailability !== 'available'}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl border border-[#075DE8] text-[#075DE8] hover:bg-[#075DE8]/5 disabled:opacity-50 text-sm font-semibold transition-colors"
                >
                  Reserve this home
                </button>
                <button
                  disabled={listing.publicAvailability !== 'available'}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-[#0F172A] dark:bg-white/10 hover:bg-[#1E293B] text-white text-sm font-semibold transition-colors disabled:opacity-50"
                >
                  Apply now
                </button>
              </div>

              {listing.publicAvailability === 'reserved' && (
                <p className="mt-4 text-xs text-center text-amber-600 bg-amber-50 dark:bg-amber-900/20 rounded-lg py-2 px-3">
                  This home is currently reserved. Register interest to be notified if it frees up.
                </p>
              )}

              <div className="mt-5 pt-5 border-t border-[#E6EEF5] dark:border-white/10 flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#075DE8] to-[#0EA5E9] flex items-center justify-center text-white font-bold">G</div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-[#0F172A] dark:text-white">Granville Lettings</p>
                  <p className="text-xs text-[#94A3B8]">Managing agent · replies in ~2h</p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-[#E6EEF5] dark:border-white/10 bg-[#F8FAFC] dark:bg-white/[0.02] p-4 text-xs text-[#64748B] dark:text-[#94A3B8] flex items-start gap-2">
              <ShieldCheck size={16} className="text-emerald-500 shrink-0 mt-0.5" />
              This listing is published live from the Granville property system — availability and pricing are always up to date.
            </div>
          </div>
        </aside>
      </div>

      {/* lightbox */}
      {lightbox && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4" onClick={() => setLightbox(false)}>
          <button className="absolute top-5 right-5 text-white/80 hover:text-white" onClick={() => setLightbox(false)}><X size={28} /></button>
          <button className="absolute left-4 text-white/80 hover:text-white" onClick={(e) => { e.stopPropagation(); setActiveImg((i) => (i - 1 + gallery.length) % gallery.length); }}><ChevronLeft size={40} /></button>
          <div className="w-full max-w-4xl aspect-[4/3] rounded-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <PropertyArt seed={gallery[activeImg].seed} tier={m.tier} label={gallery[activeImg].label} />
          </div>
          <button className="absolute right-4 text-white/80 hover:text-white" onClick={(e) => { e.stopPropagation(); setActiveImg((i) => (i + 1) % gallery.length); }}><ChevronRight size={40} /></button>
          <span className="absolute bottom-6 text-white/80 text-sm">{gallery[activeImg].label} · {activeImg + 1} / {gallery.length}</span>
        </div>
      )}

      {/* Book a viewing */}
      <BookViewingModal open={booking} onClose={() => setBooking(false)} listing={listing} />
    </div>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      className="mt-8 pt-8 border-t border-[#E6EEF5] dark:border-white/10 first:border-0 first:pt-0 first:mt-8"
    >
      <h2 className="text-lg font-bold text-[#0F172A] dark:text-white mb-4">{title}</h2>
      {children}
    </motion.section>
  );
}

function Chip({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-[#F1F5F9] dark:bg-white/5 text-[#475569] dark:text-[#CBD5E1]">
      {icon} {children}
    </span>
  );
}
