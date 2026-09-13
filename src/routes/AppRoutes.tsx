import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Public Pages
import { HomePage } from '../pages/public/HomePage';
import { PropertiesPage } from '../pages/public/PropertiesPage';
import { PropertyDetailPage } from '../pages/public/PropertyDetailPage';
import { ComparePage } from '../pages/public/ComparePage';
import { AgentsPage } from '../pages/public/AgentsPage';
import { AgentDetailPage } from '../pages/public/AgentDetailPage';
import { ProjectsPage } from '../pages/public/ProjectsPage';
import { ProjectDetailPage } from '../pages/public/ProjectDetailPage';
import { AboutPage } from '../pages/public/AboutPage';
import { ServicesPage } from '../pages/public/ServicesPage';
import { ContactPage } from '../pages/public/ContactPage';
import { LoginPage } from '../pages/auth/LoginPage';
import { RegisterPage } from '../pages/auth/RegisterPage';

// Customer Pages
import { CustomerDashboardPage } from '../pages/customer/CustomerDashboardPage';
import { CustomerFavouritesPage } from '../pages/customer/CustomerFavouritesPage';
import { CustomerEnquiriesPage } from '../pages/customer/CustomerEnquiriesPage';
import { CustomerVisitsPage } from '../pages/customer/CustomerVisitsPage';
import { CustomerProfilePage } from '../pages/customer/CustomerProfilePage';

// Agent Pages
import { AgentDashboardPage } from '../pages/agent/AgentDashboardPage';
import { AgentPropertiesPage } from '../pages/agent/AgentPropertiesPage';
import { AgentCreatePropertyPage } from '../pages/agent/AgentCreatePropertyPage';
import { AgentLeadsPage } from '../pages/agent/AgentLeadsPage';
import { AgentVisitsPage } from '../pages/agent/AgentVisitsPage';

// Admin Pages
import { AdminDashboardPage } from '../pages/admin/AdminDashboardPage';
import { AdminPropertiesPage } from '../pages/admin/AdminPropertiesPage';
import { AdminPendingPropertiesPage } from '../pages/admin/AdminPendingPropertiesPage';
import { AdminUsersPage } from '../pages/admin/AdminUsersPage';
import { AdminLeadsPage } from '../pages/admin/AdminLeadsPage';
import { AdminMasterDataPage } from '../pages/admin/AdminMasterDataPage';

// Route Guard
import { ProtectedRoute } from './ProtectedRoute';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';

export const AppRoutes: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans antialiased">
      <Navbar />
      <main className="flex-1">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/properties" element={<PropertiesPage />} />
          <Route path="/properties/:slug" element={<PropertyDetailPage />} />
          <Route path="/buy" element={<Navigate to="/properties?listingType=SALE" replace />} />
          <Route path="/rent" element={<Navigate to="/properties?listingType=RENT" replace />} />
          <Route path="/commercial" element={<Navigate to="/properties?propertyType=COMMERCIAL" replace />} />
          <Route path="/compare" element={<ComparePage />} />
          <Route path="/agents" element={<AgentsPage />} />
          <Route path="/agents/:id" element={<AgentDetailPage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/projects/:slug" element={<ProjectDetailPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Customer Portal */}
          <Route
            path="/customer/dashboard"
            element={
              <ProtectedRoute allowedRoles={['ROLE_CUSTOMER', 'ROLE_AGENT', 'ROLE_ADMIN', 'ROLE_SUPER_ADMIN']}>
                <CustomerDashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/customer/favourites"
            element={
              <ProtectedRoute allowedRoles={['ROLE_CUSTOMER', 'ROLE_AGENT', 'ROLE_ADMIN', 'ROLE_SUPER_ADMIN']}>
                <CustomerFavouritesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/customer/enquiries"
            element={
              <ProtectedRoute allowedRoles={['ROLE_CUSTOMER', 'ROLE_AGENT', 'ROLE_ADMIN', 'ROLE_SUPER_ADMIN']}>
                <CustomerEnquiriesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/customer/visits"
            element={
              <ProtectedRoute allowedRoles={['ROLE_CUSTOMER', 'ROLE_AGENT', 'ROLE_ADMIN', 'ROLE_SUPER_ADMIN']}>
                <CustomerVisitsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/customer/profile"
            element={
              <ProtectedRoute allowedRoles={['ROLE_CUSTOMER', 'ROLE_AGENT', 'ROLE_ADMIN', 'ROLE_SUPER_ADMIN']}>
                <CustomerProfilePage />
              </ProtectedRoute>
            }
          />

          {/* Agent Portal */}
          <Route
            path="/agent/dashboard"
            element={
              <ProtectedRoute allowedRoles={['ROLE_AGENT', 'ROLE_ADMIN', 'ROLE_SUPER_ADMIN']}>
                <AgentDashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/agent/properties"
            element={
              <ProtectedRoute allowedRoles={['ROLE_AGENT', 'ROLE_ADMIN', 'ROLE_SUPER_ADMIN']}>
                <AgentPropertiesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/agent/properties/create"
            element={
              <ProtectedRoute allowedRoles={['ROLE_AGENT', 'ROLE_ADMIN', 'ROLE_SUPER_ADMIN']}>
                <AgentCreatePropertyPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/agent/leads"
            element={
              <ProtectedRoute allowedRoles={['ROLE_AGENT', 'ROLE_ADMIN', 'ROLE_SUPER_ADMIN']}>
                <AgentLeadsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/agent/visits"
            element={
              <ProtectedRoute allowedRoles={['ROLE_AGENT', 'ROLE_ADMIN', 'ROLE_SUPER_ADMIN']}>
                <AgentVisitsPage />
              </ProtectedRoute>
            }
          />

          {/* Admin Portal */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={['ROLE_ADMIN', 'ROLE_SUPER_ADMIN']}>
                <AdminDashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/properties"
            element={
              <ProtectedRoute allowedRoles={['ROLE_ADMIN', 'ROLE_SUPER_ADMIN']}>
                <AdminPropertiesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/properties/pending"
            element={
              <ProtectedRoute allowedRoles={['ROLE_ADMIN', 'ROLE_SUPER_ADMIN']}>
                <AdminPendingPropertiesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute allowedRoles={['ROLE_ADMIN', 'ROLE_SUPER_ADMIN']}>
                <AdminUsersPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/leads"
            element={
              <ProtectedRoute allowedRoles={['ROLE_ADMIN', 'ROLE_SUPER_ADMIN']}>
                <AdminLeadsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/master-data"
            element={
              <ProtectedRoute allowedRoles={['ROLE_ADMIN', 'ROLE_SUPER_ADMIN']}>
                <AdminMasterDataPage />
              </ProtectedRoute>
            }
          />

          {/* Catch-all fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};
