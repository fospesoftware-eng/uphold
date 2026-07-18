import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ArrowRight } from 'lucide-react';

const navLinks = [
  { label: 'Features', href: '/features' },
  { label: 'How it Works', href: '/how-it-works' },
  { label: 'Schedule Demo', href: '/login' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'Who we are', href: '/about' },
];

const aboutDropdownItems = [
  {
    title: 'About',
    desc: 'Our mission, story, and why we exist.',
    href: '/about',
    image: '/about.jpg'
  },
  {
    title: 'Leadership',
    desc: 'Meet the team behind Uphold.',
    href: '/about#leadership',
    image: '/leadership.jpg'
  },
  {
    title: 'Vision 2030',
    desc: 'Where we are heading and product roadmap.',
    href: '/about#vision',
    image: '/vision.jpg'
  },
  {
    title: 'Location',
    desc: 'Our hubs and regional supported areas.',
    href: '/about#locations',
    image: '/locations.jpg'
  }
];

export function LandingNav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [mobileAboutOpen, setMobileAboutOpen] = useState(false);
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
          <div className="flex items-center justify-between h-[120px]">
            <Link to="/" className="flex items-center group flex-shrink-0">
              <img
                src="/uphold-logo-transparent.png"
                alt="Uphold"
                className="h-[180px] w-auto object-contain transition-opacity group-hover:opacity-80"
              />
            </Link>

            {/* Desktop nav */}
            <div className="hidden lg:flex items-center gap-0.5">
              {navLinks.filter(l => l.label !== 'Who we are').map(link => (
                <NavLink
                  key={link.href}
                  to={link.href}
                  className={({ isActive }) =>
                    `px-3.5 py-2 text-sm rounded-lg font-medium transition-all duration-200 ${
                      isActive
                        ? 'text-white bg-white/15'
                        : 'text-white/65 hover:text-white hover:bg-white/8'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}

              {/* About with Dropdown */}
              <div
                className="relative py-2"
                onMouseEnter={() => setAboutOpen(true)}
                onMouseLeave={() => setAboutOpen(false)}
              >
                <button
                  className={`px-3.5 py-2 text-sm rounded-lg font-medium transition-all duration-200 flex items-center gap-1 cursor-pointer ${
                    aboutOpen || window.location.pathname.startsWith('/about')
                      ? 'text-white bg-white/15'
                      : 'text-white/65 hover:text-white hover:bg-white/8'
                  }`}
                >
                  Who we are
                  <svg className={`w-3 h-3 transition-transform duration-200 ${aboutOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                <AnimatePresence>
                  {aboutOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 12, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 12, scale: 0.96 }}
                      transition={{ duration: 0.2, ease: 'easeOut' }}
                      className="absolute left-1/2 -translate-x-1/2 top-full mt-1 w-[560px] p-4 bg-[#060B18]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_16px_40px_rgba(0,0,0,0.5)] z-50 grid grid-cols-2 gap-3"
                    >
                      {aboutDropdownItems.map(item => (
                        <Link
                          key={item.title}
                          to={item.href}
                          onClick={() => setAboutOpen(false)}
                          className="relative aspect-[16/10] rounded-xl overflow-hidden group border border-white/5 shadow-md flex flex-col justify-end p-4 transition-all duration-300 hover:border-white/20"
                        >
                          {/* Image background */}
                          <img
                            src={item.image}
                            alt={item.title}
                            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />

                          {/* Dark overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

                          {/* Text content */}
                          <div className="relative z-10 min-w-0">
                            <p className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors flex items-center gap-1">
                              {item.title}
                              <svg className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7-7" />
                              </svg>
                            </p>
                            <p className="text-[10px] text-white/60 line-clamp-2 mt-1 leading-normal group-hover:text-white/80 transition-colors">
                              {item.desc}
                            </p>
                          </div>
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
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
              {navLinks.map(link => {
                if (link.label === 'Who we are') {
                  return (
                    <div key={link.href} className="space-y-1">
                      <button
                        onClick={() => setMobileAboutOpen(!mobileAboutOpen)}
                        className="flex items-center justify-between w-full px-4 py-3 text-sm text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-all font-medium"
                      >
                        <span>Who we are</span>
                        <svg className={`w-4 h-4 transition-transform duration-200 ${mobileAboutOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      <AnimatePresence>
                        {mobileAboutOpen && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="pl-4 space-y-1 overflow-hidden"
                          >
                            {aboutDropdownItems.map(item => (
                              <Link
                                key={item.title}
                                to={item.href}
                                onClick={() => { setMobileOpen(false); setMobileAboutOpen(false); }}
                                className="flex items-center gap-3 px-4 py-2.5 text-xs text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition-all"
                              >
                                <img src={item.image} alt={item.title} className="w-8 h-6 rounded object-cover" />
                                <span>{item.title}</span>
                              </Link>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                }
                return (
                  <Link
                    key={link.href}
                    to={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="block w-full text-left px-4 py-3 text-sm text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-all font-medium"
                  >
                    {link.label}
                  </Link>
                );
              })}
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
