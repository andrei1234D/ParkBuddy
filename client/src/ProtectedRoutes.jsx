import { useContext, useEffect } from 'react';
import GlobalStatesContext from './context/GlobalStatesContext';
import { Navigate, Outlet } from 'react-router';
import { toast } from 'react-toastify';

const ProtectedRoutes = () => {
  const { translate, isLoggedIn, role } = useContext(GlobalStatesContext);
  const partnerRoutes = ['/Lend-A-Spot', '/Your-Parking-Spots'];
  const isPartnerRoute = partnerRoutes.some((route) =>
    window.location.pathname.includes(route)
  );

  useEffect(() => {
    if (!isLoggedIn) {
      toast.error(translate('loginToAccessPage'), {
        position: 'top-right',
        autoClose: 3000,
        closeOnClick: true,
        closeButton: false,
      });
    } else if (isPartnerRoute && role !== 'partner') {
      toast.error(translate('loginAsPartnerToAccessPage'), {
        position: 'top-right',
        autoClose: 3000,
        closeOnClick: true,
        closeButton: false,
      });
    }
  }, [isLoggedIn, role, translate, isPartnerRoute]);

  // Check if the user is logged in
  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }

  if (isPartnerRoute && role !== 'partner') {
    return <Navigate to="/login" />;
  }

  return <Outlet />;
};

export default ProtectedRoutes;
