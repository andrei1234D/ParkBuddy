import { Navigate, Outlet } from 'react-router';
const useAuth = () => {
  if (localStorage.getItem('isLoggedIn') === 'false') return false;
  else return true;
};
const ProtectedRoutes = () => {
  const isAuth = useAuth();
  return isAuth ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoutes;
