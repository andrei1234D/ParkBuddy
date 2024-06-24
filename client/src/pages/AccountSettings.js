import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { AiOutlineLogout } from 'react-icons/ai';
import { IoWallet } from 'react-icons/io5';
import GlobalStatesContext from '../context/GlobalStatesContext';
import { Button } from '@mui/material';

import '../style/Settings.css';

const AccountSettings = () => {
  const { role, username, toggleLogout, isLoggedIn, translate } =
    useContext(GlobalStatesContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    toggleLogout();
  };

  const handleToLendASpot = () => {
    navigate('/Lend-A-Spot');
  };

  const handleToYourParkingSpots = () => {
    navigate('/Your-Parking-Spots');
  };

  return (
    <div id="big">
      <div className="centered-content">
        <div className="titleSettings">
          <div className="textGlow settingsText">
            {translate('accountSalute')}, {username}
          </div>
        </div>

        <p style={{ color: 'var(--UIText)' }}>
          {translate('loggedInA')} <b style={{ fontSize: '20px' }}>{role}</b>{' '}
          {translate('account')}
        </p>

        {role === 'customer' && (
          <div style={{ textAlign: 'center' }}>
            <p>
              {translate('loggedInA')}{' '}
              <b style={{ fontSize: '20px' }}>{translate('customer')}</b>{' '}
              {translate('account')}, {translate('ifUWantToLend')}
            </p>
            <Link to="/register">
              <Button>{translate('upgradeNow')}</Button>
            </Link>
          </div>
        )}
        <div
          style={{
            textAlign: 'center',
            rowGap: '20px',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {role === 'partner' && (
            <div>
              <p>{translate('lendASpotWhenever')}</p>
              <Button
                variant="contained"
                style={{
                  color: 'var(--UIColor)',
                  backgroundColor: 'var(--UIText)',
                }}
                onClick={handleToLendASpot}
              >
                {translate('lend')}
              </Button>
            </div>
          )}
          <Button
            onClick={handleToYourParkingSpots}
            style={{
              color: 'var(--UIColor)',
              backgroundColor: 'var(--UIText)',
            }}
          >
            {translate('seeYourParkingSpots')}
          </Button>
          <Link to="/paymentMethod">
            <Button
              variant="contained"
              style={{
                color: 'var(--UIColor)',
                backgroundColor: 'var(--UIText)',
              }}
            >
              {translate('toPayment')}{' '}
              <IoWallet size="25px" style={{ marginLeft: '8px' }} />
            </Button>
          </Link>

          <Button
            variant="contained"
            onClick={handleLogout}
            style={{
              color: 'var(--UIColor)',
              backgroundColor: 'var(--UIText)',
            }}
          >
            {translate('logout')} <AiOutlineLogout size="25px" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AccountSettings;
