import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button, Input, Select } from '../../../components/ui';
import { assetService } from '../../../services';
import { useAuth } from '../../../lib/auth';
import type { Asset, AssetCategory } from '../../../types';

interface Props {
  asset?: Asset;
  categories: AssetCategory[];
  onSuccess: () => void;
  onCancel: () => void;
}

const STATUSES = [
  'available', 'installed', 'assigned', 'in_maintenance',
  'out_of_service', 'damaged', 'reserved', 'archived',
];
const CONDITIONS = ['excellent', 'good', 'fair', 'poor', 'broken', 'needs_replacement'];
const DEPRECIATION = ['straight_line', 'declining_balance', 'none'];

type FormData = {
  name: string;
  category_id: string;
  subcategory: string;
  description: string;
  property_name: string;
  building: string;
  floor: string;
  unit_number: string;
  room: string;
  serial_number: string;
  manufacturer: string;
  brand: string;
  model: string;
  purchase_date: string;
  installation_date: string;
  supplier: string;
  vendor: string;
  invoice_number: string;
  purchase_cost: string;
  current_value: string;
  depreciation_method: string;
  warranty_expiry: string;
  useful_life_years: string;
  replacement_date: string;
  condition: string;
  status: string;
  assigned_to: string;
  notes: string;
};

