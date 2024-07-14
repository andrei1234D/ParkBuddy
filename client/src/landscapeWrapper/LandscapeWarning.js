import React from 'react';
import '../style/LandscapeWarning.css';
import landscapeMode from '../images/landscapeMode.png';
const LandscapeWarning = () => {
  return (
    <div className="landscape-warning">
      <div className="warning-content">
        <img
          src={`${landscapeMode}`}
          alt="Rotate phone"
          className="rotate-icon"
        />
        <p style={{ fontSize: '40px' }}>
          Please rotate your device to portrait mode
        </p>
      </div>
    </div>
  );
};

export default LandscapeWarning;
