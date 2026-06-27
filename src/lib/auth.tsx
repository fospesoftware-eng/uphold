import React, { createContext, useContext, useState, useCallback } from 'react';
import type { User, UserRole } from '../types';
import { users } from '../data/mockData';

interface AuthContextType {
  user: User | null;
  viewAsRole: UserRole | null;
  effectiveRole: UserRole;
  isAuthenticated: boolean;
  login: (user: User) => void;
  logout: () => void;
  setViewAsRole: (role: UserRole | null) => void;
  orgId: string;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const saved = sessionStorage.getItem('uphold-user');
      return saved ? JSON.parse(saved) as User : null;
    } catch { return null; }
  });
  const [viewAsRole, setViewAsRole] = useState<UserRole | null>(null);

  const login = useCallback((u: User) => {
    sessionStorage.setItem('uphold-user', JSON.stringify(u));
    setUser(u);
  }, []);
  const logout = useCallback(() => {
    sessionStorage.removeItem('uphold-user');
    setUser(null);
    setViewAsRole(null);
  }, []);

  const effectiveRole: UserRole = viewAsRole ?? user?.role ?? 'support_staff';

  return (
    <AuthContext.Provider value={{
      user,
      viewAsRole,
      effectiveRole,
      isAuthenticated: !!user,
      login,
      logout,
      setViewAsRole,
      orgId: user?.organisationId ?? 'org-1',
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

export function useCanAccess(feature: string): boolean {
  const { effectiveRole } = useAuth();
  const access: Record<string, UserRole[]> = {
    dashboard: ['super_admin', 'admin', 'board'],
    tenants: ['super_admin', 'admin', 'support_staff'],
    properties: ['super_admin', 'admin'],
    support: ['super_admin', 'admin', 'support_staff'],
    financials: ['super_admin', 'admin'],
    documents: ['super_admin', 'admin', 'support_staff'],
    reports: ['super_admin', 'admin', 'board'],
    administration: ['super_admin'],
    edit: ['super_admin', 'admin', 'support_staff'],
  };
  return (access[feature] ?? []).includes(effectiveRole);
}

export { users };
