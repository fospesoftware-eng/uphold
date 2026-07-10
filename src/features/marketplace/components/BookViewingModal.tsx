import { useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, Calendar, Clock, Users, Video, MapPin, User, Mail, Phone,
  MessageSquare, CheckCircle2, Minus, Plus, ShieldCheck, CalendarCheck,
} from 'lucide-react';
import { marketplaceStore } from '../useMarketplace';
import type { ViewingRequest } from '../store';
import type { DecoratedListing } from '../useMarketplace';
import { shortDate } from '../format';

const TIME_SLOTS = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'];
const AGENTS = ['No preference', 'Marcus Webb', 'Sarah Mitchell', 'David Okafor'];

/** next 14 days as selectable pills */
function upcomingDays(count = 14) {
  const out: { iso: string; dow: string; day: number; mon: string }[] = [];
  const d = new Date();
  for (let i = 1; i <= count; i++) {
    const x = new Date(d);
    x.setDate(d.getDate() + i);
    out.push({
      iso: x.toISOString().slice(0, 10),
      dow: x.toLocaleDateString('en-GB', { weekday: 'short' }),
      day: x.getDate(),
      mon: x.toLocaleDateString('en-GB', { month: 'short' }),
    });
  }
  return out;
}

export function BookViewingModal({
  open, onClose, listing,
}: { open: boolean; onClose: () => void; listing: DecoratedListing }) {
  const days = useMemo(() => upcomingDays(), []);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [visitors, setVisitors] = useState(1);
  const [mode, setMode] = useState<'physical' | 'virtual'>('physical');
  const [agent, setAgent] = useState(AGENTS[0]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [comments, setComments] = useState('');
  const [touched, setTouched] = useState(false);
  const [confirmed, setConfirmed] = useState<ViewingRequest | null>(null);

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const canSubmit = date && time && name.trim() && emailValid && phone.trim().length >= 7;

  const submit = () => {
    setTouched(true);
    if (!canSubmit) return;
    const booking: ViewingRequest = {
      id: 'VW-' + Math.random().toString(36).slice(2, 7).toUpperCase(),
      listingId: listing.id,
      listingHeadline: listing.meta.headline,
      propertyAddress: `${listing.property.address}, ${listing.property.city}`,
      date, time, visitors, mode, agent, name: name.trim(), email: email.trim(),
      phone: phone.trim(), comments: comments.trim() || undefined,
      status: 'pending', createdAt: new Date().toISOString(),
    };
    marketplaceStore.addBooking(booking);
    setConfirmed(booking);
  };

  const reset = () => {
    setDate(''); setTime(''); setVisitors(1); setMode('physical'); setAgent(AGENTS[0]);
    setName(''); setEmail(''); setPhone(''); setComments(''); setTouched(false); setConfirmed(null);
  };
  const close = () => { onClose(); setTimeout(reset, 250); };

  return createPortal(
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={close}
            className="fixed inset-0 z-[60] bg-[#050B18]/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[61] flex items-end sm:items-center justify-center sm:p-4 overflow-y-auto"
          >
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 40, scale: 0.98 }}
              transition={{ type: 'spring', damping: 26, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full sm:max-w-lg bg-white dark:bg-[#111827] rounded-t-3xl sm:rounded-3xl shadow-2xl my-0 sm:my-8 max-h-[92vh] flex flex-col"
            >
              {confirmed ? (
                <Success booking={confirmed} onClose={close} />
              ) : (
                <>
                  {/* header */}
                  <div className="shrink-0 px-6 pt-6 pb-4 border-b border-[#E6EEF5] dark:border-white/10">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h2 className="text-lg font-bold text-[#0F172A] dark:text-white flex items-center gap-2">
                          <CalendarCheck size={20} className="text-[#075DE8]" /> Book a viewing
                        </h2>
                        <p className="mt-1 text-xs text-[#64748B] dark:text-[#94A3B8] line-clamp-1">
                          {listing.meta.headline} · {listing.property.city}
                        </p>
                      </div>
                      <button onClick={close} className="w-8 h-8 rounded-lg flex items-center justify-center text-[#64748B] hover:bg-[#F1F5F9] dark:hover:bg-white/5">
                        <X size={18} />
                      </button>
                    </div>
                  </div>

                  {/* body */}
                  <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
                    {/* date */}
                    <Group icon={<Calendar size={15} />} label="Choose a date">
                      <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
                        {days.map((d) => (
                          <button key={d.iso} onClick={() => setDate(d.iso)}
                            className={`shrink-0 w-14 py-2 rounded-xl border text-center transition-colors ${
                              date === d.iso ? 'bg-[#075DE8] text-white border-[#075DE8]' : 'border-[#E6EEF5] dark:border-white/10 hover:border-[#075DE8]/40'
                            }`}>
                            <span className="block text-[10px] uppercase opacity-70">{d.dow}</span>
                            <span className="block text-base font-bold leading-tight">{d.day}</span>
                            <span className="block text-[10px] opacity-70">{d.mon}</span>
                          </button>
                        ))}
                      </div>
                      {touched && !date && <Err>Please choose a date</Err>}
                    </Group>

                    {/* time */}
                    <Group icon={<Clock size={15} />} label="Choose a time">
                      <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                        {TIME_SLOTS.map((t) => (
                          <button key={t} onClick={() => setTime(t)}
                            className={`py-2 rounded-lg text-sm font-medium border transition-colors ${
                              time === t ? 'bg-[#075DE8] text-white border-[#075DE8]' : 'border-[#E6EEF5] dark:border-white/10 hover:border-[#075DE8]/40'
                            }`}>
                            {t}
                          </button>
                        ))}
                      </div>
                      {touched && !time && <Err>Please choose a time</Err>}
                    </Group>

                    {/* mode + visitors */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <Group icon={<Video size={15} />} label="Viewing type">
                        <div className="grid grid-cols-2 gap-2">
                          {([['physical', 'In person', <MapPin size={14} key="a" />], ['virtual', 'Virtual', <Video size={14} key="b" />]] as const).map(([v, l, ic]) => (
                            <button key={v} onClick={() => setMode(v)}
                              className={`flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-medium border transition-colors ${
                                mode === v ? 'bg-[#075DE8] text-white border-[#075DE8]' : 'border-[#E6EEF5] dark:border-white/10 hover:border-[#075DE8]/40'
                              }`}>
                              {ic} {l}
                            </button>
                          ))}
                        </div>
                      </Group>
                      <Group icon={<Users size={15} />} label="Visitors">
                        <div className="flex items-center gap-3">
                          <button onClick={() => setVisitors((v) => Math.max(1, v - 1))}
                            className="w-10 h-10 rounded-xl border border-[#E6EEF5] dark:border-white/10 flex items-center justify-center hover:border-[#075DE8]/40"><Minus size={16} /></button>
                          <span className="w-8 text-center text-lg font-bold">{visitors}</span>
                          <button onClick={() => setVisitors((v) => Math.min(6, v + 1))}
                            className="w-10 h-10 rounded-xl border border-[#E6EEF5] dark:border-white/10 flex items-center justify-center hover:border-[#075DE8]/40"><Plus size={16} /></button>
                        </div>
                      </Group>
                    </div>

                    {/* agent */}
                    <Group icon={<User size={15} />} label="Preferred agent">
                      <select value={agent} onChange={(e) => setAgent(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl border border-[#E6EEF5] dark:border-white/10 bg-white dark:bg-white/5 text-sm outline-none">
                        {AGENTS.map((a) => <option key={a} value={a}>{a}</option>)}
                      </select>
                    </Group>

                    {/* details */}
                    <Group icon={<User size={15} />} label="Your details">
                      <div className="space-y-2.5">
                        <TextField icon={<User size={15} />} value={name} onChange={setName} placeholder="Full name"
                          error={touched && !name.trim() ? 'Required' : undefined} />
                        <TextField icon={<Mail size={15} />} value={email} onChange={setEmail} placeholder="Email address" type="email"
                          error={touched && !emailValid ? 'Enter a valid email' : undefined} />
                        <TextField icon={<Phone size={15} />} value={phone} onChange={setPhone} placeholder="Phone number" type="tel"
                          error={touched && phone.trim().length < 7 ? 'Required' : undefined} />
                      </div>
                    </Group>

                    {/* comments */}
                    <Group icon={<MessageSquare size={15} />} label="Comments (optional)">
                      <textarea value={comments} onChange={(e) => setComments(e.target.value)} rows={3}
                        placeholder="Anything the agent should know…"
                        className="w-full px-3 py-2.5 rounded-xl border border-[#E6EEF5] dark:border-white/10 bg-white dark:bg-white/5 text-sm outline-none resize-none" />
                    </Group>
                  </div>

                  {/* footer */}
                  <div className="shrink-0 px-6 py-4 border-t border-[#E6EEF5] dark:border-white/10 bg-[#F8FAFC] dark:bg-white/[0.02] rounded-b-3xl">
                    <div className="flex items-center gap-2 text-[11px] text-[#94A3B8] mb-3">
                      <ShieldCheck size={13} className="text-emerald-500" /> Free · no obligation · instant confirmation
                    </div>
                    <button onClick={submit} disabled={!canSubmit}
                      className="w-full py-3 rounded-2xl bg-[#075DE8] hover:bg-[#0650CC] disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold transition-colors">
                      Confirm viewing request
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}

function Success({ booking, onClose }: { booking: ViewingRequest; onClose: () => void }) {
  return (
    <div className="px-6 py-8 text-center">
      <motion.div initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', damping: 14 }}
        className="mx-auto w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 mb-4">
        <CheckCircle2 size={34} />
      </motion.div>
      <h2 className="text-xl font-bold text-[#0F172A] dark:text-white">Viewing requested!</h2>
      <p className="mt-1 text-sm text-[#64748B] dark:text-[#94A3B8]">
        Reference <span className="font-semibold text-[#075DE8]">{booking.id}</span>
      </p>

      <div className="mt-5 rounded-2xl border border-[#E6EEF5] dark:border-white/10 text-left divide-y divide-[#E6EEF5] dark:divide-white/10">
        {[
          { l: 'Property', v: booking.listingHeadline },
          { l: 'When', v: `${shortDate(booking.date)} · ${booking.time}` },
          { l: 'Type', v: booking.mode === 'virtual' ? 'Virtual viewing' : 'In-person viewing' },
          { l: 'Visitors', v: `${booking.visitors}` },
          { l: 'Agent', v: booking.agent },
        ].map((r) => (
          <div key={r.l} className="flex items-start justify-between gap-4 px-4 py-2.5 text-sm">
            <span className="text-[#94A3B8] shrink-0">{r.l}</span>
            <span className="font-medium text-[#0F172A] dark:text-white text-right line-clamp-2">{r.v}</span>
          </div>
        ))}
      </div>

      <div className="mt-5 rounded-2xl bg-[#075DE8]/5 border border-[#075DE8]/15 p-4 text-left text-xs text-[#475569] dark:text-[#CBD5E1]">
        <p className="font-semibold text-[#0F172A] dark:text-white mb-1.5">What happens next</p>
        <ol className="space-y-1 list-decimal list-inside">
          <li>The managing agent reviews your request (usually within a few hours).</li>
          <li>You’ll get an email &amp; SMS confirmation once approved.</li>
          <li>A calendar invite with directions or a video link is sent.</li>
        </ol>
      </div>

      <button onClick={onClose} className="mt-6 w-full py-3 rounded-2xl bg-[#075DE8] hover:bg-[#0650CC] text-white text-sm font-semibold transition-colors">
        Done
      </button>
    </div>
  );
}

function Group({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#94A3B8] mb-2.5">
        <span className="text-[#075DE8]">{icon}</span> {label}
      </p>
      {children}
    </div>
  );
}

function TextField({ icon, value, onChange, placeholder, type = 'text', error }: {
  icon: React.ReactNode; value: string; onChange: (v: string) => void; placeholder: string; type?: string; error?: string;
}) {
  return (
    <div>
      <div className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border bg-white dark:bg-white/5 ${error ? 'border-rose-300' : 'border-[#E6EEF5] dark:border-white/10'}`}>
        <span className="text-[#94A3B8]">{icon}</span>
        <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
          className="w-full bg-transparent outline-none text-sm" />
      </div>
      {error && <Err>{error}</Err>}
    </div>
  );
}

function Err({ children }: { children: React.ReactNode }) {
  return <p className="mt-1.5 text-[11px] font-medium text-rose-500">{children}</p>;
}
