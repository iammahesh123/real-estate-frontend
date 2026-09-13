import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Skeleton } from '../components/common/Skeleton';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="max-w-md w-full p-8 space-y-4">
          <Skeleton className="h-8 w-48 mx-auto" />
          <Skeleton className="h-4 w-64 mx-auto" />
          <Skeleton className="h-32 w-full rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && allowedRoles.length > 0) {
    const hasRole = allowedRoles.some((role) => user.roles?.includes(role));
    if (!hasRole) {
      // If user lacks required role, redirect them to their primary home
      if (user.roles?.includes('ROLE_ADMIN') || user.roles?.includes('ROLE_SUPER_ADMIN')) {
        return <Navigate to="/admin/dashboard" replace />;
      }
      if (user.roles?.includes('ROLE_AGENT')) {
        return <Navigate to="/agent/dashboard" replace />;
      }
      return <Navigate to="/customer/dashboard" replace />;
    }
  }

  return <>{children}</>;
};
