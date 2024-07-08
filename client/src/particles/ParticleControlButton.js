import React from 'react';
import GlobalStatesContext from '../context/GlobalStatesContext';
import { useContext } from 'react';
import { Button } from '@mui/material';
import '../style/ParticlesBackground.css';

const ParticleControlButton = () => {
  const { moveParticles, toggleParticles, translate } =
    useContext(GlobalStatesContext);

  return (
    <Button
      variant="contained"
      onClick={toggleParticles}
      className="transition-width"
      style={{
        color: 'rgb(var(--UIText))',
        backgroundColor: 'rgb(var(--UIColor))',
        fontSize: '35px',
      }}
    >
      {moveParticles ? translate('stopParticles') : translate('startParticles')}
    </Button>
  );
};

export default ParticleControlButton;
