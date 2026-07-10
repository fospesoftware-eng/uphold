// ─────────────────────────────────────────────────────────────────────────────
// Marketplace listings — DERIVED from the existing PMS records.
//
// A "listing" is not a new database table. It is a view computed from:
//   • the existing `properties` records (address, city, type, status…)
//   • the existing `rooms` records (vacancy + weeklyRent)
//   • a thin marketing OVERLAY (images/amenities/description) keyed by property id
//
// Auto-publish logic (Acceptance Criteria):
//   property.status 'inactive'    → hidden
//   property.status 'maintenance' → unavailable
//   any room 'vacant'             → available
//   any room 'pending'            → reserved
//   otherwise                     → occupied (hidden from public grid)
// A listing appears on the public site only when the owner has toggled Publish
// AND its derived availability is 'available' or 'reserved'.
// ─────────────────────────────────────────────────────────────────────────────

import type { Property, Room, PropertyType } from '../../types';
import { properties as pmsProperties, rooms as pmsRooms } from '../../data/mockData';

export type Availability = 'available' | 'reserved' | 'occupied' | 'unavailable' | 'hidden';
export type ListingTier = 'luxury' | 'premium' | 'affordable' | 'commercial' | 'student';

export interface ListingMeta {
  headline: string;
  description: string;
  tier: ListingTier;
  bedrooms: number;
  bathrooms: number;
  areaSqft: number;
  furnished: boolean;
  parking: boolean;
  petFriendly: boolean;
  availableFrom: string; // ISO
  minLeaseMonths: number;
  maxOccupancy: number;
  deposit: number;
  utilitiesIncluded: string[];
  amenities: string[];
  rating: number;
  reviewsCount: number;
  baseViews: number;
  featured: boolean;
  publishedByDefault: boolean;
  /** seeds for the generated gallery art */
  gallerySeeds: { label: string; seed: number }[];
  energyRating: string; // A–G
  walkScore: number;
  transitScore: number;
  lat: number;
  lng: number;
}

export interface Listing {
  id: string;               // listing id === property id (1:1 with PMS record)
  property: Property;
  rooms: Room[];
  vacantRooms: Room[];
  availability: Availability;
  priceMonthly: number;     // "from" price (min vacant room, or min room)
  priceWeekly: number;
  meta: ListingMeta;
}

// ── Amenity & utility vocabularies ──────────────────────────────────────────
const AMENITY_POOL = [
  'High-Speed Wi-Fi', 'Fully Fitted Kitchen', 'En-suite Bathroom', 'Communal Lounge',
  'Landscaped Garden', 'Off-Street Parking', 'Smart Heating', 'CCTV Security',
  'Bike Storage', 'Laundry Room', 'Roof Terrace', 'Gym Access', 'Concierge',
  'Step-Free Access', 'Pet Friendly', 'Furnished', 'Dishwasher', 'EV Charging',
];

