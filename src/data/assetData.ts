// Demo asset inventory for Granville Community Homes (org-1).
// Backs assetService with in-memory data, matching the pattern of the other
// mock services (the Supabase client is a stub in this build).

import type { Asset, AssetCategory, AssetMaintenance, AssetLog } from '../types';

export const assetCategories: AssetCategory[] = [
  { id: 'cat-care',        name: 'Care Equipment',    icon: 'accessibility', color: '#10B981', description: 'Profiling beds, hoists, pressure care' },
  { id: 'cat-furniture',   name: 'Furniture',         icon: 'armchair',      color: '#F59E0B', description: 'Beds, wardrobes, desks, seating' },
  { id: 'cat-electronics', name: 'Electronics',       icon: 'tv',            color: '#3B82F6', description: 'TVs, tablets, monitors' },
  { id: 'cat-appliances',  name: 'Appliances',        icon: 'refrigerator',  color: '#8B5CF6', description: 'Fridges, washers, cookers' },
  { id: 'cat-safety',      name: 'Safety & Security', icon: 'shield-check',  color: '#EF4444', description: 'Alarms, CCTV, detectors' },
  { id: 'cat-networking',  name: 'Networking',        icon: 'wifi',          color: '#0EA5E9', description: 'Routers, access points' },
  { id: 'cat-mobility',    name: 'Mobility Aids',     icon: 'move',          color: '#14B8A6', description: 'Wheelchairs, walking aids' },
];

const catMap = Object.fromEntries(assetCategories.map(c => [c.id, c]));

// Seeds omit the embedded `category` object — it's attached from `category_id` below.
type Seed = Omit<Asset, 'category'>;

