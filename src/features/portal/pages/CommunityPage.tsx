import { useState } from 'react';
import { motion } from 'framer-motion';
import { COMMUNITY_EVENTS } from '../data';
import { useTenantPortal } from '../context';
import { Users, Calendar, MapPin, CheckCircle } from 'lucide-react';
import type { CommunityEvent } from '../types';

const TYPE_ICONS: Record<string, string> = {
  social: '🎉', meeting: '💬', class: '🧘', sport: '⚽', celebration: '🎊',
};

export function CommunityPage() {
  const { tenantUser } = useTenantPortal();
  const [events, setEvents] = useState<CommunityEvent[]>(COMMUNITY_EVENTS);
  const [tab, setTab] = useState<'events' | 'faqs'>('events');

  const toggleRSVP = (id: string) => {
    setEvents(prev => prev.map(e => e.id === id ? { ...e, isRegistered: !e.isRegistered, registeredCount: e.isRegistered ? e.registeredCount - 1 : e.registeredCount + 1 } : e));
  };

  return (
    <div className="max-w-2xl mx-auto px-4 pt-6 pb-8 lg:max-w-none lg:px-6">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-xl font-bold text-[#0F172A] dark:text-white">Community</h1>
          <p className="text-sm text-[#64748B]">Events &amp; social updates</p>
        </div>
      </div>

      <div className="flex gap-2 mb-5">
        {(['events', 'faqs'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all capitalize ${
              tab === t ? 'bg-[#075DE8] text-white' : 'bg-white dark:bg-[#111827] border border-[#E6EEF5] dark:border-[#1E2D45] text-[#64748B]'
            }`}
          >{t}</button>
        ))}
      </div>

      {tab === 'events' && (
        <div className="space-y-4">
          {events.map((event, i) => (
            <motion.div key={event.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white dark:bg-[#111827] border border-[#E6EEF5] dark:border-[#1E2D45] rounded-2xl overflow-hidden hover:shadow-md transition-all"
            >
              <div className={`h-24 bg-gradient-to-r ${event.imageColor} flex items-center justify-center text-5xl`}>
                {TYPE_ICONS[event.type] ?? '📅'}
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-base font-bold text-[#0F172A] dark:text-white">{event.title}</h3>
                    <p className="text-sm text-[#64748B] mt-1">{event.description}</p>
                  </div>
                  {event.isRegistered && (
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                      <CheckCircle size={16} className="text-emerald-600" />
                    </div>
                  )}
                </div>
                <div className="flex flex-wrap gap-3 mt-3 text-xs text-[#64748B]">
                  <span className="flex items-center gap-1.5">
                    <Calendar size={12} />
                    {new Date(event.date).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })} · {event.time}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MapPin size={12} />
                    {event.location}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Users size={12} />
                    {event.registeredCount}{event.maxAttendees ? `/${event.maxAttendees}` : ''} attending
                  </span>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-xs text-[#94A3B8]">By {event.organizer}</span>
                  <button
                    onClick={() => toggleRSVP(event.id)}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                      event.isRegistered
                        ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400'
                        : 'bg-[#075DE8] text-white hover:bg-[#0650CC]'
                    }`}
                  >
                    {event.isRegistered ? '✓ Going' : 'RSVP'}
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {tab === 'faqs' && (
        <div className="space-y-2">
          {[
            { q: 'How do I report a maintenance issue?', a: 'Go to the Maintenance section and tap "New Request". We\'ll respond within 24 hours.', cat: 'Maintenance' },
            { q: 'When is my rent due?', a: 'Rent is due on the 1st of each month. You\'ll receive a reminder 5 days before.', cat: 'Payments' },
            { q: 'How do I add a visitor?', a: 'Go to Visitors and tap "Create Pass". Your visitor will receive a QR code by SMS.', cat: 'Visitors' },
            { q: 'How do I collect a parcel?', a: 'Check the Parcels section for your collection code. Bring it to reception (Mon–Fri 8am–6pm).', cat: 'Parcels' },
            { q: 'What\'s the Wi-Fi password?', a: 'Connect to "Granville-Residents". The password is in your welcome pack.', cat: 'Internet' },
            { q: 'Who do I call in an emergency?', a: 'Call 0161 555 0199 (24/7). For fire or medical emergencies call 999 first.', cat: 'Emergency' },
          ].map((faq, i) => (
            <motion.details
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.04 }}
              className="bg-white dark:bg-[#111827] border border-[#E6EEF5] dark:border-[#1E2D45] rounded-2xl overflow-hidden group"
            >
              <summary className="flex items-center justify-between px-4 py-3.5 cursor-pointer list-none hover:bg-[#F8FAFC] dark:hover:bg-[#1E2D45] transition-colors">
                <div>
                  <span className="text-[10px] font-semibold text-[#075DE8] px-2 py-0.5 rounded-full bg-[#EFF6FF] dark:bg-[#1E2D45] mr-2">{faq.cat}</span>
                  <span className="text-sm font-semibold text-[#334155] dark:text-[#CBD5E1]">{faq.q}</span>
                </div>
                <span className="text-[#94A3B8] ml-2 flex-shrink-0">﹢</span>
              </summary>
              <div className="px-4 pb-4 pt-2 text-sm text-[#64748B] border-t border-[#F1F5F9] dark:border-[#1E2D45]">
                {faq.a}
              </div>
            </motion.details>
          ))}
        </div>
      )}
    </div>
  );
}