// ── Marketing overlay for the REAL PMS properties (keyed by property id) ─────
const META_OVERLAY: Record<string, Partial<ListingMeta>> = {
  'prop-1': {
    headline: 'Bright room in a beautifully kept Victorian shared house',
    tier: 'affordable', bedrooms: 1, bathrooms: 1, areaSqft: 140, furnished: true,
    parking: true, petFriendly: false, minLeaseMonths: 6, maxOccupancy: 1,
    amenities: ['High-Speed Wi-Fi', 'Fully Fitted Kitchen', 'Communal Lounge', 'Landscaped Garden', 'Off-Street Parking', 'Smart Heating', 'Laundry Room'],
    utilitiesIncluded: ['Water', 'Wi-Fi', 'Council Tax'], rating: 4.8, reviewsCount: 32,
    baseViews: 1240, featured: true, energyRating: 'C', walkScore: 88, transitScore: 79,
    lat: 53.4451, lng: -2.2246,
  },
  'prop-2': {
    headline: 'Supported-living studio with 24/7 on-site care team',
    tier: 'premium', bedrooms: 1, bathrooms: 1, areaSqft: 165, furnished: true,
    parking: true, petFriendly: true, minLeaseMonths: 12, maxOccupancy: 1,
    amenities: ['High-Speed Wi-Fi', 'En-suite Bathroom', 'Step-Free Access', 'CCTV Security', 'Communal Lounge', 'Concierge', 'Smart Heating'],
    utilitiesIncluded: ['Water', 'Wi-Fi', 'Heating', 'Care Support'], rating: 4.9, reviewsCount: 51,
    baseViews: 2130, featured: true, energyRating: 'B', walkScore: 82, transitScore: 85,
    lat: 52.4508, lng: -1.9305,
  },
  'prop-3': {
    headline: 'Spacious double in a friendly Leeds house-share',
    tier: 'affordable', bedrooms: 1, bathrooms: 1, areaSqft: 150, furnished: true,
    parking: false, petFriendly: false, minLeaseMonths: 6, maxOccupancy: 2,
    amenities: ['High-Speed Wi-Fi', 'Fully Fitted Kitchen', 'Communal Lounge', 'Bike Storage', 'Laundry Room'],
    utilitiesIncluded: ['Water', 'Wi-Fi'], rating: 4.6, reviewsCount: 24,
    baseViews: 870, featured: false, energyRating: 'C', walkScore: 91, transitScore: 80,
    lat: 53.8175, lng: -1.5731,
  },
  'prop-4': {
    headline: 'Modern supported apartment moments from the waterfront',
    tier: 'premium', bedrooms: 1, bathrooms: 1, areaSqft: 172, furnished: true,
    parking: true, petFriendly: true, minLeaseMonths: 12, maxOccupancy: 1,
    amenities: ['High-Speed Wi-Fi', 'En-suite Bathroom', 'Step-Free Access', 'Smart Heating', 'CCTV Security', 'EV Charging'],
    utilitiesIncluded: ['Water', 'Wi-Fi', 'Heating', 'Care Support'], rating: 4.7, reviewsCount: 38,
    baseViews: 1520, featured: false, energyRating: 'B', walkScore: 79, transitScore: 83,
    lat: 53.3900, lng: -2.9770,
  },
  'prop-5': {
    headline: 'Self-contained one-bed with private garden in Bristol',
    tier: 'premium', bedrooms: 1, bathrooms: 1, areaSqft: 480, furnished: false,
    parking: true, petFriendly: true, minLeaseMonths: 12, maxOccupancy: 2,
    amenities: ['High-Speed Wi-Fi', 'Fully Fitted Kitchen', 'Landscaped Garden', 'Off-Street Parking', 'Smart Heating', 'EV Charging', 'Dishwasher'],
    utilitiesIncluded: ['Water'], rating: 4.9, reviewsCount: 19,
    baseViews: 1980, featured: true, energyRating: 'A', walkScore: 85, transitScore: 76,
    lat: 51.4620, lng: -2.5626,
  },
};

// ── Extra demo stock (SAME Property/Room shape) so the grid feels commercial ──
// These are clearly marketplace demo records; the publish + auto-status logic
// runs on them identically to the real PMS records above.
interface StockDef {
  property: Property;
  rooms: Room[];
  meta: ListingMeta;
}

function mkMeta(m: ListingMeta): ListingMeta {
  return m;
}

