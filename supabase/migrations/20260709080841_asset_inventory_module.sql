/*
# Asset Inventory Management Module

## Summary
Creates all tables required for the Asset Inventory Management module in a property management
system. This module allows property owners/managers to track every physical asset inside a
property with full lifecycle management, QR codes, maintenance scheduling, and tenant assignments.

## New Tables

### asset_categories
Stores asset categories (Furniture, Electronics, HVAC, etc.).
- id: UUID primary key
- name: Category display name (e.g. "Furniture")
- icon: Lucide icon name for UI display
- color: Tailwind color string for UI theming
- description: Optional description
- created_at: Creation timestamp

### assets
Core asset table — every physical item tracked in the system.
- id: UUID primary key
- asset_code: Human-readable unique code (e.g. AST-0001)
- name: Asset display name
- category_id: FK → asset_categories
- subcategory: Optional text subcategory
- description: Detailed description
- property_name, building, floor, unit_number, room: Location hierarchy
- serial_number, manufacturer, brand, model: Identification fields
- purchase_date, installation_date: Date tracking
- supplier, vendor, invoice_number: Procurement info
- purchase_cost, current_value: Financial tracking (DECIMAL 12,2)
- depreciation_method: 'straight_line' | 'declining_balance' | 'none'
- warranty_expiry: Warranty end date
- useful_life_years: Expected useful life in years
- replacement_date: Projected replacement date
- condition: excellent | good | fair | poor | broken | needs_replacement
- status: available | installed | assigned | in_maintenance | out_of_service | disposed | lost | damaged | reserved | archived
- assigned_to: Current assignee name/reference
- qr_code: Unique QR code value (UUID-based)
- images: Text array of image URLs
- notes: Free-text notes
- custom_fields: JSONB for extensibility
- created_by, updated_by: Audit fields (text, not FK to avoid auth coupling)
- created_at, updated_at: Timestamps

### asset_maintenance
Maintenance records for each asset.
- id: UUID primary key
- asset_id: FK → assets (CASCADE delete)
- maintenance_type: preventive | corrective | emergency | warranty_service | inspection | cleaning | calibration
- scheduled_date, completed_date: Date tracking
- technician, vendor_name: Who performed the work
- description: What was done
- cost: Decimal cost
- parts_replaced: Text description of parts
- status: scheduled | in_progress | completed | overdue | cancelled
- next_due_date: When next maintenance is due
- photos: Text array of photo URLs
- notes: Additional notes
- created_at: Timestamp

### asset_assignments
Tracks which tenant/person an asset is assigned to, with full history.
- id: UUID primary key
- asset_id: FK → assets (CASCADE delete)
- assigned_to: Name of assignee
- property_name, unit_number: Where the assignment is
- assigned_date: When assigned
- returned_date: When returned (NULL = currently assigned)
- condition_on_assign: Condition when assigned
- condition_on_return: Condition when returned
- notes: Assignment notes
- created_at: Timestamp

### asset_logs
Immutable audit trail for every action on every asset.
- id: UUID primary key
- asset_id: FK → assets (CASCADE delete)
- action: Action taken (created, updated, status_changed, assigned, qr_generated, etc.)
- performed_by: Name of user who performed the action
- details: JSON or text details of what changed
- created_at: Timestamp (no updates allowed on audit log)

## Security
- RLS is enabled on all tables.
- All policies use TO anon, authenticated because this app uses a custom session-based
  auth system (not Supabase auth), so all requests arrive via the anon key.
- USING (true) / WITH CHECK (true) is intentional — data is shared within a single org context.
*/

