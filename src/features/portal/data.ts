import type {
  TenantPortalUser, TenantUnit, PortalAsset, MaintenanceTicket,
  PortalPayment, PortalDocument, Notice, VisitorPass, Parcel,
  UtilityMonth, Conversation, CommunityEvent, FAQ,
} from './types';

// ── Demo credentials ──────────────────────────────────────────────────────────
export const DEMO_CREDENTIALS: Record<string, { password: string; userId: string }> = {
  'tenant1@demo.com':  { password: 'password123', userId: 'tenant-1' },
  'tenant2@demo.com':  { password: 'password123', userId: 'tenant-2' },
  'manager@demo.com':  { password: 'password123', userId: 'manager-1' },
  'admin@demo.com':    { password: 'password123', userId: 'admin-1' },
};

export const PORTAL_USERS: TenantPortalUser[] = [
  {
    id: 'tenant-1', name: 'James Thornton', email: 'tenant1@demo.com',
    phone: '+44 7700 900123', unitId: 'unit-1', propertyId: 'prop-1',
    role: 'tenant', joinedAt: '2024-01-10',
  },
  {
    id: 'tenant-2', name: 'Emily Chang', email: 'tenant2@demo.com',
    phone: '+44 7700 900456', unitId: 'unit-2', propertyId: 'prop-2',
    role: 'tenant', joinedAt: '2023-11-02',
  },
  {
    id: 'manager-1', name: 'Sarah Mitchell', email: 'manager@demo.com',
    phone: '+44 7700 900789', unitId: '', propertyId: '',
    role: 'manager', joinedAt: '2022-06-01',
  },
  {
    id: 'admin-1', name: 'Admin User', email: 'admin@demo.com',
    phone: '+44 7700 900000', unitId: '', propertyId: '',
    role: 'admin', joinedAt: '2021-01-01',
  },
];

// ── Units ─────────────────────────────────────────────────────────────────────
export const TENANT_UNITS: TenantUnit[] = [
  {
    id: 'unit-1', tenantId: 'tenant-1', unitNumber: 'Room 1', floor: 'Ground Floor',
    building: 'Main Building', propertyId: 'prop-1', propertyName: 'Maple House',
    propertyAddress: '14 Maple Avenue', city: 'Manchester', postcode: 'M4 1AB',
    bedrooms: 1, bathrooms: 1, areaSqft: 285, parking: 'Bay 3 - Accessible',
    storage: 'Locker 12', moveInDate: '2024-01-10', leaseStart: '2026-01-01',
    leaseEnd: '2026-12-31', deposit: 1700.00, rentAmount: 850.00,
    rentDueDay: 1, outstandingBalance: 0,
    landlordName: 'NorthBridge Housing Ltd', landlordPhone: '0161 555 0100',
    landlordEmail: 'landlord@northbridge.org', managerName: 'Sarah Mitchell',
    managerPhone: '0161 555 0101', managerEmail: 'sarah.mitchell@northbridge.org',
    emergencyPhone: '0161 555 0199',
    amenities: ['On-site Laundry', 'Garden', 'Communal Lounge', 'Bike Storage', 'CCTV', 'Key Fob Entry', 'Broadband Included', 'Weekly Cleaning'],
    leaseStatus: 'active',
    photos: [],
    features: ['Double Bed', 'En-suite Wet Room', 'Built-in Wardrobe', 'Smart TV', 'Mini Fridge', 'Desk & Chair', 'Heating Controls'],
  },
  {
    id: 'unit-2', tenantId: 'tenant-2', unitNumber: 'Unit 5', floor: 'Ground Floor',
    building: 'Main Building', propertyId: 'prop-2', propertyName: 'Birch Court',
    propertyAddress: '8 Birch Lane', city: 'Manchester', postcode: 'M14 5XB',
    bedrooms: 1, bathrooms: 1, areaSqft: 310, parking: 'Bay 7',
    storage: 'Locker 5', moveInDate: '2023-11-02', leaseStart: '2025-08-15',
    leaseEnd: '2026-08-15', deposit: 1590.00, rentAmount: 795.00,
    rentDueDay: 1, outstandingBalance: 150.00,
    landlordName: 'NorthBridge Housing Ltd', landlordPhone: '0161 555 0100',
    landlordEmail: 'landlord@northbridge.org', managerName: 'Sarah Mitchell',
    managerPhone: '0161 555 0101', managerEmail: 'sarah.mitchell@northbridge.org',
    emergencyPhone: '0161 555 0199',
    amenities: ['On-site Laundry', 'Garden', 'Communal Lounge', 'CCTV', 'Key Fob Entry', 'Broadband Included'],
    leaseStatus: 'expiring_soon',
    photos: [],
    features: ['Double Bed', 'Shower Room', 'Built-in Wardrobe', 'TV Point', 'Fridge', 'Desk', 'Heating Controls'],
  },
];