const STOCK: StockDef[] = [
  {
    property: {
      id: 'mkt-1', organisationId: 'org-1', address: 'The Sky Loft, 1 Deansgate Square',
      city: 'Manchester', postcode: 'M15 4GB', type: 'self_contained', totalRooms: 1,
      occupiedRooms: 0, status: 'active', assignedStaffIds: ['user-2'],
      lastInspectionDate: '2026-05-01', nextInspectionDate: '2026-11-01',
      localAuthority: 'Manchester City Council', region: 'North West',
    },
    rooms: [{ id: 'mkt-1-r1', propertyId: 'mkt-1', roomNumber: 'PH', status: 'vacant', weeklyRent: 620 }],
    meta: mkMeta({
      headline: 'Penthouse-level living with panoramic skyline views',
      description: 'A breathtaking corner residence on the 44th floor with floor-to-ceiling glazing, a chef’s kitchen and a private winter-garden balcony. Concierge, spa and sky-lounge access included.',
      tier: 'luxury', bedrooms: 2, bathrooms: 2, areaSqft: 1150, furnished: true, parking: true,
      petFriendly: true, availableFrom: '2026-08-01', minLeaseMonths: 12, maxOccupancy: 4,
      deposit: 3720, utilitiesIncluded: ['Water', 'Heating', 'Concierge'],
      amenities: ['Concierge', 'Gym Access', 'Roof Terrace', 'EV Charging', 'Smart Heating', 'CCTV Security', 'High-Speed Wi-Fi', 'Dishwasher'],
      rating: 5.0, reviewsCount: 44, baseViews: 4820, featured: true, publishedByDefault: true,
      gallerySeeds: gallery(11), energyRating: 'A', walkScore: 96, transitScore: 92,
      lat: 53.4666, lng: -2.2510,
    }),
  },
  {
    property: {
      id: 'mkt-2', organisationId: 'org-1', address: 'Canalside Studios, 7 Wharf Road',
      city: 'London', postcode: 'N1 7GS', type: 'self_contained', totalRooms: 1,
      occupiedRooms: 0, status: 'active', assignedStaffIds: ['user-3'],
      lastInspectionDate: '2026-04-12', nextInspectionDate: '2026-10-12',
      localAuthority: 'Islington', region: 'London',
    },
    rooms: [{ id: 'mkt-2-r1', propertyId: 'mkt-2', roomNumber: 'S1', status: 'vacant', weeklyRent: 415 }],
    meta: mkMeta({
      headline: 'Design-led canalside studio in the heart of Islington',
      description: 'A beautifully proportioned studio with exposed brick, engineered-oak floors and a Juliet balcony over the canal. Steps from Angel and the City.',
      tier: 'premium', bedrooms: 0, bathrooms: 1, areaSqft: 420, furnished: true, parking: false,
      petFriendly: false, availableFrom: '2026-07-15', minLeaseMonths: 6, maxOccupancy: 1,
      deposit: 2490, utilitiesIncluded: ['Water', 'Wi-Fi'],
      amenities: ['High-Speed Wi-Fi', 'Fully Fitted Kitchen', 'Smart Heating', 'Bike Storage', 'CCTV Security'],
      rating: 4.8, reviewsCount: 63, baseViews: 3560, featured: true, publishedByDefault: true,
      gallerySeeds: gallery(22), energyRating: 'B', walkScore: 98, transitScore: 97,
      lat: 51.5362, lng: -0.0982,
    }),
  },
  {
    property: {
      id: 'mkt-3', organisationId: 'org-1', address: 'Parkview House, 12 Calthorpe Road',
      city: 'Birmingham', postcode: 'B15 1QP', type: 'shared_house', totalRooms: 5,
      occupiedRooms: 3, status: 'active', assignedStaffIds: ['user-2'],
      lastInspectionDate: '2026-03-30', nextInspectionDate: '2026-09-30',
      localAuthority: 'Birmingham City Council', region: 'West Midlands',
    },
    rooms: [
      { id: 'mkt-3-r1', propertyId: 'mkt-3', roomNumber: '1', status: 'vacant', weeklyRent: 165 },
      { id: 'mkt-3-r2', propertyId: 'mkt-3', roomNumber: '2', status: 'vacant', weeklyRent: 175 },
      { id: 'mkt-3-r3', propertyId: 'mkt-3', roomNumber: '3', status: 'occupied', weeklyRent: 165 },
    ],
    meta: mkMeta({
      headline: 'Two rooms available in a leafy Edgbaston house-share',
      description: 'A warm, professionally managed home with a huge shared kitchen-diner, garden and weekly cleaner. Ideal for young professionals and students.',
      tier: 'affordable', bedrooms: 1, bathrooms: 2, areaSqft: 145, furnished: true, parking: true,
      petFriendly: false, availableFrom: '2026-07-01', minLeaseMonths: 6, maxOccupancy: 1,
      deposit: 715, utilitiesIncluded: ['Water', 'Wi-Fi', 'Council Tax'],
      amenities: ['High-Speed Wi-Fi', 'Fully Fitted Kitchen', 'Communal Lounge', 'Landscaped Garden', 'Off-Street Parking', 'Laundry Room'],
      rating: 4.5, reviewsCount: 28, baseViews: 990, featured: false, publishedByDefault: true,
      gallerySeeds: gallery(33), energyRating: 'C', walkScore: 84, transitScore: 78,
      lat: 52.4642, lng: -1.9218,
    }),
  },
  {
    property: {
      id: 'mkt-4', organisationId: 'org-1', address: 'Meridian Offices, 200 Colmore Row',
      city: 'Birmingham', postcode: 'B3 2QD', type: 'self_contained', totalRooms: 1,
      occupiedRooms: 0, status: 'active', assignedStaffIds: ['user-3'],
      lastInspectionDate: '2026-02-01', nextInspectionDate: '2026-08-01',
      localAuthority: 'Birmingham City Council', region: 'West Midlands',
    },
    rooms: [{ id: 'mkt-4-r1', propertyId: 'mkt-4', roomNumber: 'FL8', status: 'vacant', weeklyRent: 880 }],
    meta: mkMeta({
      headline: 'Grade-A office floor with skyline boardroom',
      description: 'A fully fitted commercial floor with 24 desks, two meeting rooms, breakout kitchen and dedicated fibre. Flexible 12–36 month terms.',
      tier: 'commercial', bedrooms: 0, bathrooms: 2, areaSqft: 3200, furnished: true, parking: true,
      petFriendly: false, availableFrom: '2026-09-01', minLeaseMonths: 12, maxOccupancy: 24,
      deposit: 7620, utilitiesIncluded: ['Water', 'Heating', 'Fibre', 'Cleaning'],
      amenities: ['High-Speed Wi-Fi', 'EV Charging', 'CCTV Security', 'Concierge', 'Bike Storage', 'Smart Heating'],
      rating: 4.7, reviewsCount: 15, baseViews: 1340, featured: false, publishedByDefault: true,
      gallerySeeds: gallery(44), energyRating: 'A', walkScore: 95, transitScore: 90,
      lat: 52.4817, lng: -1.8998,
    }),
  },
  {
    property: {
      id: 'mkt-5', organisationId: 'org-1', address: 'Scholars Court, 5 Woodhouse Lane',
      city: 'Leeds', postcode: 'LS2 3AP', type: 'shared_house', totalRooms: 6,
      occupiedRooms: 4, status: 'active', assignedStaffIds: ['user-2'],
      lastInspectionDate: '2026-01-20', nextInspectionDate: '2026-07-20',
      localAuthority: 'Leeds City Council', region: 'Yorkshire',
    },
    rooms: [
      { id: 'mkt-5-r1', propertyId: 'mkt-5', roomNumber: 'A', status: 'vacant', weeklyRent: 155 },
      { id: 'mkt-5-r2', propertyId: 'mkt-5', roomNumber: 'B', status: 'pending', weeklyRent: 155 },
    ],
    meta: mkMeta({
      headline: 'Purpose-built student room next to the university',
      description: 'All-inclusive student living with study pods, cinema room and on-site gym. Contents insurance and superfast Wi-Fi included.',
      tier: 'student', bedrooms: 1, bathrooms: 1, areaSqft: 130, furnished: true, parking: false,
      petFriendly: false, availableFrom: '2026-09-10', minLeaseMonths: 11, maxOccupancy: 1,
      deposit: 300, utilitiesIncluded: ['Water', 'Wi-Fi', 'Heating', 'Electricity', 'Contents Insurance'],
      amenities: ['High-Speed Wi-Fi', 'Gym Access', 'Communal Lounge', 'Laundry Room', 'CCTV Security', 'Bike Storage'],
      rating: 4.6, reviewsCount: 71, baseViews: 2760, featured: true, publishedByDefault: true,
      gallerySeeds: gallery(55), energyRating: 'B', walkScore: 93, transitScore: 88,
      lat: 53.8060, lng: -1.5550,
    }),
  },
  {
    property: {
      id: 'mkt-6', organisationId: 'org-1', address: 'Harbour Villa, 3 Sandbanks Road',
      city: 'Bristol', postcode: 'BS8 4PN', type: 'self_contained', totalRooms: 1,
      occupiedRooms: 0, status: 'active', assignedStaffIds: ['user-2'],
      lastInspectionDate: '2026-04-18', nextInspectionDate: '2026-10-18',
      localAuthority: 'Bristol City Council', region: 'South West',
    },
    rooms: [{ id: 'mkt-6-r1', propertyId: 'mkt-6', roomNumber: 'V', status: 'vacant', weeklyRent: 540 }],
    meta: mkMeta({
      headline: 'Architect-designed villa with harbour views',
      description: 'A striking four-bedroom villa with double-height living space, a wraparound terrace and direct harbour frontage. The finest home on the marketplace.',
      tier: 'luxury', bedrooms: 4, bathrooms: 3, areaSqft: 2400, furnished: false, parking: true,
      petFriendly: true, availableFrom: '2026-08-20', minLeaseMonths: 12, maxOccupancy: 6,
      deposit: 3240, utilitiesIncluded: ['Water'],
      amenities: ['Landscaped Garden', 'Roof Terrace', 'EV Charging', 'Smart Heating', 'Off-Street Parking', 'Dishwasher', 'High-Speed Wi-Fi'],
      rating: 5.0, reviewsCount: 22, baseViews: 3980, featured: true, publishedByDefault: true,
      gallerySeeds: gallery(66), energyRating: 'A', walkScore: 74, transitScore: 68,
      lat: 51.4485, lng: -2.6210,
    }),
  },
  {
    property: {
      id: 'mkt-7', organisationId: 'org-1', address: 'Riverside Retail, 44 Albert Dock',
      city: 'Liverpool', postcode: 'L3 4AF', type: 'self_contained', totalRooms: 1,
      occupiedRooms: 0, status: 'active', assignedStaffIds: ['user-3'],
      lastInspectionDate: '2026-03-05', nextInspectionDate: '2026-09-05',
      localAuthority: 'Liverpool City Council', region: 'North West',
    },
    rooms: [{ id: 'mkt-7-r1', propertyId: 'mkt-7', roomNumber: 'U2', status: 'vacant', weeklyRent: 460 }],
    meta: mkMeta({
      headline: 'Waterfront retail unit in a landmark dock building',
      description: 'A characterful ground-floor retail unit with 5m frontage and huge footfall in the heart of the Albert Dock. Class E use.',
      tier: 'commercial', bedrooms: 0, bathrooms: 1, areaSqft: 1400, furnished: false, parking: false,
      petFriendly: false, availableFrom: '2026-07-25', minLeaseMonths: 24, maxOccupancy: 40,
      deposit: 3980, utilitiesIncluded: ['Water'],
      amenities: ['High-Speed Wi-Fi', 'CCTV Security', 'Smart Heating'],
      rating: 4.4, reviewsCount: 11, baseViews: 720, featured: false, publishedByDefault: true,
      gallerySeeds: gallery(77), energyRating: 'C', walkScore: 89, transitScore: 82,
      lat: 53.3999, lng: -2.9920,
    }),
  },
  {
    property: {
      id: 'mkt-8', organisationId: 'org-1', address: 'The Gardens, 9 Regency Crescent',
      city: 'London', postcode: 'SW1V 2LP', type: 'self_contained', totalRooms: 1,
      occupiedRooms: 0, status: 'maintenance', assignedStaffIds: ['user-2'],
      lastInspectionDate: '2026-05-10', nextInspectionDate: '2026-11-10',
      localAuthority: 'Westminster', region: 'London',
    },
    rooms: [{ id: 'mkt-8-r1', propertyId: 'mkt-8', roomNumber: 'G', status: 'maintenance', weeklyRent: 750 }],
    meta: mkMeta({
      headline: 'Grand garden apartment in a stucco-fronted crescent',
      description: 'A refined lateral apartment with two reception rooms and access to private gardens. Currently undergoing refurbishment.',
      tier: 'luxury', bedrooms: 3, bathrooms: 2, areaSqft: 1650, furnished: true, parking: true,
      petFriendly: false, availableFrom: '2026-10-01', minLeaseMonths: 12, maxOccupancy: 5,
      deposit: 4500, utilitiesIncluded: ['Water', 'Heating', 'Garden Upkeep'],
      amenities: ['Concierge', 'Landscaped Garden', 'Smart Heating', 'CCTV Security', 'High-Speed Wi-Fi'],
      rating: 4.9, reviewsCount: 34, baseViews: 2210, featured: false, publishedByDefault: true,
      gallerySeeds: gallery(88), energyRating: 'B', walkScore: 97, transitScore: 95,
      lat: 51.4900, lng: -0.1400,
    }),
  },
];

