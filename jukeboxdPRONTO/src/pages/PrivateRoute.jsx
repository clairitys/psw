import { Navigate } from 'react-router-dom';

export function PrivateRoute({ children }) {
  const user = localStorage.getItem('authUser');
  return user ? children : <Navigate to="/entre" replace />;
}