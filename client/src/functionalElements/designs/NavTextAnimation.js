import React, { useContext } from 'react';
import { useLocation } from 'react-router-dom';
import GlobalStatesContext from '../../context/GlobalStatesContext';
import '../../style/NavTextAnimation.css';

export default function NavTextAnimation() {
  const { translate } = useContext(GlobalStatesContext);
  const location = useLocation();

  return (
    <div>
      {location.pathname === '/Rent-A-Spot' ? (
        <div className="normal-text">{translate('rentASpot')}</div>
      ) : location.pathname === '/Lend-A-Spot' ? (
        <div className="normal-text">{translate('lendASpot')}</div>
      ) : location.pathname === '/login' ? (
        <div className="normal-text">{translate('login')}</div>
      ) : location.pathname === '/register' ? (
        <div className="normal-text">{translate('register')}</div>
      ) : (
        <div className="catchy">
          <div className="catchy1">{translate('catchy1')}</div>
          <div className="catchy2">{translate('catchy2')}</div>
        </div>
      )}
    </div>
  );
}
