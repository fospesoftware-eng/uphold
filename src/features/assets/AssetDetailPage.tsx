import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, Package, QrCode, Edit, Wrench, Calendar,
  MapPin, Tag, DollarSign, Shield, User, AlertTriangle,
  CheckCircle, Clock, Plus, Trash2, ChevronRight,
  FileText, Activity,
} from 'lucide-react';
import {
  Card, Button, Badge, PageHeader, Modal, EmptyState, Toast,
} from '../../components/ui';
import { assetService } from '../../services';
import { useAuth } from '../../lib/auth';
import type { Asset, AssetMaintenance, AssetAssignment, AssetLog } from '../../types';
import { AssetForm } from './components/AssetForm';
import { QRCodeModal } from './components/QRCodeModal';

const STATUS_CONFIG: Record<string, { label: string; color: string; dot: string }> = {
  available:      { label: 'Available',      color: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400', dot: 'bg-emerald-500' },
  installed:      { label: 'Installed',      color: 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400',            dot: 'bg-blue-500' },
  assigned:       { label: 'Assigned',       color: 'bg-violet-50 text-violet-700 dark:bg-violet-900/20 dark:text-violet-400',    dot: 'bg-violet-500' },
  in_maintenance: { label: 'Maintenance',    color: 'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400',        dot: 'bg-amber-500' },
  out_of_service: { label: 'Out of Service', color: 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400',               dot: 'bg-red-500' },
  disposed:       { label: 'Disposed',       color: 'bg-gray-50 text-gray-600 dark:bg-gray-800/40 dark:text-gray-400',           dot: 'bg-gray-400' },
  damaged:        { label: 'Damaged',        color: 'bg-orange-50 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400',   dot: 'bg-orange-500' },
  lost:           { label: 'Lost',           color: 'bg-rose-50 text-rose-700 dark:bg-rose-900/20 dark:text-rose-400',           dot: 'bg-rose-500' },
  reserved:       { label: 'Reserved',       color: 'bg-sky-50 text-sky-700 dark:bg-sky-900/20 dark:text-sky-400',              dot: 'bg-sky-500' },
  archived:       { label: 'Archived',       color: 'bg-slate-50 text-slate-600 dark:bg-slate-800/40 dark:text-slate-400',       dot: 'bg-slate-400' },
};

const MAINT_STATUS: Record<string, { label: string; color: string }> = {
  scheduled:   { label: 'Scheduled',   color: 'bg-sky-50 text-sky-700 dark:bg-sky-900/20 dark:text-sky-400' },
  in_progress: { label: 'In Progress', color: 'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400' },
  completed:   { label: 'Completed',   color: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400' },
  overdue:     { label: 'Overdue',     color: 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400' },
  cancelled:   { label: 'Cancelled',   color: 'bg-gray-50 text-gray-600 dark:bg-gray-800 dark:text-gray-400' },
};

function InfoRow({ label, value }: { label: string; value?: string | number | null }) {
  if (!value && value !== 0) return null;
  return (
    <div className="flex items-start justify-between py-2.5 border-b border-[#F1F5F9] dark:border-[#1E2D45] last:border-0">
      <span className="text-xs text-[#64748B] dark:text-[#94A3B8] font-medium">{label}</span>
      <span className="text-xs font-semibold text-[#334155] dark:text-[#CBD5E1] text-right max-w-[60%]">{value}</span>
    </div>
  );
}

function MaintenanceForm({ assetId, onSuccess, onCancel }: { assetId: string; onSuccess: () => void; onCancel: () => void }) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    maintenance_type: 'preventive',
    description: '',
    scheduled_date: '',
    technician: '',
    cost: '',
    status: 'scheduled',
    next_due_date: '',
    notes: '',
  });

  const fieldCls = 'px-3 py-2 w-full text-sm border border-[#E2E8F0] dark:border-[#1E2D45] rounded-xl bg-white dark:bg-[#111827] text-[#334155] dark:text-[#CBD5E1] focus:outline-none focus:ring-2 focus:ring-[#075DE8] transition-colors';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.description) return;
    setLoading(true);
    try {
      await assetService.addMaintenance({
        asset_id: assetId,
        maintenance_type: form.maintenance_type as AssetMaintenance['maintenance_type'],
        description: form.description,
        scheduled_date: form.scheduled_date || undefined,
        technician: form.technician || undefined,
        cost: form.cost ? parseFloat(form.cost) : undefined,
        status: form.status as AssetMaintenance['status'],
        next_due_date: form.next_due_date || undefined,
        notes: form.notes || undefined,
      }, user?.name ?? 'Unknown');
      onSuccess();
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-[#334155] dark:text-[#CBD5E1] mb-1.5">Type</label>
          <select value={form.maintenance_type} onChange={e => setForm(f => ({ ...f, maintenance_type: e.target.value }))} className={fieldCls}>
            {['preventive','corrective','emergency','warranty_service','inspection','cleaning','calibration'].map(t =>
              <option key={t} value={t}>{t.replace(/_/g,' ').replace(/\b\w/g, l => l.toUpperCase())}</option>
            )}
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-[#334155] dark:text-[#CBD5E1] mb-1.5">Status</label>
          <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))} className={fieldCls}>
            {['scheduled','in_progress','completed','cancelled'].map(s =>
              <option key={s} value={s}>{s.replace(/_/g,' ').replace(/\b\w/g, l => l.toUpperCase())}</option>
            )}
          </select>
        </div>
        <div className="col-span-2">
          <label className="block text-xs font-semibold text-[#334155] dark:text-[#CBD5E1] mb-1.5">Description <span className="text-rose-500">*</span></label>
          <input value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} required placeholder="Describe the maintenance work…" className={fieldCls} />
        </div>
        <div>
          <label className="block text-xs font-semibold text-[#334155] dark:text-[#CBD5E1] mb-1.5">Scheduled Date</label>
          <input type="date" value={form.scheduled_date} onChange={e => setForm(f => ({ ...f, scheduled_date: e.target.value }))} className={fieldCls} />
        </div>
        <div>
          <label className="block text-xs font-semibold text-[#334155] dark:text-[#CBD5E1] mb-1.5">Next Due Date</label>
          <input type="date" value={form.next_due_date} onChange={e => setForm(f => ({ ...f, next_due_date: e.target.value }))} className={fieldCls} />
        </div>
        <div>
          <label className="block text-xs font-semibold text-[#334155] dark:text-[#CBD5E1] mb-1.5">Technician</label>
          <input value={form.technician} onChange={e => setForm(f => ({ ...f, technician: e.target.value }))} placeholder="Name" className={fieldCls} />
        </div>
        <div>
          <label className="block text-xs font-semibold text-[#334155] dark:text-[#CBD5E1] mb-1.5">Cost (£)</label>
          <input type="number" step="0.01" value={form.cost} onChange={e => setForm(f => ({ ...f, cost: e.target.value }))} placeholder="0.00" className={fieldCls} />
        </div>
        <div className="col-span-2">
          <label className="block text-xs font-semibold text-[#334155] dark:text-[#CBD5E1] mb-1.5">Notes</label>
          <textarea rows={3} value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} placeholder="Additional notes…" className={`${fieldCls} resize-none`} />
        </div>
      </div>
      <div className="flex justify-end gap-3 pt-2 border-t border-[#F1F5F9] dark:border-[#1E2D45]">
        <Button type="button" variant="secondary" size="sm" onClick={onCancel}>Cancel</Button>
        <Button type="submit" variant="primary" size="sm" loading={loading}>Add Record</Button>
      </div>
    </form>
  );
}

