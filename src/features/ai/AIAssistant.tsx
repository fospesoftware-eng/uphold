import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, Send, Loader2 } from 'lucide-react';
import { aiService, aiSuggestedPrompts } from '../../services/ai';
import type { AIMessage } from '../../services/ai';

export function AIAssistant() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<AIMessage[]>([
    {
      role: 'assistant',
      content: "Hi, I'm Uphold AI. Ask me about tenant risk, compliance, arrears, occupancy or support hours — I'll answer from your live data.",
      suggestions: aiSuggestedPrompts,
    },
  ]);
  const [input, setInput] = useState('');
  const [thinking, setThinking] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, thinking]);

  const send = async (text: string) => {
    const query = text.trim();
    if (!query || thinking) return;
    setMessages(m => [...m, { role: 'user', content: query }]);
    setInput('');
    setThinking(true);
    const reply = await aiService.ask(query);
    setMessages(m => [...m, reply]);
    setThinking(false);
  };

  return (
    <>
      {/* Floating launcher */}
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.4, type: 'spring', stiffness: 260, damping: 20 }}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
        onClick={() => setOpen(v => !v)}
        aria-label="Open Uphold AI assistant"
        className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-uphold-gradient text-white shadow-[0_8px_28px_rgba(7,93,232,.45)] flex items-center justify-center"
      >
        <AnimatePresence mode="wait">
          {open ? (
            <motion.span key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
              <X size={22} />
            </motion.span>
          ) : (
            <motion.span key="s" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
              <Sparkles size={22} />
            </motion.span>
          )}
        </AnimatePresence>
        {!open && <span className="absolute inset-0 rounded-full bg-[#15C6B8]/50 animate-ping" style={{ animationDuration: '2.4s' }} />}
      </motion.button>

      {/* Chat panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="fixed bottom-24 right-6 z-40 w-[calc(100vw-3rem)] sm:w-[400px] h-[560px] max-h-[calc(100vh-8rem)] bg-white dark:bg-[#111827] rounded-2xl border border-[#E6EEF5] dark:border-[#1E2D45] shadow-[0_24px_60px_rgba(15,23,42,.25)] flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center gap-3 p-4 bg-[linear-gradient(135deg,#06122A_0%,#0A2A4D_50%,#06302F_100%)] text-white">
              <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center">
                <Sparkles size={18} className="text-[#32E6A4]" />
              </div>
              <div>
                <p className="font-semibold font-display text-sm">Uphold AI</p>
                <p className="text-[11px] text-white/60 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#32E6A4] animate-pulse" /> Grounded in your live data
                </p>
              </div>
              <button onClick={() => setOpen(false)} className="ml-auto p-1.5 rounded-lg hover:bg-white/10 transition-colors">
                <X size={18} />
              </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] ${m.role === 'user' ? '' : 'w-full'}`}>
                    <div className={`rounded-2xl px-3.5 py-2.5 text-sm whitespace-pre-line leading-relaxed ${
                      m.role === 'user'
                        ? 'bg-uphold-gradient text-white rounded-br-sm'
                        : 'bg-[#F1F5F9] dark:bg-[#1E2D45] text-[#334155] dark:text-[#CBD5E1] rounded-bl-sm'
                    }`}>
                      {m.content}
                    </div>
                    {m.suggestions && (
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {m.suggestions.map(s => (
                          <button
                            key={s}
                            onClick={() => send(s)}
                            className="text-xs px-2.5 py-1 rounded-full border border-[#E6EEF5] dark:border-[#1E2D45] text-[#075DE8] hover:bg-uphold-gradient-subtle transition-colors"
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {thinking && (
                <div className="flex justify-start">
                  <div className="rounded-2xl rounded-bl-sm bg-[#F1F5F9] dark:bg-[#1E2D45] px-3.5 py-2.5 flex items-center gap-2 text-xs text-[#64748B]">
                    <Loader2 size={14} className="animate-spin" /> Analysing your data…
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <form
              onSubmit={e => { e.preventDefault(); send(input); }}
              className="p-3 border-t border-[#E6EEF5] dark:border-[#1E2D45] flex items-center gap-2"
            >
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Ask about tenants, risk, compliance…"
                className="flex-1 rounded-xl border border-[#E6EEF5] dark:border-[#1E2D45] bg-white dark:bg-[#0A0F1E] text-sm px-3.5 py-2.5 text-[#0F172A] dark:text-[#F8FAFC] placeholder:text-[#64748B] focus:outline-none focus:ring-2 focus:ring-[#15C6B8]"
              />
              <button
                type="submit"
                disabled={!input.trim() || thinking}
                className="w-10 h-10 flex-shrink-0 rounded-xl bg-uphold-gradient text-white flex items-center justify-center disabled:opacity-40 transition-opacity"
              >
                <Send size={16} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
