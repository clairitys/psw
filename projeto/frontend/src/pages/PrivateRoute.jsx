import { Navigate } from 'react-router-dom';

export function PrivateRoute({ children }) {
  const authUser = localStorage.getItem('authUser');
  const token = localStorage.getItem('token');

  if (!authUser || !token) {
    return <Navigate to="/entre" replace />;
  }

  return children;
}
