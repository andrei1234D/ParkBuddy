import React, { useContext, useState } from 'react';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import DarkMode from '../DarkMode/DarkMode';
import GlobalStatesContext from '../context/GlobalStatesContext';
import '../style/Settings.css';
import ParticleMovement from '../particles/ParticleControlButton';

const Settings = () => {
  const languageOptions = [
    { value: 'en', label: 'English' },
    { value: 'ro', label: 'Română' },
    { value: 'pl', label: 'Polski' },
  ];

  const { language, toggleLanguage, translate } =
    useContext(GlobalStatesContext);
  return (
    <div id="big">
      <div className="centered-content">
        <div className="titleSettings">
          <div className="textGlow settingsText">{translate('settings')}</div>
        </div>
        <ParticleMovement />

        <DarkMode />

        <div className="languageSelection">
          <Select
            value={language}
            onChange={(event) => toggleLanguage(event.target.value)}
            style={{
              backgroundColor: 'var(--UIColor)',
              color: 'var(--UIText)',
            }}
          >
            {languageOptions.map((option) => (
              <MenuItem
                key={option.value}
                value={option.value}
                style={{ textAlign: 'center', color: 'black' }}
              >
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </div>
      </div>
    </div>
  );
};

export default Settings;