// ── Gallery seed helper ─────────────────────────────────────────────────────
function gallery(base: number): { label: string; seed: number }[] {
  const labels = ['Exterior', 'Living Space', 'Kitchen', 'Bedroom', 'Bathroom', 'Balcony / View'];
  return labels.map((label, i) => ({ label, seed: base * 10 + i }));
}

// ── Defaults for the real PMS properties (fill any missing meta fields) ──────
function defaultMeta(p: Property, minWeekly: number): ListingMeta {
  const monthly = Math.round((minWeekly * 52) / 12);
  return {
    headline: `${labelForType(p.type)} in ${p.city}`,
    description:
      `A well-presented ${labelForType(p.type).toLowerCase()} at ${p.address}, ${p.city}. ` +
      `Professionally managed by the team with regular inspections and full compliance certification. ` +
      `Close to local transport, shops and green space.`,
    tier: 'affordable', bedrooms: 1, bathrooms: 1, areaSqft: 150, furnished: true,
    parking: false, petFriendly: false, availableFrom: nextMonthISO(), minLeaseMonths: 6,
    maxOccupancy: 1, deposit: Math.round(monthly * 1.1), utilitiesIncluded: ['Water', 'Wi-Fi'],
    amenities: AMENITY_POOL.slice(0, 6), rating: 4.6, reviewsCount: 20, baseViews: 800,
    featured: false, publishedByDefault: true, gallerySeeds: gallery(Number(p.id.replace(/\D/g, '')) || 1),
    energyRating: 'C', walkScore: 85, transitScore: 78, lat: 53.4, lng: -2.2,
  };
}