const seeds: Seed[] = [
  {
    id: 'ast-1', asset_code: 'AST-0001', name: 'Profiling Care Bed', category_id: 'cat-care',
    subcategory: 'Adjustable Bed', description: 'Electric 4-section profiling bed with side rails',
    property_name: '14 Elm Grove', unit_number: 'Room 1', room: "Bedroom 1",
    serial_number: 'CB-2024-014', manufacturer: 'Drive Medical', brand: 'Drive', model: 'Profiling Bed Pro',
    purchase_date: '2024-01-08', installation_date: '2024-01-10', supplier: 'CareCo', invoice_number: 'INV-CC-8841',
    purchase_cost: 1450, current_value: 1160, warranty_expiry: '2027-01-08', useful_life_years: 7,
    condition: 'excellent', status: 'assigned', assigned_to: 'Sarah Mitchell', qr_code: 'AST-0001',
    created_at: '2024-01-08T09:00:00Z', updated_at: '2026-04-12T10:00:00Z', last_maintenance: '2026-04-10',
  },
  {
    id: 'ast-2', asset_code: 'AST-0002', name: 'Ceiling Track Hoist', category_id: 'cat-care',
    subcategory: 'Hoist', description: 'Arjo Maxi Sky 2 Plus ceiling-mounted hoist',
    property_name: '14 Elm Grove', unit_number: 'Room 1', room: "Bedroom 1",
    serial_number: 'MH-24-001', manufacturer: 'Arjo', model: 'Maxi Sky 2 Plus',
    purchase_date: '2024-01-08', installation_date: '2024-01-10', supplier: 'Arjo UK', invoice_number: 'INV-AR-2210',
    purchase_cost: 3200, current_value: 2720, warranty_expiry: '2027-01-08', useful_life_years: 10,
    condition: 'excellent', status: 'installed', qr_code: 'AST-0002',
    created_at: '2024-01-08T09:10:00Z', updated_at: '2026-01-16T10:00:00Z', last_maintenance: '2026-01-15', next_maintenance: '2026-07-15',
  },
  {
    id: 'ast-3', asset_code: 'AST-0003', name: '65" Smart TV', category_id: 'cat-electronics',
    subcategory: 'Television', description: 'Samsung 65" 4K QLED communal lounge TV',
    property_name: '14 Elm Grove', room: "Living / Dining",
    serial_number: 'TV-23-0012', manufacturer: 'Samsung', model: 'QE65Q80C',
    purchase_date: '2023-05-12', installation_date: '2023-05-14', supplier: 'Currys Business', invoice_number: 'INV-CB-5521',
    purchase_cost: 999, current_value: 620, warranty_expiry: '2026-07-22', useful_life_years: 5,
    condition: 'good', status: 'installed', qr_code: 'AST-0003',
    created_at: '2023-05-12T09:00:00Z', updated_at: '2025-12-02T10:00:00Z',
  },
  {
    id: 'ast-4', asset_code: 'AST-0004', name: 'Wi-Fi Router', category_id: 'cat-networking',
    subcategory: 'Router', description: 'BT Business Hub 6 whole-building coverage',
    property_name: '14 Elm Grove', room: "Laundry",
    serial_number: 'RTR-22-001', manufacturer: 'BT', model: 'Business Hub 6',
    purchase_date: '2022-10-05', installation_date: '2022-10-06', supplier: 'BT Business',
    purchase_cost: 180, current_value: 60, warranty_expiry: '2025-10-05', useful_life_years: 4,
    condition: 'fair', status: 'installed', qr_code: 'AST-0004',
    created_at: '2022-10-05T09:00:00Z', updated_at: '2026-02-01T10:00:00Z',
  },
  {
    id: 'ast-5', asset_code: 'AST-0005', name: 'Fire Alarm Control Panel', category_id: 'cat-safety',
    subcategory: 'Fire Safety', description: 'Addressable fire alarm panel, 8-zone',
    property_name: '14 Elm Grove', room: "Entry",
    serial_number: 'FA-21-118', manufacturer: 'Kentec', model: 'Syncro AS',
    purchase_date: '2021-06-20', installation_date: '2021-06-22', supplier: 'SafeGuard Fire',
    purchase_cost: 1250, current_value: 700, warranty_expiry: '2026-06-20', useful_life_years: 10,
    condition: 'good', status: 'installed', qr_code: 'AST-0005',
    created_at: '2021-06-20T09:00:00Z', updated_at: '2026-06-05T10:00:00Z', last_maintenance: '2026-06-01', next_maintenance: '2026-12-01',
  },
  {
    id: 'ast-6', asset_code: 'AST-0006', name: 'Electric Wheelchair', category_id: 'cat-mobility',
    subcategory: 'Powered Chair', description: 'Powered wheelchair with tilt-in-space',
    property_name: '22 Station Road', unit_number: 'Room 3',
    serial_number: 'WC-25-044', manufacturer: 'Invacare', model: 'TDX SP2',
    purchase_date: '2025-02-18', installation_date: '2025-02-20', supplier: 'Invacare UK', invoice_number: 'INV-IN-9931',
    purchase_cost: 4800, current_value: 4200, warranty_expiry: '2028-02-18', useful_life_years: 8,
    condition: 'excellent', status: 'assigned', assigned_to: 'Daniel Hughes', qr_code: 'AST-0006',
    created_at: '2025-02-18T09:00:00Z', updated_at: '2026-05-20T10:00:00Z',
  },
  {
    id: 'ast-7', asset_code: 'AST-0007', name: 'Washing Machine', category_id: 'cat-appliances',
    subcategory: 'Laundry', description: 'Commercial 10kg washing machine',
    property_name: '22 Station Road', room: 'Laundry',
    serial_number: 'WM-24-207', manufacturer: 'Miele', model: 'PWM 507',
    purchase_date: '2024-03-11', installation_date: '2024-03-12', supplier: 'Miele Professional',
    purchase_cost: 2100, current_value: 1600, warranty_expiry: '2027-03-11', useful_life_years: 8,
    condition: 'good', status: 'in_maintenance', qr_code: 'AST-0007',
    created_at: '2024-03-11T09:00:00Z', updated_at: '2026-07-02T10:00:00Z', next_maintenance: '2026-07-14',
  },
  {
    id: 'ast-8', asset_code: 'AST-0008', name: 'Riser Recliner Armchair', category_id: 'cat-furniture',
    subcategory: 'Seating', description: 'Dual-motor riser recliner chair',
    property_name: '22 Station Road', unit_number: 'Room 2',
    serial_number: 'RC-24-088', manufacturer: 'Repose', model: 'Rimini',
    purchase_date: '2024-09-02', installation_date: '2024-09-04', supplier: 'Repose Furniture',
    purchase_cost: 850, current_value: 720, warranty_expiry: '2026-08-05', useful_life_years: 6,
    condition: 'good', status: 'assigned', assigned_to: 'Priya Nair', qr_code: 'AST-0008',
    created_at: '2024-09-02T09:00:00Z', updated_at: '2026-03-18T10:00:00Z',
  },
  {
    id: 'ast-9', asset_code: 'AST-0009', name: 'CCTV Camera Set (4x)', category_id: 'cat-safety',
    subcategory: 'CCTV', description: '4-camera HD CCTV with NVR',
    property_name: '8 Queens Terrace', room: 'External',
    serial_number: 'CC-23-330', manufacturer: 'Hikvision', model: 'DS-2CD2',
    purchase_date: '2023-11-15', installation_date: '2023-11-18', supplier: 'SecureVision',
    purchase_cost: 1400, current_value: 950, warranty_expiry: '2026-11-15', useful_life_years: 6,
    condition: 'good', status: 'installed', qr_code: 'AST-0009',
    created_at: '2023-11-15T09:00:00Z', updated_at: '2026-01-10T10:00:00Z',
  },
  {
    id: 'ast-10', asset_code: 'AST-0010', name: 'Adjustable Overbed Table', category_id: 'cat-furniture',
    subcategory: 'Table', description: 'Height-adjustable tilting overbed table',
    property_name: '8 Queens Terrace', unit_number: 'Room 1',
    serial_number: 'OT-25-012', manufacturer: 'NRS Healthcare', model: 'Cantilever',
    purchase_date: '2025-06-30', installation_date: '2025-07-01', supplier: 'NRS Healthcare',
    purchase_cost: 140, current_value: 130, warranty_expiry: '2027-06-30', useful_life_years: 5,
    condition: 'excellent', status: 'available', qr_code: 'AST-0010',
    created_at: '2025-06-30T09:00:00Z', updated_at: '2025-07-01T10:00:00Z',
  },
  {
    id: 'ast-11', asset_code: 'AST-0011', name: 'Fridge Freezer', category_id: 'cat-appliances',
    subcategory: 'Refrigeration', description: 'Frost-free fridge freezer, communal kitchen',
    property_name: '8 Queens Terrace', room: 'Kitchen',
    serial_number: 'FF-22-501', manufacturer: 'Beko', model: 'CFG3552',
    purchase_date: '2022-04-19', installation_date: '2022-04-20', supplier: 'AO Business',
    purchase_cost: 420, current_value: 160, warranty_expiry: '2025-04-19', useful_life_years: 6,
    condition: 'poor', status: 'damaged', qr_code: 'AST-0011', notes: 'Door seal failing — replacement quoted',
    created_at: '2022-04-19T09:00:00Z', updated_at: '2026-06-28T10:00:00Z',
  },
  {
    id: 'ast-12', asset_code: 'AST-0012', name: 'Care Tablet (iPad)', category_id: 'cat-electronics',
    subcategory: 'Tablet', description: 'iPad for care records & video calls',
    property_name: '41 Brook Street', room: 'Office',
    serial_number: 'IPD-25-076', manufacturer: 'Apple', model: 'iPad 10th Gen',
    purchase_date: '2025-01-22', installation_date: '2025-01-22', supplier: 'Apple Business',
    purchase_cost: 499, current_value: 400, warranty_expiry: '2027-01-22', useful_life_years: 4,
    condition: 'good', status: 'assigned', assigned_to: 'Aisha Khan', qr_code: 'AST-0012',
    created_at: '2025-01-22T09:00:00Z', updated_at: '2026-05-01T10:00:00Z',
  },
  {
    id: 'ast-13', asset_code: 'AST-0013', name: 'Rollator Walking Frame', category_id: 'cat-mobility',
    subcategory: 'Walking Aid', description: '4-wheel rollator with seat and brakes',
    property_name: '41 Brook Street', unit_number: 'Room 4',
    serial_number: 'RL-25-129', manufacturer: 'Drive Medical', model: 'Nitro',
    purchase_date: '2025-05-06', installation_date: '2025-05-06', supplier: 'CareCo',
    purchase_cost: 165, current_value: 150, warranty_expiry: '2027-05-06', useful_life_years: 5,
    condition: 'excellent', status: 'reserved', qr_code: 'AST-0013',
    created_at: '2025-05-06T09:00:00Z', updated_at: '2026-06-15T10:00:00Z',
  },
  {
    id: 'ast-14', asset_code: 'AST-0014', name: 'Wardrobe (2-door)', category_id: 'cat-furniture',
    subcategory: 'Storage', description: 'Solid pine double wardrobe',
    property_name: '5 Kingfisher Close', unit_number: 'Room 2',
    serial_number: 'WD-24-315', manufacturer: 'Ikea', model: 'Brimnes',
    purchase_date: '2024-07-14', installation_date: '2024-07-15', supplier: 'Ikea Business',
    purchase_cost: 190, current_value: 150, useful_life_years: 8,
    condition: 'good', status: 'assigned', assigned_to: 'Thomas Bennett', qr_code: 'AST-0014',
    created_at: '2024-07-14T09:00:00Z', updated_at: '2026-02-20T10:00:00Z',
  },
  {
    id: 'ast-15', asset_code: 'AST-0015', name: 'Wireless Access Point', category_id: 'cat-networking',
    subcategory: 'Access Point', description: 'Ubiquiti UniFi AP for upper floor',
    property_name: '5 Kingfisher Close', room: 'Landing',
    serial_number: 'AP-26-004', manufacturer: 'Ubiquiti', model: 'U6-Lite',
    purchase_date: '2026-07-03', installation_date: '2026-07-04', supplier: 'Broadband Buyer', invoice_number: 'INV-BB-1180',
    purchase_cost: 99, current_value: 95, warranty_expiry: '2028-07-03', useful_life_years: 5,
    condition: 'excellent', status: 'available', qr_code: 'AST-0015',
    created_at: '2026-07-03T09:00:00Z', updated_at: '2026-07-03T09:00:00Z',
  },
  {
    id: 'ast-16', asset_code: 'AST-0016', name: 'Pressure Relief Mattress', category_id: 'cat-care',
    subcategory: 'Pressure Care', description: 'Dynamic air pressure-relieving mattress',
    property_name: '5 Kingfisher Close', unit_number: 'Room 2',
    serial_number: 'PM-26-021', manufacturer: 'Invacare', model: 'Softform Premier',
    purchase_date: '2026-07-07', installation_date: '2026-07-08', supplier: 'Invacare UK', invoice_number: 'INV-IN-1044',
    purchase_cost: 640, current_value: 630, warranty_expiry: '2029-07-07', useful_life_years: 7,
    condition: 'excellent', status: 'assigned', assigned_to: 'Thomas Bennett', qr_code: 'AST-0016',
    created_at: '2026-07-07T09:00:00Z', updated_at: '2026-07-08T10:00:00Z',
  },
];

