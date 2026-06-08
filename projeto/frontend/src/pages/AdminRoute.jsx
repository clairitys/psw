import { Navigate } from 'react-router-dom';
import { PrivateRoute } from './PrivateRoute.jsx';

export function AdminRoute({ children }) {
  const authUser = localStorage.getItem('authUser');
  let user = null;

  try {
    user = authUser ? JSON.parse(authUser) : null;
  } catch {
    user = null;
  }

  if (!user?.isAdmin) {
    return <Navigate to="/home" replace />;
  }

  return <PrivateRoute>{children}</PrivateRoute>;
}
