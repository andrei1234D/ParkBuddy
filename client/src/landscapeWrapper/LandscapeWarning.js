import React from 'react';
import '../style/LandscapeWarning.css';
import landscapeMode from '../images/landscapeMode.png';
import { useContext } from 'react';
import GlobalStatesContext from '../context/GlobalStatesContext';

const LandscapeWarning = () => {
  const { translate } = useContext(GlobalStatesContext);

  return (
    <div className="landscape-warning">
      <div className="warning-content">
        <img
          src={`${landscapeMode}`}
          alt="Rotate phone"
          className="rotate-icon"
        />
        <p style={{ fontSize: '40px' }}>
          {translate('Please_rotate_your_device_to_portrait_mode')}
        </p>
      </div>
    </div>
  );
};

export default LandscapeWarning;
