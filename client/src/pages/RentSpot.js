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
      const timer = setTimeout(() => {
        setShowConfetti(false);
      }, 3000);

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
    toast.success(translate('Browsing_without_any_filters_applied'), {
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
      setErrorRent(translate('Please_specify_your_rental_start_and_end_times'));
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
        toast.success(translate('Filters_Applied'), {
          position: 'top-right',
          autoClose: 10000,
          closeButton: false,
          closeOnClick: true,
        });
      } catch (error) {
        console.error('Error renting spot:', error);
        toast.error(translate('Error_applying_filters'), {
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
  function translateStatus(status) {
    switch (status) {
      case 'free':
        return translate('free');
      case 'unavailable':
        return translate('unavailable');
      case 'occupied':
        return translate('occupied');
      default:
        return status; // If no translation is found, return the status itself
    }
  }
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
            placeholder={translate('Search_for_a_location')}
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
                    <p>
                      {translate('status')}{' '}
                      {translateStatus(selectedSpot.status)} {translate('now')}
                    </p>
                    <p>{translate('price')}: 0.30LEI pe minut</p>
                    <p>
                      {translate('owner')}: {selectedSpot.username}
                    </p>
                    <p>{translate('Phone_Number')}: 0721985898</p>
                    <p>
                      {translate('Rating')}: 5/5{' '}
                      <span className="star">&#9733;</span>
                    </p>
                    <Button onClick={handleDialogConfirmationOpen}>
                      {translate('Rent_Now')}
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
                  {translate(
                    'Tell_us_when_would_you_like_your_spot_to_be_available_and_we_will_show_you_the_best_spots_for_your_needs'
                  )}
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
                        {translate('Start_Time')}
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
                        {translate('End_Time')}
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
                      {translate('DATE')}
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
                    {translate('Browse_all_spots')}
                  </Button>
                  <Button
                    onClick={handlePreferencesClick}
                    style={{ color: 'green', fontWeight: '700' }}
                  >
                    {translate('Find_your_perfect_fit')}
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* BUBBLE */}

          <div className={`${errorRent ? 'shrink-animation' : ''}`}></div>
          <Tooltip
            title={translate('spot_preferences')}
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
              <DialogTitle>{translate('You_Are_Almost_There')}</DialogTitle>
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
                    {translate(
                      'Please_verify_that_the_details_of_your_order_are_correct_We_will_not_issue_a_refund_if_you_do_not_use_the_parking_spot_during_the_paid_period'
                    )}
                  </h3>
                  <p>
                    {translate('You_will_rent_the')} {selectedSpot.address}{' '}
                    {translate('spot_on')}{' '}
                    {selectedStartDate.toLocaleDateString()} {translate('from')}{' '}
                    {startTime ? (
                      <>
                        {startTime.toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit',
                          hour12: true,
                        })}
                      </>
                    ) : (
                      <>'{translate('Not_selected')}'</>
                    )}{' '}
                    {translate('to')}{' '}
                    {endTime ? (
                      <>
                        {endTime.toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit',
                          hour12: true,
                        })}
                      </>
                    ) : (
                      <>{translate('Not_selected')}</>
                    )}{' '}
                    {translate('for')} 0.30 RON/{translate('minute')}
                  </p>
                </div>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleDialogCloseConfirmation}>
                  {translate('Cancel')}
                </Button>
                <Button onClick={handleClickRedirect}>
                  {translate('Pay_and_see_directions')}
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