// ── Assets ────────────────────────────────────────────────────────────────────
export const PORTAL_ASSETS: PortalAsset[] = [
  {
    id: 'pa-01', tenantId: 'tenant-1', assetCode: 'AST-0003', name: 'Adjustable Care Bed',
    category: 'Furniture', categoryIcon: 'bed-double', description: 'Electrically adjustable profiling care bed',
    model: 'Profiling Bed Pro', manufacturer: 'Drive Medical', serialNumber: 'CB-2024-004',
    condition: 'excellent', warrantyExpiry: '2027-01-10', installationDate: '2024-01-10',
    status: 'working', lastService: '2026-04-10', nextService: '2026-07-10',
    qrCode: 'AST-0003', color: 'blue',
  },
  {
    id: 'pa-02', tenantId: 'tenant-1', assetCode: 'AST-0011', name: '65" Smart TV',
    category: 'Electronics', categoryIcon: 'tv', description: 'Samsung 65" 4K QLED Smart TV',
    model: 'QE65Q80CATXXU', manufacturer: 'Samsung', serialNumber: 'TV-23-0012',
    condition: 'good', warrantyExpiry: '2026-05-12', installationDate: '2023-05-12',
    status: 'working', lastService: '2025-12-01', nextService: '2026-12-01',
    qrCode: 'AST-0011', color: 'slate',
  },
  {
    id: 'pa-03', tenantId: 'tenant-1', assetCode: 'AST-0015', name: 'Wi-Fi Router',
    category: 'Networking', categoryIcon: 'wifi', description: 'BT Business Hub 6 for whole-building coverage',
    model: 'Business Hub 6', manufacturer: 'BT', serialNumber: 'RTR-22-001',
    condition: 'good', warrantyExpiry: '2025-10-05', installationDate: '2022-10-05',
    status: 'working', qrCode: 'AST-0015', color: 'violet',
  },
  {
    id: 'pa-04', tenantId: 'tenant-1', assetCode: 'AST-0028', name: 'Ceiling Track Hoist',
    category: 'Care Equipment', categoryIcon: 'accessibility', description: 'Arjo Maxi Sky 2 Plus ceiling hoist',
    model: 'Maxi Sky 2 Plus', manufacturer: 'Arjo', serialNumber: 'MH-24-001',
    condition: 'excellent', warrantyExpiry: '2027-01-10', installationDate: '2024-01-10',
    status: 'working', lastService: '2026-01-15', nextService: '2026-07-15',
    qrCode: 'AST-0028', color: 'emerald',
  },
  {
    id: 'pa-05', tenantId: 'tenant-1', assetCode: 'AST-0001', name: 'Adjustable Desk',
    category: 'Furniture', categoryIcon: 'layout-panel-top', description: 'Height-adjustable study desk',
    model: 'Classic Double', manufacturer: 'Argos', serialNumber: 'BF-23001',
    condition: 'good', installationDate: '2024-01-10',
    status: 'working', qrCode: 'AST-0001', color: 'amber',
  },
  {
    id: 'pa-06', tenantId: 'tenant-1', assetCode: 'PA-R01-006', name: 'Smoke Detector',
    category: 'Safety', categoryIcon: 'bell-ring', description: 'Interconnected smoke detector',
    model: 'Optical LD1', manufacturer: 'Kidde', serialNumber: 'SD-R01-001',
    condition: 'excellent', warrantyExpiry: '2028-03-01', installationDate: '2024-01-10',
    status: 'working', nextService: '2026-12-01',
    qrCode: 'PA-R01-006', color: 'rose',
  },
  // Emily's assets
  {
    id: 'pa-07', tenantId: 'tenant-2', assetCode: 'AST-0008', name: 'Washing Machine',
    category: 'Kitchen Appliances', categoryIcon: 'washing-machine', description: 'Samsung front-loading washing machine',
    model: 'WW90T634DHH', manufacturer: 'Samsung', serialNumber: 'WM-22-0055',
    condition: 'good', warrantyExpiry: '2025-08-30', installationDate: '2022-08-30',
    status: 'working', qrCode: 'AST-0008', color: 'sky',
  },
  {
    id: 'pa-08', tenantId: 'tenant-2', assetCode: 'AST-0029', name: 'Wheelchair',
    category: 'Care Equipment', categoryIcon: 'accessibility', description: 'Drive Medical Enigma Lite transport wheelchair',
    model: 'Enigma Lite', manufacturer: 'Drive Medical', serialNumber: 'WC-23-001',
    condition: 'good', warrantyExpiry: '2026-11-02', installationDate: '2023-11-02',
    status: 'working', qrCode: 'AST-0029', color: 'indigo',
  },
  {
    id: 'pa-09', tenantId: 'tenant-2', assetCode: 'PA-U5-003', name: 'Electric Hob',
    category: 'Kitchen Appliances', categoryIcon: 'flame', description: '4-ring electric ceramic hob',
    model: 'CEI6P21X', manufacturer: 'Smeg', serialNumber: 'EH-U5-001',
    condition: 'good', warrantyExpiry: '2026-11-15', installationDate: '2023-11-02',
    status: 'working', qrCode: 'PA-U5-003', color: 'orange',
  },
  {
    id: 'pa-10', tenantId: 'tenant-2', assetCode: 'PA-U5-004', name: 'Refrigerator',
    category: 'Kitchen Appliances', categoryIcon: 'thermometer', description: 'Under-counter fridge',
    model: 'HRZ336BSAA', manufacturer: 'Haier', serialNumber: 'RF-U5-001',
    condition: 'fair', warrantyExpiry: '2025-11-02', installationDate: '2023-11-02',
    status: 'needs_service', nextService: '2026-09-01',
    qrCode: 'PA-U5-004', color: 'teal',
  },
];