export function labelForType(t: PropertyType): string {
  return {
    supported_living: 'Supported Living',
    shared_house: 'Shared House',
    self_contained: 'Self-Contained Home',
    move_on: 'Move-On Accommodation',
  }[t];
}

function nextMonthISO(): string {
  const d = new Date();
  d.setMonth(d.getMonth() + 1, 1);
  return d.toISOString().slice(0, 10);
}

// ── Availability derivation (the auto-publish rules) ─────────────────────────
function deriveAvailability(p: Property, rms: Room[]): Availability {
  if (p.status === 'inactive') return 'hidden';
  if (p.status === 'maintenance') return 'unavailable';
  if (rms.some((r) => r.status === 'vacant')) return 'available';
  if (rms.some((r) => r.status === 'pending')) return 'reserved';
  if (rms.some((r) => r.status === 'maintenance' || r.status === 'unavailable')) return 'unavailable';
  return 'occupied';
}

// ── Build the full listing set (real PMS records + demo stock) ───────────────
let cache: Listing[] | null = null;

export function getAllListings(): Listing[] {
  if (cache) return cache;

  const real: Listing[] = pmsProperties.map((property) => {
    const rms = pmsRooms.filter((r) => r.propertyId === property.id);
    const vacant = rms.filter((r) => r.status === 'vacant');
    const priceRooms = vacant.length ? vacant : rms;
    const minWeekly = priceRooms.length ? Math.min(...priceRooms.map((r) => r.weeklyRent)) : 175;
    const meta = { ...defaultMeta(property, minWeekly), ...META_OVERLAY[property.id] } as ListingMeta;
    return {
      id: property.id, property, rooms: rms, vacantRooms: vacant,
      availability: deriveAvailability(property, rms),
      priceWeekly: minWeekly, priceMonthly: Math.round((minWeekly * 52) / 12), meta,
    };
  });

  const stock: Listing[] = STOCK.map(({ property, rooms: rms, meta }) => {
    const vacant = rms.filter((r) => r.status === 'vacant');
    const priceRooms = vacant.length ? vacant : rms;
    const minWeekly = priceRooms.length ? Math.min(...priceRooms.map((r) => r.weeklyRent)) : 200;
    return {
      id: property.id, property, rooms: rms, vacantRooms: vacant,
      availability: deriveAvailability(property, rms),
      priceWeekly: minWeekly, priceMonthly: Math.round((minWeekly * 52) / 12), meta,
    };
  });

  cache = [...stock, ...real];
  return cache;
}

