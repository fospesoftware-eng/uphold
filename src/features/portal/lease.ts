// Single source of truth for lease status.
// The stored `leaseStatus` field on a unit can drift out of date, so status shown
// to tenants is always DERIVED from `leaseEnd` relative to the current date.

export type LeaseState = 'active' | 'expiring_soon' | 'expired';

export interface LeaseInfo {
  state: LeaseState;
  daysLeft: number;   // negative once expired
  label: string;      // e.g. "Lease Active"
  shortLabel: string; // e.g. "Active"
  detail: string;     // e.g. "175 days left" / "Expired 21 days ago"
}

/** A lease within this many days of ending is considered "expiring soon". */
export const LEASE_EXPIRING_WINDOW_DAYS = 60;

const MS_PER_DAY = 1000 * 60 * 60 * 24;

export function getLeaseInfo(leaseEnd: string, now: Date = new Date()): LeaseInfo {
  const end = new Date(leaseEnd).getTime();
  const daysLeft = Math.ceil((end - now.getTime()) / MS_PER_DAY);

  const state: LeaseState =
    daysLeft <= 0 ? 'expired'
    : daysLeft <= LEASE_EXPIRING_WINDOW_DAYS ? 'expiring_soon'
    : 'active';

  const label =
    state === 'expired' ? 'Lease Expired'
    : state === 'expiring_soon' ? 'Expiring Soon'
    : 'Lease Active';

  const shortLabel =
    state === 'expired' ? 'Expired'
    : state === 'expiring_soon' ? 'Expiring' : 'Active';

  const detail =
    daysLeft <= 0 ? `Expired ${Math.abs(daysLeft)} day${Math.abs(daysLeft) === 1 ? '' : 's'} ago`
    : `${daysLeft} day${daysLeft === 1 ? '' : 's'} left`;

  return { state, daysLeft, label, shortLabel, detail };
}
