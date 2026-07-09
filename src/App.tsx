import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './lib/auth';
import { AppLayout } from './components/layout/AppLayout';
import { AuthPage } from './features/auth/AuthPage';
import { LandingLayout } from './features/landing/LandingLayout';
import { HomePage } from './features/landing/pages/HomePage';
import { FeaturesPage } from './features/landing/pages/FeaturesPage';
import { PricingPage } from './features/landing/pages/PricingPage';
import { AboutPage } from './features/landing/pages/AboutPage';
import { DashboardPage } from './features/dashboard/DashboardPage';
import { TenantsPage } from './features/tenants/TenantsPage';
import { TenantProfilePage } from './features/tenants/TenantProfilePage';
import { PropertiesPage } from './features/properties/PropertiesPage';
import { SupportPage } from './features/support/SupportPage';
import { FinancialsPage } from './features/financials/FinancialsPage';
import { DocumentsPage } from './features/documents/DocumentsPage';
import { ReportsPage } from './features/reports/ReportsPage';
import { AdministrationPage } from './features/administration/AdministrationPage';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function AppRoutes() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      {/* Public landing pages */}
      <Route element={<LandingLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/features" element={<FeaturesPage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/about" element={<AboutPage />} />
      </Route>

      {/* Auth */}
      <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <AuthPage />} />

      {/* Protected app routes */}
      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="tenants" element={<TenantsPage />} />
        <Route path="tenants/:id" element={<TenantProfilePage />} />
        <Route path="properties" element={<PropertiesPage />} />
        <Route path="support" element={<SupportPage />} />
        <Route path="financials" element={<FinancialsPage />} />
        <Route path="documents" element={<DocumentsPage />} />
        <Route path="reports" element={<ReportsPage />} />
        <Route path="administration" element={<AdministrationPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