export const assets: Asset[] = seeds.map(s => ({
  ...s,
  category: s.category_id ? catMap[s.category_id] : undefined,
  images: s.images ?? [`/assets/${s.id}.svg`],
}));

export const assetMaintenance: AssetMaintenance[] = [
  {
    id: 'am-1', asset_id: 'ast-2', maintenance_type: 'inspection', scheduled_date: '2026-01-15', completed_date: '2026-01-15',
    technician: 'LOLER Inspections Ltd', description: 'Six-monthly LOLER thorough examination — passed',
    cost: 95, status: 'completed', next_due_date: '2026-07-15', created_at: '2026-01-15T11:00:00Z',
  },
  {
    id: 'am-2', asset_id: 'ast-7', maintenance_type: 'corrective', scheduled_date: '2026-07-02',
    technician: 'Miele Service', description: 'Drum bearing noise — parts on order', parts_replaced: 'Drum bearing kit',
    cost: 180, status: 'in_progress', next_due_date: '2026-07-14', created_at: '2026-07-02T09:30:00Z',
  },
  {
    id: 'am-3', asset_id: 'ast-5', maintenance_type: 'preventive', scheduled_date: '2026-06-01', completed_date: '2026-06-01',
    technician: 'SafeGuard Fire', description: 'Annual fire panel service & battery check',
    cost: 120, status: 'completed', next_due_date: '2026-12-01', created_at: '2026-06-01T10:00:00Z',
  },
  {
    id: 'am-4', asset_id: 'ast-11', maintenance_type: 'corrective', scheduled_date: '2026-07-10',
    description: 'Replace perished door seal / assess for replacement', status: 'scheduled',
    created_at: '2026-06-28T14:00:00Z',
  },
];

export const assetLogs: AssetLog[] = [
  { id: 'al-1', asset_id: 'ast-16', action: 'created', performed_by: 'Marcus Webb', details: 'Asset "Pressure Relief Mattress" created', created_at: '2026-07-07T09:00:00Z' },
  { id: 'al-2', asset_id: 'ast-16', action: 'assigned', performed_by: 'Marcus Webb', details: 'Assigned to Thomas Bennett', created_at: '2026-07-08T10:00:00Z' },
  { id: 'al-3', asset_id: 'ast-15', action: 'created', performed_by: 'Marcus Webb', details: 'Asset "Wireless Access Point" created', created_at: '2026-07-03T09:00:00Z' },
  { id: 'al-4', asset_id: 'ast-7', action: 'maintenance_added', performed_by: 'Marcus Webb', details: 'corrective maintenance: Drum bearing noise', created_at: '2026-07-02T09:30:00Z' },
  { id: 'al-5', asset_id: 'ast-11', action: 'status_changed', performed_by: 'Marcus Webb', details: 'Status set to damaged', created_at: '2026-06-28T14:00:00Z' },
];
