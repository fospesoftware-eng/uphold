// ─────────────────────────────────────────────────────────────────────────────
// Marketplace runtime store
//
// A tiny external store (useSyncExternalStore) that holds the *publish* overlay
// on top of the existing PMS property/room records. It does NOT duplicate any
// property data — it only tracks, per listing id:
//   • published   — has the owner toggled "Publish Listing"
//   • featured    — promoted to the Featured rail
//   • reservedIds — listings manually flagged reserved (holding deposit taken)
//
// Because it lives at module scope, the admin toggle and the public site read
// the exact same source of truth within the SPA runtime — flip a toggle in the
// admin module and the public marketplace updates live.
// ─────────────────────────────────────────────────────────────────────────────

export interface ViewingRequest {
  id: string;
  listingId: string;
  listingHeadline: string;
  propertyAddress: string;
  date: string;   // ISO date (YYYY-MM-DD)
  time: string;   // "10:00"
  visitors: number;
  mode: 'physical' | 'virtual';
  agent: string;
  name: string;
  email: string;
  phone: string;
  comments?: string;
  status: 'pending' | 'approved' | 'declined';
  createdAt: string;
}

export interface MarketplaceState {
  published: Record<string, boolean>;
  featured: Record<string, boolean>;
  reserved: Record<string, boolean>;
  /** simple view counter overlay, seeded from listing meta */
  views: Record<string, number>;
  /** viewing requests submitted from the public site */
  bookings: ViewingRequest[];
}

type Listener = () => void;

const STORAGE_KEY = 'granville.marketplace.v1';

function load(): MarketplaceState {
  const empty: MarketplaceState = { published: {}, featured: {}, reserved: {}, views: {}, bookings: [] };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return empty;
    return { ...empty, ...JSON.parse(raw) };
  } catch {
    return empty;
  }
}

function persist() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* storage unavailable — degrade to in-memory only */
  }
}

let state: MarketplaceState = load();

const listeners = new Set<Listener>();

// live cross-tab sync: when another tab writes, refresh + notify subscribers
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (e) => {
    if (e.key === STORAGE_KEY) {
      state = load();
      listeners.forEach((l) => l());
    }
  });
}

function emit() {
  // new object identity so useSyncExternalStore detects the change
  state = { ...state };
  persist();
  listeners.forEach((l) => l());
}

export const marketplaceStore = {
  subscribe(listener: Listener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
  getSnapshot() {
    return state;
  },
  /** Seed initial publish/feature/views state once, from derived listing meta. */
  hydrate(seed: {
    published?: Record<string, boolean>;
    featured?: Record<string, boolean>;
    reserved?: Record<string, boolean>;
    views?: Record<string, number>;
  }) {
    state = {
      published: { ...seed.published, ...state.published },
      featured: { ...seed.featured, ...state.featured },
      reserved: { ...seed.reserved, ...state.reserved },
      views: { ...seed.views, ...state.views },
      bookings: state.bookings ?? [],
    };
    // no emit needed during initial hydration, but harmless
    listeners.forEach((l) => l());
  },
  addBooking(b: ViewingRequest) {
    state.bookings = [b, ...(state.bookings ?? [])];
    emit();
  },
  setBookingStatus(id: string, status: ViewingRequest['status']) {
    state.bookings = (state.bookings ?? []).map((x) => (x.id === id ? { ...x, status } : x));
    emit();
  },
  setPublished(id: string, value: boolean) {
    state.published = { ...state.published, [id]: value };
    emit();
  },
  togglePublished(id: string) {
    this.setPublished(id, !state.published[id]);
  },
  setFeatured(id: string, value: boolean) {
    state.featured = { ...state.featured, [id]: value };
    emit();
  },
  toggleFeatured(id: string) {
    this.setFeatured(id, !state.featured[id]);
  },
  setReserved(id: string, value: boolean) {
    state.reserved = { ...state.reserved, [id]: value };
    emit();
  },
  bumpViews(id: string) {
    state.views = { ...state.views, [id]: (state.views[id] ?? 0) + 1 };
    emit();
  },
};
