import { React, useContext } from 'react';
import { ReactComponent as Sun } from './Sun.svg';
import { ReactComponent as Moon } from './Moon.svg';
import GlobalStatesContext from '../context/GlobalStatesContext';
import './DarkMode.css';

const DarkMode = () => {
  const { isDarkMode, toggleDarkMode } = useContext(GlobalStatesContext);
  const setDarkMode = () => {
    document.querySelector('body').setAttribute('data-theme', 'dark');
    toggleDarkMode('dark');
  };
  const setLightMode = () => {
    document.querySelector('body').setAttribute('data-theme', 'light');
    toggleDarkMode('false');
  };

  if (isDarkMode === 'dark') setDarkMode();
  const toggleTheme = (e) => {
    if (e.target.checked) setDarkMode();
    else setLightMode();
  };
  return (
    <div className="dark_mode">
      <input
        className="dark_mode_input"
        type="checkbox"
        id="darkmode-toggle"
        onChange={toggleTheme}
        defaultChecked={isDarkMode}
      />
      <label className="dark_mode_label" for="darkmode-toggle">
        <Sun />
        <Moon />
      </label>
    </div>
  );
};

export default DarkMode;
