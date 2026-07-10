import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  MapPin, BedDouble, Bath, Maximize, Heart, Share2, Eye, Star,
  ShieldCheck, Car, Sofa, PawPrint,
} from 'lucide-react';
import { PropertyArt } from '../PropertyArt';
import { gbp, tierLabel } from '../format';
import { AVAILABILITY_LABEL } from '../listings';
import type { DecoratedListing } from '../useMarketplace';

const availStyle: Record<string, string> = {
  available: 'bg-emerald-500/90 text-white',
  reserved: 'bg-amber-500/90 text-white',
  occupied: 'bg-slate-500/90 text-white',
  unavailable: 'bg-slate-400/90 text-white',
  hidden: 'bg-slate-400/90 text-white',
};

export function ListingCard({ listing, index = 0 }: { listing: DecoratedListing; index?: number }) {
  const [saved, setSaved] = useState(false);
  const m = listing.meta;
  const cover = m.gallerySeeds[0];

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.45, delay: (index % 8) * 0.05 }}
      className="group relative rounded-3xl overflow-hidden bg-white/70 dark:bg-white/[0.04] backdrop-blur-xl border border-white/60 dark:border-white/10 shadow-[0_8px_30px_rgba(15,23,42,0.08)] hover:shadow-[0_20px_50px_rgba(15,23,42,0.18)] transition-all duration-300 hover:-translate-y-1"
    >
      {/* image */}
      <Link to={`/marketplace/property/${listing.id}`} className="block relative h-56 overflow-hidden">
        <div className="absolute inset-0 transition-transform duration-500 group-hover:scale-105">
          <PropertyArt seed={cover.seed} tier={m.tier} label={cover.label} />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />

        {/* top badges */}
        <div className="absolute top-3 left-3 flex items-center gap-2">
          <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold shadow-sm ${availStyle[listing.publicAvailability]}`}>
            {AVAILABILITY_LABEL[listing.publicAvailability]}
          </span>
          {listing.featured && (
            <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-white/90 text-[#B45309] shadow-sm">
              ★ Featured
            </span>
          )}
        </div>

        {/* actions */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5">
          <button
            onClick={(e) => { e.preventDefault(); setSaved((s) => !s); }}
            className="w-8 h-8 rounded-full bg-white/85 backdrop-blur flex items-center justify-center text-[#475569] hover:text-rose-500 shadow-sm transition-colors"
            aria-label="Save property"
          >
            <Heart size={15} fill={saved ? '#f43f5e' : 'none'} color={saved ? '#f43f5e' : 'currentColor'} />
          </button>
          <button
            onClick={(e) => e.preventDefault()}
            className="w-8 h-8 rounded-full bg-white/85 backdrop-blur flex items-center justify-center text-[#475569] hover:text-[#075DE8] shadow-sm transition-colors"
            aria-label="Share property"
          >
            <Share2 size={14} />
          </button>
        </div>

        {/* verified + tier */}
        <div className="absolute bottom-3 left-3 flex items-center gap-2">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#075DE8]/90 text-white shadow-sm">
            <ShieldCheck size={11} /> Verified
          </span>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-white/85 text-[#334155]">
            {tierLabel[m.tier]}
          </span>
        </div>
      </Link>

      {/* body */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-lg font-bold text-[#0F172A] dark:text-white leading-tight">{gbp(listing.priceMonthly)}<span className="text-xs font-medium text-[#64748B]"> /mo</span></p>
            <p className="text-[11px] text-[#94A3B8]">{gbp(listing.priceWeekly)} per week</p>
          </div>
          <div className="flex items-center gap-1 text-[#F59E0B] shrink-0">
            <Star size={14} fill="#F59E0B" />
            <span className="text-sm font-semibold text-[#334155] dark:text-[#CBD5E1]">{m.rating.toFixed(1)}</span>
            <span className="text-[11px] text-[#94A3B8]">({m.reviewsCount})</span>
          </div>
        </div>

        <h3 className="mt-2 text-sm font-semibold text-[#0F172A] dark:text-white line-clamp-1">{m.headline}</h3>
        <p className="mt-1 flex items-center gap-1 text-xs text-[#64748B] dark:text-[#94A3B8]">
          <MapPin size={12} /> {listing.property.address}, {listing.property.city}
        </p>

        {/* specs */}
        <div className="mt-3 flex items-center gap-3 text-xs text-[#475569] dark:text-[#CBD5E1]">
          {m.bedrooms > 0 && <span className="inline-flex items-center gap-1"><BedDouble size={14} />{m.bedrooms} bed</span>}
          <span className="inline-flex items-center gap-1"><Bath size={14} />{m.bathrooms} bath</span>
          <span className="inline-flex items-center gap-1"><Maximize size={14} />{m.areaSqft} ft²</span>
        </div>

        {/* perks */}
        <div className="mt-3 flex items-center gap-2 flex-wrap">
          {m.furnished && <Perk icon={<Sofa size={12} />} label="Furnished" />}
          {m.parking && <Perk icon={<Car size={12} />} label="Parking" />}
          {m.petFriendly && <Perk icon={<PawPrint size={12} />} label="Pets OK" />}
        </div>

        <div className="mt-4 pt-3 border-t border-[#E6EEF5] dark:border-white/10 flex items-center justify-between">
          <span className="inline-flex items-center gap-1 text-[11px] text-[#94A3B8]"><Eye size={12} /> {listing.views.toLocaleString()} views</span>
          <Link
            to={`/marketplace/property/${listing.id}`}
            className="text-xs font-semibold text-[#075DE8] hover:text-[#0650CC] transition-colors"
          >
            View details →
          </Link>
        </div>
      </div>
    </motion.article>
  );
}

function Perk({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#F1F5F9] dark:bg-white/5 text-[#475569] dark:text-[#CBD5E1]">
      {icon} {label}
    </span>
  );
}
