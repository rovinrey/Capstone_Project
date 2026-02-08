import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: JSX.Element;
  allowedRole: 'admin' | 'beneficiary';
}

const ProtectedRoute = ({ children, allowedRole }: ProtectedRouteProps) => {
  // 1. Get the stored user data and role
  const userRole = localStorage.getItem('role');
  
  // 2. If no role exists, the user isn't logged in
  if (!userRole) {
    return <Navigate to="/login" replace />;
  }

  // 3. If the user's role doesn't match the required role for this page
  if (userRole !== allowedRole) {
    // Redirect them to their own correct dashboard if they try to snoop
    return <Navigate to={userRole === 'admin' ? '/admin' : '/beneficiary'} replace />;
  }

  // 4. Everything is fine, show the page
  return children;
};

export default ProtectedRoute;