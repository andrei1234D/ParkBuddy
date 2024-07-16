import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

import { FaCircle } from 'react-icons/fa';
import { CiCircleQuestion } from 'react-icons/ci';
import IconButton from '@mui/material/IconButton';

import LoadingSpinner from '../spinner/LoadingSpinner.js';

import Tooltip from '@mui/material/Tooltip';
//context import

import GlobalStatesContext from '../context/GlobalStatesContext';

import '../style/YourSpots.css';

import api from '../api.js';
import noSpotsImage from '../images/noSpots.png';

function YourSpots() {
  const { translate, username } = useContext(GlobalStatesContext);
  const [parkingSpots, setParkingSpots] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchParkingSpots() {
      try {
        const response = await api.post('/Your-Spots', {
          username,
        });
        setParkingSpots(response.data.parkingSpots);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching parking spots:', error);
        // Handle error, such as displaying an error message to the user
        setLoading(false);
      }
    }

    fetchParkingSpots();
  }, [username]);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div>
      {loading ? (
        <div className="loading">{translate('Loading...')}</div>
      ) : (
        <div className="containerParkingSpots">
          <div className="pageReminder">{translate('YOUR_SPOTS')}</div>
          <div className="containerHeaderSpots">
            <p className="nrSpot">{translate('nr')}</p>
            <p className="addressName">{translate('addressName')}</p>
            <p className="coordinates">{translate('longitude')}</p>
            <p className="coordinates">{translate('latitude')}</p>
            <div className="status">
              <p>{translate('status')}</p>
              <Tooltip
                title={
                  <div style={{ fontSize: '13px' }}>
                    <FaCircle style={{ color: 'green' }} /> {translate('free')}{' '}
                    <br />
                    <FaCircle style={{ color: 'blue' }} />{' '}
                    {translate('occupied')}
                    <br />
                    <FaCircle style={{ color: 'red' }} />{' '}
                    {translate('unavailable')}
                    <br />
                  </div>
                }
                arrow
                placement="right"
              >
                <IconButton
                  style={{
                    width: 'auto',
                    height: 'auto',
                    color: 'var(--UIColor)',
                  }}
                >
                  <CiCircleQuestion
                    style={{
                      color: 'var(--UIColor)',
                      width: 'fit-content',
                      height: 'fit-content',
                    }}
                  />
                </IconButton>
              </Tooltip>
            </div>
          </div>
          {parkingSpots.length === 0 ? (
            <div className="noSpotsContainer">
              <img
                src={noSpotsImage}
                alt={translate('no_spots_available')}
                className="noSpotsImage"
              />
              <p className="noSpotsText">{translate('no_spots_available')}</p>
            </div>
          ) : (
            parkingSpots.map((spot, index) => (
              <div
                key={index}
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  color: 'rgb(var(--UIText)',
                }}
              >
                <p className="nrSpot">{index + 1}</p>
                <div className="containerSpots">
                  <p className="addressName">{spot.address}</p>
                  <p className="coordinates">{spot.longitude}</p>
                  <p className="coordinates">{spot.latitude}</p>
                  <p className="status">
                    {spot.status === 'free' && (
                      <FaCircle style={{ color: 'green' }} />
                    )}
                    {spot.status === 'reserved' && (
                      <FaCircle style={{ color: 'yellow' }} />
                    )}
                    {spot.status === 'occupied' && (
                      <FaCircle style={{ color: 'blue' }} />
                    )}
                    {spot.status === 'unavailable' && (
                      <FaCircle style={{ color: 'red' }} />
                    )}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default YourSpots;
