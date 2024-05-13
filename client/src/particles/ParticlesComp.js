import React, { useCallback } from 'react';
import Particles from 'react-tsparticles';
import { loadSlim } from 'tsparticles-slim';
import { useContext } from 'react';

import GlobalStatesContext from '../context/GlobalStatesContext';
import '../style/ParticlesBackground.css';

const ParticlesComp = () => {
  const particlesInit = useCallback(async (engine) => {
    await loadSlim(engine);
  }, []);

  const particlesLoaded = useCallback((container) => {}, []);
  const { moveParticles } = useContext(GlobalStatesContext);
  let particlesBackground = '#040720';
  const particleOptions = {
    background: {
      color: { value: { particlesBackground } },
    },
    fpsLimit: 120,
    interactivity: {
      events: {
        onClick: {
          enable: true,
          mode: 'push',
        },
        onHover: {
          enable: true,
          mode: 'attract',
        },
        resize: true,
      },

      modes: {
        push: {
          quantity: moveParticles ? 5 : 0,
        },
        //the attract onHover
        attract: {
          distance: 200,
          speed: moveParticles ? 1.3 : 0,
        },
      },
    },
    particles: {
      collisions: {
        enable: true,
        maxSpeed: 3.3,
        mode: 'bounce',
        bounce: {
          horizontal: { value: 1 },
          vertical: { value: 1 },
        },
      },
      color: {
        value: '#3fff7a',
        opacity: 1,
      },
      links: {
        color: '#66b2b2',
        distance: 165,
        enable: true,
        opacity: 0.6,
        width: 1.3,
      },
      move: {
        enable: moveParticles,
        direction: 'none',
        outModes: {
          default: 'bounce',
        },
        random: true, // Set random to true
        speed: { min: 0.6, max: 1.5 }, // Provide a range for speed
        wrap: true,
      },

      number: {
        density: {
          enable: true,
          area: 800,
        },
        value: 170,
        max: 250,
      },
      opacity: {
        value: 0.5,
      },
      shape: {
        type: ['circle', 'polygon'],
      },
      size: {
        value: { min: 2, max: 4 },
      },
    },

    detectRetina: true,
  };
  return (
    <div className="background_container">
      <Particles
        id="tsparticles"
        init={particlesInit}
        loaded={particlesLoaded}
        options={particleOptions}
      />
    </div>
  );
};
export default ParticlesComp;
