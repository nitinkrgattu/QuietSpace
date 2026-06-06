// ============================================
// ProtectedRoute.jsx
// Route guard — redirects unauthenticated users to login
// ============================================

import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * ProtectedRoute — wraps routes that require authentication
 * Shows a loading spinner while auth state is being determined
 * Redirects to / (login) if not authenticated
 */
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  // Show loading state while Supabase checks session
  if (loading) {
    return (
      <div className="auth-loading">
        <div className="auth-loading__spinner" />
        <p className="auth-loading__text">Loading QuietSpace...</p>
      </div>
    );
  }

  // Redirect to login if not authenticated
  // Save the attempted URL so we can redirect back after login
  if (!isAuthenticated) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
