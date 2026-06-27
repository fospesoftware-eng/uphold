import { Link } from 'react-router-dom';
import { Globe, Lock, ShieldCheck } from 'lucide-react';

const footerLinks = {
  Product: [
    { label: 'Features', to: '/features' },
    { label: 'Pricing', to: '/pricing' },
    { label: 'About', to: '/about' },
  ],
  Company: [
    { label: 'About us', to: '/about' },
    { label: 'Careers', to: '/about' },
    { label: 'Contact', to: '/about' },
  ],
  Legal: [
    { label: 'Privacy Policy', to: '/about' },
    { label: 'Terms of Service', to: '/about' },
    { label: 'GDPR Statement', to: '/about' },
  ],
};

export function LandingFooter() {
  return (
    <footer className="bg-[#030609] border-t border-white/10 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 mb-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="inline-flex mb-5 hover:opacity-80 transition-opacity">
              <img
                src="/uphold-logo-transparent.png"
                alt="Uphold"
                className="w-[200px] h-[200px] object-contain"
              />
            </Link>
            <p className="text-sm text-white/50 leading-relaxed mb-6 max-w-xs">
              The UK's most trusted CRM for supported housing — built for care teams who need clarity, not complexity.
            </p>
            <div className="flex items-center gap-3 flex-wrap">
              {[
                { icon: <ShieldCheck size={12} className="text-[#32E6A4]" />, label: 'ISO 27001' },
                { icon: <Lock size={12} className="text-[#15C6B8]" />, label: 'GDPR Ready' },
                { icon: <Globe size={12} className="text-[#0797D8]" />, label: 'UK Data' },
              ].map(b => (
                <div key={b.label} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10">
                  {b.icon}
                  <span className="text-xs text-white/60">{b.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-sm font-semibold text-white mb-4">{title}</h4>
              <ul className="space-y-3">
                {links.map(link => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="text-sm text-white/50 hover:text-white/80 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/40">
            © 2026 Uphold Technologies Ltd. All rights reserved. Registered in England & Wales.
          </p>
          <p className="text-xs text-white/30">
            Built with care for supported housing teams across the UK.
          </p>
        </div>
      </div>
    </footer>
  );
}
