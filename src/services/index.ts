import type {
  Tenant, Property, Certificate, SupportLog, StarAssessment,
  Invoice, Transaction, TenantDocument, AppNotification, ActivityEvent,
  DashboardKPI, Organisation, User, DocumentTemplate, Report,
  Asset, AssetCategory, AssetMaintenance, AssetAssignment, AssetLog, AssetKPIs,
} from '../types';
import {
  tenants, properties, certificates, supportLogs, starAssessments,
  invoices, tenantDocuments, notifications, activityFeed, dashboardKPIs,
  organisations, users, documentTemplates, rooms, occupancyTrend,
  rentCollectionTrend, supportHoursData, currentLicensePlan,
} from '../data/mockData';

const delay = (ms = 600) => new Promise(resolve => setTimeout(resolve, ms));

// ── Auth Service ─────────────────────────────────────────────────────────────
export const authService = {
  async login(email: string, _password: string) {
    await delay(800);
    const user = users.find(u => u.email === email);
    if (!user) throw new Error('Invalid email or password');
    return { user, requiresTwoFactor: user.twoFactorEnabled };
  },

  async verifyTwoFactor(_code: string) {
    await delay(500);
    return { success: true };
  },

  async getOrganisations(userId: string) {
    await delay(400);
    const user = users.find(u => u.id === userId);
    if (!user) throw new Error('User not found');
    return organisations.filter(o => o.id === user.organisationId);
  },
};

// ── Dashboard Service ─────────────────────────────────────────────────────────
export const dashboardService = {
  async getKPIs(_orgId: string): Promise<DashboardKPI> {
    await delay();
    return dashboardKPIs;
  },

  async getOccupancyTrend(_orgId: string) {
    await delay(400);
    return occupancyTrend;
  },

  async getRentCollectionTrend(_orgId: string) {
    await delay(400);
    return rentCollectionTrend;
  },

  async getSupportHoursBreakdown(_orgId: string) {
    await delay(400);
    return supportHoursData;
  },

  async getRecentActivity(_orgId: string): Promise<ActivityEvent[]> {
    await delay(500);
    return activityFeed;
  },

  async getAlerts(_orgId: string): Promise<AppNotification[]> {
    await delay(300);
    return notifications.filter(n => !n.read || n.severity === 'danger');
  },
};

// ── Organisation Service ──────────────────────────────────────────────────────
export const organisationService = {
  async getAll(): Promise<Organisation[]> {
    await delay();
    return organisations;
  },

  async getById(id: string): Promise<Organisation> {
    await delay(400);
    const org = organisations.find(o => o.id === id);
    if (!org) throw new Error('Organisation not found');
    return org;
  },

  async getLicensePlan(_orgId: string) {
    await delay(400);
    return currentLicensePlan;
  },
};

// ── Tenant Service ────────────────────────────────────────────────────────────
export const tenantService = {
  async getAll(_orgId: string): Promise<Tenant[]> {
    await delay();
    return tenants;
  },

  async getById(id: string): Promise<Tenant> {
    await delay(400);
    const tenant = tenants.find(t => t.id === id);
    if (!tenant) throw new Error('Tenant not found');
    return tenant;
  },

  async create(data: Partial<Tenant>): Promise<Tenant> {
    await delay(800);
    const newTenant: Tenant = {
      id: `tenant-${Date.now()}`,
      organisationId: 'org-1',
      ...data,
    } as Tenant;
    return newTenant;
  },

  async update(id: string, data: Partial<Tenant>): Promise<Tenant> {
    await delay(600);
    const tenant = tenants.find(t => t.id === id);
    if (!tenant) throw new Error('Tenant not found');
    return { ...tenant, ...data };
  },

  async getSupportLogs(tenantId: string): Promise<SupportLog[]> {
    await delay(400);
    return supportLogs.filter(l => l.tenantId === tenantId);
  },

  async getDocuments(tenantId: string): Promise<TenantDocument[]> {
    await delay(400);
    return tenantDocuments.filter(d => d.tenantId === tenantId);
  },

  async getStarAssessments(tenantId: string): Promise<StarAssessment[]> {
    await delay(400);
    return starAssessments.filter(a => a.tenantId === tenantId);
  },

  async getInvoices(tenantId: string): Promise<Invoice[]> {
    await delay(400);
    return invoices.filter(i => i.tenantId === tenantId);
  },

  async getTransactions(tenantId: string): Promise<Transaction[]> {
    await delay(400);
    const tx: Transaction[] = invoices
      .filter(i => i.tenantId === tenantId && i.status === 'paid')
      .map(i => ({
        id: `tx-${i.id}`,
        tenantId,
        date: i.paidDate || i.dueDate,
        type: 'rent' as const,
        amount: i.amount,
        method: i.paymentMethod,
        reference: i.invoiceNumber,
        status: 'completed' as const,
      }));
    return tx;
  },
};

