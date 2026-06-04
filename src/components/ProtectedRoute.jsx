import { useAuth } from '../contexts/AuthContext';
import { Redirect } from 'wouter';

export function ProtectedRoute({ component: Component, ...rest }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Redirect to="/login" />;
  }

  return <Component {...rest} />;
}