-- ── asset_categories ─────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS asset_categories (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  icon        TEXT NOT NULL DEFAULT 'package',
  color       TEXT NOT NULL DEFAULT 'blue',
  description TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE asset_categories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_asset_categories" ON asset_categories;
CREATE POLICY "anon_select_asset_categories" ON asset_categories FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_asset_categories" ON asset_categories;
CREATE POLICY "anon_insert_asset_categories" ON asset_categories FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_asset_categories" ON asset_categories;
CREATE POLICY "anon_update_asset_categories" ON asset_categories FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_asset_categories" ON asset_categories;
CREATE POLICY "anon_delete_asset_categories" ON asset_categories FOR DELETE
  TO anon, authenticated USING (true);

-- Seed default categories
INSERT INTO asset_categories (name, icon, color, description) VALUES
  ('Furniture',           'sofa',           'amber',   'Chairs, tables, beds, sofas, cabinets'),
  ('Electronics',         'monitor',        'blue',    'TVs, laptops, tablets, screens'),
  ('Kitchen Appliances',  'chef-hat',       'orange',  'Fridge, microwave, oven, kettle'),
  ('Bathroom Fixtures',   'droplets',       'cyan',    'Shower, toilet, sink, bath'),
  ('Lighting',            'lightbulb',      'yellow',  'Light fittings, lamps, emergency lighting'),
  ('HVAC',                'wind',           'sky',     'Air conditioning, heating, ventilation'),
  ('Safety Equipment',    'shield-check',   'green',   'Fire extinguishers, smoke alarms, first aid'),
  ('Security Devices',    'lock',           'slate',   'CCTV, door locks, access control'),
  ('Networking & IT',     'wifi',           'violet',  'Routers, switches, access points'),
  ('Cleaning Equipment',  'sparkles',       'teal',    'Vacuum cleaners, floor scrubbers, carts'),
  ('Garden Equipment',    'trees',          'lime',    'Lawnmowers, garden tools, irrigation'),
  ('Other',               'package',        'gray',    'Miscellaneous assets')
ON CONFLICT DO NOTHING;

-- ── assets ───────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS assets (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  asset_code          TEXT UNIQUE NOT NULL,
  name                TEXT NOT NULL,
  category_id         UUID REFERENCES asset_categories(id) ON DELETE SET NULL,
  subcategory         TEXT,
  description         TEXT,
  property_name       TEXT,
  building            TEXT,
  floor               TEXT,
  unit_number         TEXT,
  room                TEXT,
  serial_number       TEXT,
  manufacturer        TEXT,
  brand               TEXT,
  model               TEXT,
  purchase_date       DATE,
  installation_date   DATE,
  supplier            TEXT,
  vendor              TEXT,
  invoice_number      TEXT,
  purchase_cost       DECIMAL(12,2),
  current_value       DECIMAL(12,2),
  depreciation_method TEXT NOT NULL DEFAULT 'straight_line',
  warranty_expiry     DATE,
  useful_life_years   INTEGER,
  replacement_date    DATE,
  condition           TEXT NOT NULL DEFAULT 'good',
  status              TEXT NOT NULL DEFAULT 'available',
  assigned_to         TEXT,
  qr_code             TEXT UNIQUE DEFAULT gen_random_uuid()::TEXT,
  images              TEXT[] DEFAULT '{}',
  notes               TEXT,
  custom_fields       JSONB DEFAULT '{}',
  created_by          TEXT,
  updated_by          TEXT,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_assets_status       ON assets(status);
CREATE INDEX IF NOT EXISTS idx_assets_category_id  ON assets(category_id);
CREATE INDEX IF NOT EXISTS idx_assets_property     ON assets(property_name);
CREATE INDEX IF NOT EXISTS idx_assets_assigned_to  ON assets(assigned_to);
CREATE INDEX IF NOT EXISTS idx_assets_warranty     ON assets(warranty_expiry);

ALTER TABLE assets ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_assets" ON assets;
CREATE POLICY "anon_select_assets" ON assets FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_assets" ON assets;
CREATE POLICY "anon_insert_assets" ON assets FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_assets" ON assets;
CREATE POLICY "anon_update_assets" ON assets FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_assets" ON assets;
CREATE POLICY "anon_delete_assets" ON assets FOR DELETE
  TO anon, authenticated USING (true);

-- ── asset_maintenance ────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS asset_maintenance (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  asset_id         UUID NOT NULL REFERENCES assets(id) ON DELETE CASCADE,
  maintenance_type TEXT NOT NULL DEFAULT 'preventive',
  scheduled_date   DATE,
  completed_date   DATE,
  technician       TEXT,
  vendor_name      TEXT,
  description      TEXT NOT NULL,
  cost             DECIMAL(12,2),
  parts_replaced   TEXT,
  status           TEXT NOT NULL DEFAULT 'scheduled',
  next_due_date    DATE,
  photos           TEXT[] DEFAULT '{}',
  notes            TEXT,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_maintenance_asset_id ON asset_maintenance(asset_id);
CREATE INDEX IF NOT EXISTS idx_maintenance_status   ON asset_maintenance(status);
CREATE INDEX IF NOT EXISTS idx_maintenance_due      ON asset_maintenance(next_due_date);

ALTER TABLE asset_maintenance ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_asset_maintenance" ON asset_maintenance;
CREATE POLICY "anon_select_asset_maintenance" ON asset_maintenance FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_asset_maintenance" ON asset_maintenance;
CREATE POLICY "anon_insert_asset_maintenance" ON asset_maintenance FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_asset_maintenance" ON asset_maintenance;
CREATE POLICY "anon_update_asset_maintenance" ON asset_maintenance FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_asset_maintenance" ON asset_maintenance;
CREATE POLICY "anon_delete_asset_maintenance" ON asset_maintenance FOR DELETE
  TO anon, authenticated USING (true);

-- ── asset_assignments ────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS asset_assignments (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  asset_id              UUID NOT NULL REFERENCES assets(id) ON DELETE CASCADE,
  assigned_to           TEXT NOT NULL,
  property_name         TEXT,
  unit_number           TEXT,
  assigned_date         DATE NOT NULL DEFAULT CURRENT_DATE,
  returned_date         DATE,
  condition_on_assign   TEXT,
  condition_on_return   TEXT,
  notes                 TEXT,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_assignments_asset_id ON asset_assignments(asset_id);

ALTER TABLE asset_assignments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_asset_assignments" ON asset_assignments;
CREATE POLICY "anon_select_asset_assignments" ON asset_assignments FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_asset_assignments" ON asset_assignments;
CREATE POLICY "anon_insert_asset_assignments" ON asset_assignments FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_asset_assignments" ON asset_assignments;
CREATE POLICY "anon_update_asset_assignments" ON asset_assignments FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_asset_assignments" ON asset_assignments;
CREATE POLICY "anon_delete_asset_assignments" ON asset_assignments FOR DELETE
  TO anon, authenticated USING (true);

-- ── asset_logs ───────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS asset_logs (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  asset_id     UUID NOT NULL REFERENCES assets(id) ON DELETE CASCADE,
  action       TEXT NOT NULL,
  performed_by TEXT NOT NULL DEFAULT 'System',
  details      TEXT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_asset_logs_asset_id ON asset_logs(asset_id);
CREATE INDEX IF NOT EXISTS idx_asset_logs_created  ON asset_logs(created_at DESC);

ALTER TABLE asset_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_asset_logs" ON asset_logs;
CREATE POLICY "anon_select_asset_logs" ON asset_logs FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_asset_logs" ON asset_logs;
CREATE POLICY "anon_insert_asset_logs" ON asset_logs FOR INSERT
  TO anon, authenticated WITH CHECK (true);
