import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

// Auth pages
import LoginPage from '@/pages/auth/LoginPage';
import RegisterPage from '@/pages/auth/RegisterPage';

// Dashboard pages
import AdminDashboard from '@/pages/dashboard/AdminDashboard';
import NormalUserDashboard from '@/pages/dashboard/NormalUserDashboard';
import StoreOwnerDashboard from '@/pages/dashboard/StoreOwnerDashboard';

// Feature pages
import UserManagement from '@/pages/admin/UserManagement';
import StoreManagement from '@/pages/admin/StoreManagement';
import StoreListings from '@/pages/stores/StoreListings';
import StoreDetails from '@/pages/stores/StoreDetails';
import ProfileSettings from '@/pages/profile/ProfileSettings';

// Layout components
import ProtectedRoute from '@/components/layout/ProtectedRoute';
import PublicRoute from '@/components/layout/PublicRoute';

function App() {
  const { isLoading, isAuthenticated, user } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <Routes>
      {/* Public routes (only accessible when not authenticated) */}
      <Route path="/login" element={
        <PublicRoute>
          <LoginPage />
        </PublicRoute>
      } />
      
      <Route path="/register" element={
        <PublicRoute>
          <RegisterPage />
        </PublicRoute>
      } />

      {/* Protected routes (only accessible when authenticated) */}
      <Route path="/dashboard" element={
        <ProtectedRoute>
          {user?.role === UserRole.SYSTEM_ADMIN && <AdminDashboard />}
          {user?.role === UserRole.NORMAL_USER && <NormalUserDashboard />}
          {user?.role === UserRole.STORE_OWNER && <StoreOwnerDashboard />}
        </ProtectedRoute>
      } />

      {/* Admin only routes */}
      <Route path="/admin/users" element={
        <ProtectedRoute requiredRole={UserRole.SYSTEM_ADMIN}>
          <UserManagement />
        </ProtectedRoute>
      } />

      <Route path="/admin/stores" element={
        <ProtectedRoute requiredRole={UserRole.SYSTEM_ADMIN}>
          <StoreManagement />
        </ProtectedRoute>
      } />

      {/* Store listings (accessible to normal users and admins) */}
      <Route path="/stores" element={
        <ProtectedRoute requiredRoles={[UserRole.NORMAL_USER, UserRole.SYSTEM_ADMIN]}>
          <StoreListings />
        </ProtectedRoute>
      } />

      <Route path="/stores/:id" element={
        <ProtectedRoute requiredRoles={[UserRole.NORMAL_USER, UserRole.SYSTEM_ADMIN]}>
          <StoreDetails />
        </ProtectedRoute>
      } />

      {/* Profile settings (all authenticated users) */}
      <Route path="/profile" element={
        <ProtectedRoute>
          <ProfileSettings />
        </ProtectedRoute>
      } />

      {/* Default redirects */}
      <Route path="/" element={
        isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />
      } />

      {/* Catch all route */}
      <Route path="*" element={
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">404 - Page Not Found</h1>
            <p className="text-gray-600">The page you're looking for doesn't exist.</p>
          </div>
        </div>
      } />
    </Routes>
  );
}

export default App;
