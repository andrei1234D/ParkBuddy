import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { GoogleMap, Marker, InfoWindow } from '@react-google-maps/api';
import { FaSearch } from 'react-icons/fa';
import markerImage from '../images/marker1.png';
import GlobalStatesContext from '../context/GlobalStatesContext';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import LoadingSpinner from '../spinner/LoadingSpinner.js';
import Autocomplete from 'react-google-autocomplete';
import mapStyles from '../styleForMap/mapStyle.js';
import '../style/RentASpot.css';
const mapContainerStyle = {
  width: '100%',
  height: '100vh',
};

const center = {
  lat: 44.415573973386864,
  lng: 26.102983712003493,
};

const RentSpot = () => {
  const [map, setMap] = useState(null);
  const [spots, setSpots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSpot, setSelectedSpot] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedStartDate, setSelectedStartDate] = useState(new Date());
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const { translate, username } = useContext(GlobalStatesContext);
  const [infoWindowPosition, setInfoWindowPosition] = useState(null);
  const [infoWindowOpen, setInfoWindowOpen] = useState(false);

  const [selectedLocation, setSelectedLocation] = useState({
    lat: 44.415573973386864,
    lng: 26.102983712003493,
  });
  const navigate = useNavigate();

  useEffect(() => {
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
    return () => {
      const elementsToHide = document.querySelectorAll(
        '.gm-style-iw-t, .gm-style-iw-tc, .gm-ui-hover-effect,.gm-style-iw-a,button[tabindex="0"]'
      );
      elementsToHide.forEach((element) => {
        element.style.display = 'none';
      });
    };
  }, []);
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

  const handleMarkerExit = () => {
    setSelectedSpot(null);
    setInfoWindowPosition(null);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
  };
  const handleDialogOpen = () => {
    setOpenDialog(true);
  };
  const handleInfoWindowClose = () => {
    setSelectedSpot(null);
    setInfoWindowOpen(false);
  };

  const handleRentButtonClick = async () => {
    try {
      const response = await axios.post('http://localhost:5000/Rent-A-Spot', {
        startRentTime: startTime,
        endRentTime: endTime,
        selectedDate: selectedStartDate,
        username,
      });
      navigate(response.data.directionsUrl);
    } catch (error) {
      console.error('Error renting spot:', error);
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
  return (
    <div>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          zoom={11}
          center={selectedLocation}
          options={{ styles: mapStyles, fullscreenControl: false }}
          onLoad={(map) => setMap(map)}
        >
          {map && (
            <Autocomplete
              apiKey="AIzaSyAbdrtMH-j0086-Itq7lKIhtdviyAPA4fQ"
              onPlaceSelected={handlePlaceSelect}
              options={{
                componentRestrictions: { country: 'ro' },
              }}
              style={{ width: '100%', position: 'absolute', zIndex: '100' }}
            />
          )}

          {spots.map((spot) => (
            <Marker
              map={map}
              key={spot.id}
              position={{ lat: spot.latitude, lng: spot.longitude }}
              onClick={() => {
                handleMarkerClick(spot);
              }}
              onCloseClick={handleMarkerExit}
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
                <p>Availability: {selectedSpot.availability.length}</p>
                <p>Price: the most you are willing to pay.</p>
                <p>Owner: {selectedSpot.username}</p>
                <p>Phone Number: 0721985898</p>
                <Button onClick={handleDialogOpen}>Rent Now</Button>
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      )}

      <Dialog open={openDialog} onClose={handleDialogClose} fullScreen={true}>
        <DialogTitle>{selectedSpot ? selectedSpot.name : ''}</DialogTitle>
        <DialogContent>
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
          <DatePicker
            selected={selectedStartDate}
            onChange={(date) => setSelectedStartDate(date)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button onClick={handleRentButtonClick}>Pay&Go</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default RentSpot;