// ── Maintenance Tickets ───────────────────────────────────────────────────────
export const MAINTENANCE_TICKETS: MaintenanceTicket[] = [
  {
    id: 'tkt-001', tenantId: 'tenant-1', ticketNumber: 'TKT-2026-0041',
    title: 'Bathroom radiator not heating up', description: 'The radiator in my bathroom has stopped working. The pipes are warm but the radiator stays cold.',
    category: 'plumbing', priority: 'medium', status: 'in_progress',
    location: 'Bathroom', relatedAssetId: undefined, relatedAssetName: undefined,
    createdAt: '2026-06-28T09:30:00Z', updatedAt: '2026-07-02T11:00:00Z',
    assignedTo: 'Tom Harris (Plumber)', estimatedResolution: '2026-07-15',
    updates: [
      { id: 'u1', author: 'James Thornton', authorRole: 'tenant', message: 'The bathroom radiator has completely stopped heating. Both valves are open.', timestamp: '2026-06-28T09:30:00Z' },
      { id: 'u2', author: 'Sarah Mitchell', authorRole: 'staff', message: 'Thanks James, we\'ve logged this as medium priority. A plumber will be with you by 2nd July.', timestamp: '2026-06-28T10:15:00Z' },
      { id: 'u3', author: 'Tom Harris', authorRole: 'technician', message: 'Visited and diagnosed a faulty thermostatic valve. Parts ordered. Will return to fit within 5 working days.', timestamp: '2026-07-02T11:00:00Z' },
    ],
  },
  {
    id: 'tkt-002', tenantId: 'tenant-1', ticketNumber: 'TKT-2026-0018',
    title: 'Bedroom light flickers intermittently', description: 'The ceiling light in my bedroom flickers every few minutes. Could be a loose connection.',
    category: 'electrical', priority: 'low', status: 'resolved',
    location: 'Bedroom', createdAt: '2026-05-14T14:00:00Z', updatedAt: '2026-05-20T16:30:00Z',
    resolvedAt: '2026-05-20T16:30:00Z', assignedTo: 'Paul Evans (Electrician)',
    estimatedResolution: '2026-05-20',
    updates: [
      { id: 'u4', author: 'James Thornton', authorRole: 'tenant', message: 'The bedroom ceiling light flickers randomly for about 30 seconds then stops.', timestamp: '2026-05-14T14:00:00Z' },
      { id: 'u5', author: 'Sarah Mitchell', authorRole: 'staff', message: 'Scheduled for Paul Evans on 20th May.', timestamp: '2026-05-15T09:00:00Z' },
      { id: 'u6', author: 'Paul Evans', authorRole: 'technician', message: 'Fixed a loose connection in the ceiling rose. All working normally.', timestamp: '2026-05-20T16:30:00Z' },
    ],
    rating: 5, feedback: 'Quick and professional repair. Very happy with the service.',
  },
  {
    id: 'tkt-003', tenantId: 'tenant-1', ticketNumber: 'TKT-2026-0052',
    title: 'Door hinge squeaking loudly', description: 'The hinge on my room door has started squeaking very loudly whenever I open or close it.',
    category: 'maintenance', priority: 'low', status: 'submitted',
    location: 'Room Door', createdAt: '2026-07-07T18:00:00Z', updatedAt: '2026-07-07T18:00:00Z',
    updates: [
      { id: 'u7', author: 'James Thornton', authorRole: 'tenant', message: 'The door squeaks very loudly, particularly at night. Please could someone oil the hinge?', timestamp: '2026-07-07T18:00:00Z' },
    ],
  },
  {
    id: 'tkt-004', tenantId: 'tenant-2', ticketNumber: 'TKT-2026-0044',
    title: 'Kitchen tap dripping', description: 'The cold water kitchen tap has been dripping constantly for about a week now.',
    category: 'plumbing', priority: 'medium', status: 'assigned',
    location: 'Kitchen', createdAt: '2026-07-01T10:00:00Z', updatedAt: '2026-07-03T09:00:00Z',
    assignedTo: 'Tom Harris (Plumber)', estimatedResolution: '2026-07-12',
    updates: [
      { id: 'u8', author: 'Emily Chang', authorRole: 'tenant', message: 'Kitchen tap has been dripping for a week. Washer needs replacing.', timestamp: '2026-07-01T10:00:00Z' },
      { id: 'u9', author: 'Sarah Mitchell', authorRole: 'staff', message: 'Acknowledged. Assigned to Tom Harris who will visit on 12th July between 10am–12pm.', timestamp: '2026-07-03T09:00:00Z' },
    ],
  },
  {
    id: 'tkt-005', tenantId: 'tenant-2', ticketNumber: 'TKT-2025-0098',
    title: 'Wi-Fi router not working', description: 'Internet went down completely. Router shows no broadband light.',
    category: 'internet', priority: 'high', status: 'closed',
    location: 'Living Area', createdAt: '2025-11-10T08:00:00Z', updatedAt: '2025-11-11T15:00:00Z',
    resolvedAt: '2025-11-11T15:00:00Z', assignedTo: 'IT Support',
    updates: [
      { id: 'u10', author: 'Emily Chang', authorRole: 'tenant', message: 'No internet since this morning. Router shows solid red light on broadband.', timestamp: '2025-11-10T08:00:00Z' },
      { id: 'u11', author: 'Sarah Mitchell', authorRole: 'staff', message: 'ISP fault in the area. Should be resolved by end of day.', timestamp: '2025-11-10T11:00:00Z' },
      { id: 'u12', author: 'Sarah Mitchell', authorRole: 'staff', message: 'ISP has resolved the fault. Please let us know if the issue persists.', timestamp: '2025-11-11T15:00:00Z' },
    ],
    rating: 4, feedback: 'Good communication throughout.',
  },
];

