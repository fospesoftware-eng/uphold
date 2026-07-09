import { motion } from 'framer-motion';
import { Phone, Mail, MessageSquare, HelpCircle, AlertTriangle, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CONTACTS = [
  { name: 'Property Manager', desc: 'Sarah Mitchell', phone: '0161 555 0101', email: 'sarah.mitchell@granvillehomes.org', color: 'from-emerald-400 to-teal-500', initials: 'SM', available: 'Mon–Fri 9am–5pm' },
  { name: 'Maintenance', desc: 'Urgent repairs', phone: '0161 555 0102', email: 'maintenance@granvillehomes.org', color: 'from-amber-400 to-orange-500', initials: 'MT', available: 'Mon–Fri 8am–6pm' },
  { name: '24/7 Emergency', desc: 'Property emergencies', phone: '0161 555 0199', email: 'emergency@granvillehomes.org', color: 'from-rose-500 to-red-600', initials: '24', available: 'Always available' },
];

const FAQ_QUICK = [
  { q: 'How to submit a maintenance request?', href: '/portal/maintenance' },
  { q: 'How to pay my rent?', href: '/portal/payments' },
  { q: 'How to create a visitor pass?', href: '/portal/visitors' },
  { q: 'Where to find my documents?', href: '/portal/documents' },
];

export function SupportPage() {
  const navigate = useNavigate();

  return (
    <div className="max-w-2xl mx-auto px-4 pt-6 pb-8 lg:max-w-none lg:px-6 space-y-6">
      <div>
        <h1 className="text-xl font-bold text-[#0F172A] dark:text-white">Support Centre</h1>
        <p className="text-sm text-[#64748B]">We're here to help</p>
      </div>

      {/* Emergency banner */}
      <div className="flex items-center gap-3 p-4 rounded-2xl bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800/50">
        <AlertTriangle size={20} className="text-rose-600 flex-shrink-0" />
        <div className="flex-1">
          <p className="text-sm font-bold text-rose-700 dark:text-rose-400">Emergency?</p>
          <p className="text-xs text-rose-600 dark:text-rose-400/80">Fire, medical or serious security issue — call 999 first.</p>
        </div>
        <a href="tel:999" className="px-3 py-2 rounded-xl bg-rose-600 text-white text-sm font-bold flex-shrink-0">
          999
        </a>
      </div>

      {/* Contact cards */}
      <section>
        <h2 className="text-sm font-semibold text-[#334155] dark:text-[#CBD5E1] mb-3">Contact Us</h2>
        <div className="space-y-3">
          {CONTACTS.map(contact => (
            <motion.div
              key={contact.name}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-[#111827] border border-[#E6EEF5] dark:border-[#1E2D45] rounded-2xl p-4"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${contact.color} flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}>
                  {contact.initials}
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#0F172A] dark:text-white">{contact.name}</p>
                  <p className="text-xs text-[#64748B]">{contact.desc} · {contact.available}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <a href={`tel:${contact.phone}`}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#F8FAFC] dark:bg-[#1E2D45] text-sm font-medium text-[#334155] dark:text-[#CBD5E1] hover:bg-[#EFF6FF] hover:text-[#075DE8] transition-colors"
                >
                  <Phone size={15} />
                  Call
                </a>
                <a href={`mailto:${contact.email}`}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#F8FAFC] dark:bg-[#1E2D45] text-sm font-medium text-[#334155] dark:text-[#CBD5E1] hover:bg-[#EFF6FF] hover:text-[#075DE8] transition-colors"
                >
                  <Mail size={15} />
                  Email
                </a>
                <button
                  onClick={() => navigate('/portal/messages')}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#075DE8] text-white text-sm font-medium hover:bg-[#0650CC] transition-colors"
                >
                  <MessageSquare size={15} />
                  Message
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Quick help */}
      <section>
        <h2 className="text-sm font-semibold text-[#334155] dark:text-[#CBD5E1] mb-3">Quick Help</h2>
        <div className="space-y-2">
          {FAQ_QUICK.map(item => (
            <button
              key={item.q}
              onClick={() => navigate(item.href)}
              className="w-full flex items-center gap-3 px-4 py-3.5 bg-white dark:bg-[#111827] border border-[#E6EEF5] dark:border-[#1E2D45] rounded-2xl text-left hover:shadow-md hover:border-[#075DE8]/30 transition-all"
            >
              <HelpCircle size={16} className="text-[#075DE8] flex-shrink-0" />
              <span className="text-sm font-medium text-[#334155] dark:text-[#CBD5E1] flex-1">{item.q}</span>
              <span className="text-[#94A3B8] text-sm">›</span>
            </button>
          ))}
        </div>
      </section>

      {/* Raise ticket */}
      <section>
        <h2 className="text-sm font-semibold text-[#334155] dark:text-[#CBD5E1] mb-3">Report an Issue</h2>
        <button
          onClick={() => navigate('/portal/maintenance')}
          className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-gradient-to-r from-[#075DE8] to-[#0EA5E9] text-white font-semibold shadow-lg shadow-blue-500/20 hover:opacity-95 transition-all"
        >
          <FileText size={18} />
          Submit Maintenance Request
        </button>
      </section>

      {/* App info */}
      <div className="text-center text-[10px] text-[#94A3B8] space-y-1 pb-2">
        <p>Granville Resident Portal · Version 1.0.0</p>
        <p>© 2026 Granville Community Homes Ltd. All rights reserved.</p>
      </div>
    </div>
  );
}
