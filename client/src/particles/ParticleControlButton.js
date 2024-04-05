import React from 'react';
import GlobalStatesContext from '../context/GlobalStatesContext';
import translations from '../translation/Translation';
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
      style={{ color: 'var(--UIColor)', backgroundColor: 'var(--UIText)' }}
    >
      {moveParticles ? translate('stopParticles') : translate('startParticles')}
    </Button>
  );
};

export default ParticleControlButton;