// ── Payments ──────────────────────────────────────────────────────────────────
export const PORTAL_PAYMENTS: PortalPayment[] = [
  // Tenant 1 - James (no arrears)
  { id: 'pay-001', tenantId: 'tenant-1', type: 'rent', description: 'Monthly Rent - July 2026', amount: 850.00, dueDate: '2026-07-01', paidDate: '2026-07-01', status: 'paid', method: 'direct_debit', reference: 'REF-2026-07', invoiceNumber: 'INV-2026-07' },
  { id: 'pay-002', tenantId: 'tenant-1', type: 'rent', description: 'Monthly Rent - June 2026', amount: 850.00, dueDate: '2026-06-01', paidDate: '2026-06-01', status: 'paid', method: 'direct_debit', reference: 'REF-2026-06', invoiceNumber: 'INV-2026-06' },
  { id: 'pay-003', tenantId: 'tenant-1', type: 'rent', description: 'Monthly Rent - May 2026', amount: 850.00, dueDate: '2026-05-01', paidDate: '2026-05-01', status: 'paid', method: 'direct_debit', reference: 'REF-2026-05', invoiceNumber: 'INV-2026-05' },
  { id: 'pay-004', tenantId: 'tenant-1', type: 'rent', description: 'Monthly Rent - April 2026', amount: 850.00, dueDate: '2026-04-01', paidDate: '2026-04-01', status: 'paid', method: 'direct_debit', reference: 'REF-2026-04', invoiceNumber: 'INV-2026-04' },
  { id: 'pay-005', tenantId: 'tenant-1', type: 'rent', description: 'Monthly Rent - March 2026', amount: 850.00, dueDate: '2026-03-01', paidDate: '2026-03-01', status: 'paid', method: 'direct_debit', reference: 'REF-2026-03', invoiceNumber: 'INV-2026-03' },
  { id: 'pay-006', tenantId: 'tenant-1', type: 'rent', description: 'Monthly Rent - August 2026', amount: 850.00, dueDate: '2026-08-01', status: 'upcoming' },
  { id: 'pay-007', tenantId: 'tenant-1', type: 'utility', description: 'Utility Bill - Q2 2026', amount: 45.50, dueDate: '2026-07-15', status: 'pending', invoiceNumber: 'UTL-2026-Q2' },
  // Tenant 2 - Emily (has outstanding balance)
  { id: 'pay-101', tenantId: 'tenant-2', type: 'rent', description: 'Monthly Rent - July 2026', amount: 795.00, dueDate: '2026-07-01', status: 'overdue', invoiceNumber: 'INV-E-2026-07' },
  { id: 'pay-102', tenantId: 'tenant-2', type: 'rent', description: 'Monthly Rent - June 2026', amount: 795.00, dueDate: '2026-06-01', paidDate: '2026-06-03', status: 'paid', method: 'bank_transfer', reference: 'REF-E-2026-06', invoiceNumber: 'INV-E-2026-06' },
  { id: 'pay-103', tenantId: 'tenant-2', type: 'rent', description: 'Monthly Rent - May 2026', amount: 795.00, dueDate: '2026-05-01', paidDate: '2026-05-01', status: 'paid', method: 'direct_debit', reference: 'REF-E-2026-05', invoiceNumber: 'INV-E-2026-05' },
  { id: 'pay-104', tenantId: 'tenant-2', type: 'rent', description: 'Monthly Rent - April 2026', amount: 795.00, dueDate: '2026-04-01', paidDate: '2026-04-01', status: 'paid', method: 'direct_debit', reference: 'REF-E-2026-04', invoiceNumber: 'INV-E-2026-04' },
  { id: 'pay-105', tenantId: 'tenant-2', type: 'late_fee', description: 'Late Payment Fee - July 2026', amount: 25.00, dueDate: '2026-07-10', status: 'overdue', invoiceNumber: 'LF-E-2026-07' },
  { id: 'pay-106', tenantId: 'tenant-2', type: 'rent', description: 'Monthly Rent - August 2026', amount: 795.00, dueDate: '2026-08-01', status: 'upcoming' },
];

