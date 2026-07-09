import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Building2, ChevronRight, ArrowLeft, MapPin, Users, ShieldCheck,
  ShieldAlert, ShieldX, Edit2, Plus, QrCode, FileBarChart, MoreHorizontal,
  Star, Share2, Printer, Download, Wrench, CreditCard, Package, Bell,
  CheckCircle, AlertTriangle, XCircle, Clock, TrendingUp, TrendingDown,
  Home, Layers, FileText, Activity, Settings, BarChart3, Zap, Droplets,
  Flame, Wifi, Car, TreePine, Accessibility, ChevronDown, ExternalLink,
  Phone, Mail, Calendar, DollarSign, Shield, Tag, Hash,
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadialBarChart, RadialBar,
} from 'recharts';
import { properties, certificates, rooms, tenants, users } from '../../data/mockData';
import { Badge, Button } from '../../components/ui';
import { FloorPlan3D } from '../floorplan/FloorPlan3D';
import type { Property } from '../../types';

// ── palette ───────────────────────────────────────────────────────────────────
const BLUE  = '#075DE8';
const TEAL  = '#0EA5E9';
const GREEN = '#10B981';
const AMBER = '#F59E0B';
const ROSE  = '#F43F5E';
const PIE_COLORS = [BLUE, TEAL, GREEN, AMBER, ROSE, '#8B5CF6'];

// ── demo data baked-in ────────────────────────────────────────────────────────
const REVENUE_TREND = [
  { month: 'Aug', income: 21400, expenses: 4200, rent: 19800 },
  { month: 'Sep', income: 22100, expenses: 3900, rent: 20500 },
  { month: 'Oct', income: 23000, expenses: 5100, rent: 21000 },
  { month: 'Nov', income: 21800, expenses: 4400, rent: 20200 },
  { month: 'Dec', income: 22600, expenses: 6200, rent: 21400 },
  { month: 'Jan', income: 24100, expenses: 4800, rent: 22600 },
  { month: 'Feb', income: 23500, expenses: 3700, rent: 22100 },
  { month: 'Mar', income: 25200, expenses: 5300, rent: 23800 },
  { month: 'Apr', income: 26000, expenses: 4600, rent: 24500 },
  { month: 'May', income: 27400, expenses: 5800, rent: 25900 },
  { month: 'Jun', income: 28400, expenses: 5200, rent: 26800 },
  { month: 'Jul', income: 29100, expenses: 4900, rent: 27600 },
];

const OCCUPANCY_TREND = [
  { month: 'Jan', rate: 78 }, { month: 'Feb', rate: 83 }, { month: 'Mar', rate: 89 },
  { month: 'Apr', rate: 92 }, { month: 'May', rate: 94 }, { month: 'Jun', rate: 88 },
  { month: 'Jul', rate: 91 }, { month: 'Aug', rate: 95 }, { month: 'Sep', rate: 97 },
  { month: 'Oct', rate: 100 }, { month: 'Nov', rate: 97 }, { month: 'Dec', rate: 94 },
];

const MAINTENANCE_BY_TYPE = [
  { name: 'Plumbing', value: 28, fill: BLUE },
  { name: 'Electrical', value: 22, fill: TEAL },
  { name: 'HVAC', value: 18, fill: GREEN },
  { name: 'Structural', value: 12, fill: AMBER },
  { name: 'Appliances', value: 11, fill: ROSE },
  { name: 'Other', value: 9, fill: '#8B5CF6' },
];

const ASSET_BY_CATEGORY = [
  { name: 'Furniture', value: 112, fill: BLUE },
  { name: 'Appliances', value: 84, fill: TEAL },
  { name: 'HVAC', value: 24, fill: GREEN },
  { name: 'Safety', value: 68, fill: AMBER },
  { name: 'IT/AV', value: 38, fill: ROSE },
];

const MAINTENANCE_MONTHLY = [
  { month: 'Jan', open: 4, completed: 8, cost: 1200 },
  { month: 'Feb', open: 3, completed: 6, cost: 900 },
  { month: 'Mar', open: 6, completed: 7, cost: 2100 },
  { month: 'Apr', open: 2, completed: 9, cost: 680 },
  { month: 'May', open: 5, completed: 11, cost: 1800 },
  { month: 'Jun', open: 8, completed: 10, cost: 2400 },
  { month: 'Jul', open: 4, completed: 7, cost: 1100 },
];

const CERT_LABELS: Record<string, string> = {
  gas_safety: 'Gas Safety', fire_safety: 'Fire Safety',
  electrical_eicr: 'Electrical EICR', buildings_insurance: 'Buildings Insurance',
  hmo_licence: 'HMO Licence', epc: 'EPC Certificate',
  pat_testing: 'PAT Testing', legionella: 'Legionella Risk',
};

const ACTIVITY_FEED = [
  { id: 1, icon: Users,       color: 'text-blue-500 bg-blue-50 dark:bg-blue-900/20',   title: 'New tenant moved in',         desc: 'James Thornton assigned to Room 3',     time: '2 hours ago' },
  { id: 2, icon: Wrench,      color: 'text-amber-500 bg-amber-50 dark:bg-amber-900/20', title: 'Maintenance ticket created',   desc: 'Boiler service – Room 2 radiator fault',time: '5 hours ago' },
  { id: 3, icon: ShieldCheck, color: 'text-green-500 bg-green-50 dark:bg-green-900/20', title: 'Gas Safety cert renewed',      desc: 'Valid until 8 Jul 2027',               time: 'Yesterday' },
  { id: 4, icon: CreditCard,  color: 'text-purple-500 bg-purple-50 dark:bg-purple-900/20', title: 'Rent payment received',     desc: '£850 from James Thornton',             time: 'Yesterday' },
  { id: 5, icon: FileText,    color: 'text-teal-500 bg-teal-50 dark:bg-teal-900/20',   title: 'Document uploaded',            desc: 'Tenancy agreement – Emily Chang',       time: '2 days ago' },
  { id: 6, icon: Package,     color: 'text-rose-500 bg-rose-50 dark:bg-rose-900/20',   title: 'New asset registered',         desc: 'Samsung Fridge-Freezer (AST-0441)',     time: '3 days ago' },
  { id: 7, icon: QrCode,      color: 'text-indigo-500 bg-indigo-50 dark:bg-indigo-900/20', title: 'QR codes generated',       desc: '6 unit QR codes printed',              time: '4 days ago' },
  { id: 8, icon: Bell,        color: 'text-orange-500 bg-orange-50 dark:bg-orange-900/20', title: 'Notice published',         desc: 'Planned water shutdown – 14 Jul',       time: '5 days ago' },
];

