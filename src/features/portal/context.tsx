import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { TenantPortalUser } from './types';
import { PORTAL_USERS, DEMO_CREDENTIALS } from './data';

export type PortalTheme = 'dark' | 'light';

interface TenantPortalContextType {
  tenantUser: TenantPortalUser | null;
  isAuthenticated: boolean;
  theme: PortalTheme;
  toggleTheme: () => void;
  login: (email: string, password: string) => { success: boolean; redirect?: string; error?: string };
  logout: () => void;
}

const TenantPortalContext = createContext<TenantPortalContextType | null>(null);

function getInitialTheme(): PortalTheme {
  try {
    const saved = localStorage.getItem('portal-theme') as PortalTheme | null;
    if (saved === 'dark' || saved === 'light') return saved;
  } catch { /* ignore */ }
  if (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: light)').matches) {
    return 'light';
  }
  return 'dark';
}

export function TenantPortalProvider({ children }: { children: React.ReactNode }) {
  const [tenantUser, setTenantUser] = useState<TenantPortalUser | null>(() => {
    try {
      const saved = sessionStorage.getItem('portal-user');
      return saved ? JSON.parse(saved) as TenantPortalUser : null;
    } catch { return null; }
  });

  const [theme, setTheme] = useState<PortalTheme>(getInitialTheme);

  useEffect(() => {
    try { localStorage.setItem('portal-theme', theme); } catch { /* ignore */ }
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme(t => (t === 'dark' ? 'light' : 'dark'));
  }, []);

  const login = useCallback((email: string, password: string) => {
    const creds = DEMO_CREDENTIALS[email.toLowerCase()];
    if (!creds || creds.password !== password) {
      return { success: false, error: 'Invalid email or password' };
    }
    const user = PORTAL_USERS.find(u => u.id === creds.userId);
    if (!user) return { success: false, error: 'User not found' };

    if (user.role === 'manager' || user.role === 'admin') {
      return { success: true, redirect: '/dashboard' };
    }

    sessionStorage.setItem('portal-user', JSON.stringify(user));
    setTenantUser(user);
    return { success: true };
  }, []);

  const logout = useCallback(() => {
    sessionStorage.removeItem('portal-user');
    setTenantUser(null);
  }, []);

  return (
    <TenantPortalContext.Provider value={{ tenantUser, isAuthenticated: !!tenantUser, theme, toggleTheme, login, logout }}>
      {children}
    </TenantPortalContext.Provider>
  );
}

export function useTenantPortal() {
  const ctx = useContext(TenantPortalContext);
  if (!ctx) throw new Error('useTenantPortal must be used within TenantPortalProvider');
  return ctx;
}
