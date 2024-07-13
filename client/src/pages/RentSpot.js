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

import Confetti from 'react-confetti';
import 'react-datepicker/dist/react-datepicker.css';

import Button from '@mui/material/Button';
import { IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

import LoadingSpinner from '../spinner/LoadingSpinner.js';
import Autocomplete from 'react-google-autocomplete';
import mapStyles from '../styleForMap/mapStyle.js';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import '../style/RentASpot.css';

import api from '../api.js';

const mapContainerStyle = {
  width: '100vw',
  height: 'calc(100vh - 64px)',
};

const RentSpot = () => {
  const [apiKey, setApiKey] = useState(null);
  const [map, setMap] = useState(null);
  const [mapInitialized, setMapInitialized] = useState(false);
  const [isMapVisible, setIsMapVisible] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
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
  const [errorRent, setErrorRent] = useState('');

  const [showBubble, setShowBubble] = useState(false);
  const [showSearch, setShowSearch] = useState(true);
  const [searchPosition, setSearchPosition] = useState('center');

  const [selectedLocation, setSelectedLocation] = useState({
    lat: 44.415573973386864,
    lng: 26.102983712003493,
  });

  const { translate, username, role, firstName, email } =
    useContext(GlobalStatesContext);

  useEffect(() => {
    const fetchApiKey = async () => {
      try {
        const response = await api.post('/googleApiKey');
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
    if (apiKey && !window.google) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=initMap`;
      script.async = true;
      script.defer = true;
      script.onload = () => setMapInitialized(true);
      document.head.appendChild(script);
    }
  }, [apiKey]);
  useEffect(() => {
    if (showConfetti) {
      // Set a timer to turn off confetti after 3 seconds (3000 milliseconds)
      const timer = setTimeout(() => {
        setShowConfetti(false);
      }, 3000);

      // Cleanup the timer if the component is unmounted or showConfetti changes
      return () => clearTimeout(timer);
    }
  }, [showConfetti]);
  const fetchData = async () => {
    try {
      const response = await api.post('/Get-Spots');
      setSpots(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching spots:', error);
      setLoading(false);
      setShowSearch(true);
    }
  };

  const handleMarkerClick = (spot) => {
    console.log('Marker Click Has Been Called Once');
    setSelectedSpot(spot);
    setInfoWindowPosition({ lat: spot.latitude, lng: spot.longitude });
    setInfoWindowOpen(true);
  };
  const handleBubbleClick = () => {
    setShowBubble(false);
    setOpenDialog(true);
    setErrorRent('');
  };

  const handleDialogClosePreferences = () => {
    setOpenDialog(false);
    setShowBubble(true);
  };
  const handleDialogCloseNoPreferences = () => {
    setOpenDialog(false);
    setShowBubble(true);
    fetchData();
    toast.success('Browsing without any filters applied', {
      position: 'top-right',
      autoClose: 8000,
      closeOnClick: true,
      closeButton: false,
    });
  };

  const handleDialogCloseConfirmation = () => {
    setOpenDialogConfirmation(false);
  };

  const handleDialogConfirmationOpen = () => {
    if (startTime === null || endTime === null) {
      setErrorRent('Please specify your rental start and end times!');
    } else {
      setOpenDialogConfirmation(true);
    }
  };

  const handleInfoWindowClose = () => {
    setSelectedSpot(null);
    setInfoWindowOpen(false);
  };

  const handleClickRedirect = () => {
    try {
      const spotAddress = selectedSpot.address;
      const spotUsername = selectedSpot.username;
      api.post('/addParkingRentalTimes', {
        startTime: formatTime(startTime),
        endTime: formatTime(endTime),
        spotAddress,
        spotUsername,
        selectedStartDate,
        username,
        role,
        firstName,
        email,
      });
      const { latitude, longitude } = selectedSpot;
      const url = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
      setShowConfetti(true);
      setTimeout(() => {
        window.location.href = url;
      }, 3500);
    } catch (error) {
      console.error('error adding spot:', error);
    }
  };

  const handlePreferencesClick = async () => {
    if (selectedStartDate && startTime && endTime) {
      try {
        const response = await api.post('/Preferences-Spots', {
          startRentTime: startTime,
          endRentTime: endTime,
          selectedDate: selectedStartDate,
          username,
        });
        setSpots(response.data);
        console.log('response data:');
        console.log(response.data);
        toast.success('Filters Applied', {
          position: 'top-right',
          autoClose: 10000,
          closeButton: false,
          closeOnClick: true,
        });
      } catch (error) {
        console.error('Error renting spot:', error);
        toast.error('Error applying filters', {
          position: 'top-right',
          autoClose: 10000,
          closeButton: false,
          closeOnClick: true,
        });
      }
      handleDialogClosePreferences();
    } else {
      setError(translate('fillAllError'));
      console.log(error);
    }
  };

  const handlePlaceSelect = (place) => {
    console.log('Place selected:', place.geometry.location.lat());
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
    setSearchPosition('top');
    setIsMapVisible(true);
  };

  const handleErrorClose = () => {
    setError('');
  };
  const handleErrorRentClose = () => {
    setErrorRent('');
  };
  const getMinEndTime = () => {
    if (!startTime) return new Date();
    const time = new Date(startTime);
    time.setMinutes(time.getMinutes() + 1);
    return time;
  };
  const formatTime = (date) => {
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  if (loading) {
    return <LoadingSpinner />;
  }
  return (
    <div>
      <ToastContainer />
      {showSearch && (
        <div className={`search-bar ${searchPosition}`}>
          <Autocomplete
            apiKey={apiKey}
            onPlaceSelected={handlePlaceSelect}
            options={{
              componentRestrictions: { country: 'ro' },
            }}
            placeholder="Search for a location"
            types={['(regions)']}
            className={`Autocomplete ${searchPosition}`}
          />
          <FaSearch className={`search-icon ${searchPosition}`} />
        </div>
      )}
      {isMapVisible && (
        <div>
          {apiKey && (
            <GoogleMap
              mapContainerStyle={mapContainerStyle}
              zoom={11}
              center={selectedLocation}
              options={{
                styles: mapStyles,
                fullscreenControl: false,
                mapTypeControl: false,
              }}
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
                      zIndex: '105',
                    }}
                  >
                    <h3>{selectedSpot.address}</h3>
                    <p>Status: {selectedSpot.status} now</p>
                    <p>Price: 0.30LEI pe minut</p>
                    <p>Owner: {selectedSpot.username}</p>
                    <p>Phone Number: 0721985898</p>
                    <p>
                      Rating: 5/5 <span className="star">&#9733;</span>
                    </p>
                    <Button onClick={handleDialogConfirmationOpen}>
                      Rent Now
                    </Button>
                  </div>
                </InfoWindow>
              )}
            </GoogleMap>
          )}
          {/* MORPHING DIALOG */}
          <div className={`custom-dialog ${openDialog ? 'open' : 'close'}`}>
            <div className={`dialog-content ${openDialog ? 'open' : 'close'}`}>
              <div className="dialog-header">
                <div>
                  Tell us when would you like your spot to be available and we
                  will show you the best spots for your needs
                </div>
                <IconButton
                  onClick={handleDialogCloseNoPreferences}
                  style={{ width: '30px', height: '30px' }}
                >
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
                  <div className="timePickerContainer">
                    <div>
                      <p style={{ textAlign: 'center', fontSize: '25px' }}>
                        Start Time
                      </p>
                      <DatePicker
                        title={startTime}
                        selected={startTime}
                        onChange={(date) => setStartTime(date)}
                        showTimeSelect
                        showTimeSelectOnly
                        timeIntervals={10}
                        timeCaption="Time"
                        dateFormat="HH:mm"
                      />
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        flexDirection: 'column',
                      }}
                    >
                      <p
                        style={{
                          textAlign: 'center',
                          fontSize: '25px',
                        }}
                      >
                        End Time
                      </p>
                      <DatePicker
                        selected={endTime}
                        onChange={(date) => setEndTime(date)}
                        showTimeSelect
                        showTimeSelectOnly
                        timeIntervals={10}
                        timeCaption="Time"
                        dateFormat="HH:mm"
                        minTime={getMinEndTime()}
                        maxTime={new Date().setHours(23, 59, 59, 999)}
                      />
                    </div>
                  </div>
                  <div style={{ display: 'block' }}>
                    <p style={{ textAlign: 'center', fontSize: '25px' }}>
                      {' '}
                      DATE
                    </p>
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
                    style={{ color: 'green', fontWeight: '700' }}
                  >
                    Find your perfect fit
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* BUBBLE */}

          <div className={`${errorRent ? 'shrink-animation' : ''}`}></div>
          <Tooltip
            title={'spot preferences '}
            className={`bubbleToolTip ${openDialog ? 'open' : 'close'} `}
            arrow
            placement="top"
          >
            <div
              className={`bubble ${openDialog ? 'open' : 'close'} `}
              onClick={handleBubbleClick}
            >
              <FaSearch color="white" size={30} />
            </div>
          </Tooltip>

          {error && (
            <div
              style={{
                position: 'fixed',
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
              <IconButton
                onClick={handleErrorClose}
                style={{ width: '30px', height: '30px' }}
              >
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
                    Please verify that the details of your order are correct We
                    will not issue a refund if you do not use the parking spot
                    during the paid period.{' '}
                  </h3>
                  <p>
                    You will rent the {selectedSpot.address} spot on{' '}
                    {selectedStartDate.toLocaleDateString()} from{' '}
                    {startTime ? (
                      <>
                        {startTime.toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit',
                          hour12: true,
                        })}
                      </>
                    ) : (
                      <>'Not selected'</>
                    )}
                    {' to '}
                    {endTime ? (
                      <>
                        {endTime.toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit',
                          hour12: true,
                        })}
                      </>
                    ) : (
                      <>Not selected</>
                    )}{' '}
                    for 0.30 RON/minute
                  </p>
                </div>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleDialogCloseConfirmation}>Cancel</Button>
                <Button onClick={handleClickRedirect}>
                  Pay & see directions
                </Button>
              </DialogActions>
            </Dialog>
          )}
          {errorRent && (
            <div
              style={{
                position: 'fixed  ',
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
                {errorRent}
              </div>
              <IconButton
                onClick={handleErrorRentClose}
                style={{ width: '30px', height: '30px' }}
              >
                <CloseIcon />
              </IconButton>
            </div>
          )}
          {showConfetti && (
            <Confetti
              width={window.innerWidth}
              height={window.innerHeight * 1.2}
              numberOfPieces={600}
              recycle={false}
              origin={{ x: 0, y: 1 }}
              gravity={1}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default RentSpot;