// ── Documents ─────────────────────────────────────────────────────────────────
export const PORTAL_DOCUMENTS: PortalDocument[] = [
  { id: 'doc-001', tenantId: 'tenant-1', name: 'Tenancy Agreement 2024–2025', type: 'Tenancy Agreement', category: 'lease', uploadedAt: '2024-01-10', expiryDate: '2025-12-31', fileSize: '245 KB', fileType: 'pdf', status: 'current', signatureRequired: true, signed: true, version: 1, description: 'Assured Shorthold Tenancy Agreement for Room 1, Maple House' },
  { id: 'doc-002', tenantId: 'tenant-1', name: 'Tenancy Agreement 2025–2026 (Renewal)', type: 'Tenancy Agreement', category: 'lease', uploadedAt: '2025-11-20', expiryDate: '2026-12-31', fileSize: '248 KB', fileType: 'pdf', status: 'pending_signature', signatureRequired: true, signed: false, version: 2, description: 'Renewal agreement for 2026. Please sign by 31 January 2026.' },
  { id: 'doc-003', tenantId: 'tenant-1', name: 'Move-in Inspection Checklist', type: 'Inspection', category: 'checklist', uploadedAt: '2024-01-10', fileSize: '180 KB', fileType: 'pdf', status: 'signed', signatureRequired: true, signed: true, version: 1, description: 'Room condition report signed at move-in' },
  { id: 'doc-004', tenantId: 'tenant-1', name: 'Asset Handover Certificate', type: 'Certificate', category: 'certificate', uploadedAt: '2024-01-10', fileSize: '120 KB', fileType: 'pdf', status: 'current', signatureRequired: true, signed: true, version: 1, description: 'Assets assigned to you at move-in' },
  { id: 'doc-005', tenantId: 'tenant-1', name: 'House Rules & Policies', type: 'Policy', category: 'policy', uploadedAt: '2024-01-10', fileSize: '95 KB', fileType: 'pdf', status: 'current', signatureRequired: false, signed: false, version: 3 },
  { id: 'doc-006', tenantId: 'tenant-1', name: 'Ceiling Hoist User Manual', type: 'Manual', category: 'manual', uploadedAt: '2024-01-15', fileSize: '2.4 MB', fileType: 'pdf', status: 'current', signatureRequired: false, signed: false, version: 1 },
  { id: 'doc-007', tenantId: 'tenant-1', name: 'July 2026 Rent Invoice', type: 'Invoice', category: 'invoice', uploadedAt: '2026-07-01', fileSize: '85 KB', fileType: 'pdf', status: 'current', signatureRequired: false, signed: false, version: 1 },
  // Tenant 2
  { id: 'doc-101', tenantId: 'tenant-2', name: 'Tenancy Agreement 2023–2025', type: 'Tenancy Agreement', category: 'lease', uploadedAt: '2023-11-02', expiryDate: '2025-10-31', fileSize: '242 KB', fileType: 'pdf', status: 'expiring_soon', signatureRequired: true, signed: true, version: 1 },
  { id: 'doc-102', tenantId: 'tenant-2', name: 'Move-in Inspection Checklist', type: 'Inspection', category: 'checklist', uploadedAt: '2023-11-02', fileSize: '165 KB', fileType: 'pdf', status: 'signed', signatureRequired: true, signed: true, version: 1 },
  { id: 'doc-103', tenantId: 'tenant-2', name: 'House Rules & Policies', type: 'Policy', category: 'policy', uploadedAt: '2023-11-02', fileSize: '95 KB', fileType: 'pdf', status: 'current', signatureRequired: false, signed: false, version: 3 },
  { id: 'doc-104', tenantId: 'tenant-2', name: 'July 2026 Rent Invoice', type: 'Invoice', category: 'invoice', uploadedAt: '2026-07-01', fileSize: '85 KB', fileType: 'pdf', status: 'current', signatureRequired: false, signed: false, version: 1, description: 'OVERDUE - payment required immediately' },
];

