import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  ChevronLeft, ChevronRight, Clock, User, Mail, Phone, Building2,
  Check, ArrowRight, CalendarDays, Sparkles, CheckCircle, ShieldCheck,
} from 'lucide-react';

const TIME_SLOTS = ['09:00', '09:30', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00'];
const WEEKDAYS = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const fmtDate = (d: Date) => d.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
const isSameDay = (a: Date, b: Date) => a.toDateString() === b.toDateString();
const startOfDay = (d: Date) => { const x = new Date(d); x.setHours(0, 0, 0, 0); return x; };

export function ScheduleDemoPage() {
  const today = startOfDay(new Date());
  const [viewMonth, setViewMonth] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', email: '', phone: '', org: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  const days = useMemo(() => {
    const year = viewMonth.getFullYear(), month = viewMonth.getMonth();
    const first = new Date(year, month, 1);
    const offset = (first.getDay() + 6) % 7; // Monday-first
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const cells: (Date | null)[] = [];
    for (let i = 0; i < offset; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));
    return cells;
  }, [viewMonth]);

  const isSelectable = (d: Date) => {
    const day = d.getDay();
    return startOfDay(d) >= today && day !== 0 && day !== 6; // future weekdays only
  };

  const canGoPrev = viewMonth > new Date(today.getFullYear(), today.getMonth(), 1);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Please enter your name';
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) e.email = 'Enter a valid email';
    if (form.phone.replace(/\D/g, '').length < 7) e.phone = 'Enter a valid phone number';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!selectedDate || !selectedTime) return;
    if (!validate()) return;
    setSubmitted(true);
  };

  const ready = selectedDate && selectedTime;

  return (
    <div className="bg-white min-h-screen">
      {/* Hero */}
      <div className="bg-[#060B18] pt-32 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-80 h-80 rounded-full bg-[#075DE8]/15 blur-[80px]" />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full bg-[#15C6B8]/15 blur-[80px]" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/15 bg-white/5 text-sm text-white/80 font-medium mb-6"
          >
            <CalendarDays size={13} /> Book a demo
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-4xl lg:text-5xl font-bold font-display text-white mb-4"
          >
            See Uphold on{' '}
            <span className="text-uphold-gradient">your portfolio</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="text-lg text-white/60 max-w-xl mx-auto"
          >
            Pick a time that suits you. A 30-minute, no-pressure walkthrough tailored to supported housing.
          </motion.p>
        </div>
      </div>

      {/* Booking */}
      <div className="max-w-5xl mx-auto px-6 lg:px-8 -mt-12 relative z-20 pb-24">
        <AnimatePresence mode="wait">
          {submitted ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-3xl border border-[#E6EEF5] shadow-xl p-10 text-center max-w-2xl mx-auto"
            >
              <motion.div
                initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 220, damping: 16 }}
                className="w-16 h-16 rounded-2xl bg-uphold-gradient flex items-center justify-center text-white mx-auto mb-5"
              >
                <Check size={32} />
              </motion.div>
              <h2 className="text-2xl font-bold font-display text-[#0F172A] mb-2">You're booked in!</h2>
              <p className="text-[#64748B] mb-6">
                Thanks {form.name.split(' ')[0]} — we've reserved your demo for<br />
                <span className="font-semibold text-[#0F172A]">{selectedDate && fmtDate(selectedDate)} at {selectedTime}</span>.
              </p>
              <div className="bg-[#F8FAFC] border border-[#E6EEF5] rounded-2xl p-5 text-left text-sm space-y-2 mb-6">
                <p className="flex items-center gap-2 text-[#334155]"><Mail size={15} className="text-[#075DE8]" /> A calendar invite is on its way to {form.email}</p>
                <p className="flex items-center gap-2 text-[#334155]"><Phone size={15} className="text-[#075DE8]" /> We'll call {form.phone} if we need anything</p>
              </div>
              <button
                onClick={() => navigate('/')}
                className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white rounded-xl bg-uphold-gradient"
              >
                Back to home <ArrowRight size={15} />
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="grid grid-cols-1 lg:grid-cols-5 gap-0 bg-white rounded-3xl border border-[#E6EEF5] shadow-xl overflow-hidden"
            >
              {/* Calendar + time */}
              <div className="lg:col-span-3 p-6 sm:p-8 border-b lg:border-b-0 lg:border-r border-[#E6EEF5]">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="font-bold font-display text-[#0F172A]">Pick a date</h3>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => canGoPrev && setViewMonth(new Date(viewMonth.getFullYear(), viewMonth.getMonth() - 1, 1))}
                      disabled={!canGoPrev}
                      className="p-1.5 rounded-lg hover:bg-[#F1F5F9] text-[#64748B] disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft size={18} />
                    </button>
                    <span className="text-sm font-medium text-[#0F172A] w-32 text-center">{MONTHS[viewMonth.getMonth()]} {viewMonth.getFullYear()}</span>
                    <button
                      onClick={() => setViewMonth(new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1, 1))}
                      className="p-1.5 rounded-lg hover:bg-[#F1F5F9] text-[#64748B]"
                    >
                      <ChevronRight size={18} />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-7 gap-1 mb-2">
                  {WEEKDAYS.map(d => <div key={d} className="text-center text-xs font-semibold text-[#94A3B8] py-1">{d}</div>)}
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {days.map((d, i) => {
                    if (!d) return <div key={i} />;
                    const selectable = isSelectable(d);
                    const selected = selectedDate && isSameDay(d, selectedDate);
                    const isToday = isSameDay(d, today);
                    return (
                      <button
                        key={i}
                        disabled={!selectable}
                        onClick={() => { setSelectedDate(d); setSelectedTime(null); }}
                        className={`aspect-square rounded-lg text-sm font-medium transition-all relative ${
                          selected ? 'bg-uphold-gradient text-white shadow-[0_4px_14px_rgba(7,93,232,0.4)]'
                          : selectable ? 'text-[#334155] hover:bg-uphold-gradient-subtle hover:text-[#075DE8]'
                          : 'text-[#CBD5E1] cursor-not-allowed'
                        }`}
                      >
                        {d.getDate()}
                        {isToday && !selected && <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#075DE8]" />}
                      </button>
                    );
                  })}
                </div>

                {/* Time slots */}
                <div className="mt-6">
                  <h3 className="font-bold font-display text-[#0F172A] mb-3 flex items-center gap-2">
                    <Clock size={16} className="text-[#075DE8]" /> Pick a time
                    {!selectedDate && <span className="text-xs font-normal text-[#94A3B8]">— select a date first</span>}
                  </h3>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {TIME_SLOTS.map(t => (
                      <button
                        key={t}
                        disabled={!selectedDate}
                        onClick={() => setSelectedTime(t)}
                        className={`py-2.5 rounded-xl text-sm font-medium border transition-all ${
                          selectedTime === t ? 'bg-uphold-gradient text-white border-transparent'
                          : selectedDate ? 'border-[#E6EEF5] text-[#334155] hover:border-[#075DE8] hover:text-[#075DE8]'
                          : 'border-[#F1F5F9] text-[#CBD5E1] cursor-not-allowed'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Contact details */}
              <form onSubmit={handleSubmit} className="lg:col-span-2 p-6 sm:p-8 flex flex-col">
                <h3 className="font-bold font-display text-[#0F172A] mb-1">Your details</h3>
                <p className="text-xs text-[#64748B] mb-5">We'll send a calendar invite and a reminder.</p>

                {ready && (
                  <div className="flex items-center gap-2 text-xs font-medium text-[#075DE8] bg-uphold-gradient-subtle rounded-xl px-3 py-2.5 mb-5">
                    <Sparkles size={14} /> {selectedDate && fmtDate(selectedDate)} · {selectedTime}
                  </div>
                )}

                <div className="space-y-4 flex-1">
                  <Field icon={<User size={15} />} label="Full name" placeholder="Jane Doe"
                    value={form.name} onChange={v => setForm(f => ({ ...f, name: v }))} error={errors.name} />
                  <Field icon={<Mail size={15} />} label="Work email" type="email" placeholder="jane@organisation.org.uk"
                    value={form.email} onChange={v => setForm(f => ({ ...f, email: v }))} error={errors.email} />
                  <Field icon={<Phone size={15} />} label="Mobile number" type="tel" placeholder="07712 345678"
                    value={form.phone} onChange={v => setForm(f => ({ ...f, phone: v }))} error={errors.phone} />
                  <Field icon={<Building2 size={15} />} label="Organisation (optional)" placeholder="Northbridge Supported Living"
                    value={form.org} onChange={v => setForm(f => ({ ...f, org: v }))} />
                </div>

                <button
                  type="submit"
                  disabled={!ready}
                  className="mt-6 w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold text-white rounded-xl bg-uphold-gradient shadow-[0_4px_20px_rgba(7,93,232,0.4)] disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
                >
                  {ready ? 'Confirm my demo' : 'Pick a date & time'} <ArrowRight size={15} />
                </button>
                <p className="text-[11px] text-[#94A3B8] text-center mt-3 flex items-center justify-center gap-1.5">
                  <ShieldCheck size={12} /> No spam. Your details stay private.
                </p>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Trust strip */}
        {!submitted && (
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mt-8 text-xs text-[#64748B]">
            {['30-minute walkthrough', 'Tailored to supported housing', 'No commitment'].map(t => (
              <span key={t} className="inline-flex items-center gap-1.5"><CheckCircle size={13} className="text-[#10B981]" /> {t}</span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Field({ icon, label, value, onChange, placeholder, type = 'text', error }: {
  icon: React.ReactNode; label: string; value: string; onChange: (v: string) => void;
  placeholder?: string; type?: string; error?: string;
}) {
  return (
    <div>
      <label className="text-sm font-medium text-[#334155] mb-1.5 block">{label}</label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]">{icon}</span>
        <input
          type={type}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          className={`w-full rounded-xl border bg-white text-[#0F172A] text-sm py-2.5 pl-9 pr-3.5 placeholder:text-[#CBD5E1] focus:outline-none focus:ring-2 focus:ring-[#15C6B8] transition-all ${error ? 'border-rose-400' : 'border-[#E6EEF5]'}`}
        />
      </div>
      {error && <p className="text-xs text-rose-500 mt-1">{error}</p>}
    </div>
  );
}