export function AssetForm({ asset, categories, onSuccess, onCancel }: Props) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'basic' | 'location' | 'financial' | 'notes'>('basic');

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      name: asset?.name ?? '',
      category_id: asset?.category_id ?? '',
      subcategory: asset?.subcategory ?? '',
      description: asset?.description ?? '',
      property_name: asset?.property_name ?? '',
      building: asset?.building ?? '',
      floor: asset?.floor ?? '',
      unit_number: asset?.unit_number ?? '',
      room: asset?.room ?? '',
      serial_number: asset?.serial_number ?? '',
      manufacturer: asset?.manufacturer ?? '',
      brand: asset?.brand ?? '',
      model: asset?.model ?? '',
      purchase_date: asset?.purchase_date ?? '',
      installation_date: asset?.installation_date ?? '',
      supplier: asset?.supplier ?? '',
      vendor: asset?.vendor ?? '',
      invoice_number: asset?.invoice_number ?? '',
      purchase_cost: asset?.purchase_cost?.toString() ?? '',
      current_value: asset?.current_value?.toString() ?? '',
      depreciation_method: asset?.depreciation_method ?? 'straight_line',
      warranty_expiry: asset?.warranty_expiry ?? '',
      useful_life_years: asset?.useful_life_years?.toString() ?? '',
      replacement_date: asset?.replacement_date ?? '',
      condition: asset?.condition ?? 'good',
      status: asset?.status ?? 'available',
      assigned_to: asset?.assigned_to ?? '',
      notes: asset?.notes ?? '',
    },
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    setError('');
    try {
      const payload = {
        name: data.name,
        category_id: data.category_id || undefined,
        subcategory: data.subcategory || undefined,
        description: data.description || undefined,
        property_name: data.property_name || undefined,
        building: data.building || undefined,
        floor: data.floor || undefined,
        unit_number: data.unit_number || undefined,
        room: data.room || undefined,
        serial_number: data.serial_number || undefined,
        manufacturer: data.manufacturer || undefined,
        brand: data.brand || undefined,
        model: data.model || undefined,
        purchase_date: data.purchase_date || undefined,
        installation_date: data.installation_date || undefined,
        supplier: data.supplier || undefined,
        vendor: data.vendor || undefined,
        invoice_number: data.invoice_number || undefined,
        purchase_cost: data.purchase_cost ? parseFloat(data.purchase_cost) : undefined,
        current_value: data.current_value ? parseFloat(data.current_value) : undefined,
        depreciation_method: data.depreciation_method,
        warranty_expiry: data.warranty_expiry || undefined,
        useful_life_years: data.useful_life_years ? parseInt(data.useful_life_years) : undefined,
        replacement_date: data.replacement_date || undefined,
        condition: data.condition as Asset['condition'],
        status: data.status as Asset['status'],
        assigned_to: data.assigned_to || undefined,
        notes: data.notes || undefined,
      };

      if (asset) {
        await assetService.updateAsset(asset.id, payload, user?.name ?? 'Unknown');
      } else {
        await assetService.createAsset(payload, user?.name ?? 'Unknown');
      }
      onSuccess();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to save asset');
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'basic' as const, label: 'Basic Info' },
    { id: 'location' as const, label: 'Location' },
    { id: 'financial' as const, label: 'Financial' },
    { id: 'notes' as const, label: 'Notes' },
  ];

  const fieldCls = 'px-3 py-2 w-full text-sm border border-[#E2E8F0] dark:border-[#1E2D45] rounded-xl bg-white dark:bg-[#111827] text-[#334155] dark:text-[#CBD5E1] focus:outline-none focus:ring-2 focus:ring-[#075DE8] transition-colors placeholder:text-[#CBD5E1] dark:placeholder:text-[#475569]';

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Tab Navigation */}
      <div className="flex gap-1 p-1 bg-[#F1F5F9] dark:bg-[#1E2D45] rounded-xl">
        {tabs.map(tab => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeTab === tab.id
                ? 'bg-white dark:bg-[#111827] text-[#075DE8] shadow-sm'
                : 'text-[#64748B] hover:text-[#334155] dark:hover:text-[#CBD5E1]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Basic Info */}
      {activeTab === 'basic' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-[#334155] dark:text-[#CBD5E1] mb-1.5">Asset Name <span className="text-rose-500">*</span></label>
            <input {...register('name', { required: true })} placeholder="e.g. Samsung 65″ Smart TV" className={fieldCls} />
            {errors.name && <p className="text-xs text-rose-500 mt-1">Name is required</p>}
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#334155] dark:text-[#CBD5E1] mb-1.5">Category</label>
            <select {...register('category_id')} className={fieldCls}>
              <option value="">Select category…</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#334155] dark:text-[#CBD5E1] mb-1.5">Subcategory</label>
            <input {...register('subcategory')} placeholder="e.g. Wall-mounted" className={fieldCls} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#334155] dark:text-[#CBD5E1] mb-1.5">Status</label>
            <select {...register('status')} className={fieldCls}>
              {STATUSES.map(s => <option key={s} value={s}>{s.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#334155] dark:text-[#CBD5E1] mb-1.5">Condition</label>
            <select {...register('condition')} className={fieldCls}>
              {CONDITIONS.map(c => <option key={c} value={c}>{c.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#334155] dark:text-[#CBD5E1] mb-1.5">Brand</label>
            <input {...register('brand')} placeholder="e.g. Samsung" className={fieldCls} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#334155] dark:text-[#CBD5E1] mb-1.5">Model</label>
            <input {...register('model')} placeholder="e.g. UE65AU7100" className={fieldCls} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#334155] dark:text-[#CBD5E1] mb-1.5">Serial Number</label>
            <input {...register('serial_number')} placeholder="e.g. SN1234567890" className={fieldCls} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#334155] dark:text-[#CBD5E1] mb-1.5">Manufacturer</label>
            <input {...register('manufacturer')} placeholder="e.g. Samsung Electronics" className={fieldCls} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#334155] dark:text-[#CBD5E1] mb-1.5">Assigned To</label>
            <input {...register('assigned_to')} placeholder="Tenant name or unit" className={fieldCls} />
          </div>
        </div>
      )}

      {/* Location */}
      {activeTab === 'location' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-[#334155] dark:text-[#CBD5E1] mb-1.5">Property</label>
            <input {...register('property_name')} placeholder="e.g. Maple House" className={fieldCls} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#334155] dark:text-[#CBD5E1] mb-1.5">Building</label>
            <input {...register('building')} placeholder="e.g. Block A" className={fieldCls} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#334155] dark:text-[#CBD5E1] mb-1.5">Floor</label>
            <input {...register('floor')} placeholder="e.g. Ground" className={fieldCls} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#334155] dark:text-[#CBD5E1] mb-1.5">Unit / Room No.</label>
            <input {...register('unit_number')} placeholder="e.g. 305" className={fieldCls} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#334155] dark:text-[#CBD5E1] mb-1.5">Room</label>
            <input {...register('room')} placeholder="e.g. Lounge" className={fieldCls} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#334155] dark:text-[#CBD5E1] mb-1.5">Purchase Date</label>
            <input type="date" {...register('purchase_date')} className={fieldCls} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#334155] dark:text-[#CBD5E1] mb-1.5">Installation Date</label>
            <input type="date" {...register('installation_date')} className={fieldCls} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#334155] dark:text-[#CBD5E1] mb-1.5">Warranty Expires</label>
            <input type="date" {...register('warranty_expiry')} className={fieldCls} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#334155] dark:text-[#CBD5E1] mb-1.5">Replacement Date</label>
            <input type="date" {...register('replacement_date')} className={fieldCls} />
          </div>
        </div>
      )}

      {/* Financial */}
      {activeTab === 'financial' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#334155] dark:text-[#CBD5E1] mb-1.5">Purchase Cost (£)</label>
            <input type="number" step="0.01" {...register('purchase_cost')} placeholder="0.00" className={fieldCls} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#334155] dark:text-[#CBD5E1] mb-1.5">Current Value (£)</label>
            <input type="number" step="0.01" {...register('current_value')} placeholder="0.00" className={fieldCls} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#334155] dark:text-[#CBD5E1] mb-1.5">Depreciation Method</label>
            <select {...register('depreciation_method')} className={fieldCls}>
              {DEPRECIATION.map(d => <option key={d} value={d}>{d.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#334155] dark:text-[#CBD5E1] mb-1.5">Useful Life (years)</label>
            <input type="number" {...register('useful_life_years')} placeholder="e.g. 5" className={fieldCls} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#334155] dark:text-[#CBD5E1] mb-1.5">Supplier</label>
            <input {...register('supplier')} placeholder="e.g. Argos" className={fieldCls} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#334155] dark:text-[#CBD5E1] mb-1.5">Vendor / Contractor</label>
            <input {...register('vendor')} placeholder="e.g. ABC Supplies" className={fieldCls} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#334155] dark:text-[#CBD5E1] mb-1.5">Invoice Number</label>
            <input {...register('invoice_number')} placeholder="e.g. INV-2024-001" className={fieldCls} />
          </div>
        </div>
      )}

      {/* Notes */}
      {activeTab === 'notes' && (
        <div>
          <label className="block text-xs font-semibold text-[#334155] dark:text-[#CBD5E1] mb-1.5">Notes</label>
          <textarea
            {...register('notes')}
            rows={8}
            placeholder="Any additional notes about this asset…"
            className={`${fieldCls} resize-none`}
          />
        </div>
      )}

      {error && (
        <p className="text-sm text-rose-600 bg-rose-50 dark:bg-rose-900/20 px-3 py-2 rounded-xl">{error}</p>
      )}

      <div className="flex justify-end gap-3 pt-2 border-t border-[#F1F5F9] dark:border-[#1E2D45]">
        <Button type="button" variant="secondary" size="sm" onClick={onCancel}>Cancel</Button>
        <Button type="submit" variant="primary" size="sm" loading={loading}>
          {asset ? 'Save Changes' : 'Create Asset'}
        </Button>
      </div>
    </form>
  );
}
