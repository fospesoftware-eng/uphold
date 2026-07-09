import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, QrCode, Clock, CheckCircle, X, Car } from 'lucide-react';
import { useTenantPortal } from '../context';
import { getTenantData } from '../data';

const STATUS_CONFIG = {
  pending:    { label: 'Pending Approval', color: 'text-amber-600',   bg: 'bg-amber-100 dark:bg-amber-900/30' },
  approved:   { label: 'Approved',         color: 'text-emerald-600', bg: 'bg-emerald-100 dark:bg-emerald-900/30' },
  checked_in: { label: 'Checked In',       color: 'text-blue-600',    bg: 'bg-blue-100 dark:bg-blue-900/30' },
  completed:  { label: 'Completed',        color: 'text-slate-500',   bg: 'bg-slate-100 dark:bg-slate-800/50' },
  cancelled:  { label: 'Cancelled',        color: 'text-rose-600',    bg: 'bg-rose-100 dark:bg-rose-900/30' },
};

function NewVisitorSheet({ onClose }: { onClose: () => void }) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [purpose, setPurpose] = useState('');
  const [vehicle, setVehicle] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(onClose, 2000);
  };

  return (
    <>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        className="fixed inset-x-0 bottom-0 z-50 bg-white dark:bg-[#111827] rounded-t-3xl max-h-[88vh] overflow-y-auto"
      >
        <div className="sticky top-0 bg-white dark:bg-[#111827] px-5 pt-5 pb-3 border-b border-[#E6EEF5] dark:border-[#1E2D45] flex items-center justify-between">
          <h2 className="text-base font-bold text-[#0F172A] dark:text-white">Create Visitor Pass</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-[#F1F5F9] dark:hover:bg-[#1E2D45]">
            <X size={18} className="text-[#64748B]" />
          </button>
        </div>
        {submitted ? (
          <div className="px-5 py-12 flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mb-4">
              <CheckCircle size={32} className="text-emerald-600" />
            </div>
            <h3 className="text-lg font-bold text-[#0F172A] dark:text-white mb-2">Pass Created!</h3>
            <p className="text-sm text-[#64748B]">Your visitor will receive a QR code via SMS.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="px-5 py-4 space-y-4 pb-8">
            {[
              { label: 'Visitor Name *', value: name, setter: setName, placeholder: 'Full name', type: 'text', required: true },
              { label: 'Phone Number', value: phone, setter: setPhone, placeholder: '+44 7700 000000', type: 'tel', required: false },
              { label: 'Visit Date *', value: date, setter: setDate, placeholder: '', type: 'date', required: true },
              { label: 'Visit Time *', value: time, setter: setTime, placeholder: '', type: 'time', required: true },
              { label: 'Purpose of Visit *', value: purpose, setter: setPurpose, placeholder: 'e.g. Family visit, Medical appointment', type: 'text', required: true },
              { label: 'Vehicle Registration', value: vehicle, setter: setVehicle, placeholder: 'e.g. AB12 XYZ', type: 'text', required: false },
            ].map(field => (
              <div key={field.label}>
                <label className="block text-xs font-semibold text-[#334155] dark:text-[#CBD5E1] mb-2">{field.label}</label>
                <input
                  type={field.type} value={field.value} onChange={e => field.setter(e.target.value)}
                  placeholder={field.placeholder} required={field.required}
                  className="w-full px-4 py-3 rounded-xl border border-[#E6EEF5] dark:border-[#1E2D45] bg-[#F8FAFC] dark:bg-[#1E2D45] text-[#0F172A] dark:text-white text-sm placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#075DE8]"
                />
              </div>
            ))}
            <button type="submit"
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#075DE8] to-[#0EA5E9] text-white font-semibold text-sm shadow-lg shadow-blue-500/20">
              Create Visitor Pass
            </button>
          </form>
        )}
      </motion.div>
    </>
  );
}

export function VisitorsPage() {
  const { tenantUser } = useTenantPortal();
  const [showNew, setShowNew] = useState(false);

  if (!tenantUser) return null;
  const { visitors } = getTenantData(tenantUser.id);

  const upcoming = visitors.filter(v => !['completed', 'cancelled'].includes(v.status));
  const past = visitors.filter(v => ['completed', 'cancelled'].includes(v.status));

  return (
    <div className="max-w-2xl mx-auto px-4 pt-6 pb-8 lg:max-w-none lg:px-6">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-xl font-bold text-[#0F172A] dark:text-white">Visitors</h1>
          <p className="text-sm text-[#64748B]">{upcoming.length} upcoming passes</p>
        </div>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowNew(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-[#075DE8] to-[#0EA5E9] text-white text-sm font-semibold shadow-lg shadow-blue-500/20"
        >
          <Plus size={16} />
          New Pass
        </motion.button>
      </div>

      {upcoming.length > 0 && (
        <section className="mb-6">
          <h2 className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wider mb-3">Upcoming</h2>
          <div className="space-y-2.5">
            {upcoming.map(visitor => {
              const cfg = STATUS_CONFIG[visitor.status] ?? STATUS_CONFIG.pending;
              return (
                <motion.div key={visitor.id} whileTap={{ scale: 0.98 }}
                  className="flex items-start gap-3 p-4 bg-white dark:bg-[#111827] border border-[#E6EEF5] dark:border-[#1E2D45] rounded-2xl hover:shadow-md transition-all"
                >
                  <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-violet-400 to-purple-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                    {visitor.visitorName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-[#0F172A] dark:text-white">{visitor.visitorName}</p>
                    <p className="text-xs text-[#64748B] mt-0.5">{visitor.purpose}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <div className="flex items-center gap-1.5 text-xs text-[#64748B]">
                        <Clock size={12} />
                        {new Date(visitor.visitDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })} at {visitor.visitTime}
                      </div>
                      {visitor.vehicleReg && (
                        <div className="flex items-center gap-1.5 text-xs text-[#64748B]">
                          <Car size={12} />
                          {visitor.vehicleReg}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${cfg.bg} ${cfg.color}`}>{cfg.label}</span>
                      {visitor.parkingSlot && (
                        <span className="text-[10px] text-[#64748B]">Parking: {visitor.parkingSlot}</span>
                      )}
                    </div>
                  </div>
                  <button className="p-2 rounded-xl bg-[#F8FAFC] dark:bg-[#1E2D45] hover:bg-[#E6EEF5] transition-colors flex-shrink-0">
                    <QrCode size={16} className="text-[#075DE8]" />
                  </button>
                </motion.div>
              );
            })}
          </div>
        </section>
      )}

      {past.length > 0 && (
        <section>
          <h2 className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wider mb-3">Past Visits</h2>
          <div className="space-y-2">
            {past.map(visitor => {
              const cfg = STATUS_CONFIG[visitor.status] ?? STATUS_CONFIG.completed;
              return (
                <div key={visitor.id} className="flex items-center gap-3 p-3 bg-white dark:bg-[#111827] border border-[#E6EEF5] dark:border-[#1E2D45] rounded-xl opacity-75">
                  <div className="w-9 h-9 rounded-xl bg-[#F8FAFC] dark:bg-[#1E2D45] flex items-center justify-center text-xs font-bold text-[#64748B]">
                    {visitor.visitorName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#334155] dark:text-[#CBD5E1] truncate">{visitor.visitorName}</p>
                    <p className="text-xs text-[#94A3B8]">{new Date(visitor.visitDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })} · {visitor.purpose}</p>
                  </div>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${cfg.bg} ${cfg.color}`}>{cfg.label}</span>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {showNew && <NewVisitorSheet onClose={() => setShowNew(false)} />}
    </div>
  );
}