// ── Property Service ──────────────────────────────────────────────────────────
export const propertyService = {
  async getAll(_orgId: string): Promise<Property[]> {
    await delay();
    return properties;
  },

  async getById(id: string): Promise<Property> {
    await delay(400);
    const prop = properties.find(p => p.id === id);
    if (!prop) throw new Error('Property not found');
    return prop;
  },

  async getRooms(propertyId: string) {
    await delay(400);
    return rooms.filter(r => r.propertyId === propertyId);
  },

  async getCertificates(propertyId: string): Promise<Certificate[]> {
    await delay(400);
    return certificates.filter(c => c.propertyId === propertyId);
  },

  async getAllCertificates(): Promise<Certificate[]> {
    await delay(400);
    return certificates;
  },
};

// ── Support Service ───────────────────────────────────────────────────────────
export const supportService = {
  async getAllLogs(_orgId: string): Promise<SupportLog[]> {
    await delay();
    return supportLogs;
  },

  async logSupport(data: Partial<SupportLog>): Promise<SupportLog> {
    await delay(700);
    return {
      id: `log-${Date.now()}`,
      ...data,
    } as SupportLog;
  },

  async getStarAssessments(_orgId: string): Promise<StarAssessment[]> {
    await delay();
    return starAssessments;
  },

  async saveStarAssessment(data: Partial<StarAssessment>): Promise<StarAssessment> {
    await delay(700);
    return {
      id: `star-${Date.now()}`,
      ...data,
    } as StarAssessment;
  },
};

// ── Financial Service ─────────────────────────────────────────────────────────
export const financialService = {
  async getAllInvoices(_orgId: string): Promise<Invoice[]> {
    await delay();
    return invoices;
  },

  async getAllTransactions(_orgId: string): Promise<Transaction[]> {
    await delay();
    const tx: Transaction[] = invoices
      .filter(i => i.status === 'paid')
      .map(i => ({
        id: `tx-${i.id}`,
        tenantId: i.tenantId,
        date: i.paidDate || i.dueDate,
        type: 'rent' as const,
        amount: i.amount,
        method: i.paymentMethod,
        reference: i.invoiceNumber,
        status: 'completed' as const,
      }));
    return tx;
  },
};

// ── Document Service ──────────────────────────────────────────────────────────
export const documentService = {
  async getAllDocuments(_orgId: string): Promise<TenantDocument[]> {
    await delay();
    return tenantDocuments;
  },

  async getAllTemplates(): Promise<DocumentTemplate[]> {
    await delay(400);
    return documentTemplates;
  },

  async uploadDocument(data: Partial<TenantDocument>): Promise<TenantDocument> {
    await delay(1200);
    return {
      id: `doc-${Date.now()}`,
      ...data,
    } as TenantDocument;
  },
};

