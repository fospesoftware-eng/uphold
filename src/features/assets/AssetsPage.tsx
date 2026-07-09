import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Package, Plus, Search, Filter, Grid3X3, List,
  QrCode, AlertTriangle, CheckCircle, Wrench, Trash2,
  Download, Upload, ChevronDown, TrendingUp, DollarSign,
  Calendar, MoreHorizontal, Eye, Edit, X, Tag,
} from 'lucide-react';
import {
  PageHeader, Card, StatCard, Badge, Button, Input,
  Modal, EmptyState, Toast,
} from '../../components/ui';
import { assetService } from '../../services';
import { useAuth } from '../../lib/auth';
import type { Asset, AssetCategory, AssetKPIs } from '../../types';
import { AssetForm } from './components/AssetForm';
import { QRCodeModal } from './components/QRCodeModal';

const STATUS_CONFIG: Record<string, { label: string; color: string; dot: string }> = {
  available:       { label: 'Available',       color: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400',  dot: 'bg-emerald-500' },
  installed:       { label: 'Installed',       color: 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400',             dot: 'bg-blue-500' },
  assigned:        { label: 'Assigned',        color: 'bg-violet-50 text-violet-700 dark:bg-violet-900/20 dark:text-violet-400',     dot: 'bg-violet-500' },
  in_maintenance:  { label: 'Maintenance',     color: 'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400',         dot: 'bg-amber-500' },
  out_of_service:  { label: 'Out of Service',  color: 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400',                dot: 'bg-red-500' },
  disposed:        { label: 'Disposed',        color: 'bg-gray-50 text-gray-600 dark:bg-gray-800/40 dark:text-gray-400',            dot: 'bg-gray-400' },
  lost:            { label: 'Lost',            color: 'bg-rose-50 text-rose-700 dark:bg-rose-900/20 dark:text-rose-400',            dot: 'bg-rose-500' },
  damaged:         { label: 'Damaged',         color: 'bg-orange-50 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400',    dot: 'bg-orange-500' },
  reserved:        { label: 'Reserved',        color: 'bg-sky-50 text-sky-700 dark:bg-sky-900/20 dark:text-sky-400',               dot: 'bg-sky-500' },
  archived:        { label: 'Archived',        color: 'bg-slate-50 text-slate-600 dark:bg-slate-800/40 dark:text-slate-400',        dot: 'bg-slate-400' },
};

const CONDITION_CONFIG: Record<string, { label: string; color: string }> = {
  excellent:        { label: 'Excellent',         color: 'text-emerald-600 dark:text-emerald-400' },
  good:             { label: 'Good',              color: 'text-blue-600 dark:text-blue-400' },
  fair:             { label: 'Fair',              color: 'text-amber-600 dark:text-amber-400' },
  poor:             { label: 'Poor',              color: 'text-orange-600 dark:text-orange-400' },
  broken:           { label: 'Broken',            color: 'text-red-600 dark:text-red-400' },
  needs_replacement: { label: 'Needs Replacement', color: 'text-rose-600 dark:text-rose-400' },
};

function StatusBadge({ status }: { status: string }) {
  const cfg = STATUS_CONFIG[status] ?? { label: status, color: 'bg-gray-100 text-gray-600', dot: 'bg-gray-400' };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${cfg.color}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}

function AssetCardView({ asset, onView, onEdit, onQR, onDelete }: {
  asset: Asset;
  onView: () => void;
  onEdit: () => void;
  onQR: () => void;
  onDelete: () => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const cond = CONDITION_CONFIG[asset.condition] ?? { label: asset.condition, color: 'text-gray-500' };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.97 }}
      className="bg-white dark:bg-[#111827] border border-[#E6EEF5] dark:border-[#1E2D45] rounded-2xl p-4 hover:shadow-md hover:border-[#CBD5E1] dark:hover:border-[#2D3F5C] transition-all duration-200 group cursor-pointer"
      onClick={onView}
    >
      {asset.images?.[0] && (
        <div className="-mx-4 -mt-4 mb-3 h-28 overflow-hidden rounded-t-2xl bg-[#F1F5F9] dark:bg-[#1E2D45]">
          <img src={asset.images[0]} alt={asset.name} loading="lazy"
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
        </div>
      )}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-[#F1F5F9] dark:bg-[#1E2D45] flex items-center justify-center flex-shrink-0">
            <Package size={18} className="text-[#075DE8]" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-mono text-[#64748B] dark:text-[#94A3B8]">{asset.asset_code}</p>
            <p className="text-sm font-semibold text-[#0F172A] dark:text-[#F8FAFC] truncate max-w-[140px]">{asset.name}</p>
          </div>
        </div>
        <div className="relative" onClick={e => e.stopPropagation()}>
          <button
            onClick={() => setMenuOpen(v => !v)}
            className="p-1.5 rounded-lg hover:bg-[#F1F5F9] dark:hover:bg-[#1E2D45] text-[#94A3B8] opacity-0 group-hover:opacity-100 transition-all"
          >
            <MoreHorizontal size={15} />
          </button>
          <AnimatePresence>
            {menuOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -4 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -4 }}
                className="absolute right-0 top-8 z-20 w-40 bg-white dark:bg-[#1E2D45] border border-[#E6EEF5] dark:border-[#2D3F5C] rounded-xl shadow-lg py-1"
              >
                {[
                  { icon: <Eye size={13} />, label: 'View Details', action: onView },
                  { icon: <Edit size={13} />, label: 'Edit', action: onEdit },
                  { icon: <QrCode size={13} />, label: 'QR Code', action: onQR },
                  { icon: <Trash2 size={13} />, label: 'Delete', action: onDelete, danger: true },
                ].map(item => (
                  <button
                    key={item.label}
                    onClick={() => { item.action(); setMenuOpen(false); }}
                    className={`w-full flex items-center gap-2 px-3 py-2 text-xs font-medium transition-colors ${
                      item.danger
                        ? 'text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20'
                        : 'text-[#334155] dark:text-[#CBD5E1] hover:bg-[#F8FAFC] dark:hover:bg-[#253557]'
                    }`}
                  >
                    {item.icon}{item.label}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="space-y-2 mb-3">
        {asset.category && (
          <div className="flex items-center gap-1.5">
            <Tag size={11} className="text-[#94A3B8]" />
            <span className="text-xs text-[#64748B] dark:text-[#94A3B8]">{asset.category.name}</span>
          </div>
        )}
        {asset.property_name && (
          <div className="flex items-center gap-1.5">
            <Package size={11} className="text-[#94A3B8]" />
            <span className="text-xs text-[#64748B] dark:text-[#94A3B8] truncate">{asset.property_name}{asset.unit_number ? ` · Unit ${asset.unit_number}` : ''}</span>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-[#F1F5F9] dark:border-[#1E2D45]">
        <StatusBadge status={asset.status} />
        <span className={`text-xs font-medium ${cond.color}`}>{cond.label}</span>
      </div>

      {asset.current_value != null && (
        <p className="mt-2 text-xs text-[#64748B] dark:text-[#94A3B8]">
          Value: <span className="font-semibold text-[#334155] dark:text-[#CBD5E1]">£{asset.current_value.toLocaleString()}</span>
        </p>
      )}
    </motion.div>
  );
}

function AssetRowView({ asset, onView, onEdit, onQR, onDelete }: {
  asset: Asset;
  onView: () => void;
  onEdit: () => void;
  onQR: () => void;
  onDelete: () => void;
}) {
  const cond = CONDITION_CONFIG[asset.condition] ?? { label: asset.condition, color: 'text-gray-500' };
  return (
    <tr
      className="border-b border-[#F1F5F9] dark:border-[#1E2D45] hover:bg-[#F8FAFC] dark:hover:bg-[#1A2744] cursor-pointer transition-colors"
      onClick={onView}
    >
      <td className="px-4 py-3">
        <div>
          <span className="text-xs font-mono text-[#64748B] dark:text-[#94A3B8]">{asset.asset_code}</span>
          <p className="text-sm font-medium text-[#0F172A] dark:text-[#F8FAFC]">{asset.name}</p>
        </div>
      </td>
      <td className="px-4 py-3 text-sm text-[#64748B] dark:text-[#94A3B8]">{asset.category?.name ?? '—'}</td>
      <td className="px-4 py-3 text-sm text-[#64748B] dark:text-[#94A3B8]">{asset.property_name ?? '—'}{asset.unit_number ? ` / ${asset.unit_number}` : ''}</td>
      <td className="px-4 py-3"><StatusBadge status={asset.status} /></td>
      <td className={`px-4 py-3 text-xs font-medium ${cond.color}`}>{cond.label}</td>
      <td className="px-4 py-3 text-sm text-[#64748B] dark:text-[#94A3B8]">
        {asset.warranty_expiry ? new Date(asset.warranty_expiry).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}
      </td>
      <td className="px-4 py-3 text-sm text-[#334155] dark:text-[#CBD5E1]">
        {asset.current_value != null ? `£${asset.current_value.toLocaleString()}` : '—'}
      </td>
      <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
        <div className="flex items-center gap-1">
          {[
            { icon: <Eye size={14} />, action: onView, title: 'View' },
            { icon: <Edit size={14} />, action: onEdit, title: 'Edit' },
            { icon: <QrCode size={14} />, action: onQR, title: 'QR Code' },
            { icon: <Trash2 size={14} />, action: onDelete, title: 'Delete', danger: true },
          ].map(btn => (
            <button
              key={btn.title}
              onClick={btn.action}
              title={btn.title}
              className={`p-1.5 rounded-lg transition-colors ${
                btn.danger
                  ? 'text-[#94A3B8] hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20'
                  : 'text-[#94A3B8] hover:text-[#334155] dark:hover:text-[#CBD5E1] hover:bg-[#F1F5F9] dark:hover:bg-[#1E2D45]'
              }`}
            >
              {btn.icon}
            </button>
          ))}
        </div>
      </td>
    </tr>
  );
}

export function AssetsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [assets, setAssets] = useState<Asset[]>([]);
  const [categories, setCategories] = useState<AssetCategory[]>([]);
  const [kpis, setKpis] = useState<AssetKPIs | null>(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingAsset, setEditingAsset] = useState<Asset | null>(null);
  const [qrAsset, setQrAsset] = useState<Asset | null>(null);
  const [deleteAsset, setDeleteAsset] = useState<Asset | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = useCallback((message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  }, []);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [cats, kpiData] = await Promise.all([
        assetService.getCategories(),
        assetService.getKPIs(),
      ]);
      setCategories(cats);
      setKpis(kpiData);
    } catch {
      showToast('Failed to load data', 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  const loadAssets = useCallback(async () => {
    try {
      const data = await assetService.getAssets({
        search: search || undefined,
        status: filterStatus || undefined,
        category_id: filterCategory || undefined,
      });
      setAssets(data);
    } catch {
      showToast('Failed to load assets', 'error');
    }
  }, [search, filterStatus, filterCategory, showToast]);

  useEffect(() => { loadData(); }, [loadData]);
  useEffect(() => { loadAssets(); }, [loadAssets]);

  const handleDelete = async () => {
    if (!deleteAsset) return;
    setDeleting(true);
    try {
      await assetService.deleteAsset(deleteAsset.id, user?.name ?? 'Unknown');
      setDeleteAsset(null);
      showToast(`"${deleteAsset.name}" deleted`);
      loadAssets();
      loadData();
    } catch {
      showToast('Failed to delete asset', 'error');
    } finally {
      setDeleting(false);
    }
  };

  const handleFormSuccess = () => {
    setShowCreateModal(false);
    setEditingAsset(null);
    showToast(editingAsset ? 'Asset updated' : 'Asset created');
    loadAssets();
    loadData();
  };

  const kpiCards = kpis ? [
    { title: 'Total Assets',        value: kpis.total,             icon: <Package size={18} />,       subtitle: `+${kpis.added_this_month} this month`, variant: 'gradient' as const },
    { title: 'Available',           value: kpis.available,         icon: <CheckCircle size={18} />,   subtitle: 'Ready to assign',                       variant: 'success' as const },
    { title: 'Under Maintenance',   value: kpis.maintenance_due,   icon: <Wrench size={18} />,        subtitle: 'Active jobs',                           variant: kpis.maintenance_due > 0 ? 'warning' as const : 'default' as const },
    { title: 'Warranty Expiring',   value: kpis.warranty_expiring, icon: <AlertTriangle size={18} />, subtitle: 'Within 30 days',                        variant: kpis.warranty_expiring > 0 ? 'danger' as const : 'default' as const },
    { title: 'Total Asset Value',   value: `£${(kpis.total_value / 1000).toFixed(0)}k`, icon: <DollarSign size={18} />, subtitle: 'Current estimated',   variant: 'default' as const },
  ] : [];

  const activeFilters = [filterStatus, filterCategory].filter(Boolean).length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Asset Inventory"
        subtitle="Track, manage, and maintain every physical asset across your properties"
        actions={
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" leftIcon={<Upload size={14} />}>Import</Button>
            <Button variant="secondary" size="sm" leftIcon={<Download size={14} />}>Export</Button>
            <Button variant="primary" size="sm" leftIcon={<Plus size={14} />} onClick={() => setShowCreateModal(true)}>
              Add Asset
            </Button>
          </div>
        }
      />

      {/* KPI Cards */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-28 rounded-2xl bg-[#F1F5F9] dark:bg-[#1E2D45] animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {kpiCards.map(card => (
            <StatCard key={card.title} {...card} />
          ))}
        </div>
      )}

      {/* Toolbar */}
      <Card padding="sm">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <Input
              placeholder="Search by name, code, serial number…"
              leftElement={<Search size={15} className="text-[#94A3B8]" />}
              value={search}
              onChange={e => setSearch(e.target.value)}
              rightElement={
                search ? (
                  <button onClick={() => setSearch('')} className="p-0.5 rounded hover:bg-[#F1F5F9] dark:hover:bg-[#1E2D45]">
                    <X size={13} className="text-[#94A3B8]" />
                  </button>
                ) : undefined
              }
            />
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowFilters(v => !v)}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium border transition-all ${
                showFilters || activeFilters > 0
                  ? 'border-[#075DE8] text-[#075DE8] bg-blue-50 dark:bg-blue-900/20'
                  : 'border-[#E2E8F0] dark:border-[#1E2D45] text-[#64748B] hover:bg-[#F8FAFC] dark:hover:bg-[#1E2D45]'
              }`}
            >
              <Filter size={14} />
              Filters
              {activeFilters > 0 && (
                <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-[#075DE8] text-white">{activeFilters}</span>
              )}
            </button>
            <div className="flex items-center border border-[#E2E8F0] dark:border-[#1E2D45] rounded-xl overflow-hidden">
              {(['grid', 'list'] as const).map(mode => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  className={`p-2 transition-colors ${viewMode === mode ? 'bg-[#075DE8] text-white' : 'text-[#64748B] hover:bg-[#F8FAFC] dark:hover:bg-[#1E2D45]'}`}
                >
                  {mode === 'grid' ? <Grid3X3 size={15} /> : <List size={15} />}
                </button>
              ))}
            </div>
          </div>
        </div>

        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="flex flex-wrap gap-3 pt-3 mt-3 border-t border-[#F1F5F9] dark:border-[#1E2D45]">
                <select
                  value={filterStatus}
                  onChange={e => setFilterStatus(e.target.value)}
                  className="px-3 py-1.5 text-sm border border-[#E2E8F0] dark:border-[#1E2D45] rounded-xl bg-white dark:bg-[#111827] text-[#334155] dark:text-[#CBD5E1] focus:outline-none focus:ring-2 focus:ring-[#075DE8]"
                >
                  <option value="">All Statuses</option>
                  {Object.entries(STATUS_CONFIG).map(([v, c]) => <option key={v} value={v}>{c.label}</option>)}
                </select>
                <select
                  value={filterCategory}
                  onChange={e => setFilterCategory(e.target.value)}
                  className="px-3 py-1.5 text-sm border border-[#E2E8F0] dark:border-[#1E2D45] rounded-xl bg-white dark:bg-[#111827] text-[#334155] dark:text-[#CBD5E1] focus:outline-none focus:ring-2 focus:ring-[#075DE8]"
                >
                  <option value="">All Categories</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
                {activeFilters > 0 && (
                  <button
                    onClick={() => { setFilterStatus(''); setFilterCategory(''); }}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-xl transition-colors"
                  >
                    <X size={13} /> Clear all
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>

      {/* Asset count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-[#64748B] dark:text-[#94A3B8]">
          {assets.length} asset{assets.length !== 1 ? 's' : ''}
          {search && ` matching "${search}"`}
        </p>
      </div>

      {/* Asset Grid / List */}
      {assets.length === 0 && !loading ? (
        <EmptyState
          icon={<Package size={32} className="text-[#94A3B8]" />}
          title="No assets found"
          description={search || activeFilters > 0 ? 'Try adjusting your search or filters.' : 'Get started by adding your first asset.'}
          action={!search && !activeFilters ? <Button variant="primary" size="sm" leftIcon={<Plus size={14} />} onClick={() => setShowCreateModal(true)}>Add First Asset</Button> : undefined}
        />
      ) : viewMode === 'grid' ? (
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <AnimatePresence mode="popLayout">
            {assets.map(asset => (
              <AssetCardView
                key={asset.id}
                asset={asset}
                onView={() => navigate(`/assets/${asset.id}`)}
                onEdit={() => setEditingAsset(asset)}
                onQR={() => setQrAsset(asset)}
                onDelete={() => setDeleteAsset(asset)}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      ) : (
        <Card padding="sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-[#F1F5F9] dark:border-[#1E2D45]">
                  {['Asset', 'Category', 'Location', 'Status', 'Condition', 'Warranty', 'Value', ''].map(h => (
                    <th key={h} className="px-4 py-3 text-xs font-semibold text-[#64748B] dark:text-[#94A3B8] uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {assets.map(asset => (
                  <AssetRowView
                    key={asset.id}
                    asset={asset}
                    onView={() => navigate(`/assets/${asset.id}`)}
                    onEdit={() => setEditingAsset(asset)}
                    onQR={() => setQrAsset(asset)}
                    onDelete={() => setDeleteAsset(asset)}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Create / Edit Modal */}
      <Modal
        open={showCreateModal || !!editingAsset}
        onClose={() => { setShowCreateModal(false); setEditingAsset(null); }}
        title={editingAsset ? `Edit — ${editingAsset.name}` : 'Add New Asset'}
        size="xl"
      >
        <AssetForm
          asset={editingAsset ?? undefined}
          categories={categories}
          onSuccess={handleFormSuccess}
          onCancel={() => { setShowCreateModal(false); setEditingAsset(null); }}
        />
      </Modal>

      {/* QR Code Modal */}
      {qrAsset && (
        <QRCodeModal asset={qrAsset} onClose={() => setQrAsset(null)} />
      )}

      {/* Delete Confirm */}
      <Modal
        open={!!deleteAsset}
        onClose={() => setDeleteAsset(null)}
        title="Delete Asset"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-sm text-[#334155] dark:text-[#CBD5E1]">
            Are you sure you want to delete <strong>{deleteAsset?.name}</strong>? This action cannot be undone.
          </p>
          <div className="flex gap-3 justify-end">
            <Button variant="secondary" size="sm" onClick={() => setDeleteAsset(null)}>Cancel</Button>
            <Button variant="danger" size="sm" loading={deleting} onClick={handleDelete}>Delete</Button>
          </div>
        </div>
      </Modal>

      {/* Toast */}
      <div className="fixed bottom-4 right-4 z-50">
        <AnimatePresence>
          {toast && (
            <Toast
              message={toast.message}
              type={toast.type}
              onClose={() => setToast(null)}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
