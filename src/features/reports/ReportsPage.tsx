import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Download, RefreshCw, FileSpreadsheet, FileText } from 'lucide-react';
import { Card, PageHeader, Badge, Button, EmptyState } from '../../components/ui';
import { reportService } from '../../services';
import type { Report } from '../../types';

const CATEGORY_COLORS: Record<string, string> = {
  Compliance: 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400',
  Support: 'bg-teal-100 text-teal-700 dark:bg-teal-900/20 dark:text-teal-400',
  Financials: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400',
  Properties: 'bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400',
  Executive: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-400',
};

export function ReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState<string | null>(null);

  useEffect(() => {
    reportService.getReports().then(r => { setReports(r); setLoading(false); });
  }, []);

  const handleGenerate = async (id: string) => {
    setGenerating(id);
    await reportService.generateReport(id);
    setGenerating(null);
  };

  const categories = [...new Set(reports.map(r => r.category))];

  return (
    <div className="max-w-[1400px] mx-auto">
      <PageHeader
        title="Reports"
        subtitle="Generate and export compliance, financial, and operational reports"
      />

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => <div key={i} className="h-40 skeleton rounded-xl" />)}
        </div>
      ) : (
        <div className="space-y-8">
          {categories.map(cat => (
            <div key={cat}>
              <h2 className="text-base font-semibold font-display text-[#0F172A] dark:text-[#F8FAFC] mb-4 flex items-center gap-2">
                <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${CATEGORY_COLORS[cat] ?? 'bg-slate-100 text-slate-600'}`}>{cat}</span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {reports.filter(r => r.category === cat).map((report, i) => (
                  <motion.div
                    key={report.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.07 }}
                  >
                    <Card hover className="flex flex-col h-full">
                      <div className="flex items-start gap-3 mb-3">
                        <div className="w-10 h-10 rounded-xl bg-uphold-gradient-subtle flex items-center justify-center text-[#075DE8] flex-shrink-0">
                          <BarChart3 size={20} />
                        </div>
                        <div>
                          <h3 className="font-semibold text-sm text-[#0F172A] dark:text-[#F8FAFC] leading-tight">{report.name}</h3>
                        </div>
                      </div>
                      <p className="text-xs text-[#64748B] mb-4 flex-1">{report.description}</p>
                      {report.lastGenerated && (
                        <p className="text-[10px] text-[#94A3B8] mb-3">
                          Last generated {new Date(report.lastGenerated).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </p>
                      )}
                      <div className="flex items-center gap-2 mt-auto">
                        <Button
                          size="sm"
                          variant="outline"
                          leftIcon={generating === report.id ? <RefreshCw size={13} className="animate-spin" /> : <RefreshCw size={13} />}
                          loading={generating === report.id}
                          onClick={() => handleGenerate(report.id)}
                          className="flex-1"
                        >
                          Generate
                        </Button>
                        <button className="p-1.5 rounded-lg border border-[#E6EEF5] dark:border-[#1E2D45] hover:bg-[#F8FAFC] dark:hover:bg-[#1E2D45] text-[#64748B] transition-colors">
                          <Download size={14} />
                        </button>
                        <button className="p-1.5 rounded-lg border border-[#E6EEF5] dark:border-[#1E2D45] hover:bg-[#F8FAFC] dark:hover:bg-[#1E2D45] text-[#64748B] transition-colors">
                          <FileSpreadsheet size={14} />
                        </button>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Custom Report Builder teaser */}
      <Card className="mt-8 border-dashed border-2 border-[#E6EEF5] dark:border-[#1E2D45] bg-uphold-gradient-subtle">
        <div className="flex flex-col sm:flex-row items-center gap-5 py-2">
          <div className="w-12 h-12 rounded-xl bg-uphold-gradient flex items-center justify-center text-white flex-shrink-0">
            <BarChart3 size={24} />
          </div>
          <div className="flex-1 text-center sm:text-left">
            <h3 className="font-semibold font-display text-[#0F172A] dark:text-[#F8FAFC]">Custom Report Builder</h3>
            <p className="text-sm text-[#64748B] mt-0.5">Build bespoke reports with custom data sources, filters, grouping, and date ranges.</p>
          </div>
          <Button leftIcon={<Plus size={16} />}>Build Custom Report</Button>
        </div>
      </Card>
    </div>
  );
}

function Plus({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path d="M12 5v14M5 12h14" strokeLinecap="round" />
    </svg>
  );
}