// ── Report Service ────────────────────────────────────────────────────────────
export const reportService = {
  async getReports(): Promise<Report[]> {
    await delay();
    return [
      { id: 'r-1', name: 'ESA Compliance Report', description: 'Evidence & Support Activity compliance summary across all properties.', category: 'Compliance', lastGenerated: '2026-06-20', generatedBy: 'user-1', status: 'ready' },
      { id: 'r-2', name: 'Support Hours Summary', description: 'Weekly and monthly support hours per tenant and key worker.', category: 'Support', lastGenerated: '2026-06-27', generatedBy: 'user-2', status: 'ready' },
      { id: 'r-3', name: 'Certificate Expiry Report', description: 'All property certificates with expiry status and upcoming renewals.', category: 'Compliance', lastGenerated: '2026-06-25', generatedBy: 'user-1', status: 'ready' },
      { id: 'r-4', name: 'Rent Audit Report', description: 'Rent collected vs expected with arrears breakdown by tenant and property.', category: 'Financials', lastGenerated: '2026-06-01', generatedBy: 'user-1', status: 'ready' },
      { id: 'r-5', name: 'STAR Progress Report', description: 'STAR assessment completion rates and average scores.', category: 'Support', lastGenerated: '2026-06-15', generatedBy: 'user-2', status: 'ready' },
      { id: 'r-6', name: 'Missing Documents Report', description: 'Tenants with missing required documentation.', category: 'Compliance', status: 'ready' },
      { id: 'r-7', name: 'Occupancy Report', description: 'Property occupancy rates, vacancies, and turnover statistics.', category: 'Properties', lastGenerated: '2026-06-01', generatedBy: 'user-1', status: 'ready' },
      { id: 'r-8', name: 'Board Summary Report', description: 'Executive summary for board and senior leadership.', category: 'Executive', lastGenerated: '2026-06-01', generatedBy: 'user-1', status: 'ready' },
    ];
  },

  async generateReport(id: string): Promise<{ success: boolean; downloadUrl: string }> {
    await delay(2000);
    return { success: true, downloadUrl: `/reports/${id}.pdf` };
  },
};

// ── Admin Service ─────────────────────────────────────────────────────────────
export const adminService = {
  async getUsers(_orgId: string): Promise<User[]> {
    await delay();
    return users;
  },

  async getAllOrganisations(): Promise<Organisation[]> {
    await delay();
    return organisations;
  },
};

// ── Notification Service ──────────────────────────────────────────────────────
export const notificationService = {
  async getAll(): Promise<AppNotification[]> {
    await delay(300);
    return notifications;
  },

  async markRead(id: string): Promise<void> {
    await delay(200);
    const n = notifications.find(n => n.id === id);
    if (n) n.read = true;
  },
};

// ── Asset Service (Supabase-backed) ──────────────────────────────────────────
import { supabase } from '../lib/supabase';

