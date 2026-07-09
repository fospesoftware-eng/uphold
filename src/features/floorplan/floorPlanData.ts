// Simple grid-based floor-plan model rendered as an interactive 3D dollhouse.
// Coordinates are in grid cells; the renderer scales them to pixels.

export type RoomType =
  | 'living' | 'kitchen' | 'dining' | 'bedroom' | 'bathroom' | 'wc'
  | 'hall' | 'utility' | 'sauna' | 'office' | 'storage';

export type FurnitureType =
  | 'bed' | 'sofa' | 'table' | 'tv' | 'wardrobe' | 'counter' | 'fridge'
  | 'bath' | 'toilet' | 'sink' | 'bench' | 'washer' | 'plant';

export interface Furniture {
  type: FurnitureType;
  x: number; y: number; w: number; h: number; // absolute grid coords
}

export interface FloorRoom {
  id: string;
  name: string;
  type: RoomType;
  x: number; y: number; w: number; h: number;
  area?: number; // m²
}

export interface FloorPlan {
  gridW: number;
  gridH: number;
  rooms: FloorRoom[];
  furniture: Furniture[];
}

// ── A clean, fully-tiled 3-bed shared house (matches the reference image) ──────
const SHARED_HOUSE_3BED: FloorPlan = {
  gridW: 18,
  gridH: 12,
  rooms: [
    { id: 'living',  name: 'Living / Dining', type: 'living',   x: 0,  y: 0, w: 8, h: 6, area: 36 },
    { id: 'bed2',    name: 'Bedroom 2',       type: 'bedroom',  x: 8,  y: 0, w: 4, h: 6, area: 6.8 },
    { id: 'bed3',    name: 'Bedroom 3',       type: 'bedroom',  x: 12, y: 0, w: 4, h: 6, area: 6.8 },
    { id: 'laundry', name: 'Laundry',         type: 'utility',  x: 16, y: 0, w: 2, h: 3, area: 6.9 },
    { id: 'wc1',     name: 'WC',              type: 'wc',       x: 16, y: 3, w: 2, h: 3, area: 1.9 },
    { id: 'kitchen', name: 'Kitchen',         type: 'kitchen',  x: 0,  y: 6, w: 5, h: 6, area: 14 },
    { id: 'bed1',    name: 'Bedroom 1',       type: 'bedroom',  x: 5,  y: 6, w: 5, h: 6, area: 6.8 },
    { id: 'entry',   name: 'Entry',           type: 'hall',     x: 10, y: 6, w: 4, h: 3, area: 9.7 },
    { id: 'sauna',   name: 'Sauna',           type: 'sauna',    x: 14, y: 6, w: 4, h: 3, area: 4.3 },
    { id: 'wc2',     name: 'WC',              type: 'wc',       x: 10, y: 9, w: 2, h: 3, area: 5.5 },
    { id: 'bath',    name: 'Bathroom',        type: 'bathroom', x: 12, y: 9, w: 6, h: 3, area: 6 },
  ],
  furniture: [
    // living
    { type: 'sofa',  x: 0.4, y: 0.5, w: 3,   h: 1.2 },
    { type: 'sofa',  x: 0.4, y: 2,   w: 1.2, h: 3 },
    { type: 'table', x: 4,   y: 2.4, w: 2.6, h: 1.6 },
    { type: 'tv',    x: 6.7, y: 0.4, w: 1.1, h: 0.5 },
    { type: 'plant', x: 6.6, y: 4.6, w: 0.9, h: 0.9 },
    // kitchen
    { type: 'counter', x: 0.3, y: 6.3, w: 4.4, h: 1 },
    { type: 'fridge',  x: 0.3, y: 10.4, w: 1, h: 1.2 },
    { type: 'table',   x: 2.4, y: 9,   w: 2,  h: 1.4 },
    // bedrooms
    { type: 'bed',      x: 6,    y: 7.4, w: 3,   h: 4 },
    { type: 'wardrobe', x: 9,    y: 6.3, w: 0.8, h: 2 },
    { type: 'bed',      x: 8.4,  y: 1,   w: 2,   h: 3.6 },
    { type: 'wardrobe', x: 11,   y: 0.4, w: 0.8, h: 2 },
    { type: 'bed',      x: 12.4, y: 1,   w: 2,   h: 3.6 },
    { type: 'wardrobe', x: 15,   y: 0.4, w: 0.8, h: 2 },
    // bathroom
    { type: 'bath',   x: 12.4, y: 9.4, w: 3,   h: 1.4 },
    { type: 'sink',   x: 16.4, y: 9.4, w: 1,   h: 0.8 },
    { type: 'toilet', x: 16.5, y: 11,  w: 0.8, h: 0.8 },
    // wcs
    { type: 'toilet', x: 16.3, y: 3.4, w: 0.8, h: 0.9 },
    { type: 'toilet', x: 10.3, y: 9.5, w: 0.8, h: 0.9 },
    // sauna / laundry
    { type: 'bench',  x: 14.3, y: 6.3, w: 3.2, h: 0.7 },
    { type: 'washer', x: 16.3, y: 0.5, w: 1.3, h: 1.2 },
  ],
};

