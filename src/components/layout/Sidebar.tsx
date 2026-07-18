import { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Users, Building2, HeartHandshake, DollarSign,
  FileText, BarChart3, Settings, ChevronLeft, ChevronRight,
  HelpCircle, LogOut, X, Package, Store, Sparkles
} from 'lucide-react';
import { useAuth, useCanAccess } from '../../lib/auth';
import { Avatar } from '../ui';

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  href: string;
  badge?: number;
}

const navItems: NavItem[] = [
  { id: 'dashboard',      label: 'Dashboard',       icon: <LayoutDashboard size={18} />, href: '/dashboard' },
  { id: 'insights',       label: 'AI Insights',      icon: <Sparkles size={18} />,        href: '/insights' },
  { id: 'tenants',        label: 'Tenants',          icon: <Users size={18} />,           href: '/tenants' },
  { id: 'properties',     label: 'Properties',       icon: <Building2 size={18} />,       href: '/properties' },
  { id: 'marketplace',    label: 'Marketplace',      icon: <Store size={18} />,           href: '/marketplace/admin' },
  { id: 'assets',         label: 'Asset Inventory',  icon: <Package size={18} />,         href: '/assets' },
  { id: 'support',        label: 'Support',          icon: <HeartHandshake size={18} />,  href: '/support' },
  { id: 'financials',     label: 'Financials',       icon: <DollarSign size={18} />,      href: '/financials' },
  { id: 'documents',      label: 'Documents',        icon: <FileText size={18} />,        href: '/documents' },
  { id: 'reports',        label: 'Reports',          icon: <BarChart3 size={18} />,       href: '/reports' },
  { id: 'administration', label: 'Administration',   icon: <Settings size={18} />,        href: '/administration' },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
}

export function Sidebar({ collapsed, onToggle, mobileOpen, onMobileClose }: SidebarProps) {
  const { user, effectiveRole, logout } = useAuth();
  const location = useLocation();

  const roleLabels: Record<string, string> = {
    super_admin: 'Super Admin',
    admin: 'Administrator',
    support_staff: 'Support Staff',
    board: 'Board',
  };

  const accessibleItems = navItems.filter(item => {
    const access: Record<string, string[]> = {
      dashboard:      ['super_admin', 'admin', 'board'],
      insights:       ['super_admin', 'admin', 'board'],
      tenants:        ['super_admin', 'admin', 'support_staff'],
      properties:     ['super_admin', 'admin'],
      marketplace:    ['super_admin', 'admin'],
      assets:         ['super_admin', 'admin', 'support_staff'],
      support:        ['super_admin', 'admin', 'support_staff'],
      financials:     ['super_admin', 'admin'],
      documents:      ['super_admin', 'admin', 'support_staff'],
      reports:        ['super_admin', 'admin', 'board'],
      administration: ['super_admin'],
    };
    return (access[item.id] ?? []).includes(effectiveRole);
  });

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className={`flex items-center gap-3 px-4 py-5 border-b border-[#E6EEF5] dark:border-[#1E2D45] ${collapsed ? 'justify-center' : ''}`}>
        {collapsed ? (
          <div className="w-9 h-9 flex-shrink-0">
            <img src="/uphold-icon.png" alt="Uphold" className="w-full h-full object-contain" />
          </div>
        ) : (
          <img src="/uphold-logo-transparent.png" alt="Uphold" className="h-[108px] w-auto object-contain" />
        )}
        <button
          onClick={onToggle}
          className="ml-auto hidden lg:flex p-1 rounded-lg hover:bg-[#F1F5F9] dark:hover:bg-[#1E2D45] text-[#64748B] transition-colors"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
        <button onClick={onMobileClose} className="lg:hidden p-1 rounded-lg hover:bg-[#F1F5F9] text-[#64748B]">
          <X size={16} />
        </button>
      </div>

      {/* Org & Role */}
      {!collapsed && (
        <div className="px-4 py-3 border-b border-[#E6EEF5] dark:border-[#1E2D45]">
          <p className="text-xs font-medium text-[#0F172A] dark:text-[#F8FAFC] truncate">Granville Community Homes</p>
          <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-uphold-gradient-subtle text-[#075DE8]">
            {roleLabels[effectiveRole] ?? effectiveRole}
          </span>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 py-4 px-2 space-y-0.5 overflow-y-auto" aria-label="Main navigation">
        {accessibleItems.map(item => (
          <NavLink
            key={item.id}
            to={item.href}
            className={({ isActive }) =>
              `relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group ${
                isActive
                  ? 'bg-uphold-gradient-subtle text-[#075DE8] sidebar-item-active'
                  : 'text-[#64748B] hover:bg-[#F8FAFC] dark:hover:bg-[#1E2D45] hover:text-[#334155] dark:hover:text-[#CBD5E1]'
              } ${collapsed ? 'justify-center' : ''}`
            }
            onClick={onMobileClose}
            title={collapsed ? item.label : undefined}
          >
            {({ isActive }) => (
              <>
                <span className={`flex-shrink-0 ${isActive ? 'text-[#075DE8]' : ''}`}>{item.icon}</span>
                <AnimatePresence>
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.15 }}
                      className="truncate"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
                {item.badge && !collapsed && (
                  <span className="ml-auto px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-rose-100 text-rose-600">
                    {item.badge}
                  </span>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Bottom */}
      <div className={`border-t border-[#E6EEF5] dark:border-[#1E2D45] p-3 space-y-1 ${collapsed ? 'items-center flex flex-col' : ''}`}>
        <button className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-[#64748B] hover:bg-[#F8FAFC] dark:hover:bg-[#1E2D45] transition-colors ${collapsed ? 'justify-center' : ''}`}>
          <HelpCircle size={18} />
          {!collapsed && <span>Help & Support</span>}
        </button>
        {user && (
          <div className={`flex items-center gap-3 px-3 py-2 rounded-xl ${collapsed ? 'flex-col' : ''}`}>
            <Avatar name={user.name} size="sm" />
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-[#0F172A] dark:text-[#F8FAFC] truncate">{user.name}</p>
                <p className="text-[10px] text-[#64748B] truncate">{user.email}</p>
              </div>
            )}
            <button onClick={logout} className="p-1.5 rounded-lg hover:bg-[#F1F5F9] dark:hover:bg-[#253557] text-[#64748B] hover:text-rose-500 transition-colors" title="Sign out">
              <LogOut size={15} />
            </button>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <motion.aside
        animate={{ width: collapsed ? 64 : 260 }}
        transition={{ duration: 0.25, ease: 'easeInOut' }}
        className="hidden lg:flex flex-col h-screen bg-white dark:bg-[#111827] border-r border-[#E6EEF5] dark:border-[#1E2D45] flex-shrink-0 overflow-hidden"
        aria-label="Sidebar"
      >
        <SidebarContent />
      </motion.aside>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="lg:hidden fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
              onClick={onMobileClose}
            />
            <motion.aside
              initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="lg:hidden fixed inset-y-0 left-0 z-50 w-72 bg-white dark:bg-[#111827] border-r border-[#E6EEF5] dark:border-[#1E2D45]"
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
