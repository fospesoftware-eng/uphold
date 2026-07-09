import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Search, ChevronRight, Paperclip } from 'lucide-react';
import { useTenantPortal } from '../context';
import { getTenantData } from '../data';
import type { Conversation, Message } from '../types';

function ConversationView({ conv, onBack }: { conv: Conversation; onBack: () => void }) {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>(conv.messages);

  const sendMessage = () => {
    if (!message.trim()) return;
    setMessages(prev => [...prev, {
      id: `new-${Date.now()}`, conversationId: conv.id,
      senderName: 'You', senderRole: 'tenant',
      content: message, timestamp: new Date().toISOString(), read: true, isOwn: true,
    }]);
    setMessage('');
  };

  const initials = (name: string) => name.split(' ').map(n => n[0]).join('').slice(0, 2);
  const roleColors: Record<string, string> = {
    manager: 'from-emerald-400 to-teal-500',
    maintenance: 'from-amber-400 to-orange-500',
    accounts: 'from-blue-400 to-indigo-500',
    security: 'from-slate-400 to-slate-600',
    reception: 'from-violet-400 to-purple-500',
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] lg:h-[calc(100vh-4rem)]">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 bg-white dark:bg-[#111827] border-b border-[#E6EEF5] dark:border-[#1E2D45]">
        <button onClick={onBack} className="p-2 rounded-xl hover:bg-[#F1F5F9] dark:hover:bg-[#1E2D45] text-[#64748B]">
          ←
        </button>
        <div className={`w-10 h-10 rounded-2xl bg-gradient-to-br ${roleColors[conv.recipientRole] ?? 'from-blue-400 to-indigo-500'} flex items-center justify-center text-white text-sm font-bold`}>
          {initials(conv.recipientName)}
        </div>
        <div>
          <p className="text-sm font-semibold text-[#0F172A] dark:text-white">{conv.recipientName}</p>
          <p className="text-xs text-[#64748B] capitalize">{conv.recipientRole}</p>
        </div>
      </div>

      {/* Subject */}
      <div className="px-4 py-2 bg-[#F8FAFC] dark:bg-[#0A0F1E] border-b border-[#E6EEF5] dark:border-[#1E2D45]">
        <p className="text-xs font-medium text-[#64748B]">Re: {conv.subject}</p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {messages.map(msg => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex gap-2 ${msg.isOwn ? 'flex-row-reverse' : 'flex-row'}`}
          >
            {!msg.isOwn && (
              <div className={`w-7 h-7 rounded-full bg-gradient-to-br ${roleColors[conv.recipientRole] ?? 'from-blue-400 to-indigo-500'} flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0 mt-1`}>
                {initials(msg.senderName)}
              </div>
            )}
            <div className={`max-w-[75%] ${msg.isOwn ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
              <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                msg.isOwn
                  ? 'bg-[#075DE8] text-white rounded-tr-sm'
                  : 'bg-white dark:bg-[#111827] border border-[#E6EEF5] dark:border-[#1E2D45] text-[#334155] dark:text-[#CBD5E1] rounded-tl-sm'
              }`}>
                {msg.content}
              </div>
              <p className="text-[10px] text-[#94A3B8]">
                {new Date(msg.timestamp).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })} ·{' '}
                {new Date(msg.timestamp).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                {msg.isOwn && ' · Sent'}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Input */}
      <div className="px-4 py-3 bg-white dark:bg-[#111827] border-t border-[#E6EEF5] dark:border-[#1E2D45]">
        <div className="flex items-end gap-2">
          <button className="p-2.5 rounded-xl text-[#94A3B8] hover:bg-[#F1F5F9] dark:hover:bg-[#1E2D45] transition-colors">
            <Paperclip size={18} />
          </button>
          <div className="flex-1">
            <textarea
              value={message}
              onChange={e => setMessage(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
              placeholder="Type a message..."
              rows={1}
              className="w-full px-4 py-3 rounded-2xl border border-[#E6EEF5] dark:border-[#1E2D45] bg-[#F8FAFC] dark:bg-[#1E2D45] text-[#0F172A] dark:text-white text-sm placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#075DE8] resize-none"
            />
          </div>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={sendMessage}
            disabled={!message.trim()}
            className="p-2.5 rounded-xl bg-[#075DE8] text-white hover:bg-[#0650CC] transition-colors disabled:opacity-40"
          >
            <Send size={18} />
          </motion.button>
        </div>
      </div>
    </div>
  );
}

export function MessagesPage() {
  const { tenantUser } = useTenantPortal();
  const [selectedConv, setSelectedConv] = useState<Conversation | null>(null);
  const [search, setSearch] = useState('');

  if (!tenantUser) return null;
  const { conversations } = getTenantData(tenantUser.id);

  if (selectedConv) return <ConversationView conv={selectedConv} onBack={() => setSelectedConv(null)} />;

  const filtered = conversations.filter(c =>
    c.recipientName.toLowerCase().includes(search.toLowerCase()) ||
    c.subject.toLowerCase().includes(search.toLowerCase())
  );

  const roleColors: Record<string, string> = {
    manager: 'from-emerald-400 to-teal-500',
    maintenance: 'from-amber-400 to-orange-500',
    accounts: 'from-blue-400 to-indigo-500',
  };

  return (
    <div className="max-w-2xl mx-auto px-4 pt-6 pb-8 lg:max-w-none lg:px-6">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-xl font-bold text-[#0F172A] dark:text-white">Messages</h1>
          <p className="text-sm text-[#64748B]">
            {conversations.reduce((s, c) => s + c.unreadCount, 0)} unread
          </p>
        </div>
        <button className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-[#075DE8] to-[#0EA5E9] text-white text-xs font-semibold shadow-sm">
          + New Message
        </button>
      </div>

      <div className="relative mb-5">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search messages..."
          className="w-full pl-10 pr-4 py-3 rounded-2xl border border-[#E6EEF5] dark:border-[#1E2D45] bg-white dark:bg-[#111827] text-sm text-[#0F172A] dark:text-white placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#075DE8]"
        />
      </div>

      <div className="space-y-2">
        {filtered.map(conv => (
          <motion.button
            key={conv.id}
            whileTap={{ scale: 0.98 }}
            onClick={() => setSelectedConv(conv)}
            className={`w-full flex items-center gap-3 p-4 rounded-2xl border text-left transition-all hover:shadow-md ${
              conv.unreadCount > 0
                ? 'bg-[#EFF6FF] dark:bg-[#1E2D45] border-[#075DE8]/30'
                : 'bg-white dark:bg-[#111827] border-[#E6EEF5] dark:border-[#1E2D45]'
            }`}
          >
            <div className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${roleColors[conv.recipientRole] ?? 'from-blue-400 to-indigo-500'} flex items-center justify-center text-white text-sm font-bold flex-shrink-0`}>
              {conv.recipientName.split(' ').map(n => n[0]).join('').slice(0, 2)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-0.5">
                <p className={`text-sm font-semibold truncate ${conv.unreadCount > 0 ? 'text-[#075DE8]' : 'text-[#0F172A] dark:text-white'}`}>
                  {conv.recipientName}
                </p>
                <p className="text-[10px] text-[#94A3B8] flex-shrink-0 ml-2">
                  {new Date(conv.lastMessageTime).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                </p>
              </div>
              <p className="text-xs text-[#94A3B8] font-medium truncate mb-1">{conv.subject}</p>
              <p className="text-xs text-[#64748B] truncate">{conv.lastMessage}</p>
            </div>
            {conv.unreadCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-[#075DE8] text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0">
                {conv.unreadCount}
              </span>
            )}
          </motion.button>
        ))}
      </div>

      {/* Staff contacts */}
      <div className="mt-6">
        <h3 className="text-sm font-semibold text-[#334155] dark:text-[#CBD5E1] mb-3">Contact Staff</h3>
        <div className="grid grid-cols-2 gap-2">
          {[
            { name: 'Property Manager', role: 'manager', desc: 'Tenancy & property queries', color: 'from-emerald-400 to-teal-500' },
            { name: 'Maintenance Team', role: 'maintenance', desc: 'Repairs & upkeep', color: 'from-amber-400 to-orange-500' },
            { name: 'Accounts', role: 'accounts', desc: 'Billing & payments', color: 'from-blue-400 to-indigo-500' },
            { name: 'Reception', role: 'reception', desc: 'General enquiries', color: 'from-violet-400 to-purple-500' },
          ].map(contact => (
            <button key={contact.name}
              className="flex items-center gap-2.5 p-3 rounded-2xl border border-[#E6EEF5] dark:border-[#1E2D45] bg-white dark:bg-[#111827] text-left hover:shadow-md transition-all"
            >
              <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${contact.color} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
                {contact.name.slice(0, 2)}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-[#334155] dark:text-[#CBD5E1] truncate">{contact.name}</p>
                <p className="text-[10px] text-[#94A3B8] truncate">{contact.desc}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