export function getListingById(id: string): Listing | undefined {
  return getAllListings().find((l) => l.id === id);
}

/** Seed for the runtime publish store (called once at app start). */
export function publishSeed() {
  const published: Record<string, boolean> = {};
  const featured: Record<string, boolean> = {};
  const views: Record<string, number> = {};
  for (const l of getAllListings()) {
    published[l.id] = l.meta.publishedByDefault ?? true;
    featured[l.id] = l.meta.featured;
    views[l.id] = l.meta.baseViews;
  }
  return { published, featured, views, reserved: {} };
}

// ── Static content used across the public site ──────────────────────────────
export const POPULAR_CITIES = [
  { name: 'London', region: 'Greater London', seed: 101 },
  { name: 'Manchester', region: 'North West', seed: 102 },
  { name: 'Birmingham', region: 'West Midlands', seed: 103 },
  { name: 'Leeds', region: 'Yorkshire', seed: 104 },
  { name: 'Bristol', region: 'South West', seed: 105 },
  { name: 'Liverpool', region: 'North West', seed: 106 },
];

export const TESTIMONIALS = [
  { name: 'Amelia R.', role: 'Tenant · Manchester', quote: 'The whole process — from viewing to signing — took three days. The team was incredible and the home is exactly as pictured.', rating: 5 },
  { name: 'David O.', role: 'Tenant · Birmingham', quote: 'Booking a viewing online and getting instant confirmation felt effortless. Genuinely the smoothest rental I have ever done.', rating: 5 },
  { name: 'Priya S.', role: 'Tenant · Leeds', quote: 'Verified listings, real photos, transparent costs. No surprises, no hidden fees. Highly recommend.', rating: 5 },
];

export const FAQS = [
  { q: 'How do I book a viewing?', a: 'Open any listing and tap “Book Viewing”. Choose a date and time and you’ll receive instant confirmation once the property manager approves — usually within a few hours.' },
  { q: 'What does “Reserved” mean on a listing?', a: 'A reserved listing has an accepted holding deposit from another applicant. You can still register interest and we’ll notify you if it becomes available again.' },
  { q: 'Are the listings verified?', a: 'Yes. Every listing is published directly by the managing agent from our property system, so availability, pricing and compliance are always up to date.' },
  { q: 'What are the upfront costs?', a: 'Typically a holding deposit, first month’s rent in advance and a security deposit. Each listing shows a full move-in cost breakdown on its details page.' },
  { q: 'Can I apply online?', a: 'Absolutely. Choose “Apply Now” on any available listing to complete a full referencing application with document upload and digital signature.' },
];

export const AVAILABILITY_LABEL: Record<Availability, string> = {
  available: 'Available Now',
  reserved: 'Reserved',
  occupied: 'Let',
  unavailable: 'Unavailable',
  hidden: 'Hidden',
};
