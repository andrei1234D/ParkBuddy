import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { GoogleMap, Marker, InfoWindow } from '@react-google-maps/api';
import { FaSearch } from 'react-icons/fa';
import Tooltip from '@mui/material/Tooltip';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import markerImage from '../images/marker2.png';
import GlobalStatesContext from '../context/GlobalStatesContext';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';

import 'react-datepicker/dist/react-datepicker.css';

import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { IconButton } from '@mui/material';

import LoadingSpinner from '../spinner/LoadingSpinner.js';
import Autocomplete from 'react-google-autocomplete';
import mapStyles from '../styleForMap/mapStyle.js';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CloseIcon from '@mui/icons-material/Close';

import '../style/RentASpot.css';

const mapContainerStyle = {
  width: '100%',
  height: 'calc(100vh - 110px)',
};

const RentSpot = () => {
  const [apiKey, setApiKey] = useState(null);
  const [map, setMap] = useState(null);
  const [spots, setSpots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSpot, setSelectedSpot] = useState(null);
  const [openDialog, setOpenDialog] = useState(true);
  const [openDialogConfirmation, setOpenDialogConfirmation] = useState(false);
  const [selectedStartDate, setSelectedStartDate] = useState(new Date());
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [infoWindowPosition, setInfoWindowPosition] = useState(null);
  const [infoWindowOpen, setInfoWindowOpen] = useState(false);
  const [error, setError] = useState('');
  const [showBubble, setShowBubble] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState({
    lat: 44.415573973386864,
    lng: 26.102983712003493,
  });

  const { translate, username } = useContext(GlobalStatesContext);

  useEffect(() => {
    const fetchApiKey = async () => {
      try {
        const response = await axios.get(
          'http://localhost:5000/get-google-maps-key'
        );
        setApiKey(response.data.apiKey);
      } catch (error) {
        console.error('Error fetching API key:', error);
      }
    };

    fetchApiKey();
  }, []);

  useEffect(() => {
    if (apiKey) {
      fetchData();
    }
  }, [apiKey]);

  useEffect(() => {
    if (apiKey) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=initMap`;
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }
  }, [apiKey]);

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:5000/Get-Spots');
      setSpots(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching spots:', error);
      setLoading(false);
    }
  };

  console.log(spots);
  const handleMarkerClick = (spot) => {
    console.log('Marker Click Has Been Called Once');

    if (!infoWindowOpen) {
      setSelectedSpot(spot);
      setInfoWindowPosition({
        lat: spot.latitude,
        lng: spot.longitude,
      });
      setInfoWindowOpen(true);
    }
  };

  const handleDialogClosePreferences = () => {
    setOpenDialog(false);
    setShowBubble(true);
  };
  const handleDialogCloseNoPreferences = () => {
    setOpenDialog(false);
    setShowBubble(true);
    fetchData();
  };

  const handleDialogCloseConfirmation = () => {
    setOpenDialogConfirmation(false);
  };

  const handleDialogConfirmationOpen = () => {
    setOpenDialogConfirmation(true);
  };

  const handleInfoWindowClose = () => {
    setSelectedSpot(null);
    setInfoWindowOpen(false);
  };

  const handleClickRedirect = () => {
    const { latitude, longitude } = selectedSpot;
    const url = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
    window.location.href = url;
  };

  const handlePreferencesClick = async () => {
    if (selectedStartDate && startTime && endTime) {
      try {
        const response = await axios.post(
          'http://localhost:5000/Preferences-Spots',
          {
            startRentTime: startTime,
            endRentTime: endTime,
            selectedDate: selectedStartDate,
            username,
          }
        );
        setSpots(response.data);
        console.log('response data:');
        console.log(response.data);
        toast.success('Filters Applied', {
          position: 'top-right',
          autoClose: 10000,
          closeOnClick: true,
        });
      } catch (error) {
        console.error('Error renting spot:', error);
        toast.error('Error applying filters', {
          position: 'top-right',
          autoClose: 10000,
          closeOnClick: true,
        });
      }
      handleDialogClosePreferences();
    } else {
      setError('Please fill in all fields');
      console.log(error);
    }
  };

  const handlePlaceSelect = (place) => {
    console.log('Place selected:', place.geometry.location.lat);
    console.log(place.geometry.location);
    if (!place.geometry) {
      window.alert("No details available for input: '" + place.name + "'");
      return;
    }

    if (map) {
      if (place.geometry.viewport) {
        map.fitBounds(place.geometry.viewport);
      } else {
        map.setCenter(place.geometry.location);
        map.setZoom(17);
      }
    } else {
      console.error('Map is not yet initialized');
    }
    setSelectedLocation(place.geometry.location);
  };

  const handleErrorClose = () => {
    setError('');
  };

  const handleBubbleClick = () => {
    setShowBubble(false);
    setOpenDialog(true);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div>
      <ToastContainer />
      {map && (
        <Autocomplete
          apiKey={apiKey}
          onPlaceSelected={handlePlaceSelect}
          options={{
            componentRestrictions: { country: 'ro' },
          }}
          style={{
            width: '98%',
            position: 'relative',
            zIndex: '100',
            padding: '15px',
          }}
          placeholder="Search for a location"
        />
      )}

      {apiKey && (
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          zoom={11}
          center={selectedLocation}
          options={{ styles: mapStyles, fullscreenControl: false }}
          onLoad={(map) => setMap(map)}
        >
          {spots.map((spot) => (
            <Marker
              key={spot.id}
              position={{ lat: spot.latitude, lng: spot.longitude }}
              onClick={() => {
                handleMarkerClick(spot);
              }}
              icon={{
                url: markerImage,
                scaledSize: new window.google.maps.Size(70, 70),
              }}
              animation={window.google.maps.Animation.DROP}
              title={spot.address}
            />
          ))}
          {infoWindowOpen && selectedSpot && (
            <InfoWindow
              position={infoWindowPosition}
              onCloseClick={handleInfoWindowClose}
            >
              <div
                style={{
                  padding: '5px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  flexDirection: 'column',
                }}
              >
                <h3>{selectedSpot.address}</h3>
                <p>Status: {selectedSpot.status} now</p>
                <p>Availability: {selectedSpot.endDate}</p>
                <p>Price: the most you are willing to pay.</p>
                <p>Owner: {selectedSpot.username}</p>
                <p>Phone Number: 0721985898</p>
                <Button onClick={handleDialogConfirmationOpen}>Rent Now</Button>
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      )}

      {openDialog && (
        <div className={`custom-dialog ${openDialog ? 'open' : 'close'}`}>
          <div className="dialog-content">
            <div className="dialog-header">
              <div>
                {selectedSpot
                  ? selectedSpot.name
                  : 'Tell us when would you like your spot to be available and we will show you the best spots for your needs'}
              </div>
              <IconButton onClick={handleDialogCloseNoPreferences}>
                <CloseIcon />
              </IconButton>
            </div>
            <div className="dialog-body">
              <div
                style={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                <div
                  style={{
                    height: '100%',
                    width: '100%',
                    padding: '10px',
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-evenly ',
                  }}
                >
                  <TextField
                    label="Start Time"
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    inputProps={{
                      step: 300, // 5 min
                    }}
                  />
                  <TextField
                    label="End Time"
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    inputProps={{
                      step: 300, // 5 min
                    }}
                  />
                </div>
                <div style={{ display: 'block' }}>
                  <p style={{ textAlign: 'center', fontSize: '25px' }}> DATE</p>
                  <DatePicker
                    selected={selectedStartDate}
                    onChange={(date) => setSelectedStartDate(date)}
                  />
                </div>
              </div>
            </div>
            <div className="dialog-actions">
              <div
                style={{
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'space-around',
                }}
              >
                <Button
                  onClick={handleDialogCloseNoPreferences}
                  style={{ color: 'red' }}
                >
                  Browse all spots
                </Button>
                <Button
                  onClick={handlePreferencesClick}
                  style={{ color: '#90EE90', fontWeight: '700' }}
                >
                  Find your perfect fit
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showBubble && (
        <Tooltip title={'spot preferences'} arrow placement="top">
          <div
            style={{
              position: 'absolute',
              bottom: '290px',
              right: '20px',
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              backgroundColor: '#007bff',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              cursor: 'pointer',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            }}
            onClick={handleBubbleClick}
          >
            <FaSearch color="white" size={30} />
          </div>
        </Tooltip>
      )}

      {error && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: '#f8d7da',
            color: '#721c24',
            padding: '20px',
            borderRadius: '10px',
            boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
            display: 'flex',
            alignItems: 'center',
            zIndex: '1301',
          }}
        >
          <div variant="h6" style={{ flexGrow: 1 }}>
            {error}
          </div>
          <IconButton onClick={handleErrorClose}>
            <CloseIcon />
          </IconButton>
        </div>
      )}

      {selectedSpot && (
        <Dialog
          open={openDialogConfirmation}
          onClose={handleDialogCloseConfirmation}
        >
          <DialogTitle>You Are Almost There !</DialogTitle>
          <DialogContent>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <h3>
                Please verify that the details of your order are <b>correct</b>.
                We will not issue a refund if you do not use the parking spot
                during the paid period.{' '}
              </h3>
              <p>
                You will rent the {selectedSpot.address} spot on
                {selectedStartDate.toString()} from {startTime} to {endTime} for
                0.10RON/minute
              </p>
            </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDialogCloseConfirmation}>Cancel</Button>
            <Button onClick={handleClickRedirect}>Pay & see directions</Button>
          </DialogActions>
        </Dialog>
      )}
    </div>
  );
};

export default RentSpot;
