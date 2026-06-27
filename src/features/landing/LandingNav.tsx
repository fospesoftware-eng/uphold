import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ArrowRight } from 'lucide-react';

const navLinks = [
  { label: 'Features', href: '/features' },
  { label: 'How it Works', href: '/how-it-works' },
  { label: 'Schedule Demo', href: '/login' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'About', href: '/about' },
];

export function LandingNav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <>
      <motion.nav
        initial={{ y: -72, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-[#060B18]/92 backdrop-blur-xl border-b border-white/10 shadow-[0_4px_32px_rgba(0,0,0,0.35)]'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-[88px]">
            <Link to="/" className="flex items-center group flex-shrink-0">
              <img
                src="/uphold-logo-transparent.png"
                alt="Uphold"
                className="h-[96px] w-auto object-contain transition-opacity group-hover:opacity-80"
              />
            </Link>

            {/* Desktop nav */}
            <div className="hidden lg:flex items-center gap-0.5">
              {navLinks.map(link => (
                <NavLink
                  key={link.href}
                  to={link.href}
                  className={({ isActive }) =>
                    `px-3.5 py-2 text-sm rounded-lg font-medium transition-all duration-200 ${
                      isActive
                        ? 'text-white bg-white/10'
                        : 'text-white/65 hover:text-white hover:bg-white/8'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </div>

            {/* Desktop CTAs */}
            <div className="hidden lg:flex items-center gap-2.5">
              <Link
                to="/login"
                className="px-3.5 py-2 text-sm text-white/70 hover:text-white font-medium transition-colors"
              >
                Sign in
              </Link>

              <motion.button
                whileHover={{ scale: 1.02, boxShadow: '0 4px 28px rgba(7,93,232,0.6)' }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/login')}
                className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white rounded-xl bg-uphold-gradient shadow-[0_4px_20px_rgba(7,93,232,0.4)] transition-shadow"
              >
                Get started
                <ArrowRight size={14} />
              </motion.button>
            </div>

            {/* Mobile hamburger */}
            <button
              className="lg:hidden p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-all"
              onClick={() => setMobileOpen(v => !v)}
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="fixed top-[72px] left-0 right-0 z-40 bg-[#060B18]/96 backdrop-blur-xl border-b border-white/10"
          >
            <div className="px-6 py-4 space-y-1">
              {navLinks.map(link => (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="block w-full text-left px-4 py-3 text-sm text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-all font-medium"
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-3 border-t border-white/10 flex flex-col gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className="px-4 py-3 text-sm text-center text-white/80 hover:text-white font-medium rounded-xl hover:bg-white/10 transition-all"
                >
                  Sign in
                </Link>
                <button
                  onClick={() => { setMobileOpen(false); navigate('/login'); }}
                  className="px-4 py-3 text-sm font-semibold text-white rounded-xl bg-uphold-gradient text-center"
                >
                  Get started free
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
