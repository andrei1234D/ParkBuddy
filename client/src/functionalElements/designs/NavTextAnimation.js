import React, { useContext } from 'react';
import GlobalStatesContext from '../../context/GlobalStatesContext';

import '../../style/NavTextAnimation.css';

export default function NavTextAnimation() {
  const { translate } = useContext(GlobalStatesContext);

  return (
    <div className="catchy">
      <div className="catchy1">{translate('catchy1')},</div>
      <div className="catchy2">{translate('catchy2')}</div>
    </div>
  );
}
