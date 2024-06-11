import { useContext } from 'react';
import GlobalStatesContext from './context/GlobalStatesContext';
import { Navigate, Outlet } from 'react-router';

const ProtectedRoutes = () => {
  const { isLoggedIn, role } = useContext(GlobalStatesContext);

  // Check if the user is logged in
  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }

  // Check if the user is trying to access partner-specific routes without being a partner
  const partnerRoutes = [
    '/Account-Settings',
    '/Lend-A-Spot',
    '/Your-Parking-Spots',
    '/paymentMethod',
  ];
  const isPartnerRoute = partnerRoutes.some((route) =>
    window.location.pathname.includes(route)
  );

  if (isPartnerRoute && role !== 'partner') {
    return <Navigate to="/login" />;
  }

  return <Outlet />;
};

export default ProtectedRoutes;