const DEMO_ASSETS = [
  { id: 'AST-0441', name: 'Samsung Fridge-Freezer',    category: 'Appliances', condition: 'good',      value: 489,  status: 'installed',   warranty: '2027-03-12', room: 'Kitchen' },
  { id: 'AST-0442', name: 'Baxi Boiler 28HE',           category: 'HVAC',       condition: 'fair',      value: 1250, status: 'installed',   warranty: '2025-11-01', room: 'Utility' },
  { id: 'AST-0443', name: 'Miele Washing Machine',      category: 'Appliances', condition: 'excellent', value: 679,  status: 'installed',   warranty: '2028-06-20', room: 'Utility' },
  { id: 'AST-0444', name: 'Kidde Smoke Detector ×6',   category: 'Safety',     condition: 'good',      value: 210,  status: 'installed',   warranty: '2026-01-15', room: 'All Floors' },
  { id: 'AST-0445', name: 'Hive Smart Thermostat',      category: 'IT/AV',      condition: 'excellent', value: 179,  status: 'installed',   warranty: '2027-09-01', room: 'Hallway' },
  { id: 'AST-0446', name: 'IKEA Malm Bed Frame ×6',    category: 'Furniture',  condition: 'good',      value: 840,  status: 'assigned',    warranty: null,         room: 'Bedrooms' },
  { id: 'AST-0447', name: 'Hotpoint Dishwasher',        category: 'Appliances', condition: 'fair',      value: 350,  status: 'in_maintenance', warranty: '2026-04-08', room: 'Kitchen' },
  { id: 'AST-0448', name: 'Fire Extinguisher ×4',       category: 'Safety',     condition: 'good',      value: 280,  status: 'installed',   warranty: '2025-12-01', room: 'All Floors' },
];

const DEMO_TICKETS = [
  { id: 'TKT-1041', title: 'Boiler not heating Room 2',   priority: 'high',   status: 'in_progress', date: '2026-07-07', technician: 'Dave Smith' },
  { id: 'TKT-1042', title: 'Bathroom tap dripping – Rm 4', priority: 'medium', status: 'submitted',  date: '2026-07-06', technician: null },
  { id: 'TKT-1043', title: 'Front door lock stiff',        priority: 'low',    status: 'submitted',  date: '2026-07-05', technician: null },
  { id: 'TKT-1044', title: 'Kitchen extractor fan noise',  priority: 'low',    status: 'completed',  date: '2026-07-02', technician: 'Mike Jones' },
  { id: 'TKT-1045', title: 'Window seal broken – Rm 1',    priority: 'medium', status: 'completed',  date: '2026-06-28', technician: 'Dave Smith' },
  { id: 'TKT-1046', title: 'Exterior light bulb out',      priority: 'low',    status: 'completed',  date: '2026-06-24', technician: 'Mike Jones' },
];

const AMENITIES = [
  { icon: Wifi,         label: 'High-Speed WiFi',    available: true },
  { icon: Car,          label: 'Off-Street Parking', available: true },
  { icon: TreePine,     label: 'Private Garden',     available: true },
  { icon: Accessibility, label: 'Step-Free Access',  available: false },
  { icon: Zap,          label: 'Smart Thermostat',   available: true },
  { icon: Droplets,     label: 'Mains Water',        available: true },
  { icon: Flame,        label: 'Gas Central Heating',available: true },
  { icon: Layers,       label: 'Lift / Elevator',    available: false },
];