// ── Notices ───────────────────────────────────────────────────────────────────
export const NOTICES: Notice[] = [
  { id: 'ntc-001', title: 'Planned Water Shutdown – 14 July 2026', content: 'The mains water supply to all properties will be shut off on Monday 14th July between 9am and 1pm for essential pipe maintenance. Please ensure you store adequate water in advance. We apologise for any inconvenience.', type: 'utility_shutdown', priority: 'urgent', publishedAt: '2026-07-07T08:00:00Z', expiresAt: '2026-07-15T00:00:00Z', isPinned: true, readBy: ['tenant-2'], author: 'Sarah Mitchell', authorRole: 'Property Manager', tags: ['water', 'utilities', 'planned'] },
  { id: 'ntc-002', title: 'Summer BBQ – Saturday 19 July', content: 'Join us for our annual summer BBQ in the Maple House garden on Saturday 19th July from 2pm to 6pm! Food, drinks, and great company. Bring your own chair if you have one. RSVP to Sarah by 16th July.', type: 'event', priority: 'normal', publishedAt: '2026-07-05T10:00:00Z', expiresAt: '2026-07-20T00:00:00Z', isPinned: true, readBy: ['tenant-1', 'tenant-2'], author: 'Sarah Mitchell', authorRole: 'Property Manager', tags: ['social', 'event'] },
  { id: 'ntc-003', title: 'Fire Alarm Test – Wednesday 10 July', content: 'The monthly fire alarm test will take place on Wednesday 10th July at 10:00am. The alarm will sound for approximately 2 minutes. Please do not call emergency services during this time.', type: 'maintenance', priority: 'high', publishedAt: '2026-07-04T09:00:00Z', expiresAt: '2026-07-11T00:00:00Z', isPinned: false, readBy: ['tenant-1'], author: 'Sarah Mitchell', authorRole: 'Property Manager', tags: ['fire safety', 'test'] },
  { id: 'ntc-004', title: 'Updated Visitor Policy from 1 August', content: 'From 1st August 2026 all visitors must register using the Visitor Pass feature in this app before arriving. Drive-in visitors must also pre-register their vehicle. Full details are in the updated House Rules document.', type: 'rules', priority: 'normal', publishedAt: '2026-07-01T09:00:00Z', isPinned: false, readBy: [], author: 'NorthBridge Management', authorRole: 'Administration', tags: ['policy', 'visitors'] },
  { id: 'ntc-005', title: 'Car Park Resurfacing – 22–23 July', content: 'The car park at Maple House will be resurfaced on 22nd and 23rd July. All vehicles must be moved by 7am on 22nd. Temporary parking is available on Maple Avenue side road. Please contact Sarah if you need accessible parking assistance.', type: 'maintenance', priority: 'high', publishedAt: '2026-07-03T11:00:00Z', expiresAt: '2026-07-24T00:00:00Z', isPinned: false, readBy: ['tenant-1', 'tenant-2'], author: 'Sarah Mitchell', authorRole: 'Property Manager', tags: ['parking', 'maintenance'] },
  { id: 'ntc-006', title: 'New Communal Lounge Furniture Installed', content: 'We\'ve replaced all the communal lounge furniture with brand-new comfortable seating and a new smart TV. Come and enjoy the new space! Your feedback on the room helped shape our choices – thank you!', type: 'news', priority: 'normal', publishedAt: '2026-06-28T14:00:00Z', isPinned: false, readBy: ['tenant-1', 'tenant-2'], author: 'Sarah Mitchell', authorRole: 'Property Manager', tags: ['improvements'] },
  { id: 'ntc-007', title: 'Emergency: Gas Leak Investigation (Resolved)', content: 'RESOLVED: A suspected gas smell near the boiler room was investigated on 5th June and confirmed safe. No action is required from residents. As a precaution the boiler was shut off for 3 hours. We apologise for any disruption.', type: 'emergency', priority: 'urgent', publishedAt: '2026-06-05T16:00:00Z', isPinned: false, readBy: ['tenant-1', 'tenant-2'], author: 'NorthBridge Emergency', authorRole: 'Emergency Response', tags: ['gas', 'safety', 'resolved'] },
  { id: 'ntc-008', title: 'Rent Review – No Increase for 2026', content: 'Following our annual rent review, we are pleased to confirm that rent will remain unchanged for all current tenancies through to December 2026. We appreciate your continued residency with NorthBridge.', type: 'general', priority: 'normal', publishedAt: '2026-05-15T09:00:00Z', isPinned: false, readBy: ['tenant-1', 'tenant-2'], author: 'NorthBridge Management', authorRole: 'Finance', tags: ['rent', 'finance'] },
];

// ── Visitor Passes ────────────────────────────────────────────────────────────
export const VISITOR_PASSES: VisitorPass[] = [
  { id: 'vis-001', tenantId: 'tenant-1', visitorName: 'Dr. Alice Roberts', visitorPhone: '07700 555001', visitDate: '2026-07-12', visitTime: '10:00', visitEndTime: '11:30', purpose: 'Medical appointment', parkingSlot: 'Bay 3', status: 'approved', qrCode: 'VIS-001-QR', createdAt: '2026-07-08T10:00:00Z', notes: 'Please buzz Flat 1 on arrival' },
  { id: 'vis-002', tenantId: 'tenant-1', visitorName: 'Michael Thornton', visitorPhone: '07700 555002', visitDate: '2026-07-14', visitTime: '14:00', visitEndTime: '17:00', purpose: 'Family visit', vehicleReg: 'MN23 XYZ', parkingSlot: 'Bay 3', status: 'approved', qrCode: 'VIS-002-QR', createdAt: '2026-07-08T14:00:00Z' },
  { id: 'vis-003', tenantId: 'tenant-1', visitorName: 'CareFirst Nurse', visitDate: '2026-07-09', visitTime: '09:30', visitEndTime: '10:30', purpose: 'Weekly care visit', status: 'checked_in', qrCode: 'VIS-003-QR', createdAt: '2026-07-06T08:00:00Z' },
  { id: 'vis-004', tenantId: 'tenant-2', visitorName: 'Mia Chang', visitorPhone: '07700 555003', visitDate: '2026-07-13', visitTime: '11:00', purpose: 'Sister visit', status: 'pending', qrCode: 'VIS-004-QR', createdAt: '2026-07-09T09:00:00Z' },
];

// ── Parcels ────────────────────────────────────────────────────────────────────
export const PARCELS: Parcel[] = [
  { id: 'prc-001', tenantId: 'tenant-1', trackingNumber: 'JD123456789GB', courier: 'Royal Mail', description: 'Amazon parcel (medium box)', weight: '1.2 kg', sender: 'Amazon UK', receivedAt: '2026-07-08T10:30:00Z', status: 'pending_collection', notificationSent: true, collectionCode: 'RC-4821', location: 'Reception desk', notes: 'Ring bell for reception' },
  { id: 'prc-002', tenantId: 'tenant-1', trackingNumber: 'DPD7890123456', courier: 'DPD', description: 'Medical supplies – fragile', weight: '0.8 kg', sender: 'Lloyds Pharmacy', receivedAt: '2026-07-05T14:00:00Z', collectedAt: '2026-07-06T11:00:00Z', status: 'collected', notificationSent: true, collectionCode: 'RC-4755', location: 'Reception desk' },
  { id: 'prc-003', tenantId: 'tenant-2', trackingNumber: 'EVRI-987654321', courier: 'Evri', description: 'Clothing order', sender: 'ASOS', receivedAt: '2026-07-07T16:00:00Z', status: 'pending_collection', notificationSent: true, collectionCode: 'RC-4812', location: 'Birch Court reception' },
];