export const assetService = {
  async getCategories(): Promise<AssetCategory[]> {
    const { data, error } = await supabase
      .from('asset_categories')
      .select('*')
      .order('name');
    if (error) throw error;
    return (data ?? []) as AssetCategory[];
  },

  async getAssets(filters?: {
    status?: string;
    category_id?: string;
    search?: string;
    property?: string;
  }): Promise<Asset[]> {
    let query = supabase
      .from('assets')
      .select('*, category:asset_categories(id,name,icon,color)')
      .order('created_at', { ascending: false });

    if (filters?.status) query = query.eq('status', filters.status);
    if (filters?.category_id) query = query.eq('category_id', filters.category_id);
    if (filters?.property) query = query.eq('property_name', filters.property);
    if (filters?.search) {
      query = query.or(
        `name.ilike.%${filters.search}%,asset_code.ilike.%${filters.search}%,serial_number.ilike.%${filters.search}%`
      );
    }

    const { data, error } = await query;
    if (error) throw error;
    return (data ?? []) as Asset[];
  },

  async getAssetById(id: string): Promise<Asset | null> {
    const { data, error } = await supabase
      .from('assets')
      .select('*, category:asset_categories(id,name,icon,color)')
      .eq('id', id)
      .maybeSingle();
    if (error) throw error;
    return data as Asset | null;
  },

  async createAsset(
    payload: Omit<Asset, 'id' | 'asset_code' | 'qr_code' | 'created_at' | 'updated_at'>,
    createdBy: string
  ): Promise<Asset> {
    // Generate next asset code
    const { count } = await supabase
      .from('assets')
      .select('*', { count: 'exact', head: true });
    const assetCode = `AST-${String((count ?? 0) + 1).padStart(4, '0')}`;

    const { data, error } = await supabase
      .from('assets')
      .insert({ ...payload, asset_code: assetCode, created_by: createdBy })
      .select()
      .single();
    if (error) throw error;

    await assetService.logAction(data.id, 'created', createdBy, `Asset "${payload.name}" created`);
    return data as Asset;
  },

  async updateAsset(id: string, payload: Partial<Asset>, updatedBy: string): Promise<Asset> {
    const { data, error } = await supabase
      .from('assets')
      .update({ ...payload, updated_by: updatedBy, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;

    await assetService.logAction(id, 'updated', updatedBy, `Asset updated`);
    return data as Asset;
  },

  async deleteAsset(id: string, deletedBy: string): Promise<void> {
    await assetService.logAction(id, 'deleted', deletedBy, 'Asset deleted');
    const { error } = await supabase.from('assets').delete().eq('id', id);
    if (error) throw error;
  },

  async getKPIs(): Promise<AssetKPIs> {
    const { data: assets, error } = await supabase
      .from('assets')
      .select('status, condition, purchase_cost, current_value, created_at, warranty_expiry');
    if (error) throw error;

    const now = new Date();
    const thirtyDaysOut = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const rows = (assets ?? []) as Asset[];
    return {
      total: rows.length,
      assigned: rows.filter(a => a.status === 'assigned').length,
      available: rows.filter(a => a.status === 'available').length,
      maintenance_due: rows.filter(a => a.status === 'in_maintenance').length,
      warranty_expiring: rows.filter(a =>
        a.warranty_expiry && new Date(a.warranty_expiry) <= thirtyDaysOut && new Date(a.warranty_expiry) >= now
      ).length,
      damaged: rows.filter(a => a.status === 'damaged' || a.condition === 'broken').length,
      total_value: rows.reduce((s: number, a) => s + (a.current_value ?? a.purchase_cost ?? 0), 0),
      maintenance_cost: 0,
      added_this_month: rows.filter(a => new Date(a.created_at) >= firstOfMonth).length,
    };
  },

  // ── Maintenance ────────────────────────────────────────────────────────────

  async getMaintenance(assetId: string): Promise<AssetMaintenance[]> {
    const { data, error } = await supabase
      .from('asset_maintenance')
      .select('*')
      .eq('asset_id', assetId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return (data ?? []) as AssetMaintenance[];
  },

  async addMaintenance(
    payload: Omit<AssetMaintenance, 'id' | 'created_at'>,
    performedBy: string
  ): Promise<AssetMaintenance> {
    const { data, error } = await supabase
      .from('asset_maintenance')
      .insert(payload)
      .select()
      .single();
    if (error) throw error;
    await assetService.logAction(
      payload.asset_id, 'maintenance_added', performedBy,
      `${payload.maintenance_type} maintenance: ${payload.description}`
    );
    return data as AssetMaintenance;
  },

  async updateMaintenance(id: string, payload: Partial<AssetMaintenance>): Promise<AssetMaintenance> {
    const { data, error } = await supabase
      .from('asset_maintenance')
      .update(payload)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data as AssetMaintenance;
  },

  // ── Assignments ────────────────────────────────────────────────────────────

  async getAssignments(assetId: string): Promise<AssetAssignment[]> {
    const { data, error } = await supabase
      .from('asset_assignments')
      .select('*')
      .eq('asset_id', assetId)
      .order('assigned_date', { ascending: false });
    if (error) throw error;
    return (data ?? []) as AssetAssignment[];
  },

  async assignAsset(
    assetId: string,
    payload: Omit<AssetAssignment, 'id' | 'asset_id' | 'created_at'>,
    performedBy: string
  ): Promise<AssetAssignment> {
    const { data, error } = await supabase
      .from('asset_assignments')
      .insert({ ...payload, asset_id: assetId })
      .select()
      .single();
    if (error) throw error;

    await assetService.updateAsset(assetId, { status: 'assigned', assigned_to: payload.assigned_to }, performedBy);
    await assetService.logAction(assetId, 'assigned', performedBy, `Assigned to ${payload.assigned_to}`);
    return data as AssetAssignment;
  },

  // ── Logs ───────────────────────────────────────────────────────────────────

  async getLogs(assetId: string): Promise<AssetLog[]> {
    const { data, error } = await supabase
      .from('asset_logs')
      .select('*')
      .eq('asset_id', assetId)
      .order('created_at', { ascending: false })
      .limit(50);
    if (error) throw error;
    return (data ?? []) as AssetLog[];
  },

  async logAction(assetId: string, action: string, performedBy: string, details?: string): Promise<void> {
    await supabase.from('asset_logs').insert({ asset_id: assetId, action, performed_by: performedBy, details });
  },

  // ── Category helpers ───────────────────────────────────────────────────────

  async createCategory(payload: Omit<AssetCategory, 'id' | 'created_at'>): Promise<AssetCategory> {
    const { data, error } = await supabase
      .from('asset_categories')
      .insert(payload)
      .select()
      .single();
    if (error) throw error;
    return data as AssetCategory;
  },
};