type TabId = 'overview' | 'maintenance' | 'assignments' | 'activity';

export function AssetDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [asset, setAsset] = useState<Asset | null>(null);
  const [maintenance, setMaintenance] = useState<AssetMaintenance[]>([]);
  const [assignments, setAssignments] = useState<AssetAssignment[]>([]);
  const [logs, setLogs] = useState<AssetLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabId>('overview');

  const [showEditModal, setShowEditModal] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [showAddMaint, setShowAddMaint] = useState(false);
  const [categories, setCategories] = useState<import('../../types').AssetCategory[]>([]);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = useCallback((message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  }, []);

  const loadAsset = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    try {
      const [a, cats] = await Promise.all([
        assetService.getAssetById(id),
        assetService.getCategories(),
      ]);
      setAsset(a);
      setCategories(cats);
    } catch {
      showToast('Failed to load asset', 'error');
    } finally {
      setLoading(false);
    }
  }, [id, showToast]);

  const loadTabData = useCallback(async () => {
    if (!id) return;
    if (activeTab === 'maintenance') {
      const data = await assetService.getMaintenance(id);
      setMaintenance(data);
    } else if (activeTab === 'assignments') {
      const data = await assetService.getAssignments(id);
      setAssignments(data);
    } else if (activeTab === 'activity') {
      const data = await assetService.getLogs(id);
      setLogs(data);
    }
  }, [id, activeTab]);

  useEffect(() => { loadAsset(); }, [loadAsset]);
  useEffect(() => { loadTabData(); }, [loadTabData]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-[#F1F5F9] dark:bg-[#1E2D45] rounded-xl animate-pulse" />
        <div className="h-40 bg-[#F1F5F9] dark:bg-[#1E2D45] rounded-2xl animate-pulse" />
        <div className="grid grid-cols-3 gap-4">
          {[1,2,3].map(i => <div key={i} className="h-48 bg-[#F1F5F9] dark:bg-[#1E2D45] rounded-2xl animate-pulse" />)}
        </div>
      </div>
    );
  }

  if (!asset) {
    return (
      <EmptyState
        icon={<Package size={32} className="text-[#94A3B8]" />}
        title="Asset not found"
        description="This asset may have been deleted or doesn't exist."
        action={<Button variant="primary" size="sm" leftIcon={<ArrowLeft size={14} />} onClick={() => navigate('/assets')}>Back to Assets</Button>}
      />
    );
  }

  const status = STATUS_CONFIG[asset.status] ?? { label: asset.status, color: 'bg-gray-100 text-gray-600', dot: 'bg-gray-400' };

  const tabs: { id: TabId; label: string; icon: React.ReactNode }[] = [
    { id: 'overview',     label: 'Overview',    icon: <FileText size={14} /> },
    { id: 'maintenance',  label: 'Maintenance', icon: <Wrench size={14} /> },
    { id: 'assignments',  label: 'Assignments', icon: <User size={14} /> },
    { id: 'activity',     label: 'Activity Log',icon: <Activity size={14} /> },
  ];

  const fmt = (d?: string) => d ? new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start gap-4">
        <button
          onClick={() => navigate('/assets')}
          className="mt-1 p-2 rounded-xl hover:bg-[#F1F5F9] dark:hover:bg-[#1E2D45] text-[#64748B] transition-colors"
        >
          <ArrowLeft size={16} />
        </button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono text-[#64748B] dark:text-[#94A3B8]">{asset.asset_code}</span>
            <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${status.color}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
              {status.label}
            </span>
          </div>
          <h1 className="text-2xl font-bold text-[#0F172A] dark:text-[#F8FAFC]">{asset.name}</h1>
          {asset.description && <p className="text-sm text-[#64748B] dark:text-[#94A3B8] mt-1 line-clamp-2">{asset.description}</p>}
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <Button variant="secondary" size="sm" leftIcon={<QrCode size={14} />} onClick={() => setShowQR(true)}>QR Code</Button>
          <Button variant="primary" size="sm" leftIcon={<Edit size={14} />} onClick={() => setShowEditModal(true)}>Edit</Button>
        </div>
      </div>

      {/* Hero image */}
      {asset.images?.[0] && (
        <div className="h-48 sm:h-64 overflow-hidden rounded-2xl border border-[#E6EEF5] dark:border-[#1E2D45]">
          <img src={asset.images[0]} alt={asset.name} className="w-full h-full object-cover" />
        </div>
      )}

      {/* Quick info strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { icon: <Tag size={14} className="text-[#075DE8]" />, label: 'Category', value: asset.category?.name ?? '—' },
          { icon: <MapPin size={14} className="text-[#15C6B8]" />, label: 'Location', value: [asset.property_name, asset.unit_number ? `Unit ${asset.unit_number}` : null, asset.room].filter(Boolean).join(' · ') || '—' },
          { icon: <DollarSign size={14} className="text-[#32E6A4]" />, label: 'Value', value: asset.current_value != null ? `£${asset.current_value.toLocaleString()}` : '—' },
          { icon: <Shield size={14} className="text-amber-500" />, label: 'Warranty', value: asset.warranty_expiry ? fmt(asset.warranty_expiry) : '—' },
        ].map(item => (
          <div key={item.label} className="flex items-center gap-3 p-3 bg-white dark:bg-[#111827] border border-[#E6EEF5] dark:border-[#1E2D45] rounded-2xl">
            <div className="w-8 h-8 rounded-xl bg-[#F1F5F9] dark:bg-[#1E2D45] flex items-center justify-center flex-shrink-0">
              {item.icon}
            </div>
            <div className="min-w-0">
              <p className="text-[10px] text-[#94A3B8] font-medium uppercase tracking-wide">{item.label}</p>
              <p className="text-sm font-semibold text-[#0F172A] dark:text-[#F8FAFC] truncate">{item.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-[#E6EEF5] dark:border-[#1E2D45]">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-all -mb-px ${
              activeTab === tab.id
                ? 'border-[#075DE8] text-[#075DE8]'
                : 'border-transparent text-[#64748B] hover:text-[#334155] dark:hover:text-[#CBD5E1]'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.2 }}
        >
          {/* OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-4">
                <Card>
                  <h3 className="text-sm font-bold text-[#0F172A] dark:text-[#F8FAFC] mb-3">Asset Details</h3>
                  <InfoRow label="Asset Code" value={asset.asset_code} />
                  <InfoRow label="Name" value={asset.name} />
                  <InfoRow label="Category" value={asset.category?.name} />
                  <InfoRow label="Subcategory" value={asset.subcategory} />
                  <InfoRow label="Brand" value={asset.brand} />
                  <InfoRow label="Manufacturer" value={asset.manufacturer} />
                  <InfoRow label="Model" value={asset.model} />
                  <InfoRow label="Serial Number" value={asset.serial_number} />
                  <InfoRow label="Condition" value={asset.condition?.replace(/_/g,' ').replace(/\b\w/g, l => l.toUpperCase())} />
                  <InfoRow label="Status" value={status.label} />
                  <InfoRow label="Assigned To" value={asset.assigned_to} />
                </Card>

                <Card>
                  <h3 className="text-sm font-bold text-[#0F172A] dark:text-[#F8FAFC] mb-3">Location</h3>
                  <InfoRow label="Property" value={asset.property_name} />
                  <InfoRow label="Building" value={asset.building} />
                  <InfoRow label="Floor" value={asset.floor} />
                  <InfoRow label="Unit" value={asset.unit_number} />
                  <InfoRow label="Room" value={asset.room} />
                </Card>

                {asset.notes && (
                  <Card>
                    <h3 className="text-sm font-bold text-[#0F172A] dark:text-[#F8FAFC] mb-2">Notes</h3>
                    <p className="text-sm text-[#64748B] dark:text-[#94A3B8] whitespace-pre-wrap">{asset.notes}</p>
                  </Card>
                )}
              </div>

              <div className="space-y-4">
                <Card>
                  <h3 className="text-sm font-bold text-[#0F172A] dark:text-[#F8FAFC] mb-3">Financial</h3>
                  <InfoRow label="Purchase Cost" value={asset.purchase_cost != null ? `£${asset.purchase_cost.toLocaleString()}` : undefined} />
                  <InfoRow label="Current Value" value={asset.current_value != null ? `£${asset.current_value.toLocaleString()}` : undefined} />
                  <InfoRow label="Depreciation" value={asset.depreciation_method?.replace(/_/g,' ').replace(/\b\w/g, l => l.toUpperCase())} />
                  <InfoRow label="Useful Life" value={asset.useful_life_years ? `${asset.useful_life_years} years` : undefined} />
                  <InfoRow label="Supplier" value={asset.supplier} />
                  <InfoRow label="Vendor" value={asset.vendor} />
                  <InfoRow label="Invoice No." value={asset.invoice_number} />
                </Card>

                <Card>
                  <h3 className="text-sm font-bold text-[#0F172A] dark:text-[#F8FAFC] mb-3">Timeline</h3>
                  <InfoRow label="Purchase Date" value={fmt(asset.purchase_date)} />
                  <InfoRow label="Installation" value={fmt(asset.installation_date)} />
                  <InfoRow label="Warranty Expiry" value={fmt(asset.warranty_expiry)} />
                  <InfoRow label="Replacement Due" value={fmt(asset.replacement_date)} />
                  <InfoRow label="Created" value={fmt(asset.created_at)} />
                  <InfoRow label="Last Updated" value={fmt(asset.updated_at)} />
                </Card>

                {/* QR Preview */}
                <Card>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-bold text-[#0F172A] dark:text-[#F8FAFC]">QR Code</h3>
                    <button onClick={() => setShowQR(true)} className="text-xs text-[#075DE8] hover:underline">View full</button>
                  </div>
                  <div className="flex justify-center p-3 bg-white rounded-xl border border-[#E6EEF5] dark:border-[#1E2D45]">
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(asset.qr_code ?? asset.id)}`}
                      alt="QR Code"
                      width={100}
                      height={100}
                      className="block"
                    />
                  </div>
                  <p className="text-[10px] text-center font-mono text-[#94A3B8] mt-2 truncate">{asset.asset_code}</p>
                </Card>
              </div>
            </div>
          )}

          {/* MAINTENANCE */}
          {activeTab === 'maintenance' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-[#64748B] dark:text-[#94A3B8]">{maintenance.length} record{maintenance.length !== 1 ? 's' : ''}</p>
                <Button variant="primary" size="sm" leftIcon={<Plus size={14} />} onClick={() => setShowAddMaint(true)}>
                  Add Record
                </Button>
              </div>
              {maintenance.length === 0 ? (
                <EmptyState
                  icon={<Wrench size={28} className="text-[#94A3B8]" />}
                  title="No maintenance records"
                  description="Add the first maintenance record for this asset."
                  action={<Button variant="primary" size="sm" leftIcon={<Plus size={14} />} onClick={() => setShowAddMaint(true)}>Add Record</Button>}
                />
              ) : (
                <div className="space-y-3">
                  {maintenance.map(m => {
                    const ms = MAINT_STATUS[m.status] ?? { label: m.status, color: 'bg-gray-100 text-gray-600' };
                    return (
                      <Card key={m.id} padding="sm">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${ms.color}`}>{ms.label}</span>
                              <span className="text-xs font-medium text-[#334155] dark:text-[#CBD5E1] capitalize">{m.maintenance_type.replace(/_/g,' ')}</span>
                            </div>
                            <p className="text-sm text-[#0F172A] dark:text-[#F8FAFC] font-medium">{m.description}</p>
                            <div className="flex flex-wrap gap-3 mt-2">
                              {m.technician && <span className="text-xs text-[#64748B] dark:text-[#94A3B8]">👤 {m.technician}</span>}
                              {m.scheduled_date && <span className="text-xs text-[#64748B] dark:text-[#94A3B8]">📅 {fmt(m.scheduled_date)}</span>}
                              {m.cost != null && <span className="text-xs text-[#64748B] dark:text-[#94A3B8]">💰 £{m.cost.toLocaleString()}</span>}
                              {m.next_due_date && <span className="text-xs text-amber-600 dark:text-amber-400">⏰ Next: {fmt(m.next_due_date)}</span>}
                            </div>
                            {m.notes && <p className="text-xs text-[#94A3B8] mt-2 italic">{m.notes}</p>}
                          </div>
                          <p className="text-xs text-[#94A3B8] flex-shrink-0">{fmt(m.created_at)}</p>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ASSIGNMENTS */}
          {activeTab === 'assignments' && (
            <div className="space-y-3">
              {assignments.length === 0 ? (
                <EmptyState
                  icon={<User size={28} className="text-[#94A3B8]" />}
                  title="No assignment history"
                  description="This asset has not been assigned to any tenant."
                />
              ) : (
                assignments.map(a => (
                  <Card key={a.id} padding="sm">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold text-[#0F172A] dark:text-[#F8FAFC]">{a.assigned_to}</p>
                        <div className="flex flex-wrap gap-3 mt-1">
                          {a.property_name && <span className="text-xs text-[#64748B] dark:text-[#94A3B8]">📍 {a.property_name}{a.unit_number ? ` / Unit ${a.unit_number}` : ''}</span>}
                          <span className="text-xs text-[#64748B] dark:text-[#94A3B8]">From: {fmt(a.assigned_date)}</span>
                          {a.returned_date && <span className="text-xs text-[#64748B] dark:text-[#94A3B8]">To: {fmt(a.returned_date)}</span>}
                        </div>
                        {a.condition_on_assign && <p className="text-xs text-[#94A3B8] mt-1">Condition on assign: {a.condition_on_assign}</p>}
                      </div>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${a.returned_date ? 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400' : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400'}`}>
                        {a.returned_date ? 'Returned' : 'Active'}
                      </span>
                    </div>
                  </Card>
                ))
              )}
            </div>
          )}

          {/* ACTIVITY LOG */}
          {activeTab === 'activity' && (
            <div className="space-y-2">
              {logs.length === 0 ? (
                <EmptyState
                  icon={<Activity size={28} className="text-[#94A3B8]" />}
                  title="No activity yet"
                  description="Actions on this asset will appear here."
                />
              ) : (
                <div className="relative">
                  <div className="absolute left-5 top-0 bottom-0 w-px bg-[#E6EEF5] dark:bg-[#1E2D45]" />
                  <div className="space-y-0">
                    {logs.map((log, i) => (
                      <div key={log.id} className="relative flex gap-4 pb-4">
                        <div className="relative z-10 w-10 h-10 flex-shrink-0 flex items-center justify-center bg-white dark:bg-[#111827] border-2 border-[#E6EEF5] dark:border-[#1E2D45] rounded-full">
                          <Activity size={13} className="text-[#075DE8]" />
                        </div>
                        <div className="flex-1 bg-white dark:bg-[#111827] border border-[#E6EEF5] dark:border-[#1E2D45] rounded-xl p-3">
                          <div className="flex items-center justify-between gap-2">
                            <div>
                              <span className="text-xs font-semibold text-[#334155] dark:text-[#CBD5E1] capitalize">{log.action.replace(/_/g,' ')}</span>
                              <span className="text-xs text-[#94A3B8] ml-1.5">by {log.performed_by}</span>
                            </div>
                            <span className="text-[10px] text-[#94A3B8] flex-shrink-0">{fmt(log.created_at)}</span>
                          </div>
                          {log.details && <p className="text-xs text-[#64748B] dark:text-[#94A3B8] mt-1">{log.details}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Edit Modal */}
      <Modal open={showEditModal} onClose={() => setShowEditModal(false)} title={`Edit — ${asset.name}`} size="xl">
        <AssetForm
          asset={asset}
          categories={categories}
          onSuccess={() => { setShowEditModal(false); loadAsset(); showToast('Asset updated'); }}
          onCancel={() => setShowEditModal(false)}
        />
      </Modal>

      {/* QR Modal */}
      {showQR && <QRCodeModal asset={asset} onClose={() => setShowQR(false)} />}

      {/* Add Maintenance Modal */}
      <Modal open={showAddMaint} onClose={() => setShowAddMaint(false)} title="Add Maintenance Record" size="md">
        <MaintenanceForm
          assetId={asset.id}
          onSuccess={() => { setShowAddMaint(false); loadTabData(); showToast('Maintenance record added'); }}
          onCancel={() => setShowAddMaint(false)}
        />
      </Modal>

      <div className="fixed bottom-4 right-4 z-50">
        <AnimatePresence>
          {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
        </AnimatePresence>
      </div>
    </div>
  );
}
