import { Outlet, Link, useLocation, NavLink } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Home, Search, Heart, Menu, X, Gem, Building, GraduationCap, Briefcase } from 'lucide-react';

const NAV_CATEGORIES = [
  { label: 'Luxury', to: '/marketplace/search?tier=luxury', icon: Gem },
  { label: 'Commercial', to: '/marketplace/search?tier=commercial', icon: Briefcase },
  { label: 'Student', to: '/marketplace/search?tier=student', icon: GraduationCap },
  { label: 'Affordable', to: '/marketplace/search?tier=affordable', icon: Building },
];

export function MarketplaceLayout() {
  const location = useLocation();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    setOpen(false);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-[#F7F9FC] dark:bg-[#0A0F1C] text-[#0F172A] dark:text-white antialiased">
      {/* Nav */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-white/80 dark:bg-[#0A0F1C]/80 border-b border-[#E6EEF5] dark:border-white/10">
        <div className="max-w-[1200px] mx-auto px-5 h-16 flex items-center justify-between gap-4">
          <Link to="/marketplace" className="flex items-center">
            <img src="/granville-logo.svg" alt="Granville Community Homes" className="h-11 w-auto object-contain" />
          </Link>

          <nav className="hidden md:flex items-center gap-0.5">
            <NavLink to="/marketplace" end
              className={({ isActive }) => `px-3.5 py-2 rounded-full text-sm font-medium transition-colors ${isActive ? 'bg-[#075DE8]/10 text-[#075DE8]' : 'text-[#475569] dark:text-[#CBD5E1] hover:bg-[#F1F5F9] dark:hover:bg-white/5'}`}>
              Home
            </NavLink>
            <NavLink to="/marketplace/search" end
              className={({ isActive }) => `px-3.5 py-2 rounded-full text-sm font-medium transition-colors ${isActive ? 'bg-[#075DE8]/10 text-[#075DE8]' : 'text-[#475569] dark:text-[#CBD5E1] hover:bg-[#F1F5F9] dark:hover:bg-white/5'}`}>
              Search
            </NavLink>
            {NAV_CATEGORIES.map((c) => (
              <Link key={c.label} to={c.to}
                className="px-3.5 py-2 rounded-full text-sm font-medium text-[#475569] dark:text-[#CBD5E1] hover:bg-[#F1F5F9] dark:hover:bg-white/5 transition-colors">
                {c.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Link
              to="/portal/login"
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium text-[#475569] dark:text-[#CBD5E1] hover:bg-[#F1F5F9] dark:hover:bg-white/5 transition-colors"
            >
              <Heart size={15} /> Sign In
            </Link>
            <Link
              to="/marketplace/search"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold bg-[#075DE8] hover:bg-[#0650CC] text-white shadow-lg shadow-blue-500/25 transition-colors"
            >
              <Search size={15} /> Find a Home
            </Link>
            <button
              className="md:hidden w-9 h-9 rounded-full flex items-center justify-center hover:bg-[#F1F5F9] dark:hover:bg-white/5"
              onClick={() => setOpen((o) => !o)}
              aria-label="Menu"
            >
              {open ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {open && (
          <div className="md:hidden px-5 pb-4 flex flex-col gap-1 border-t border-[#E6EEF5] dark:border-white/10">
            <Link to="/marketplace" className="px-3 py-2 rounded-lg text-sm font-medium hover:bg-[#F1F5F9] dark:hover:bg-white/5 flex items-center gap-2"><Home size={15} /> Home</Link>
            <Link to="/marketplace/search" className="px-3 py-2 rounded-lg text-sm font-medium hover:bg-[#F1F5F9] dark:hover:bg-white/5 flex items-center gap-2"><Search size={15} /> Search Homes</Link>
            {NAV_CATEGORIES.map((c) => (
              <Link key={c.label} to={c.to} className="px-3 py-2 rounded-lg text-sm font-medium hover:bg-[#F1F5F9] dark:hover:bg-white/5 flex items-center gap-2"><c.icon size={15} /> {c.label}</Link>
            ))}
            <Link to="/portal/login" className="px-3 py-2 rounded-lg text-sm font-medium hover:bg-[#F1F5F9] dark:hover:bg-white/5 flex items-center gap-2"><Heart size={15} /> Sign In</Link>
          </div>
        )}
      </header>

      <main>
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="mt-24 border-t border-[#E6EEF5] dark:border-white/10 bg-white dark:bg-[#0A0F1C]">
        <div className="max-w-[1200px] mx-auto px-5 py-14 grid grid-cols-2 md:grid-cols-5 gap-8">
          <div className="col-span-2">
            <img src="/granville-logo.svg" alt="Granville Community Homes" className="h-12 w-auto object-contain" />
            <p className="mt-3 text-sm text-[#64748B] dark:text-[#94A3B8] max-w-xs">
              Premium, verified homes across the UK — published live from our property management system so what you see is always available.
            </p>
          </div>
          {[
            { h: 'Explore', links: ['Search Homes', 'Luxury', 'Affordable', 'Commercial'] },
            { h: 'Company', links: ['About', 'Careers', 'Press', 'Contact'] },
            { h: 'Support', links: ['Help Centre', 'Book a Viewing', 'FAQs', 'Privacy'] },
          ].map((col) => (
            <div key={col.h}>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#94A3B8] mb-3">{col.h}</h4>
              <ul className="space-y-2">
                {col.links.map((l) => (
                  <li key={l}>
                    <Link to="/marketplace/search" className="text-sm text-[#475569] dark:text-[#CBD5E1] hover:text-[#075DE8] transition-colors">{l}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-[#E6EEF5] dark:border-white/10">
          <div className="max-w-[1200px] mx-auto px-5 py-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-[#94A3B8]">
            <p>© {new Date().getFullYear()} Granville Community Homes. All rights reserved.</p>
            <p>Listings driven live from the Granville PMS · No duplicate data</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
