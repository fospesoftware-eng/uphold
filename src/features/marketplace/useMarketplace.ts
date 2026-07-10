import { useSyncExternalStore, useMemo } from 'react';
import { marketplaceStore } from './store';
import { getAllListings, publishSeed, type Listing, type Availability } from './listings';

// Hydrate the runtime store once from the derived listing meta.
marketplaceStore.hydrate(publishSeed());

export interface DecoratedListing extends Listing {
  published: boolean;
  featured: boolean;
  reserved: boolean;
  views: number;
  /** effective availability after applying manual "reserved" overlay */
  publicAvailability: Availability;
  /** visible on the public marketplace? */
  isLive: boolean;
}

function decorate(listings: Listing[], state: ReturnType<typeof marketplaceStore.getSnapshot>): DecoratedListing[] {
  return listings.map((l) => {
    const published = state.published[l.id] ?? false;
    const featured = state.featured[l.id] ?? false;
    const reserved = state.reserved[l.id] ?? false;
    const views = state.views[l.id] ?? l.meta.baseViews;
    const publicAvailability: Availability =
      reserved && l.availability === 'available' ? 'reserved' : l.availability;
    const isLive =
      published && (publicAvailability === 'available' || publicAvailability === 'reserved');
    return { ...l, published, featured, reserved, views, publicAvailability, isLive };
  });
}

/** All listings decorated with runtime publish state (admin view). */
export function useAllListings(): DecoratedListing[] {
  const state = useSyncExternalStore(marketplaceStore.subscribe, marketplaceStore.getSnapshot);
  return useMemo(() => decorate(getAllListings(), state), [state]);
}

/** Only listings that are live on the public marketplace. */
export function useLiveListings(): DecoratedListing[] {
  const all = useAllListings();
  return useMemo(() => all.filter((l) => l.isLive), [all]);
}

/** A single decorated listing by id (any state). */
export function useListing(id: string | undefined): DecoratedListing | undefined {
  const all = useAllListings();
  return useMemo(() => all.find((l) => l.id === id), [all, id]);
}

/** Viewing requests submitted from the public site. */
export function useBookings() {
  const state = useSyncExternalStore(marketplaceStore.subscribe, marketplaceStore.getSnapshot);
  return state.bookings ?? [];
}

export { marketplaceStore };
