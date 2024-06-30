import React, { useContext } from 'react';
import { useLocation } from 'react-router-dom';
import GlobalStatesContext from '../../context/GlobalStatesContext';
import '../../style/NavTextAnimation.css';

export default function NavTextAnimation() {
  const { translate } = useContext(GlobalStatesContext);
  const location = useLocation();

  return (
    <div>
      {location.pathname === '/Lend-A-Spot' ? (
        <div className="normal-text">LEND A SPOT</div>
      ) : location.pathname === '/asd' ? (
        <div className="normal-text">RENT A SPOT</div>
      ) : (
        <div className="catchy">
          <div className="catchy1">{translate('catchy1')}</div>
          <div className="catchy2">{translate('catchy2')}</div>
        </div>
      )}
    </div>
  );
}
