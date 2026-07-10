import { useMemo, useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, Search, X, MapPin } from 'lucide-react';
import { ListingCard } from '../components/ListingCard';
import { useLiveListings } from '../useMarketplace';
import { tierLabel } from '../format';

const SORTS = [
  { value: 'featured', label: 'Featured first' },
  { value: 'price_asc', label: 'Price: low to high' },
  { value: 'price_desc', label: 'Price: high to low' },
  { value: 'rating', label: 'Top rated' },
  { value: 'views', label: 'Most viewed' },
];

const TIERS = ['luxury', 'premium', 'affordable', 'commercial', 'student'];

export function SearchResults() {
  const [params, setParams] = useSearchParams();
  const all = useLiveListings();

  const [city, setCity] = useState(params.get('city') ?? '');
  const [type, setType] = useState(params.get('type') ?? '');
  const [beds, setBeds] = useState(params.get('beds') ?? '');
  const [maxPrice, setMaxPrice] = useState<number>(Number(params.get('max')) || 4000);
  const [tiers, setTiers] = useState<string[]>(params.get('tier')?.split(',').filter(Boolean) ?? []);
  const [furnished, setFurnished] = useState(false);
  const [parking, setParking] = useState(false);
  const [pets, setPets] = useState(false);
  const [sort, setSort] = useState('featured');
  const [showFilters, setShowFilters] = useState(false);

  // when the tier arrives via nav while already on this page, sync it in
  const tierParam = params.get('tier') ?? '';
  const lastTierParam = useRef(tierParam);
  useEffect(() => {
    if (tierParam !== lastTierParam.current) {
      lastTierParam.current = tierParam;
      setTiers(tierParam ? tierParam.split(',').filter(Boolean) : []);
    }
  }, [tierParam]);

  // keep the URL in sync (shareable searches)
  useEffect(() => {
    const q = new URLSearchParams();
    if (city) q.set('city', city);
    if (type) q.set('type', type);
    if (beds) q.set('beds', beds);
    if (maxPrice !== 4000) q.set('max', String(maxPrice));
    if (tiers.length) q.set('tier', tiers.join(','));
    setParams(q, { replace: true });
  }, [city, type, beds, maxPrice, tiers, setParams]);

  const results = useMemo(() => {
    let r = all.filter((l) => {
      if (city && !`${l.property.city} ${l.property.address} ${l.property.postcode} ${l.property.region}`.toLowerCase().includes(city.toLowerCase())) return false;
      if (type && l.property.type !== type) return false;
      if (beds && l.meta.bedrooms < Number(beds)) return false;
      if (l.priceMonthly > maxPrice) return false;
      if (tiers.length && !tiers.includes(l.meta.tier)) return false;
      if (furnished && !l.meta.furnished) return false;
      if (parking && !l.meta.parking) return false;
      if (pets && !l.meta.petFriendly) return false;
      return true;
    });
    r = [...r].sort((a, b) => {
      switch (sort) {
        case 'price_asc': return a.priceMonthly - b.priceMonthly;
        case 'price_desc': return b.priceMonthly - a.priceMonthly;
        case 'rating': return b.meta.rating - a.meta.rating;
        case 'views': return b.views - a.views;
        default: return Number(b.featured) - Number(a.featured) || b.meta.rating - a.meta.rating;
      }
    });
    return r;
  }, [all, city, type, beds, maxPrice, tiers, furnished, parking, pets, sort]);

  const toggleTier = (t: string) => setTiers((prev) => prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]);
  const clearAll = () => {
    setCity(''); setType(''); setBeds(''); setMaxPrice(4000); setTiers([]);
    setFurnished(false); setParking(false); setPets(false);
  };

  const Filters = (
    <div className="space-y-6">
      <div>
        <label className="text-xs font-bold uppercase tracking-wider text-[#94A3B8]">Location</label>
        <div className="mt-2 flex items-center gap-2 px-3 py-2.5 rounded-xl border border-[#E6EEF5] dark:border-white/10 bg-white dark:bg-white/5">
          <MapPin size={15} className="text-[#94A3B8]" />
          <input value={city} onChange={(e) => setCity(e.target.value)} placeholder="City or postcode"
            className="w-full bg-transparent outline-none text-sm" />
        </div>
      </div>

      <div>
        <label className="text-xs font-bold uppercase tracking-wider text-[#94A3B8]">Property type</label>
        <select value={type} onChange={(e) => setType(e.target.value)}
          className="mt-2 w-full px-3 py-2.5 rounded-xl border border-[#E6EEF5] dark:border-white/10 bg-white dark:bg-white/5 text-sm outline-none">
          <option value="">Any type</option>
          <option value="self_contained">Apartment / Home</option>
          <option value="shared_house">Shared House</option>
          <option value="supported_living">Supported Living</option>
        </select>
      </div>

      <div>
        <label className="text-xs font-bold uppercase tracking-wider text-[#94A3B8]">Minimum bedrooms</label>
        <div className="mt-2 flex gap-2">
          {['', '0', '1', '2', '3'].map((b) => (
            <button key={b} onClick={() => setBeds(b)}
              className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-colors ${
                beds === b ? 'bg-[#075DE8] text-white border-[#075DE8]' : 'border-[#E6EEF5] dark:border-white/10 text-[#475569] dark:text-[#CBD5E1] hover:border-[#075DE8]/40'
              }`}>
              {b === '' ? 'Any' : b === '0' ? 'Studio' : `${b}+`}
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-wider text-[#94A3B8]">Max monthly rent</label>
          <span className="text-sm font-semibold text-[#075DE8]">£{maxPrice.toLocaleString()}</span>
        </div>
        <input type="range" min={400} max={4000} step={50} value={maxPrice}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
          className="mt-3 w-full accent-[#075DE8]" />
      </div>

      <div>
        <label className="text-xs font-bold uppercase tracking-wider text-[#94A3B8]">Category</label>
        <div className="mt-2 flex flex-wrap gap-2">
          {TIERS.map((t) => (
            <button key={t} onClick={() => toggleTier(t)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                tiers.includes(t) ? 'bg-[#075DE8] text-white border-[#075DE8]' : 'border-[#E6EEF5] dark:border-white/10 text-[#475569] dark:text-[#CBD5E1] hover:border-[#075DE8]/40'
              }`}>
              {tierLabel[t]}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="text-xs font-bold uppercase tracking-wider text-[#94A3B8]">Must have</label>
        <div className="mt-2 space-y-2">
          {[
            { label: 'Furnished', v: furnished, set: setFurnished },
            { label: 'Parking', v: parking, set: setParking },
            { label: 'Pet friendly', v: pets, set: setPets },
          ].map((c) => (
            <label key={c.label} className="flex items-center gap-2.5 text-sm text-[#334155] dark:text-[#CBD5E1] cursor-pointer">
              <input type="checkbox" checked={c.v} onChange={(e) => c.set(e.target.checked)}
                className="w-4 h-4 rounded accent-[#075DE8]" />
              {c.label}
            </label>
          ))}
        </div>
      </div>

      <button onClick={clearAll} className="text-xs font-semibold text-[#64748B] hover:text-[#075DE8] transition-colors">
        Clear all filters
      </button>
    </div>
  );

  return (
    <div className="max-w-[1200px] mx-auto px-5 py-8">
      {/* header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#0F172A] dark:text-white tracking-tight">
            {city ? `Homes in ${city}` : 'All homes'}
          </h1>
          <p className="mt-1 text-sm text-[#64748B] dark:text-[#94A3B8]">
            <span className="font-semibold text-[#075DE8]">{results.length}</span> {results.length === 1 ? 'property' : 'properties'} available
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setShowFilters(true)}
            className="lg:hidden inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#E6EEF5] dark:border-white/10 text-sm font-medium">
            <SlidersHorizontal size={15} /> Filters
          </button>
          <select value={sort} onChange={(e) => setSort(e.target.value)}
            className="px-4 py-2.5 rounded-xl border border-[#E6EEF5] dark:border-white/10 bg-white dark:bg-white/5 text-sm font-medium outline-none">
            {SORTS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">
        {/* desktop filters */}
        <aside className="hidden lg:block">
          <div className="sticky top-24 rounded-2xl border border-[#E6EEF5] dark:border-white/10 bg-white dark:bg-white/[0.04] p-5">
            <h2 className="text-sm font-bold text-[#0F172A] dark:text-white mb-5 flex items-center gap-2">
              <SlidersHorizontal size={15} /> Filters
            </h2>
            {Filters}
          </div>
        </aside>

        {/* results */}
        <div>
          {results.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {results.map((l, i) => <ListingCard key={l.id} listing={l} index={i} />)}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="w-16 h-16 rounded-2xl bg-[#F1F5F9] dark:bg-white/5 flex items-center justify-center mb-4">
                <Search size={26} className="text-[#94A3B8]" />
              </div>
              <p className="text-lg font-semibold text-[#0F172A] dark:text-white">No homes match your filters</p>
              <p className="mt-1 text-sm text-[#64748B] dark:text-[#94A3B8]">Try widening your search or clearing some filters.</p>
              <button onClick={clearAll} className="mt-5 px-5 py-2.5 rounded-full bg-[#075DE8] text-white text-sm font-semibold hover:bg-[#0650CC] transition-colors">
                Clear filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* mobile filter drawer */}
      {showFilters && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowFilters(false)} />
          <div className="relative ml-auto w-[86%] max-w-sm h-full bg-white dark:bg-[#0A0F1C] p-5 overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold">Filters</h2>
              <button onClick={() => setShowFilters(false)} className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-[#F1F5F9] dark:hover:bg-white/5"><X size={18} /></button>
            </div>
            {Filters}
            <button onClick={() => setShowFilters(false)} className="mt-6 w-full py-3 rounded-xl bg-[#075DE8] text-white text-sm font-semibold">
              Show {results.length} homes
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
