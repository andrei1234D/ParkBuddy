import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

import { FaCircle } from 'react-icons/fa';
import { CiCircleQuestion } from 'react-icons/ci';
import IconButton from '@mui/material/IconButton';

import Tooltip from '@mui/material/Tooltip';
//context import

import GlobalStatesContext from '../context/GlobalStatesContext';

import '../style/YourSpots.css';

function Home() {
  const { translate, username } = useContext(GlobalStatesContext);
  const [parkingSpots, setParkingSpots] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    async function fetchParkingSpots() {
      try {
        const response = await axios.post('http://localhost:5000/Your-Spots', {
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

  console.log(parkingSpots);

  if (loading) {
    return <div>Loading...</div>;
  }
  return (
    <div>
      {loading ? (
        <div className="loading">Loading...</div>
      ) : (
        <div className="containerParkingSpots">
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
                    <FaCircle style={{ color: 'green' }} /> FREE <br />
                    <FaCircle style={{ color: 'blue' }} /> RESERVED <br />
                    <FaCircle style={{ color: 'red' }} /> OCCUPIED
                  </div>
                }
                arrow
                placement="right"
              >
                <IconButton
                  style={{
                    color: 'var(--UIText)',
                    fontSize: '1rem',
                  }}
                >
                  <CiCircleQuestion
                    style={{ color: 'var(--UIText)', marginLeft: '5px' }}
                  />
                </IconButton>
              </Tooltip>
            </div>
          </div>
          {parkingSpots.map((spot, index) => (
            <div key={index} className="containerSpots">
              <p className="nrSpot">{index + 1}</p>
              <p className="addressName">{spot.address}</p>
              <p className="coordinates">{spot.longitude}</p>
              <p className="coordinates">{spot.latitude}</p>
              <p className="status">
                {spot.status === 'free' && (
                  <FaCircle style={{ color: 'green' }} />
                )}
                {spot.status === 'reserved' && (
                  <FaCircle style={{ color: 'blue' }} />
                )}
                {spot.status === 'occupied' && (
                  <FaCircle style={{ color: 'red' }} />
                )}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Home;