// ── Utility Usage ─────────────────────────────────────────────────────────────
export const UTILITY_DATA: Record<string, UtilityMonth[]> = {
  'tenant-1': [
    { month: 'Jan 2026', electricity: 290, water: 4.2, gas: 38, electricityCost: 78.30, waterCost: 8.40, gasCost: 51.30, total: 138.00 },
    { month: 'Feb 2026', electricity: 270, water: 3.9, gas: 35, electricityCost: 72.90, waterCost: 7.80, gasCost: 47.25, total: 127.95 },
    { month: 'Mar 2026', electricity: 240, water: 3.8, gas: 28, electricityCost: 64.80, waterCost: 7.60, gasCost: 37.80, total: 110.20 },
    { month: 'Apr 2026', electricity: 210, water: 3.6, gas: 18, electricityCost: 56.70, waterCost: 7.20, gasCost: 24.30, total: 88.20 },
    { month: 'May 2026', electricity: 195, water: 3.7, gas: 10, electricityCost: 52.65, waterCost: 7.40, gasCost: 13.50, total: 73.55 },
    { month: 'Jun 2026', electricity: 180, water: 4.0, gas: 5, electricityCost: 48.60, waterCost: 8.00, gasCost: 6.75, total: 63.35 },
  ],
  'tenant-2': [
    { month: 'Jan 2026', electricity: 310, water: 5.1, gas: 42, electricityCost: 83.70, waterCost: 10.20, gasCost: 56.70, total: 150.60 },
    { month: 'Feb 2026', electricity: 285, water: 4.8, gas: 38, electricityCost: 76.95, waterCost: 9.60, gasCost: 51.30, total: 137.85 },
    { month: 'Mar 2026', electricity: 260, water: 4.6, gas: 31, electricityCost: 70.20, waterCost: 9.20, gasCost: 41.85, total: 121.25 },
    { month: 'Apr 2026', electricity: 230, water: 4.4, gas: 20, electricityCost: 62.10, waterCost: 8.80, gasCost: 27.00, total: 97.90 },
    { month: 'May 2026', electricity: 210, water: 4.5, gas: 12, electricityCost: 56.70, waterCost: 9.00, gasCost: 16.20, total: 81.90 },
    { month: 'Jun 2026', electricity: 198, water: 4.8, gas: 6, electricityCost: 53.46, waterCost: 9.60, gasCost: 8.10, total: 71.16 },
  ],
};

// ── Messages ──────────────────────────────────────────────────────────────────
export const CONVERSATIONS: Conversation[] = [
  {
    id: 'conv-001', tenantId: 'tenant-1', recipientName: 'Sarah Mitchell', recipientRole: 'manager',
    subject: 'Radiator repair update',
    messages: [
      { id: 'm1', conversationId: 'conv-001', senderName: 'James Thornton', senderRole: 'tenant', content: 'Hi Sarah, just wanted to follow up on the bathroom radiator. Is there any update on when Tom will return?', timestamp: '2026-07-07T14:00:00Z', read: true, isOwn: true },
      { id: 'm2', conversationId: 'conv-001', senderName: 'Sarah Mitchell', senderRole: 'manager', content: 'Hi James! Tom has confirmed he\'ll be with you on Tuesday 15th July between 10am and noon. Parts have arrived. We\'ll send you a reminder the day before.', timestamp: '2026-07-07T15:30:00Z', read: true },
      { id: 'm3', conversationId: 'conv-001', senderName: 'James Thornton', senderRole: 'tenant', content: 'That\'s great, thanks Sarah! I\'ll make sure I\'m in on Tuesday morning.', timestamp: '2026-07-07T16:00:00Z', read: true, isOwn: true },
    ],
    lastMessage: 'That\'s great, thanks Sarah! I\'ll make sure I\'m in on Tuesday morning.',
    lastMessageTime: '2026-07-07T16:00:00Z', unreadCount: 0, isArchived: false,
  },
  {
    id: 'conv-002', tenantId: 'tenant-1', recipientName: 'Sarah Mitchell', recipientRole: 'manager',
    subject: 'Tenancy renewal query',
    messages: [
      { id: 'm4', conversationId: 'conv-002', senderName: 'Sarah Mitchell', senderRole: 'manager', content: 'Dear James, please remember to sign your tenancy renewal document. It\'s available in the Documents section and needs to be signed before 31 January 2026.', timestamp: '2026-07-01T09:00:00Z', read: false },
    ],
    lastMessage: 'Dear James, please remember to sign your tenancy renewal document.',
    lastMessageTime: '2026-07-01T09:00:00Z', unreadCount: 1, isArchived: false,
  },
  {
    id: 'conv-003', tenantId: 'tenant-2', recipientName: 'Sarah Mitchell', recipientRole: 'manager',
    subject: 'July rent payment',
    messages: [
      { id: 'm5', conversationId: 'conv-003', senderName: 'Sarah Mitchell', senderRole: 'manager', content: 'Hi Emily, we notice your July rent payment hasn\'t come through yet. Could you let us know when you\'re able to pay? A late fee of £25 has been applied.', timestamp: '2026-07-05T10:00:00Z', read: false },
      { id: 'm6', conversationId: 'conv-003', senderName: 'Emily Chang', senderRole: 'tenant', content: 'Hi Sarah, I\'m really sorry about the late payment. I\'ll arrange the bank transfer this week. My benefits payment was delayed.', timestamp: '2026-07-06T12:00:00Z', read: true, isOwn: true },
      { id: 'm7', conversationId: 'conv-003', senderName: 'Sarah Mitchell', senderRole: 'manager', content: 'Thank you for letting us know Emily. Please pay as soon as possible. If you\'re having financial difficulties please speak to us and we can discuss support options.', timestamp: '2026-07-06T14:00:00Z', read: false },
    ],
    lastMessage: 'Thank you for letting us know Emily. Please pay as soon as possible.',
    lastMessageTime: '2026-07-06T14:00:00Z', unreadCount: 1, isArchived: false,
  },
];