// ── A compact 2-bed flat (variety for other properties) ───────────────────────
const FLAT_2BED: FloorPlan = {
  gridW: 14,
  gridH: 10,
  rooms: [
    { id: 'living',  name: 'Living / Kitchen', type: 'living',  x: 0, y: 0, w: 8, h: 6, area: 28 },
    { id: 'bed1',    name: 'Bedroom 1',        type: 'bedroom', x: 8, y: 0, w: 6, h: 5, area: 12 },
    { id: 'hall',    name: 'Hall',             type: 'hall',    x: 0, y: 6, w: 5, h: 4, area: 6 },
    { id: 'bed2',    name: 'Bedroom 2',        type: 'bedroom', x: 5, y: 6, w: 5, h: 4, area: 9 },
    { id: 'bath',    name: 'Bathroom',         type: 'bathroom',x: 10, y: 5, w: 4, h: 5, area: 5 },
  ],
  furniture: [
    { type: 'sofa',    x: 0.4, y: 0.5, w: 3,   h: 1.2 },
    { type: 'table',   x: 1,   y: 2.4, w: 2.4, h: 1.5 },
    { type: 'tv',      x: 6.6, y: 0.4, w: 1.1, h: 0.5 },
    { type: 'counter', x: 0.3, y: 4.6, w: 4,   h: 1 },
    { type: 'fridge',  x: 6.6, y: 4.3, w: 1,   h: 1.2 },
    { type: 'bed',     x: 9,   y: 0.6, w: 3,   h: 4 },
    { type: 'wardrobe',x: 12.4,y: 0.5, w: 0.8, h: 2.5 },
    { type: 'bed',     x: 6,   y: 6.6, w: 3,   h: 3 },
    { type: 'bath',    x: 10.4,y: 5.5, w: 3,   h: 1.4 },
    { type: 'toilet',  x: 12.5,y: 8,   w: 0.8, h: 0.8 },
    { type: 'sink',    x: 10.4,y: 8,   w: 1,   h: 0.8 },
  ],
};

// propertyId → plan. Unknown properties fall back by a stable pick.
const PLANS: Record<string, FloorPlan> = {
  'prop-1': SHARED_HOUSE_3BED,
  'prop-2': FLAT_2BED,
  'prop-3': SHARED_HOUSE_3BED,
  'prop-4': FLAT_2BED,
  'prop-5': SHARED_HOUSE_3BED,
};

export function getFloorPlan(propertyId?: string): FloorPlan {
  if (propertyId && PLANS[propertyId]) return PLANS[propertyId];
  // stable fallback so a given id always renders the same plan
  const n = (propertyId ?? '').split('').reduce((s, c) => s + c.charCodeAt(0), 0);
  return n % 2 === 0 ? SHARED_HOUSE_3BED : FLAT_2BED;
}

export const ROOM_STYLE: Record<RoomType, { floor: string; label: string }> = {
  living:   { floor: '#E9DcC9', label: 'Living' },
  kitchen:  { floor: '#DCE3EA', label: 'Kitchen' },
  dining:   { floor: '#E9DcC9', label: 'Dining' },
  bedroom:  { floor: '#EAD9C2', label: 'Bedroom' },
  bathroom: { floor: '#CFE6EC', label: 'Bathroom' },
  wc:       { floor: '#D3E7EA', label: 'WC' },
  hall:     { floor: '#E4E7EC', label: 'Hall' },
  utility:  { floor: '#DDE1E6', label: 'Utility' },
  sauna:    { floor: '#D9B48C', label: 'Sauna' },
  office:   { floor: '#E4DFD2', label: 'Office' },
  storage:  { floor: '#DDE1E6', label: 'Storage' },
};
