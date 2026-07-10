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
import { PropertyDetailPage } from './features/properties/PropertyDetailPage';
import { SupportPage } from './features/support/SupportPage';
import { FinancialsPage } from './features/financials/FinancialsPage';
import { DocumentsPage } from './features/documents/DocumentsPage';
import { ReportsPage } from './features/reports/ReportsPage';
import { AdministrationPage } from './features/administration/AdministrationPage';
import { AssetsPage } from './features/assets/AssetsPage';
import { AssetDetailPage } from './features/assets/AssetDetailPage';
// Marketplace
import { MarketplaceLayout } from './features/marketplace/MarketplaceLayout';
import { MarketplaceHome } from './features/marketplace/pages/MarketplaceHome';
import { SearchResults } from './features/marketplace/pages/SearchResults';
import { ListingDetail } from './features/marketplace/pages/ListingDetail';
import { MarketplaceAdminPage } from './features/marketplace/admin/MarketplaceAdminPage';
// Tenant Portal
import { TenantPortalProvider } from './features/portal/context';
import { PortalLayout } from './features/portal/PortalLayout';
import { PortalLoginPage } from './features/portal/PortalLoginPage';
import { PortalDashboard } from './features/portal/pages/DashboardPage';
import { PropertyPage } from './features/portal/pages/PropertyPage';
import { AssetsPage as PortalAssetsPage } from './features/portal/pages/AssetsPage';
import { QRScannerPage } from './features/portal/pages/QRScannerPage';
import { MaintenancePage } from './features/portal/pages/MaintenancePage';
import { PaymentsPage } from './features/portal/pages/PaymentsPage';
import { DocumentsPage as PortalDocumentsPage } from './features/portal/pages/DocumentsPage';
import { NoticesPage } from './features/portal/pages/NoticesPage';
import { CommunityPage } from './features/portal/pages/CommunityPage';
import { VisitorsPage } from './features/portal/pages/VisitorsPage';
import { ParcelsPage } from './features/portal/pages/ParcelsPage';
import { UtilitiesPage } from './features/portal/pages/UtilitiesPage';
import { MessagesPage } from './features/portal/pages/MessagesPage';
import { SupportPage as PortalSupportPage } from './features/portal/pages/SupportPage';
import { ProfilePage } from './features/portal/pages/ProfilePage';

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

      {/* Public Marketplace (no auth) */}
      <Route path="/marketplace" element={<MarketplaceLayout />}>
        <Route index element={<MarketplaceHome />} />
        <Route path="search" element={<SearchResults />} />
        <Route path="property/:id" element={<ListingDetail />} />
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
        <Route path="properties/:id" element={<PropertyDetailPage />} />
        <Route path="support" element={<SupportPage />} />
        <Route path="financials" element={<FinancialsPage />} />
        <Route path="documents" element={<DocumentsPage />} />
        <Route path="reports" element={<ReportsPage />} />
        <Route path="assets" element={<AssetsPage />} />
        <Route path="assets/:id" element={<AssetDetailPage />} />
        <Route path="marketplace/admin" element={<MarketplaceAdminPage />} />
        <Route path="administration" element={<AdministrationPage />} />
      </Route>

      {/* Tenant Portal */}
      <Route path="/portal/login" element={<PortalLoginPage />} />
      <Route path="/portal" element={<PortalLayout />}>
        <Route index element={<Navigate to="/portal/dashboard" replace />} />
        <Route path="dashboard"   element={<PortalDashboard />} />
        <Route path="property"    element={<PropertyPage />} />
        <Route path="assets"      element={<PortalAssetsPage />} />
        <Route path="qr-scanner"  element={<QRScannerPage />} />
        <Route path="maintenance" element={<MaintenancePage />} />
        <Route path="payments"    element={<PaymentsPage />} />
        <Route path="documents"   element={<PortalDocumentsPage />} />
        <Route path="notices"     element={<NoticesPage />} />
        <Route path="community"   element={<CommunityPage />} />
        <Route path="visitors"    element={<VisitorsPage />} />
        <Route path="parcels"     element={<ParcelsPage />} />
        <Route path="utilities"   element={<UtilitiesPage />} />
        <Route path="messages"    element={<MessagesPage />} />
        <Route path="support"     element={<PortalSupportPage />} />
        <Route path="profile"     element={<ProfilePage />} />
        <Route path="notifications" element={<NoticesPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <TenantPortalProvider>
          <AppRoutes />
        </TenantPortalProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
