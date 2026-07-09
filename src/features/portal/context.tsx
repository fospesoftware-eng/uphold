import React, { createContext, useContext, useState, useCallback } from 'react';
import type { TenantPortalUser } from './types';
import { PORTAL_USERS, DEMO_CREDENTIALS } from './data';

interface TenantPortalContextType {
  tenantUser: TenantPortalUser | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => { success: boolean; redirect?: string; error?: string };
  logout: () => void;
}

const TenantPortalContext = createContext<TenantPortalContextType | null>(null);

export function TenantPortalProvider({ children }: { children: React.ReactNode }) {
  const [tenantUser, setTenantUser] = useState<TenantPortalUser | null>(() => {
    try {
      const saved = sessionStorage.getItem('portal-user');
      return saved ? JSON.parse(saved) as TenantPortalUser : null;
    } catch { return null; }
  });

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
    <TenantPortalContext.Provider value={{ tenantUser, isAuthenticated: !!tenantUser, login, logout }}>
      {children}
    </TenantPortalContext.Provider>
  );
}

export function useTenantPortal() {
  const ctx = useContext(TenantPortalContext);
  if (!ctx) throw new Error('useTenantPortal must be used within TenantPortalProvider');
  return ctx;
}
