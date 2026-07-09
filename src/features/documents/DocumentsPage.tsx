import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, Upload, Plus, Eye, Download, Edit2 } from 'lucide-react';
import {
  Card, PageHeader, Tabs, StatusPill, Badge, Button, DataTable,
  EmptyState, FilterBar
} from '../../components/ui';
import { documentService } from '../../services';
import { tenants } from '../../data/mockData';
import type { TenantDocument, DocumentTemplate } from '../../types';

const DOC_TYPE_LABELS: Record<string, string> = {
  tenancy_agreement: 'Tenancy Agreement',
  support_plan: 'Support Plan',
  risk_assessment: 'Risk Assessment',
  consent_form: 'Consent Form',
  id_verification: 'ID Verification',
  local_authority_referral: 'LA Referral',
  benefit_confirmation: 'Benefit Confirmation',
  move_in_checklist: 'Move-in Checklist',
};

const TEMPLATE_TYPE_LABELS: Record<string, string> = {
  tenancy_agreement: 'Tenancy Agreement',
  notice: 'Notice',
  letter: 'Letter',
  support_plan: 'Support Plan',
  risk_assessment: 'Risk Assessment',
  consent_form: 'Consent Form',
  review_letter: 'Review Letter',
};

export function DocumentsPage() {
  const [documents, setDocuments] = useState<TenantDocument[]>([]);
  const [templates, setTemplates] = useState<DocumentTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('library');
  const [search, setSearch] = useState('');

  useEffect(() => {
    Promise.all([
      documentService.getAllDocuments('org-1'),
      documentService.getAllTemplates(),
    ]).then(([docs, tmpls]) => { setDocuments(docs); setTemplates(tmpls); setLoading(false); });
  }, []);

  const getTenant = (id: string) => tenants.find(t => t.id === id);

  const filtered = documents.filter(d => {
    if (!search) return true;
    const t = getTenant(d.tenantId);
    return d.name.toLowerCase().includes(search.toLowerCase()) ||
      (t ? `${t.firstName} ${t.lastName}`.toLowerCase().includes(search.toLowerCase()) : false);
  });

  const tabs = [
    { id: 'library', label: 'Document Library', count: documents.length },
    { id: 'templates', label: 'Templates', count: templates.length },
    { id: 'signatures', label: 'E-Signatures', count: documents.filter(d => d.signatureStatus === 'pending').length },
  ];

  const PLACEHOLDERS = ['{{TenantName}}', '{{PropertyAddress}}', '{{RoomNumber}}', '{{TenancyStartDate}}', '{{KeyWorkerName}}', '{{OrganisationName}}', '{{RentAmount}}'];

  return (
    <div className="max-w-[1400px] mx-auto">
      <PageHeader
        title="Documents"
        subtitle="Document library, templates, and e-signatures"
        actions={<Button leftIcon={<Upload size={16} />}>Upload Document</Button>}
      />

      <Card padding="none">
        <div className="p-4 border-b border-[#E6EEF5] dark:border-[#1E2D45]">
          <Tabs tabs={tabs} active={activeTab} onChange={setActiveTab} />
        </div>
        <div className="p-4">
          {activeTab === 'library' && (
            <>
              <FilterBar
                search={search}
                onSearch={setSearch}
                placeholder="Search documents…"
              />
              <DataTable
                loading={loading}
                data={filtered}
                keyExtractor={d => d.id}
                emptyState={<EmptyState title="No documents" className="py-8" />}
                columns={[
                  {
                    key: 'name',
                    header: 'Document',
                    render: d => (
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-uphold-gradient-subtle flex items-center justify-center text-[#075DE8]">
                          <FileText size={16} />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-[#0F172A] dark:text-[#F8FAFC]">{d.name}</p>
                          <p className="text-xs text-[#64748B] capitalize">{DOC_TYPE_LABELS[d.type] ?? d.type}</p>
                        </div>
                      </div>
                    ),
                  },
                  {
                    key: 'tenant',
                    header: 'Tenant',
                    render: d => {
                      const t = getTenant(d.tenantId);
                      return t ? <span className="text-sm">{t.firstName} {t.lastName}</span> : <span className="text-[#64748B]">—</span>;
                    },
                  },
                  { key: 'status', header: 'Status', render: d => <StatusPill status={d.status} /> },
                  { key: 'signatureStatus', header: 'Signature', render: d => <StatusPill status={d.signatureStatus} /> },
                  { key: 'version', header: 'Version', render: d => <Badge variant="muted">v{d.version}</Badge> },
                  {
                    key: 'uploadedAt',
                    header: 'Uploaded',
                    render: d => d.uploadedAt ? new Date(d.uploadedAt).toLocaleDateString('en-GB') : '—',
                  },
                  {
                    key: 'expiry',
                    header: 'Expiry',
                    render: d => d.expiryDate ? (
                      <span className={new Date(d.expiryDate) < new Date() ? 'text-rose-500 font-medium' : ''}>
                        {new Date(d.expiryDate).toLocaleDateString('en-GB')}
                      </span>
                    ) : '—',
                  },
                  {
                    key: 'actions',
                    header: '',
                    render: d => (
                      <div className="flex items-center gap-1">
                        <button className="p-1.5 rounded-lg hover:bg-[#F8FAFC] dark:hover:bg-[#1E2D45] text-[#64748B] transition-colors"><Eye size={14} /></button>
                        <button className="p-1.5 rounded-lg hover:bg-[#F8FAFC] dark:hover:bg-[#1E2D45] text-[#64748B] transition-colors"><Download size={14} /></button>
                      </div>
                    ),
                  },
                ]}
              />
            </>
          )}

          {activeTab === 'templates' && (
            <div>
              <div className="flex justify-end mb-4">
                <Button size="sm" leftIcon={<Plus size={14} />}>New Template</Button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {templates.map((tmpl, i) => (
                  <motion.div
                    key={tmpl.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.07 }}
                  >
                    <Card hover>
                      <div className="flex items-start gap-3 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-uphold-gradient-subtle flex items-center justify-center text-[#075DE8]">
                          <FileText size={20} />
                        </div>
                        <div>
                          <h3 className="font-semibold text-sm text-[#0F172A] dark:text-[#F8FAFC]">{tmpl.name}</h3>
                          <Badge variant="muted" className="mt-1">{TEMPLATE_TYPE_LABELS[tmpl.type] ?? tmpl.type}</Badge>
                        </div>
                      </div>
                      <p className="text-xs text-[#64748B] mb-4">{tmpl.description}</p>
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {PLACEHOLDERS.slice(0, 3).map(p => (
                          <span key={p} className="px-1.5 py-0.5 text-[10px] font-mono bg-[#F8FAFC] dark:bg-[#1E2D45] text-[#075DE8] rounded border border-[#E6EEF5] dark:border-[#1E2D45]">{p}</span>
                        ))}
                      </div>
                      <div className="flex items-center justify-between pt-3 border-t border-[#E6EEF5] dark:border-[#1E2D45]">
                        <span className="text-xs text-[#64748B]">Updated {new Date(tmpl.lastUpdated).toLocaleDateString('en-GB')}</span>
                        <div className="flex items-center gap-1">
                          <button className="p-1.5 rounded-lg hover:bg-[#F8FAFC] dark:hover:bg-[#1E2D45] text-[#64748B] transition-colors"><Edit2 size={14} /></button>
                          <button className="p-1.5 rounded-lg hover:bg-[#F8FAFC] dark:hover:bg-[#1E2D45] text-[#64748B] transition-colors"><Eye size={14} /></button>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'signatures' && (
            <div className="space-y-3">
              {documents.filter(d => d.signatureStatus === 'pending').length === 0 ? (
                <EmptyState title="No pending signatures" description="All documents are signed or don't require signatures." className="py-8" />
              ) : (
                documents.filter(d => d.signatureStatus === 'pending').map((d, i) => {
                  const t = getTenant(d.tenantId);
                  return (
                    <motion.div
                      key={d.id}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="flex items-center gap-4 p-4 rounded-xl border border-amber-200 dark:border-amber-900/30 bg-amber-50 dark:bg-amber-900/10"
                    >
                      <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-600">
                        <FileText size={16} />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-[#0F172A] dark:text-[#F8FAFC]">{d.name}</p>
                        <p className="text-xs text-[#64748B]">{t ? `${t.firstName} ${t.lastName}` : '—'} · {new Date(d.uploadedAt).toLocaleDateString('en-GB')}</p>
                      </div>
                      <StatusPill status="pending_signature" />
                      <Button size="sm" variant="outline">Send Reminder</Button>
                    </motion.div>
                  );
                })
              )}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
