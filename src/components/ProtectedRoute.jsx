import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { hasRole, formatRole } from '../auth/roles';

export function ProtectedRoute({ children, allowedRoles }) {
  const token = useSelector(state => state.auth.token);
  const user = useSelector(state => state.auth.user);

  // Not logged in
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // User not authorized for this page
  if (allowedRoles && !hasRole(user?.role, allowedRoles)) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ maxWidth: '500px' }}>
          <h1 style={{ fontSize: '2rem', marginBottom: '16px' }}>Access Denied</h1>
          <p style={{ fontSize: '1rem', color: '#64748b', marginBottom: '24px' }}>
            Your account ({formatRole(user?.role)}) doesn't have permission to access this page.
          </p>
          <a href="/dashboard" style={{ color: '#2563eb', textDecoration: 'none' }}>
            ← Return to Dashboard
          </a>
        </div>
      </div>
    );
  }

  return children;
}
