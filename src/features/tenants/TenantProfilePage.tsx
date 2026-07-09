import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, Phone, Mail, MapPin, Calendar, User, AlertTriangle,
  FileText, Clock, DollarSign, ClipboardList, MessageSquare, Activity,
  Edit2, Plus, CheckCircle, XCircle, AlertCircle
} from 'lucide-react';
import {
  Card, Tabs, StatusPill, Avatar, Badge, Button, ProgressBar, ProgressRing,
  PageHeader, DataTable, EmptyState, Skeleton
} from '../../components/ui';
import { tenantService } from '../../services';
import { users, properties, starAssessments } from '../../data/mockData';
import type { Tenant, SupportLog, TenantDocument, StarAssessment, Invoice } from '../../types';
import { useAuth } from '../../lib/auth';

const DOC_LABELS: Record<string, string> = {
  tenancy_agreement: 'Tenancy Agreement',
  support_plan: 'Support Plan',
  risk_assessment: 'Risk Assessment',
  consent_form: 'Consent Form',
  id_verification: 'ID Verification',
  local_authority_referral: 'LA Referral',
  benefit_confirmation: 'Benefit Confirmation',
  move_in_checklist: 'Move-in Checklist',
};

export function TenantProfilePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { effectiveRole } = useAuth();
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [supportLogs, setSupportLogs] = useState<SupportLog[]>([]);
  const [documents, setDocuments] = useState<TenantDocument[]>([]);
  const [assessments, setAssessments] = useState<StarAssessment[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  const canSeeFinancials = ['super_admin', 'admin'].includes(effectiveRole);
  const canEdit = ['super_admin', 'admin', 'support_staff'].includes(effectiveRole);

  useEffect(() => {
    if (!id) return;
    const load = async () => {
      const [t, logs, docs, assess, invs] = await Promise.all([
        tenantService.getById(id),
        tenantService.getSupportLogs(id),
        tenantService.getDocuments(id),
        tenantService.getStarAssessments(id),
        canSeeFinancials ? tenantService.getInvoices(id) : Promise.resolve([]),
      ]);
      setTenant(t); setSupportLogs(logs); setDocuments(docs);
      setAssessments(assess); setInvoices(invs);
      setLoading(false);
    };
    load();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-[1200px] mx-auto space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-48" />
        <Skeleton className="h-96" />
      </div>
    );
  }

  if (!tenant) return <div className="text-center py-16 text-[#64748B]">Tenant not found</div>;

  const property = properties.find(p => p.id === tenant.propertyId);
  const keyWorker = users.find(u => u.id === tenant.keyWorkerId);
  const supportPct = Math.min(100, Math.round((tenant.supportHoursWeek / tenant.supportHoursRequired) * 100));
  const docsComplete = documents.filter(d => d.status === 'complete').length;
  const docsTotal = 7;
  const latestAssessment = assessments.find(a => a.status === 'completed');

  const riskColors = { low: 'text-emerald-600 bg-emerald-50', medium: 'text-amber-600 bg-amber-50', high: 'text-rose-500 bg-rose-50', critical: 'text-rose-700 bg-rose-100' };

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'documents', label: 'Documents', count: documents.length },
    { id: 'support', label: 'Support Logs', count: supportLogs.length },
    { id: 'star', label: 'STAR Assessments', count: assessments.length },
    ...(canSeeFinancials ? [{ id: 'financials', label: 'Financials' }] : []),
    { id: 'notes', label: 'Notes' },
    { id: 'audit', label: 'Audit Trail' },
  ];

  return (
    <div className="max-w-[1200px] mx-auto">
      {/* Back nav */}
      <button
        onClick={() => navigate('/tenants')}
        className="flex items-center gap-2 text-sm text-[#64748B] hover:text-[#075DE8] transition-colors mb-4"
      >
        <ArrowLeft size={16} /> Back to Tenants
      </button>

      {/* Hero Card */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl bg-white dark:bg-[#111827] border border-[#E6EEF5] dark:border-[#1E2D45] shadow-[0_1px_2px_rgba(15,23,42,.06),0_8px_24px_rgba(15,23,42,.04)] mb-6"
      >
        <div className="absolute top-0 left-0 right-0 h-1 bg-uphold-gradient" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-uphold-gradient-subtle rounded-bl-full opacity-60" />

        <div className="relative p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            {/* Avatar */}
            <Avatar name={`${tenant.firstName} ${tenant.lastName}`} size="xl" />

            {/* Core Info */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-3 mb-1">
                <h1 className="text-2xl font-bold font-display text-[#0F172A] dark:text-[#F8FAFC]">
                  {tenant.firstName} {tenant.lastName}
                </h1>
                <StatusPill status={tenant.status} />
                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${riskColors[tenant.riskLevel]}`}>
                  {tenant.riskLevel.charAt(0).toUpperCase() + tenant.riskLevel.slice(1)} Risk
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-4 text-sm text-[#64748B]">
                <span className="flex items-center gap-1.5"><MapPin size={14} />{property?.address}, Room {tenant.roomNumber}</span>
                <span className="flex items-center gap-1.5"><Phone size={14} />{tenant.phone}</span>
                <span className="flex items-center gap-1.5"><Mail size={14} />{tenant.email}</span>
                <span className="flex items-center gap-1.5"><Calendar size={14} />Since {new Date(tenant.tenancyStartDate).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })}</span>
              </div>
              {keyWorker && (
                <div className="flex items-center gap-2 mt-3">
                  <span className="text-xs text-[#64748B]">Key Worker:</span>
                  <Avatar name={keyWorker.name} size="xs" />
                  <span className="text-xs font-medium text-[#334155] dark:text-[#CBD5E1]">{keyWorker.name}</span>
                </div>
              )}
            </div>

            {canEdit && (
              <Button variant="outline" leftIcon={<Edit2 size={14} />} size="sm">
                Edit Tenant
              </Button>
            )}
          </div>

          {/* Health Summary Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
            {/* Support Hours */}
            <div className="flex items-center gap-3 p-3.5 bg-[#F8FAFC] dark:bg-[#0A0F1E] rounded-xl border border-[#E6EEF5] dark:border-[#1E2D45]">
              <ProgressRing value={supportPct} size={52} strokeWidth={5} variant={supportPct < 50 ? 'danger' : supportPct < 100 ? 'warning' : 'success'}>
                <span className="text-[10px] font-bold text-[#0F172A] dark:text-[#F8FAFC]">{supportPct}%</span>
              </ProgressRing>
              <div>
                <p className="text-xs font-semibold text-[#0F172A] dark:text-[#F8FAFC]">{tenant.supportHoursWeek}h / {tenant.supportHoursRequired}h</p>
                <p className="text-[10px] text-[#64748B]">Support hours</p>
              </div>
            </div>

            {/* Documents */}
            <div className="flex items-center gap-3 p-3.5 bg-[#F8FAFC] dark:bg-[#0A0F1E] rounded-xl border border-[#E6EEF5] dark:border-[#1E2D45]">
              <ProgressRing value={Math.round((docsComplete / docsTotal) * 100)} size={52} strokeWidth={5} variant={docsComplete < docsTotal ? 'warning' : 'success'}>
                <span className="text-[10px] font-bold text-[#0F172A] dark:text-[#F8FAFC]">{docsComplete}/{docsTotal}</span>
              </ProgressRing>
              <div>
                <p className="text-xs font-semibold text-[#0F172A] dark:text-[#F8FAFC]">{docsComplete} complete</p>
                <p className="text-[10px] text-[#64748B]">Documents</p>
              </div>
            </div>

            {/* Rent Status */}
            {canSeeFinancials && (
              <div className="p-3.5 bg-[#F8FAFC] dark:bg-[#0A0F1E] rounded-xl border border-[#E6EEF5] dark:border-[#1E2D45]">
                <p className="text-xs font-semibold text-[#0F172A] dark:text-[#F8FAFC]">
                  {tenant.rentBalance < 0 ? <span className="text-rose-500">£{Math.abs(tenant.rentBalance)} arrears</span> : <span className="text-emerald-600">No arrears</span>}
                </p>
                <p className="text-[10px] text-[#64748B] mt-0.5">£{tenant.rentAmount}/wk</p>
                <StatusPill status={tenant.housingBenefitStatus === 'confirmed' ? 'confirmed' : tenant.housingBenefitStatus === 'pending' ? 'pending' : 'not_claimed'} className="mt-1 scale-90 origin-left" />
              </div>
            )}

            {/* STAR */}
            <div className="p-3.5 bg-[#F8FAFC] dark:bg-[#0A0F1E] rounded-xl border border-[#E6EEF5] dark:border-[#1E2D45]">
              {latestAssessment ? (
                <>
                  <p className="text-xs font-semibold text-[#0F172A] dark:text-[#F8FAFC]">{latestAssessment.overallScore}/80</p>
                  <p className="text-[10px] text-[#64748B] mt-0.5">STAR Score</p>
                  <ProgressBar value={latestAssessment.overallScore} max={80} className="mt-1.5" />
                </>
              ) : (
                <>
                  <p className="text-xs font-semibold text-rose-500">No STAR</p>
                  <p className="text-[10px] text-[#64748B]">Assessment needed</p>
                </>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <Card padding="none">
        <Tabs tabs={tabs} active={activeTab} onChange={setActiveTab} />
        <div className="p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === 'overview' && <OverviewTab tenant={tenant} property={property} keyWorker={keyWorker} />}
              {activeTab === 'documents' && <DocumentsTab documents={documents} canEdit={canEdit} />}
              {activeTab === 'support' && <SupportTab logs={supportLogs} />}
              {activeTab === 'star' && <StarTab assessments={assessments} tenantId={tenant.id} canEdit={canEdit} />}
              {activeTab === 'financials' && canSeeFinancials && <FinancialsTab invoices={invoices} tenant={tenant} />}
              {activeTab === 'notes' && <NotesTab />}
              {activeTab === 'audit' && <AuditTab />}
            </motion.div>
          </AnimatePresence>
        </div>
      </Card>
    </div>
  );
}

// ── Tab Components ────────────────────────────────────────────────────────────

function OverviewTab({ tenant, property, keyWorker }: { tenant: Tenant; property: any; keyWorker: any }) {
  const sections = [
    {
      title: 'Personal Details',
      fields: [
        { label: 'Full Name', value: `${tenant.firstName} ${tenant.lastName}` },
        { label: 'Date of Birth', value: new Date(tenant.dateOfBirth).toLocaleDateString('en-GB') },
        { label: 'Phone', value: tenant.phone },
        { label: 'Email', value: tenant.email },
        { label: 'NI Number', value: tenant.nationalInsuranceNumber ?? 'Not recorded' },
      ],
    },
    {
      title: 'Emergency Contact',
      fields: [
        { label: 'Name', value: tenant.emergencyContact.name },
        { label: 'Relationship', value: tenant.emergencyContact.relationship },
        { label: 'Phone', value: tenant.emergencyContact.phone },
        { label: 'Email', value: tenant.emergencyContact.email ?? 'Not recorded' },
      ],
    },
    {
      title: 'Tenancy Details',
      fields: [
        { label: 'Property', value: property ? `${property.address}, ${property.city}` : '—' },
        { label: 'Room', value: tenant.roomNumber },
        { label: 'Tenancy Start', value: new Date(tenant.tenancyStartDate).toLocaleDateString('en-GB') },
        { label: 'Tenancy End', value: tenant.tenancyEndDate ? new Date(tenant.tenancyEndDate).toLocaleDateString('en-GB') : 'Open-ended' },
        { label: 'Key Worker', value: keyWorker?.name ?? '—' },
        { label: 'Support Level', value: tenant.supportLevel.charAt(0).toUpperCase() + tenant.supportLevel.slice(1) },
        { label: 'Risk Level', value: tenant.riskLevel.charAt(0).toUpperCase() + tenant.riskLevel.slice(1) },
        { label: 'Local Authority', value: tenant.localAuthority },
        { label: 'Referral Source', value: tenant.referralSource },
        { label: 'Next Review', value: new Date(tenant.nextReviewDate).toLocaleDateString('en-GB') },
      ],
    },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {sections.map(section => (
        <div key={section.title}>
          <h3 className="text-sm font-semibold text-[#0F172A] dark:text-[#F8FAFC] mb-3 font-display">{section.title}</h3>
          <div className="space-y-3">
            {section.fields.map(field => (
              <div key={field.label} className="flex flex-col">
                <span className="text-[10px] font-semibold text-[#94A3B8] uppercase tracking-wide">{field.label}</span>
                <span className="text-sm text-[#334155] dark:text-[#CBD5E1] mt-0.5">{field.value}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
      {tenant.notes && (
        <div className="lg:col-span-3 p-4 bg-[#F8FAFC] dark:bg-[#0A0F1E] rounded-xl border border-[#E6EEF5] dark:border-[#1E2D45]">
          <span className="text-[10px] font-semibold text-[#94A3B8] uppercase tracking-wide block mb-1.5">Notes</span>
          <p className="text-sm text-[#334155] dark:text-[#CBD5E1]">{tenant.notes}</p>
        </div>
      )}
    </div>
  );
}

function DocumentsTab({ documents, canEdit }: { documents: TenantDocument[]; canEdit: boolean }) {
  const required = ['tenancy_agreement', 'support_plan', 'risk_assessment', 'consent_form', 'id_verification', 'local_authority_referral', 'benefit_confirmation'];
  const complete = documents.filter(d => d.status === 'complete').length;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-sm font-semibold text-[#0F172A] dark:text-[#F8FAFC]">{complete} / {required.length} required documents complete</p>
          <ProgressBar value={complete} max={required.length} className="mt-2 w-48" />
        </div>
        {canEdit && (
          <Button size="sm" leftIcon={<Plus size={14} />}>Upload Document</Button>
        )}
      </div>

      <div className="space-y-2">
        {required.map(docType => {
          const doc = documents.find(d => d.type === docType);
          return (
            <div key={docType} className={`flex items-center gap-4 p-4 rounded-xl border ${
              !doc ? 'border-rose-200 dark:border-rose-900/30 bg-rose-50 dark:bg-rose-900/10' :
              doc.status === 'expired' ? 'border-amber-200 dark:border-amber-900/30 bg-amber-50 dark:bg-amber-900/10' :
              'border-[#E6EEF5] dark:border-[#1E2D45] bg-white dark:bg-[#111827]'
            }`}>
              <div className="flex-shrink-0">
                {!doc ? <XCircle size={18} className="text-rose-500" /> :
                 doc.status === 'expired' ? <AlertCircle size={18} className="text-amber-500" /> :
                 <CheckCircle size={18} className="text-emerald-500" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[#0F172A] dark:text-[#F8FAFC]">{DOC_LABELS[docType]}</p>
                {doc && (
                  <p className="text-xs text-[#64748B]">
                    v{doc.version} · {doc.uploadedAt ? new Date(doc.uploadedAt).toLocaleDateString('en-GB') : ''}
                    {doc.fileSize ? ` · ${doc.fileSize}` : ''}
                  </p>
                )}
              </div>
              {doc && <StatusPill status={doc.signatureStatus === 'signed' ? 'signed' : doc.status} />}
              {!doc && <Badge variant="danger">Missing</Badge>}
              {doc?.status === 'expired' && <Badge variant="warning">Expired</Badge>}
              {doc && (
                <button className="text-xs text-[#075DE8] hover:underline">
                  {doc.status === 'missing' ? 'Upload' : 'View'}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function SupportTab({ logs }: { logs: SupportLog[] }) {
  const typeLabel = (t: string) => t.replace(/_/g, ' ').replace(/^\w/, c => c.toUpperCase());
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-[#64748B]">{logs.length} support sessions recorded</p>
        <Button size="sm" leftIcon={<Plus size={14} />}>Log Support</Button>
      </div>
      {logs.length === 0 ? (
        <EmptyState title="No support logs" description="Add a support session to get started." />
      ) : (
        <div className="space-y-3">
          {logs.map((log, i) => (
            <motion.div
              key={log.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="p-4 rounded-xl border border-[#E6EEF5] dark:border-[#1E2D45] bg-white dark:bg-[#111827]"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <Badge variant="info">{typeLabel(log.supportType)}</Badge>
                    <span className="text-xs text-[#64748B]">{new Date(log.date).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })} · {log.duration}min</span>
                    <span className="text-xs text-[#64748B]">{log.location}</span>
                  </div>
                  <p className="text-sm text-[#334155] dark:text-[#CBD5E1]">{log.notes}</p>
                  {log.outcome && <p className="text-xs text-[#64748B] mt-1"><span className="font-medium">Outcome:</span> {log.outcome}</p>}
                  {log.followUpRequired && (
                    <div className="flex items-center gap-1.5 mt-2">
                      <AlertTriangle size={12} className="text-amber-500" />
                      <span className="text-xs text-amber-600">Follow-up due {log.nextFollowUpDate ? new Date(log.nextFollowUpDate).toLocaleDateString('en-GB') : '—'}</span>
                    </div>
                  )}
                </div>
                <span className="text-sm font-semibold text-[#075DE8]">{log.duration}min</span>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

function StarTab({ assessments, tenantId, canEdit }: { assessments: StarAssessment[]; tenantId: string; canEdit: boolean }) {
  const [selected, setSelected] = useState<StarAssessment | null>(null);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-[#64748B]">{assessments.length} assessments</p>
        {canEdit && <Button size="sm" leftIcon={<Plus size={14} />}>New Assessment</Button>}
      </div>

      {assessments.length === 0 ? (
        <EmptyState title="No STAR assessments" description="Schedule a new assessment." />
      ) : (
        <div className="space-y-3">
          {assessments.map((a, i) => (
            <motion.div
              key={a.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="p-4 rounded-xl border border-[#E6EEF5] dark:border-[#1E2D45] bg-white dark:bg-[#111827] cursor-pointer hover:border-[#075DE8]/30 transition-colors"
              onClick={() => setSelected(selected?.id === a.id ? null : a)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <StatusPill status={a.status} />
                  <span className="text-sm text-[#334155] dark:text-[#CBD5E1]">
                    {new Date(a.scheduledDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </span>
                </div>
                {a.status === 'completed' && (
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-[#075DE8]">{a.overallScore}/80</span>
                    <ProgressBar value={a.overallScore} max={80} className="w-24" />
                  </div>
                )}
              </div>

              <AnimatePresence>
                {selected?.id === a.id && a.sections.length > 0 && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="mt-4 overflow-hidden"
                  >
                    <div className="space-y-2 pt-3 border-t border-[#E6EEF5] dark:border-[#1E2D45]">
                      {a.sections.map(s => (
                        <div key={s.id} className="flex items-center gap-3">
                          <span className="text-xs text-[#64748B] w-48 flex-shrink-0">{s.title}</span>
                          <ProgressBar value={s.score} max={s.maxScore} className="flex-1" />
                          <span className="text-xs font-semibold text-[#334155] dark:text-[#CBD5E1] w-8 text-right">{s.score}/{s.maxScore}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

function FinancialsTab({ invoices, tenant }: { invoices: Invoice[]; tenant: Tenant }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Weekly Rent', value: `£${tenant.rentAmount}` },
          { label: 'Balance', value: tenant.rentBalance < 0 ? `-£${Math.abs(tenant.rentBalance)}` : '£0', danger: tenant.rentBalance < 0 },
          { label: 'Housing Benefit', value: tenant.housingBenefitStatus },
        ].map(item => (
          <div key={item.label} className="p-4 rounded-xl bg-[#F8FAFC] dark:bg-[#0A0F1E] border border-[#E6EEF5] dark:border-[#1E2D45]">
            <p className="text-[10px] font-semibold text-[#94A3B8] uppercase mb-1">{item.label}</p>
            <p className={`text-xl font-bold font-display ${item.danger ? 'text-rose-500' : 'text-[#0F172A] dark:text-[#F8FAFC]'}`}>{item.value}</p>
          </div>
        ))}
      </div>

      <DataTable
        data={invoices}
        keyExtractor={i => i.id}
        columns={[
          { key: 'invoiceNumber', header: 'Invoice #', render: i => <span className="font-mono text-xs">{i.invoiceNumber}</span> },
          { key: 'period', header: 'Period' },
          { key: 'amount', header: 'Amount', render: i => `£${i.amount}` },
          { key: 'dueDate', header: 'Due', render: i => new Date(i.dueDate).toLocaleDateString('en-GB') },
          { key: 'status', header: 'Status', render: i => <StatusPill status={i.status} /> },
          { key: 'paymentMethod', header: 'Method', render: i => <span className="text-xs capitalize">{i.paymentMethod.replace(/_/g, ' ')}</span> },
        ]}
      />
    </div>
  );
}

function NotesTab() {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-[#64748B]">Internal notes</p>
        <Button size="sm" leftIcon={<Plus size={14} />}>Add Note</Button>
      </div>
      <EmptyState title="No notes yet" description="Add an internal note to keep the team informed." />
    </div>
  );
}

function AuditTab() {
  const events = [
    { id: 1, action: 'Support log added', user: 'Marcus Webb', time: '27 Jun 2026, 11:30', type: 'create' },
    { id: 2, action: 'Document uploaded: Risk Assessment v2', user: 'Fatima Al-Rashid', time: '27 Jun 2026, 10:15', type: 'upload' },
    { id: 3, action: 'Status changed: active → active', user: 'Dorota Dominika', time: '25 Jun 2026, 14:00', type: 'update' },
    { id: 4, action: 'STAR Assessment completed', user: 'Marcus Webb', time: '22 Jun 2026, 09:30', type: 'create' },
  ];
  return (
    <div className="space-y-3">
      {events.map(e => (
        <div key={e.id} className="flex items-start gap-4 py-3 border-b border-[#E6EEF5] dark:border-[#1E2D45] last:border-0">
          <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${e.type === 'create' ? 'bg-emerald-500' : e.type === 'upload' ? 'bg-blue-500' : 'bg-amber-500'}`} />
          <div className="flex-1">
            <p className="text-sm text-[#334155] dark:text-[#CBD5E1]">{e.action}</p>
            <p className="text-xs text-[#64748B] mt-0.5">{e.user} · {e.time}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
