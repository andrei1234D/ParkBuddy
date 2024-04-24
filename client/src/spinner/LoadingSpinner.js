import React from 'react';
import '../style/LoadingSpinner.css';

const LoadingSpinner = () => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100vw',
        height: '90vh',
      }}
    >
      <div className="loader"></div>;
    </div>
  );
};
export default LoadingSpinner;
