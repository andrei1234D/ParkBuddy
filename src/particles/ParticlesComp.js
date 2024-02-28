import React, { useCallback } from 'react';
import Particles from 'react-tsparticles';
import { loadSlim } from 'tsparticles-slim';

import '../style/ParticlesBackground.css';

const ParticlesComp = () => {
  const particlesInit = useCallback(async (engine) => {
    await loadSlim(engine);
  }, []);

  const particlesLoaded = useCallback((container) => {
    console.log(container);
  }, []);

  const particleOptions = {
    background: {
      color: { value: '#040720' },
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
          quantity: 5,
        },
        //the attract onHover
        attract: {
          distance: 200,
          speed: 1.3,
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
        value: '#8b4513',
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
        direction: 'none',
        enable: true,
        outModes: {
          default: 'bounce',
        },
        random: true, // Set random to true
        speed: { min: 0.6, max: 2.2 }, // Provide a range for speed
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
        value: { min: 1, max: 5 },
      },
    },

    detectRetina: true,
  };
  console.log(particleOptions);
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
