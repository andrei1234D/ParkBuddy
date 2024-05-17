import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import Tooltip from '@mui/material/Tooltip';
import { IoSettings } from 'react-icons/io5';
import GlobalStatesContext from '../context/GlobalStatesContext';
import '../style/Settings.css';

const SettingsIcon = () => {
  const { toggleMenu } = useContext(GlobalStatesContext);
  return (
    <Tooltip title="Settings" arrow placement="top">
      <div className="settings">
        <Link to="/Settings">
          <IoSettings className="settingsIcon" onClick={toggleMenu} />
        </Link>
      </div>
    </Tooltip>
  );
};

export default SettingsIcon;