// ── Community Events ──────────────────────────────────────────────────────────
export const COMMUNITY_EVENTS: CommunityEvent[] = [
  { id: 'evt-001', title: 'Summer BBQ 🍖', description: 'Annual summer BBQ in the Maple House garden. Food, drinks, and great company provided.', date: '2026-07-19', time: '14:00 – 18:00', location: 'Maple House Garden', type: 'social', organizer: 'Sarah Mitchell', maxAttendees: 30, registeredCount: 12, isRegistered: true, imageColor: 'from-orange-400 to-rose-500' },
  { id: 'evt-002', title: 'Mindfulness & Yoga Class', description: 'Weekly mindfulness session with certified instructor. All abilities welcome.', date: '2026-07-16', time: '10:00 – 11:00', location: 'Communal Lounge, Maple House', type: 'class', organizer: 'CareFirst Wellness', maxAttendees: 8, registeredCount: 6, isRegistered: false, imageColor: 'from-purple-400 to-indigo-500' },
  { id: 'evt-003', title: 'Residents\' Meeting – Q3 2026', description: 'Quarterly residents\' meeting to discuss property updates, feedback, and planned improvements.', date: '2026-07-23', time: '18:00 – 19:30', location: 'Communal Lounge, Maple House', type: 'meeting', organizer: 'NorthBridge Management', registeredCount: 8, isRegistered: false, imageColor: 'from-blue-400 to-cyan-500' },
  { id: 'evt-004', title: 'Film Night: Summer Classics', description: 'Communal film screening in the lounge. Vote for your favourite film via the noticeboard.', date: '2026-07-25', time: '19:00', location: 'Communal Lounge, Maple House', type: 'social', organizer: 'Resident Committee', maxAttendees: 15, registeredCount: 7, isRegistered: true, imageColor: 'from-amber-400 to-yellow-500' },
];

// ── FAQs ──────────────────────────────────────────────────────────────────────
export const FAQS: FAQ[] = [
  { id: 'faq-001', question: 'How do I report a maintenance issue?', answer: 'Go to the Maintenance section and tap "New Request". Fill in the details and we\'ll get back to you within 24 hours.', category: 'Maintenance' },
  { id: 'faq-002', question: 'When is my rent due?', answer: 'Rent is due on the 1st of each month. You\'ll receive a reminder notification 5 days before.', category: 'Payments' },
  { id: 'faq-003', question: 'How do I add a visitor?', answer: 'Go to Visitors and tap "Create Pass". Fill in your visitor\'s details and they\'ll receive a QR code by SMS.', category: 'Visitors' },
  { id: 'faq-004', question: 'How do I collect a parcel?', answer: 'Check the Parcels section for your collection code. Bring the code to reception during staffed hours (8am–6pm weekdays).', category: 'Parcels' },
  { id: 'faq-005', question: 'How do I access the Wi-Fi?', answer: 'Broadband is included in your rent. Connect to the "NorthBridge-Residents" network. The password is on your welcome pack.', category: 'Internet' },
  { id: 'faq-006', question: 'Who do I contact in an emergency?', answer: 'Call the emergency number: 0161 555 0199. For fire or medical emergencies call 999 first.', category: 'Emergency' },
];

// ── Helper functions ───────────────────────────────────────────────────────────
export function getTenantData(userId: string) {
  const user = PORTAL_USERS.find(u => u.id === userId);
  const unit = TENANT_UNITS.find(u => u.tenantId === userId);
  const assets = PORTAL_ASSETS.filter(a => a.tenantId === userId);
  const tickets = MAINTENANCE_TICKETS.filter(t => t.tenantId === userId);
  const payments = PORTAL_PAYMENTS.filter(p => p.tenantId === userId);
  const documents = PORTAL_DOCUMENTS.filter(d => d.tenantId === userId);
  const visitors = VISITOR_PASSES.filter(v => v.tenantId === userId);
  const parcels = PARCELS.filter(p => p.tenantId === userId);
  const utilities = UTILITY_DATA[userId] ?? [];
  const conversations = CONVERSATIONS.filter(c => c.tenantId === userId);
  return { user, unit, assets, tickets, payments, documents, visitors, parcels, utilities, conversations };
}
