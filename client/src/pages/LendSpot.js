import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { GoogleMap } from '@react-google-maps/api';
import GlobalStatesContext from '../context/GlobalStatesContext';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import { Stack, IconButton } from '@mui/material';
import LoadingSpinner from '../spinner/LoadingSpinner.js';
import Autocomplete from 'react-google-autocomplete';
import mapStyles from '../styleForMap/mapStyle.js';
import '../style/LendASpot.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CloseIcon from '@mui/icons-material/Close';

const mapContainerStyle = {
  width: '100vw',
  height: 'calc(100vh - 110px)',
};

const formatDate = (date) => {
  const d = new Date(date);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
    2,
    '0'
  )}-${String(d.getDate()).padStart(2, '0')}`;
};

const LendSpot = () => {
  const [selectedLocation, setSelectedLocation] = useState({
    lat: 44.415573973386864,
    lng: 26.102983712003493,
  });

  const [apiKey, setApiKey] = useState(null);
  const [map, setMap] = useState(null);
  const [spots, setSpots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedStartDate, setSelectedStartDate] = useState(new Date());
  const [selectedEndDate, setSelectedEndDate] = useState(new Date());
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [newSpot, setNewSpot] = useState(null);
  const [address, setAddress] = useState('');
  const [error, setError] = useState('');
  const [loginError, setLoginError] = useState(false); // New state for login error message

  const { translate, username, isLoggedIn, role } =
    useContext(GlobalStatesContext);
  const navigate = useNavigate();

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

  const geocodeLatLng = async (lat, lng) => {
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`
      );
      if (response.data.status === 'OK') {
        if (response.data.results[0]) {
          setAddress(response.data.results[0].formatted_address);
        } else {
          setAddress('No address found');
        }
      } else {
        setAddress('Geocoder failed due to: ' + response.data.status);
      }
    } catch (error) {
      console.error('Geocode error:', error);
      setAddress('Geocode error');
    }
  };

  const handleMapClick = (e) => {
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();
    setNewSpot({ lat, lng });
    geocodeLatLng(lat, lng);
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setNewSpot(null);
    setError('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (isLoggedIn && role === 'partner') {
      if (
        newSpot &&
        address &&
        selectedStartDate &&
        selectedEndDate &&
        startTime &&
        endTime
      ) {
        const formattedStartDate = formatDate(selectedStartDate);
        const formattedEndDate = formatDate(selectedEndDate);
        const parkingSpotData = {
          address,
          latitude: newSpot.lat,
          longitude: newSpot.lng,
          startTime,
          endTime,
          selectedStartDate: formattedStartDate,
          selectedEndDate: formattedEndDate,
        };
        console.log(parkingSpotData);
        try {
          const {
            latitude,
            longitude,
            address,
            startTime,
            endTime,
            selectedStartDate,
            selectedEndDate,
          } = parkingSpotData;
          const response = await axios.post(
            'http://localhost:5000/Lend-A-Spot',
            {
              latitude,
              longitude,
              address,
              startTime,
              endTime,
              selectedStartDate,
              selectedEndDate,
              username,
            }
          );
          setSpots([...spots, response.data]);
          setOpenDialog(false);
          setNewSpot(null);
          toast.success('Parking spot registered successfully!', {
            position: 'top-right',
            autoClose: 10000,
            closeOnClick: true,
          });
        } catch (error) {
          console.log(error);
          toast.error('Error registering parking spot!', {
            position: 'top-right',
            autoClose: 10000,
            closeOnClick: true,
          });
        }
      } else {
        setError('Please fill in all fields');
      }
    } else {
      setLoginError(true); // Show login error message
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

  const handleLoginErrorClose = () => {
    setLoginError(false);
  };

  const handleNavigateToLogin = () => {
    navigate('/login');
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
          onClick={handleMapClick}
        ></GoogleMap>
      )}
      <Dialog open={openDialog} onClose={handleDialogClose} fullScreen>
        <DialogTitle>{translate('Please_verify_the_address')}</DialogTitle>
        <DialogContent>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <label>{translate('pleaseVerify')}</label>
            <TextField
              multiline
              rows={3}
              type="text"
              id="address"
              value={address}
              InputProps={{
                readOnly: true,
              }}
            />
            <Stack
              direction="row"
              spacing={2}
              alignItems="center"
              justifyContent="center"
              style={{ marginTop: '5%' }}
            >
              <TextField
                id="startTime"
                label="Daily Start Time"
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <TextField
                id="endTime"
                label="Daily End Time"
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Stack>
            <Stack
              direction="row"
              spacing={2}
              alignItems="center"
              justifyContent="center"
              style={{ marginTop: '5%' }}
            >
              <DatePicker
                selected={selectedStartDate}
                onChange={(date) => setSelectedStartDate(date)}
                selectsStart
                startDate={selectedStartDate}
                endDate={selectedEndDate}
                placeholderText="Start Date"
              />
              <DatePicker
                selected={selectedEndDate}
                onChange={(date) => setSelectedEndDate(date)}
                selectsEnd
                startDate={selectedStartDate}
                endDate={selectedEndDate}
                minDate={selectedStartDate}
                placeholderText="End Date"
              />
            </Stack>
          </div>
        </DialogContent>
        <DialogActions
          style={{ display: 'flex', justifyContent: 'space-around' }}
        >
          <Button onClick={handleDialogClose}>Repick</Button>
          <Button onClick={handleSubmit}>Register Spot</Button>
        </DialogActions>
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
        {loginError && (
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
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <div variant="h6" style={{ marginBottom: '10px' }}>
              You need to log in with a partner account before you can lend
              spots.
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-around',
                width: '100%',
              }}
            >
              <Button onClick={handleLoginErrorClose}>Nevermind</Button>
              <Button onClick={handleNavigateToLogin}>Take me there</Button>
            </div>
          </div>
        )}
      </Dialog>
    </div>
  );
};

export default LendSpot;
