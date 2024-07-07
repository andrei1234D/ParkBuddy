import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { AiOutlineLogout } from 'react-icons/ai';
import { IoWallet } from 'react-icons/io5';
import GlobalStatesContext from '../context/GlobalStatesContext';
import { Button } from '@mui/material';

import '../style/Settings.css';

const AccountSettings = () => {
  const { role, username, toggleLogout, translate } =
    useContext(GlobalStatesContext);
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

        <p>
          {translate('loggedInA')} <b>{role}</b> {translate('account')}
        </p>

        {role === 'customer' && (
          <div style={{ textAlign: 'center' }}>
            <p>
              {translate('loggedInA')} <b s>{translate('customer')}</b>{' '}
              {translate('account')}, {translate('ifUWantToLend')}
            </p>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Link to="/register">
                <Button
                  style={{
                    color: 'rgb(var(--UIColor))',
                    backgroundColor: 'rgb(var(--UIText))',
                    fontSize: '20px',
                  }}
                >
                  {translate('upgradeNow')}
                </Button>
              </Link>
            </div>
          </div>
        )}
        <div
          style={{
            textAlign: 'center',
            rowGap: '20px',
            display: 'flex',
            flexDirection: 'column',
            alignContent: 'center',
          }}
        >
          {role === 'partner' && (
            <div>
              <p>{translate('lendASpotWhenever')}</p>
              <Button
                variant="contained"
                style={{
                  color: 'rgb(var(--UIColor))',
                  backgroundColor: 'rgb(var(--UIText))',
                  fontSize: '20px',
                }}
                onClick={handleToLendASpot}
              >
                {translate('lend')}
              </Button>
            </div>
          )}
          <div>
            <Button
              onClick={handleToYourParkingSpots}
              variant="contained"
              style={{
                color: 'rgb(var(--UIColor))',
                backgroundColor: 'rgb(var(--UIText))',
                fontSize: '20px',
              }}
            >
              {translate('seeYourParkingSpots')}
            </Button>
          </div>
          <Link to="/paymentMethod">
            <Button
              variant="contained"
              style={{
                color: 'rgb(var(--UIColor))',
                backgroundColor: 'rgb(var(--UIText))',
                fontSize: '20px',
              }}
            >
              {translate('toPayment')}{' '}
              <IoWallet size="50px" style={{ marginLeft: '8px' }} />
            </Button>
          </Link>
          <div>
            <Button
              variant="contained"
              onClick={handleLogout}
              style={{
                color: 'rgb(var(--UIColor))',
                backgroundColor: 'rgb(var(--UIText))',
                fontSize: '20px',
              }}
            >
              {translate('logout')} <AiOutlineLogout size="25px" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountSettings;