// ── Animated counter ──────────────────────────────────────────────────────────
function AnimatedNumber({ value, prefix = '', suffix = '', decimals = 0 }: { value: number; prefix?: string; suffix?: string; decimals?: number }) {
  const [display, setDisplay] = useState(0);
  const raf = useRef<number>(0);
  const start = useRef(performance.now());

  useEffect(() => {
    start.current = performance.now();
    const animate = (now: number) => {
      const elapsed = now - start.current;
      const progress = Math.min(elapsed / 1200, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setDisplay(value * ease);
      if (progress < 1) raf.current = requestAnimationFrame(animate);
    };
    raf.current = requestAnimationFrame(animate);
    return () => { if (raf.current) cancelAnimationFrame(raf.current); };
  }, [value]);

  return (
    <span>
      {prefix}{decimals > 0 ? display.toFixed(decimals) : Math.round(display).toLocaleString('en-GB')}{suffix}
    </span>
  );
}

// ── Tab list ──────────────────────────────────────────────────────────────────
const TABS = [
  { id: 'overview',    label: 'Overview',    icon: Home },
  { id: 'floorplan',   label: 'Floor Plan',  icon: Layers },
  { id: 'tenants',     label: 'Tenants',     icon: Users },
  { id: 'assets',      label: 'Assets',      icon: Package },
  { id: 'maintenance', label: 'Maintenance', icon: Wrench },
  { id: 'financials',  label: 'Financials',  icon: CreditCard },
  { id: 'compliance',  label: 'Compliance',  icon: ShieldCheck },
  { id: 'documents',   label: 'Documents',   icon: FileText },
  { id: 'analytics',   label: 'Analytics',   icon: BarChart3 },
  { id: 'activity',    label: 'Activity',    icon: Activity },
];

// ── Status helpers ────────────────────────────────────────────────────────────
function certStatusColor(status: string) {
  return { valid: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200', expiring_soon: 'text-amber-600 bg-amber-50 dark:bg-amber-900/20 border-amber-200', expired: 'text-rose-600 bg-rose-50 dark:bg-rose-900/20 border-rose-200', missing: 'text-slate-500 bg-slate-50 dark:bg-slate-900/20 border-slate-200' }[status] ?? '';
}

function certStatusIcon(status: string) {
  if (status === 'valid')        return <CheckCircle size={14} className="text-emerald-500" />;
  if (status === 'expiring_soon') return <AlertTriangle size={14} className="text-amber-500" />;
  return <XCircle size={14} className="text-rose-500" />;
}

function priorityBadge(p: string) {
  const map: Record<string, string> = { high: 'text-rose-600 bg-rose-50 dark:bg-rose-900/20 border-rose-200', medium: 'text-amber-600 bg-amber-50 dark:bg-amber-900/20 border-amber-200', low: 'text-slate-600 bg-slate-50 dark:bg-slate-800 border-slate-200' };
  return map[p] ?? '';
}

function ticketStatusBadge(s: string) {
  const map: Record<string, string> = { in_progress: 'text-blue-600 bg-blue-50 dark:bg-blue-900/20 border-blue-200', submitted: 'text-amber-600 bg-amber-50 dark:bg-amber-900/20 border-amber-200', completed: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200' };
  return map[s] ?? '';
}

function conditionBadge(c: string) {
  const map: Record<string, string> = { excellent: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20', good: 'text-blue-600 bg-blue-50 dark:bg-blue-900/20', fair: 'text-amber-600 bg-amber-50 dark:bg-amber-900/20', poor: 'text-rose-600 bg-rose-50 dark:bg-rose-900/20', in_maintenance: 'text-violet-600 bg-violet-50 dark:bg-violet-900/20' };
  return map[c] ?? '';
}

// ── Main page ─────────────────────────────────────────────────────────────────
export function PropertyDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [healthScore] = useState(87);

  const property = properties.find(p => p.id === id);
  if (!property) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-4">
        <Building2 size={40} className="text-[#94A3B8]" />
        <p className="text-lg font-semibold text-[#334155] dark:text-[#CBD5E1]">Property not found</p>
        <Button onClick={() => navigate('/properties')} leftIcon={<ArrowLeft size={16} />}>Back to Properties</Button>
      </div>
    );
  }

  const propCerts  = certificates.filter(c => c.propertyId === id);
  const propRooms  = rooms.filter(r => r.propertyId === id);
  const propTenants = tenants.filter(t => t.propertyId === id);
  const manager    = users.find(u => property.assignedStaffIds.includes(u.id));
  const occupancy  = Math.round((property.occupiedRooms / property.totalRooms) * 100);
  const complianceScore = propCerts.length
    ? Math.round((propCerts.filter(c => c.status === 'valid').length / propCerts.length) * 100)
    : 0;
  const monthlyRevenue = propTenants.reduce((s, t) => s + t.rentAmount * 4.33, 0);
  const outstanding    = propTenants.reduce((s, t) => s + Math.abs(Math.min(t.rentBalance, 0)), 0);

  // ── KPI cards ──────────────────────────────────────────────────────────────
  const STATS = [
    { label: 'Total Rooms',    value: property.totalRooms,     icon: Home,       color: 'text-blue-600',    bg: 'bg-blue-50 dark:bg-blue-900/20',    prefix: '' },
    { label: 'Occupied',       value: property.occupiedRooms,  icon: Users,      color: 'text-green-600',   bg: 'bg-green-50 dark:bg-green-900/20',  prefix: '' },
    { label: 'Occupancy',      value: occupancy,               icon: TrendingUp, color: 'text-teal-600',    bg: 'bg-teal-50 dark:bg-teal-900/20',    suffix: '%' },
    { label: 'Monthly Rev.',   value: Math.round(monthlyRevenue), icon: CreditCard, color: 'text-violet-600', bg: 'bg-violet-50 dark:bg-violet-900/20', prefix: '£' },
    { label: 'Outstanding',    value: outstanding,             icon: AlertTriangle, color: 'text-rose-600', bg: 'bg-rose-50 dark:bg-rose-900/20',    prefix: '£' },
    { label: 'Total Assets',   value: 326,                     icon: Package,    color: 'text-amber-600',   bg: 'bg-amber-50 dark:bg-amber-900/20',  prefix: '' },
    { label: 'Asset Value',    value: 241600,                  icon: DollarSign, color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-900/20', prefix: '£' },
    { label: 'Compliance',     value: complianceScore,         icon: ShieldCheck, color: 'text-indigo-600', bg: 'bg-indigo-50 dark:bg-indigo-900/20', suffix: '%' },
  ];

  return (
    <div className="max-w-[1400px] mx-auto">

      {/* ── Breadcrumb ── */}
      <div className="flex items-center gap-2 text-sm text-[#64748B] mb-5">
        <Link to="/dashboard" className="hover:text-[#075DE8] transition-colors">Dashboard</Link>
        <ChevronRight size={14} />
        <Link to="/properties" className="hover:text-[#075DE8] transition-colors">Properties</Link>
        <ChevronRight size={14} />
        <span className="text-[#0F172A] dark:text-white font-medium">{property.address}</span>
      </div>

      {/* ── Property Header ── */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl overflow-hidden border border-[#E6EEF5] dark:border-[#1E2D45] mb-6 shadow-sm"
      >
        {/* hero image */}
        <div className="relative h-48 sm:h-56 md:h-64 overflow-hidden bg-gradient-to-br from-[#E5EEF6] to-[#D5E3F2]">
          <img
            src={property.imageUrl || 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 400"%3E%3Crect fill="%23e5eef6" width="1200" height="400"/%3E%3C/svg%3E'}
            alt={property.address}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

          {/* top actions */}
          <div className="absolute top-4 right-4 flex items-center gap-2">
            {[Share2, Star, Printer].map((Icon, i) => (
              <button key={i} className="w-8 h-8 rounded-xl bg-white/20 hover:bg-white/30 border border-white/25 flex items-center justify-center text-white/80 hover:text-white transition-all backdrop-blur-sm">
                <Icon size={15} />
              </button>
            ))}
            <button onClick={() => navigate('/properties')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/20 hover:bg-white/30 border border-white/25 text-white/80 hover:text-white text-xs font-medium transition-all backdrop-blur-sm">
              <ArrowLeft size={14} /> Back
            </button>
          </div>
        </div>

        {/* property meta row */}
        <div className="bg-white dark:bg-[#111827] px-6 sm:px-8 pt-3 pb-5">
          {/* icon floats up into the hero; text + actions stay in white section */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="flex items-start gap-4">
              {/* icon — only this element overlaps the hero with negative margin */}
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#075DE8] to-[#0EA5E9] flex items-center justify-center shadow-xl shadow-blue-500/30 border-4 border-white dark:border-[#111827] flex-shrink-0 -mt-10">
                <Building2 size={28} className="text-white" />
              </div>
              {/* name + address — always inside the white panel */}
              <div className="pt-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-xl font-bold text-[#0F172A] dark:text-white">{property.address}</h1>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${property.status === 'active' ? 'text-emerald-700 bg-emerald-50 border-emerald-200 dark:bg-emerald-900/20' : 'text-amber-700 bg-amber-50 border-amber-200 dark:bg-amber-900/20'}`}>
                    {property.status.charAt(0).toUpperCase() + property.status.slice(1)}
                  </span>
                </div>
                <div className="flex items-center gap-3 mt-1 text-sm text-[#64748B] flex-wrap">
                  <span className="flex items-center gap-1"><MapPin size={13} />{property.city}, {property.postcode}</span>
                  <span className="capitalize">{property.type.replace(/_/g, ' ')}</span>
                  <span>{property.localAuthority}</span>
                </div>
              </div>
            </div>

            {/* quick actions */}
            <div className="flex items-center gap-2 flex-wrap pt-1">
              <button className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-[#E6EEF5] dark:border-[#1E2D45] text-[#334155] dark:text-[#CBD5E1] text-sm font-medium hover:border-[#075DE8]/40 hover:bg-[#EFF6FF] dark:hover:bg-[#1E2D45] transition-all">
                <Edit2 size={14} /> Edit
              </button>
              <button className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-[#E6EEF5] dark:border-[#1E2D45] text-[#334155] dark:text-[#CBD5E1] text-sm font-medium hover:border-[#075DE8]/40 hover:bg-[#EFF6FF] dark:hover:bg-[#1E2D45] transition-all">
                <QrCode size={14} /> QR Codes
              </button>
              <button className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-[#E6EEF5] dark:border-[#1E2D45] text-[#334155] dark:text-[#CBD5E1] text-sm font-medium hover:border-[#075DE8]/40 hover:bg-[#EFF6FF] dark:hover:bg-[#1E2D45] transition-all">
                <Download size={14} /> Export PDF
              </button>
              <button className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#075DE8] hover:bg-[#0650CC] text-white text-sm font-medium shadow-sm shadow-blue-500/20 transition-all">
                <Plus size={14} /> Add Tenant
              </button>
            </div>
          </div>

          {/* meta chips */}
          <div className="flex items-center gap-3 mt-4 flex-wrap text-xs text-[#64748B]">
            {manager && (
              <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#F8FAFC] dark:bg-[#1A2640] border border-[#E6EEF5] dark:border-[#1E2D45]">
                <div className="w-4 h-4 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-[8px] font-bold text-white">{manager.name[0]}</div>
                <span>{manager.name}</span>
              </div>
            )}
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#F8FAFC] dark:bg-[#1A2640] border border-[#E6EEF5] dark:border-[#1E2D45]">
              <Calendar size={12} />Next inspection: {new Date(property.nextInspectionDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#F8FAFC] dark:bg-[#1A2640] border border-[#E6EEF5] dark:border-[#1E2D45]">
              <Hash size={12} />ID: {property.id}
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#F8FAFC] dark:bg-[#1A2640] border border-[#E6EEF5] dark:border-[#1E2D45]">
              <MapPin size={12} />{property.region}
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── KPI Stats ── */}
      <div className="grid grid-cols-4 xl:grid-cols-8 gap-3 mb-6">
        {STATS.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="rounded-xl bg-white dark:bg-[#111827] border border-[#E6EEF5] dark:border-[#1E2D45] p-3.5 hover:border-[#075DE8]/30 hover:shadow-sm transition-all group"
          >
            <div className={`w-7 h-7 rounded-xl ${s.bg} flex items-center justify-center mb-2`}>
              <s.icon size={13} className={s.color} />
            </div>
            <p className={`text-lg font-bold ${s.color} leading-tight truncate`}>
              <AnimatedNumber value={s.value} prefix={s.prefix ?? ''} suffix={s.suffix ?? ''} />
            </p>
            <p className="text-[10px] text-[#94A3B8] mt-0.5 leading-tight truncate">{s.label}</p>
          </motion.div>
        ))}
      </div>

      {/* ── Health Score bar ── */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="rounded-xl bg-white dark:bg-[#111827] border border-[#E6EEF5] dark:border-[#1E2D45] p-4 mb-6 flex items-center gap-5 flex-wrap"
      >
        <div className="flex items-center gap-3 flex-1 min-w-[200px]">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-lg text-white shadow-lg flex-shrink-0 ${healthScore >= 80 ? 'bg-gradient-to-br from-emerald-400 to-teal-500' : healthScore >= 60 ? 'bg-gradient-to-br from-amber-400 to-orange-500' : 'bg-gradient-to-br from-rose-400 to-red-500'}`}>
            {healthScore}
          </div>
          <div>
            <p className="font-semibold text-[#0F172A] dark:text-white text-sm">Property Health Score</p>
            <p className="text-xs text-[#64748B]">Based on occupancy, compliance, payments & maintenance</p>
          </div>
        </div>
        <div className="flex-1 min-w-[200px]">
          <div className="h-2.5 rounded-full bg-[#F1F5F9] dark:bg-[#1E2D45] overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${healthScore}%` }}
              transition={{ delay: 0.5, duration: 1.2, ease: 'easeOut' }}
              className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-teal-500"
            />
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-[#64748B] flex-wrap">
          {[
            { label: 'Renew EPC', icon: AlertTriangle, color: 'text-amber-500' },
            { label: 'Collect £680 arrears', icon: AlertTriangle, color: 'text-rose-500' },
            { label: 'Schedule boiler service', icon: AlertTriangle, color: 'text-amber-500' },
          ].map(r => (
            <div key={r.label} className="flex items-center gap-1 px-2 py-1 rounded-lg bg-[#FFF8F0] dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/30">
              <r.icon size={11} className={r.color} />
              {r.label}
            </div>
          ))}
        </div>
      </motion.div>

      {/* ── Tab Bar ── */}
      <div className="overflow-x-auto -mx-1 px-1 mb-6">
        <div className="flex items-center gap-1 bg-white dark:bg-[#111827] rounded-xl border border-[#E6EEF5] dark:border-[#1E2D45] p-1 w-max min-w-full">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-[#075DE8] text-white shadow-sm'
                  : 'text-[#64748B] dark:text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-white hover:bg-[#F8FAFC] dark:hover:bg-[#1A2640]'
              }`}
            >
              <tab.icon size={13} />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Tab Content ── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === 'overview'    && <OverviewTab    property={property} rooms={propRooms} amenities={AMENITIES} />}
          {activeTab === 'floorplan'   && (
            <div className="bg-white dark:bg-[#111827] border border-[#E6EEF5] dark:border-[#1E2D45] rounded-2xl p-4 sm:p-5">
              <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                <div>
                  <h3 className="text-sm font-semibold text-[#0F172A] dark:text-white">3D Floor Plan</h3>
                  <p className="text-xs text-[#64748B] dark:text-[#94A3B8]">Interactive dollhouse view · drag to rotate, tap a room for details</p>
                </div>
              </div>
              <FloorPlan3D propertyId={property.id} height={520} />
            </div>
          )}
          {activeTab === 'tenants'     && <TenantsTab     tenants={propTenants} rooms={propRooms} />}
          {activeTab === 'assets'      && <AssetsTab      assets={DEMO_ASSETS} />}
          {activeTab === 'maintenance' && <MaintenanceTab tickets={DEMO_TICKETS} monthly={MAINTENANCE_MONTHLY} byType={MAINTENANCE_BY_TYPE} />}
          {activeTab === 'financials'  && <FinancialsTab  tenants={propTenants} revenue={REVENUE_TREND} />}
          {activeTab === 'compliance'  && <ComplianceTab  certs={propCerts} />}
          {activeTab === 'documents'   && <DocumentsTab />}
          {activeTab === 'analytics'   && <AnalyticsTab   revenue={REVENUE_TREND} occupancy={OCCUPANCY_TREND} assetsByCategory={ASSET_BY_CATEGORY} />}
          {activeTab === 'activity'    && <ActivityTab    feed={ACTIVITY_FEED} />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Tab: Overview
// ─────────────────────────────────────────────────────────────────────────────
function OverviewTab({ property, rooms, amenities }: { property: Property; rooms: any[]; amenities: any[] }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
      {/* left column */}
      <div className="lg:col-span-2 space-y-5">
        {/* Property Details */}
        <SectionCard title="Property Details" icon={Building2}>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {[
              { label: 'Property Type',    value: property.type.replace(/_/g, ' ') },
              { label: 'Total Rooms',      value: String(property.totalRooms) },
              { label: 'Occupied Rooms',   value: String(property.occupiedRooms) },
              { label: 'Local Authority',  value: property.localAuthority },
              { label: 'Region',           value: property.region },
              { label: 'Status',           value: property.status },
              { label: 'Last Inspection',  value: new Date(property.lastInspectionDate).toLocaleDateString('en-GB') },
              { label: 'Next Inspection',  value: new Date(property.nextInspectionDate).toLocaleDateString('en-GB') },
              { label: 'Construction',     value: '1998' },
              { label: 'Floors',           value: '3' },
              { label: 'Sq Ft',            value: '2,840' },
              { label: 'EPC Rating',       value: 'C (72)' },
            ].map(f => (
              <div key={f.label}>
                <p className="text-[10px] font-semibold text-[#94A3B8] uppercase tracking-wider mb-0.5">{f.label}</p>
                <p className="text-sm font-medium text-[#0F172A] dark:text-white capitalize">{f.value}</p>
              </div>
            ))}
          </div>
        </SectionCard>

        {/* Units at a glance */}
        <SectionCard title="Room Overview" icon={Home}>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {rooms.length > 0 ? rooms.map(room => {
              const statusColor: Record<string, string> = {
                occupied: 'border-emerald-200 bg-emerald-50 dark:bg-emerald-900/10',
                vacant:   'border-amber-200 bg-amber-50 dark:bg-amber-900/10',
                maintenance: 'border-rose-200 bg-rose-50 dark:bg-rose-900/10',
                pending:  'border-blue-200 bg-blue-50 dark:bg-blue-900/10',
              };
              const sc = statusColor[room.status] ?? 'border-slate-200 bg-slate-50';
              return (
                <div key={room.id} className={`rounded-xl border p-3.5 ${sc}`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-sm text-[#0F172A] dark:text-white">Room {room.roomNumber}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold capitalize ${room.status === 'occupied' ? 'bg-emerald-100 text-emerald-700' : room.status === 'vacant' ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700'}`}>{room.status}</span>
                  </div>
                  <p className="text-xs text-[#64748B]">£{room.weeklyRent}/week</p>
                  {room.notes && <p className="text-xs text-[#94A3B8] mt-1 truncate">{room.notes}</p>}
                </div>
              );
            }) : (
              // fallback when no rooms in mockData for this property
              Array.from({ length: property.totalRooms }, (_, i) => (
                <div key={i} className={`rounded-xl border p-3.5 ${i < property.occupiedRooms ? 'border-emerald-200 bg-emerald-50 dark:bg-emerald-900/10' : 'border-amber-200 bg-amber-50 dark:bg-amber-900/10'}`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-sm text-[#0F172A] dark:text-white">Room {i + 1}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${i < property.occupiedRooms ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>{i < property.occupiedRooms ? 'Occupied' : 'Vacant'}</span>
                  </div>
                  <p className="text-xs text-[#64748B]">£{165 + i * 10}/week</p>
                </div>
              ))
            )}
          </div>
        </SectionCard>
      </div>

      {/* right column */}
      <div className="space-y-5">
        {/* Map placeholder */}
        <SectionCard title="Location" icon={MapPin}>
          <div className="h-36 rounded-xl overflow-hidden border border-[#E6EEF5] dark:border-[#1E2D45] mb-3 relative bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 flex items-center justify-center">
            <div className="text-center">
              <MapPin size={28} className="text-[#075DE8] mx-auto mb-2" />
              <p className="text-xs font-medium text-[#334155] dark:text-[#CBD5E1]">{property.address}</p>
              <p className="text-xs text-[#64748B]">{property.city}, {property.postcode}</p>
            </div>
          </div>
          <button className="w-full flex items-center justify-center gap-2 py-2 rounded-xl border border-[#E6EEF5] dark:border-[#1E2D45] text-xs font-medium text-[#075DE8] hover:bg-[#EFF6FF] dark:hover:bg-[#1E2D45] transition-all">
            <ExternalLink size={13} /> Open in Google Maps
          </button>
        </SectionCard>

        {/* Amenities */}
        <SectionCard title="Amenities" icon={Zap}>
          <div className="space-y-2">
            {amenities.map(a => (
              <div key={a.label} className="flex items-center justify-between py-1.5">
                <div className="flex items-center gap-2.5 text-sm text-[#334155] dark:text-[#CBD5E1]">
                  <a.icon size={15} className="text-[#64748B]" />
                  {a.label}
                </div>
                {a.available
                  ? <CheckCircle size={15} className="text-emerald-500" />
                  : <XCircle size={15} className="text-[#CBD5E1]" />}
              </div>
            ))}
          </div>
        </SectionCard>

        {/* Notes */}
        <SectionCard title="Property Notes" icon={FileText}>
          <p className="text-sm text-[#64748B] leading-relaxed">HMO licensed property. Annual fire risk assessment required. Next boiler service overdue — schedule by end of July. EPC renewal required before September 2026.</p>
        </SectionCard>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Tab: Tenants
// ─────────────────────────────────────────────────────────────────────────────
function TenantsTab({ tenants, rooms }: { tenants: any[]; rooms: any[] }) {
  const display = tenants.length > 0 ? tenants : [];
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-[#0F172A] dark:text-white">{display.length} tenant{display.length !== 1 ? 's' : ''} at this property</p>
        <button className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#075DE8] hover:bg-[#0650CC] text-white text-xs font-medium shadow-sm transition-all">
          <Plus size={13} /> Add Tenant
        </button>
      </div>
      {display.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-[#94A3B8]">
          <Users size={32} className="mb-3" />
          <p className="font-medium">No tenants at this property</p>
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {display.map((t: any) => {
          const initials = `${t.firstName[0]}${t.lastName[0]}`;
          const riskColor: Record<string, string> = { low: 'text-emerald-600 bg-emerald-50', medium: 'text-amber-600 bg-amber-50', high: 'text-rose-600 bg-rose-50', critical: 'text-red-700 bg-red-50' };
          const statusColor: Record<string, string> = { active: 'text-emerald-600 bg-emerald-50 border-emerald-200', pending: 'text-blue-600 bg-blue-50 border-blue-200', at_risk: 'text-rose-600 bg-rose-50 border-rose-200', moved_on: 'text-slate-600 bg-slate-50 border-slate-200' };
          return (
            <div key={t.id} className="rounded-xl bg-white dark:bg-[#111827] border border-[#E6EEF5] dark:border-[#1E2D45] p-4 hover:border-[#075DE8]/30 hover:shadow-sm transition-all">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#075DE8] to-[#0EA5E9] flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                  {initials}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-semibold text-sm text-[#0F172A] dark:text-white">{t.firstName} {t.lastName}</p>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full border font-semibold capitalize ${statusColor[t.status] ?? ''}`}>
                      {t.status.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <p className="text-xs text-[#64748B] mt-0.5">Room {t.roomNumber}</p>
                </div>
              </div>
              <div className="space-y-1.5 mb-3">
                <div className="flex items-center gap-2 text-xs text-[#64748B]"><Phone size={11} />{t.phone}</div>
                <div className="flex items-center gap-2 text-xs text-[#64748B]"><Mail size={11} />{t.email}</div>
                <div className="flex items-center gap-2 text-xs text-[#64748B]"><Calendar size={11} />Since {new Date(t.tenancyStartDate).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })}</div>
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-[#F1F5F9] dark:border-[#1E2D45]">
                <div className="flex items-center gap-1.5">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold capitalize ${riskColor[t.riskLevel] ?? ''}`}>
                    {t.riskLevel} risk
                  </span>
                </div>
                <span className={`text-xs font-semibold ${t.rentBalance < 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                  {t.rentBalance < 0 ? `-£${Math.abs(t.rentBalance)}` : 'Paid'}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Tab: Assets
// ─────────────────────────────────────────────────────────────────────────────
function AssetsTab({ assets }: { assets: any[] }) {
  return (
    <div className="space-y-5">
      {/* summary bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Assets', value: '326', icon: Package, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/20' },
          { label: 'Asset Value', value: '£241,600', icon: DollarSign, color: 'text-green-600', bg: 'bg-green-50 dark:bg-green-900/20' },
          { label: 'Maintenance Due', value: '8', icon: Wrench, color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-900/20' },
          { label: 'Warranty Expiring', value: '5', icon: AlertTriangle, color: 'text-rose-600', bg: 'bg-rose-50 dark:bg-rose-900/20' },
        ].map(s => (
          <div key={s.label} className="rounded-xl bg-white dark:bg-[#111827] border border-[#E6EEF5] dark:border-[#1E2D45] p-4">
            <div className={`w-8 h-8 rounded-xl ${s.bg} flex items-center justify-center mb-2`}><s.icon size={15} className={s.color} /></div>
            <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-[#94A3B8]">{s.label}</p>
          </div>
        ))}
      </div>
      {/* charts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <SectionCard title="Assets by Category" icon={Package}>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={ASSET_BY_CATEGORY} cx="50%" cy="50%" innerRadius={45} outerRadius={75} paddingAngle={3} dataKey="value">
                {ASSET_BY_CATEGORY.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
              </Pie>
              <Tooltip formatter={(v: any) => [v, 'Assets']} />
              <Legend iconType="circle" iconSize={8} />
            </PieChart>
          </ResponsiveContainer>
        </SectionCard>
        <SectionCard title="Condition Overview" icon={Tag}>
          <div className="space-y-3 pt-2">
            {[
              { label: 'Excellent', value: 38, color: 'bg-emerald-400' },
              { label: 'Good',      value: 42, color: 'bg-blue-400' },
              { label: 'Fair',      value: 14, color: 'bg-amber-400' },
              { label: 'Poor',      value: 4,  color: 'bg-rose-400' },
              { label: 'Broken',    value: 2,  color: 'bg-red-500' },
            ].map(b => (
              <div key={b.label}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-[#64748B]">{b.label}</span>
                  <span className="font-semibold text-[#334155] dark:text-[#CBD5E1]">{b.value}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-[#F1F5F9] dark:bg-[#1E2D45] overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${b.value}%` }} transition={{ delay: 0.3, duration: 0.8, ease: 'easeOut' }} className={`h-full rounded-full ${b.color}`} />
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>
      {/* asset table */}
      <SectionCard title="Recent Assets" icon={Package}>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-[#F1F5F9] dark:border-[#1E2D45]">
                {['Asset ID', 'Name', 'Category', 'Room', 'Condition', 'Value', 'Warranty', 'Actions'].map(h => (
                  <th key={h} className="text-left py-2 px-3 text-[#94A3B8] font-semibold uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {assets.map(a => (
                <tr key={a.id} className="border-b border-[#F8FAFC] dark:border-[#1A2640] hover:bg-[#F8FAFC] dark:hover:bg-[#1A2640] transition-colors">
                  <td className="py-2.5 px-3 font-mono text-[#475569] dark:text-[#94A3B8]">{a.id}</td>
                  <td className="py-2.5 px-3 font-medium text-[#0F172A] dark:text-white whitespace-nowrap">{a.name}</td>
                  <td className="py-2.5 px-3 text-[#64748B]">{a.category}</td>
                  <td className="py-2.5 px-3 text-[#64748B]">{a.room}</td>
                  <td className="py-2.5 px-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold capitalize ${conditionBadge(a.condition)}`}>{a.condition}</span>
                  </td>
                  <td className="py-2.5 px-3 font-semibold text-[#334155] dark:text-[#CBD5E1]">£{a.value.toLocaleString()}</td>
                  <td className="py-2.5 px-3 text-[#64748B]">
                    {a.warranty ? new Date(a.warranty).toLocaleDateString('en-GB') : '—'}
                  </td>
                  <td className="py-2.5 px-3">
                    <div className="flex items-center gap-1">
                      <button className="p-1.5 rounded-lg hover:bg-[#EFF6FF] dark:hover:bg-[#1E2D45] text-[#075DE8] transition-colors"><QrCode size={13} /></button>
                      <button className="p-1.5 rounded-lg hover:bg-[#EFF6FF] dark:hover:bg-[#1E2D45] text-[#075DE8] transition-colors"><Wrench size={13} /></button>
                      <button className="p-1.5 rounded-lg hover:bg-[#EFF6FF] dark:hover:bg-[#1E2D45] text-[#64748B] transition-colors"><MoreHorizontal size={13} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Tab: Maintenance
// ─────────────────────────────────────────────────────────────────────────────
function MaintenanceTab({ tickets, monthly, byType }: { tickets: any[]; monthly: any[]; byType: any[] }) {
  const open      = tickets.filter(t => t.status !== 'completed').length;
  const completed = tickets.filter(t => t.status === 'completed').length;
  return (
    <div className="space-y-5">
      {/* summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Open Jobs',       value: open,      color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-900/20',   icon: Wrench },
          { label: 'In Progress',     value: 1,         color: 'text-blue-600',  bg: 'bg-blue-50 dark:bg-blue-900/20',     icon: Clock },
          { label: 'Completed (MTD)', value: completed, color: 'text-green-600', bg: 'bg-green-50 dark:bg-green-900/20',   icon: CheckCircle },
          { label: 'Overdue',         value: 1,         color: 'text-rose-600',  bg: 'bg-rose-50 dark:bg-rose-900/20',     icon: AlertTriangle },
        ].map(s => (
          <div key={s.label} className="rounded-xl bg-white dark:bg-[#111827] border border-[#E6EEF5] dark:border-[#1E2D45] p-4">
            <div className={`w-8 h-8 rounded-xl ${s.bg} flex items-center justify-center mb-2`}><s.icon size={15} className={s.color} /></div>
            <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-[#94A3B8]">{s.label}</p>
          </div>
        ))}
      </div>
      {/* charts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <SectionCard title="Monthly Maintenance" icon={BarChart3}>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={monthly} barSize={12}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ border: '1px solid #E6EEF5', borderRadius: '12px', fontSize: '12px' }} />
              <Bar dataKey="completed" fill={GREEN} radius={[4, 4, 0, 0]} name="Completed" />
              <Bar dataKey="open"      fill={AMBER}  radius={[4, 4, 0, 0]} name="Open" />
            </BarChart>
          </ResponsiveContainer>
        </SectionCard>
        <SectionCard title="By Type" icon={Layers}>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={byType} cx="50%" cy="50%" outerRadius={70} dataKey="value">
                {byType.map((e: any, i: number) => <Cell key={i} fill={e.fill} />)}
              </Pie>
              <Tooltip formatter={(v: any) => [`${v}%`, '']} />
              <Legend iconType="circle" iconSize={8} />
            </PieChart>
          </ResponsiveContainer>
        </SectionCard>
      </div>
      {/* tickets */}
      <SectionCard title="Maintenance Tickets" icon={Wrench}>
        <div className="space-y-2">
          {tickets.map(t => (
            <div key={t.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-[#F8FAFC] dark:hover:bg-[#1A2640] transition-colors border border-transparent hover:border-[#E6EEF5] dark:hover:border-[#1E2D45]">
              <div className="flex flex-col items-center gap-1 flex-shrink-0">
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${priorityBadge(t.priority)}`}>{t.priority}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[#0F172A] dark:text-white truncate">{t.title}</p>
                <p className="text-xs text-[#64748B]">{t.id} · {t.date}{t.technician ? ` · ${t.technician}` : ''}</p>
              </div>
              <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold border capitalize whitespace-nowrap ${ticketStatusBadge(t.status)}`}>{t.status.replace('_', ' ')}</span>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Tab: Financials
// ─────────────────────────────────────────────────────────────────────────────
function FinancialsTab({ tenants, revenue }: { tenants: any[]; revenue: any[] }) {
  const totalRent = tenants.reduce((s: number, t: any) => s + t.rentAmount * 4.33, 0);
  const outstanding = tenants.reduce((s: number, t: any) => s + Math.abs(Math.min(t.rentBalance, 0)), 0);
  return (
    <div className="space-y-5">
      {/* summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Monthly Revenue', value: `£${Math.round(totalRent).toLocaleString()}`,   icon: TrendingUp,   color: 'text-green-600',  bg: 'bg-green-50 dark:bg-green-900/20' },
          { label: 'Outstanding',     value: `£${outstanding.toLocaleString()}`,              icon: TrendingDown, color: 'text-rose-600',   bg: 'bg-rose-50 dark:bg-rose-900/20' },
          { label: 'Deposits Held',   value: '£8,500',                                        icon: Shield,       color: 'text-blue-600',   bg: 'bg-blue-50 dark:bg-blue-900/20' },
          { label: 'Collection Rate', value: outstanding > 0 ? '92%' : '100%',               icon: CheckCircle,  color: 'text-violet-600', bg: 'bg-violet-50 dark:bg-violet-900/20' },
        ].map(s => (
          <div key={s.label} className="rounded-xl bg-white dark:bg-[#111827] border border-[#E6EEF5] dark:border-[#1E2D45] p-4">
            <div className={`w-8 h-8 rounded-xl ${s.bg} flex items-center justify-center mb-2`}><s.icon size={15} className={s.color} /></div>
            <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-[#94A3B8]">{s.label}</p>
          </div>
        ))}
      </div>
      {/* chart */}
      <SectionCard title="Income vs Expenses (12 months)" icon={BarChart3}>
        <ResponsiveContainer width="100%" height={240}>
          <AreaChart data={revenue}>
            <defs>
              <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={BLUE} stopOpacity={0.25} />
                <stop offset="95%" stopColor={BLUE} stopOpacity={0} />
              </linearGradient>
              <linearGradient id="expGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={ROSE} stopOpacity={0.2} />
                <stop offset="95%" stopColor={ROSE} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
            <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 10, fill: '#94A3B8' }} axisLine={false} tickLine={false} tickFormatter={v => `£${(v/1000).toFixed(0)}k`} />
            <Tooltip formatter={(v: any, name: any) => [`£${Number(v).toLocaleString()}`, name]} contentStyle={{ border: '1px solid #E6EEF5', borderRadius: '12px', fontSize: '12px' }} />
            <Legend iconType="circle" iconSize={8} />
            <Area type="monotone" dataKey="income"   stroke={BLUE} fill="url(#incomeGrad)" strokeWidth={2} name="Income" />
            <Area type="monotone" dataKey="expenses" stroke={ROSE} fill="url(#expGrad)"   strokeWidth={2} name="Expenses" />
          </AreaChart>
        </ResponsiveContainer>
      </SectionCard>
      {/* tenant balances */}
      {tenants.length > 0 && (
        <SectionCard title="Tenant Balances" icon={Users}>
          <div className="space-y-2">
            {tenants.map((t: any) => (
              <div key={t.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-[#F8FAFC] dark:hover:bg-[#1A2640] transition-colors">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#075DE8] to-[#0EA5E9] flex items-center justify-center text-white text-xs font-bold">
                    {t.firstName[0]}{t.lastName[0]}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#0F172A] dark:text-white">{t.firstName} {t.lastName}</p>
                    <p className="text-xs text-[#64748B]">Room {t.roomNumber} · £{t.rentAmount}/week</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-bold ${t.rentBalance < 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                    {t.rentBalance < 0 ? `-£${Math.abs(t.rentBalance)}` : 'All clear'}
                  </p>
                  <p className="text-xs text-[#94A3B8] capitalize">{t.housingBenefitStatus.replace(/_/g, ' ')}</p>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Tab: Compliance
// ─────────────────────────────────────────────────────────────────────────────
function ComplianceTab({ certs }: { certs: any[] }) {
  const allTypes = ['gas_safety', 'fire_safety', 'electrical_eicr', 'buildings_insurance', 'hmo_licence', 'epc', 'pat_testing', 'legionella'];
  const certMap = Object.fromEntries(certs.map(c => [c.type, c]));
  const score = certs.length ? Math.round((certs.filter(c => c.status === 'valid').length / allTypes.length) * 100) : 0;

  return (
    <div className="space-y-5">
      {/* score */}
      <div className="rounded-xl bg-white dark:bg-[#111827] border border-[#E6EEF5] dark:border-[#1E2D45] p-5">
        <div className="flex items-center gap-5 mb-4">
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center font-bold text-xl text-white ${score >= 80 ? 'bg-gradient-to-br from-emerald-400 to-teal-500' : score >= 60 ? 'bg-gradient-to-br from-amber-400 to-orange-500' : 'bg-gradient-to-br from-rose-400 to-red-500'}`}>
            {score}%
          </div>
          <div>
            <p className="font-bold text-[#0F172A] dark:text-white">Compliance Score</p>
            <p className="text-sm text-[#64748B]">{certs.filter(c => c.status === 'valid').length} of {allTypes.length} certificates valid</p>
          </div>
        </div>
        <div className="h-2 rounded-full bg-[#F1F5F9] dark:bg-[#1E2D45] overflow-hidden">
          <motion.div initial={{ width: 0 }} animate={{ width: `${score}%` }} transition={{ delay: 0.3, duration: 1, ease: 'easeOut' }}
            className={`h-full rounded-full ${score >= 80 ? 'bg-gradient-to-r from-emerald-400 to-teal-500' : score >= 60 ? 'bg-gradient-to-r from-amber-400 to-orange-500' : 'bg-gradient-to-r from-rose-400 to-red-500'}`} />
        </div>
      </div>

      {/* certificates grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {allTypes.map(type => {
          const cert = certMap[type];
          const status = cert?.status ?? 'missing';
          const expiry = cert?.expiryDate ? new Date(cert.expiryDate) : null;
          const daysLeft = expiry ? Math.ceil((expiry.getTime() - Date.now()) / 86400000) : null;
          return (
            <motion.div key={type} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              className={`rounded-xl border p-4 ${certStatusColor(status)}`}>
              <div className="flex items-start justify-between mb-3">
                <p className="text-sm font-semibold text-[#0F172A] dark:text-white">{CERT_LABELS[type]}</p>
                {certStatusIcon(status)}
              </div>
              <p className="text-xs capitalize font-medium text-[#64748B] mb-1">{status.replace('_', ' ')}</p>
              {expiry && (
                <p className="text-xs text-[#94A3B8]">
                  {status === 'expired' ? 'Expired' : 'Expires'}: {expiry.toLocaleDateString('en-GB')}
                </p>
              )}
              {daysLeft !== null && daysLeft > 0 && daysLeft < 60 && (
                <p className="text-xs font-semibold text-amber-600 mt-1">{daysLeft} days left</p>
              )}
              <button className="mt-3 w-full text-[10px] font-semibold py-1.5 rounded-lg border border-current/30 hover:bg-white/50 dark:hover:bg-white/10 transition-all">
                {status === 'valid' ? 'View Document' : 'Renew'}
              </button>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Tab: Documents
// ─────────────────────────────────────────────────────────────────────────────
const DOC_FOLDERS = [
  { name: 'Property Documents', count: 14, icon: Building2, color: 'text-blue-600 bg-blue-50 dark:bg-blue-900/20' },
  { name: 'Floor Plans',        count: 3,  icon: Layers,    color: 'text-violet-600 bg-violet-50 dark:bg-violet-900/20' },
  { name: 'Insurance',          count: 5,  icon: Shield,    color: 'text-green-600 bg-green-50 dark:bg-green-900/20' },
  { name: 'Certificates',       count: 8,  icon: ShieldCheck, color: 'text-teal-600 bg-teal-50 dark:bg-teal-900/20' },
  { name: 'Invoices',           count: 22, icon: CreditCard, color: 'text-amber-600 bg-amber-50 dark:bg-amber-900/20' },
  { name: 'Contracts',          count: 7,  icon: FileText,  color: 'text-rose-600 bg-rose-50 dark:bg-rose-900/20' },
  { name: 'Inspection Reports', count: 6,  icon: FileBarChart, color: 'text-indigo-600 bg-indigo-50 dark:bg-indigo-900/20' },
  { name: 'Maintenance Logs',   count: 18, icon: Wrench,    color: 'text-orange-600 bg-orange-50 dark:bg-orange-900/20' },
];
const RECENT_DOCS = [
  { name: 'Gas Safety Certificate 2026.pdf',    size: '1.2 MB', date: '8 Jul 2026',  status: 'valid' },
  { name: 'Tenancy Agreement – J. Thornton.pdf',size: '2.4 MB', date: '1 Jul 2026',  status: 'signed' },
  { name: 'Annual Inspection Report Q2.pdf',    size: '3.1 MB', date: '28 Jun 2026', status: 'complete' },
  { name: 'EICR Certificate 2025.pdf',          size: '890 KB', date: '15 Jun 2026', status: 'valid' },
  { name: 'Buildings Insurance Policy.pdf',     size: '4.2 MB', date: '1 Jun 2026',  status: 'valid' },
];

function DocumentsTab() {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-[#0F172A] dark:text-white">245 documents across 8 folders</p>
        <button className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#075DE8] hover:bg-[#0650CC] text-white text-xs font-medium shadow-sm transition-all">
          <Plus size={13} /> Upload
        </button>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {DOC_FOLDERS.map(f => (
          <button key={f.name} className="rounded-xl bg-white dark:bg-[#111827] border border-[#E6EEF5] dark:border-[#1E2D45] p-4 text-left hover:border-[#075DE8]/30 hover:shadow-sm transition-all group">
            <div className={`w-9 h-9 rounded-xl ${f.color} flex items-center justify-center mb-2.5`}>
              <f.icon size={16} className={f.color.split(' ')[0]} />
            </div>
            <p className="text-xs font-semibold text-[#0F172A] dark:text-white mb-0.5">{f.name}</p>
            <p className="text-[10px] text-[#94A3B8]">{f.count} files</p>
          </button>
        ))}
      </div>
      <SectionCard title="Recent Documents" icon={FileText}>
        <div className="space-y-2">
          {RECENT_DOCS.map(d => (
            <div key={d.name} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-[#F8FAFC] dark:hover:bg-[#1A2640] transition-colors">
              <div className="w-9 h-9 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 flex items-center justify-center flex-shrink-0">
                <FileText size={16} className="text-red-500" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[#0F172A] dark:text-white truncate">{d.name}</p>
                <p className="text-xs text-[#94A3B8]">{d.size} · {d.date}</p>
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold capitalize ${d.status === 'valid' || d.status === 'complete' || d.status === 'signed' ? 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20' : 'text-amber-600 bg-amber-50 dark:bg-amber-900/20'}`}>
                {d.status}
              </span>
              <button className="p-1.5 rounded-lg hover:bg-[#EFF6FF] dark:hover:bg-[#1E2D45] text-[#075DE8] transition-colors flex-shrink-0">
                <Download size={13} />
              </button>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Tab: Analytics
// ─────────────────────────────────────────────────────────────────────────────
function AnalyticsTab({ revenue, occupancy, assetsByCategory }: { revenue: any[]; occupancy: any[]; assetsByCategory: any[] }) {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <SectionCard title="Occupancy Trend (12 months)" icon={TrendingUp}>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={occupancy}>
              <defs>
                <linearGradient id="occGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={TEAL} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={TEAL} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
              <YAxis domain={[60, 100]} tick={{ fontSize: 10, fill: '#94A3B8' }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
              <Tooltip formatter={(v: any) => [`${v}%`, 'Occupancy']} contentStyle={{ border: '1px solid #E6EEF5', borderRadius: '12px', fontSize: '12px' }} />
              <Area type="monotone" dataKey="rate" stroke={TEAL} fill="url(#occGrad)" strokeWidth={2.5} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </SectionCard>

        <SectionCard title="Revenue Trend (12 months)" icon={TrendingUp}>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={revenue}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#94A3B8' }} axisLine={false} tickLine={false} tickFormatter={v => `£${(v/1000).toFixed(0)}k`} />
              <Tooltip formatter={(v: any, n: any) => [`£${Number(v).toLocaleString()}`, n]} contentStyle={{ border: '1px solid #E6EEF5', borderRadius: '12px', fontSize: '12px' }} />
              <Legend iconType="circle" iconSize={8} />
              <Line type="monotone" dataKey="income"   stroke={BLUE}  strokeWidth={2.5} dot={false} name="Income" />
              <Line type="monotone" dataKey="rent"     stroke={GREEN} strokeWidth={2}   dot={false} name="Rent" strokeDasharray="4 2" />
              <Line type="monotone" dataKey="expenses" stroke={ROSE}  strokeWidth={2}   dot={false} name="Expenses" strokeDasharray="4 2" />
            </LineChart>
          </ResponsiveContainer>
        </SectionCard>

        <SectionCard title="Assets by Category" icon={Package}>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={assetsByCategory} layout="vertical" barSize={14}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis type="number" tick={{ fontSize: 10, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
              <YAxis dataKey="name" type="category" tick={{ fontSize: 10, fill: '#94A3B8' }} axisLine={false} tickLine={false} width={72} />
              <Tooltip contentStyle={{ border: '1px solid #E6EEF5', borderRadius: '12px', fontSize: '12px' }} />
              <Bar dataKey="value" radius={[0, 4, 4, 0]} name="Assets">
                {assetsByCategory.map((_: any, i: number) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </SectionCard>

        <SectionCard title="Maintenance Cost Trend" icon={Wrench}>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={MAINTENANCE_MONTHLY}>
              <defs>
                <linearGradient id="costGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={AMBER} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={AMBER} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#94A3B8' }} axisLine={false} tickLine={false} tickFormatter={v => `£${v}`} />
              <Tooltip formatter={(v: any) => [`£${v}`, 'Cost']} contentStyle={{ border: '1px solid #E6EEF5', borderRadius: '12px', fontSize: '12px' }} />
              <Area type="monotone" dataKey="cost" stroke={AMBER} fill="url(#costGrad)" strokeWidth={2.5} dot={false} name="Cost" />
            </AreaChart>
          </ResponsiveContainer>
        </SectionCard>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Tab: Activity
// ─────────────────────────────────────────────────────────────────────────────
function ActivityTab({ feed }: { feed: any[] }) {
  return (
    <SectionCard title="Activity Timeline" icon={Activity}>
      <div className="relative">
        <div className="absolute left-[19px] top-0 bottom-0 w-px bg-[#E6EEF5] dark:bg-[#1E2D45]" />
        <div className="space-y-1">
          {feed.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06 }}
              className="flex items-start gap-4 pl-2 py-3 group"
            >
              <div className={`w-9 h-9 rounded-xl ${item.color} flex items-center justify-center flex-shrink-0 relative z-10 border-2 border-white dark:border-[#111827]`}>
                <item.icon size={15} className={item.color.split(' ')[0]} />
              </div>
              <div className="flex-1 min-w-0 pt-0.5">
                <p className="text-sm font-semibold text-[#0F172A] dark:text-white">{item.title}</p>
                <p className="text-xs text-[#64748B] mt-0.5">{item.desc}</p>
              </div>
              <span className="text-xs text-[#94A3B8] whitespace-nowrap pt-0.5 flex-shrink-0">{item.time}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </SectionCard>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Shared: Section Card
// ─────────────────────────────────────────────────────────────────────────────
function SectionCard({ title, icon: Icon, children }: { title: string; icon: any; children: React.ReactNode }) {
  return (
    <div className="rounded-xl bg-white dark:bg-[#111827] border border-[#E6EEF5] dark:border-[#1E2D45] p-5">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-7 h-7 rounded-lg bg-[#EFF6FF] dark:bg-[#1E2D45] flex items-center justify-center">
          <Icon size={14} className="text-[#075DE8]" />
        </div>
        <h3 className="font-semibold text-[#0F172A] dark:text-white text-sm">{title}</h3>
      </div>
      {children}
    </div>
  );
}
