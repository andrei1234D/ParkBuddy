import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import Tooltip from '@mui/material/Tooltip';
import { MdOutlineManageAccounts } from 'react-icons/md';

import GlobalStatesContext from '../context/GlobalStatesContext';
import '../style/Settings.css';

const AccountIcon = () => {
  const { toggleMenu, isLoggedIn, translate } = useContext(GlobalStatesContext);

  return (
    <Tooltip title={`${translate('account')}`} arrow placement="top">
      <div className="settings">
        <Link to={`${isLoggedIn ? '/Account-Settings' : '/Login'}`}>
          <MdOutlineManageAccounts
            className="settingsIcon"
            onClick={toggleMenu}
          />
        </Link>
      </div>
    </Tooltip>
  );
};

export default AccountIcon;
