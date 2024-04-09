import React, { useState, useEffect, useContext } from 'react';
import '../style/LendASpot.css';
import { FaSearch } from 'react-icons/fa'; // Import the FaSearch icon
import axios from 'axios';

import Confetti from 'react-confetti'; // Import the confetti library
import mapStyles from '../styleForMap/mapStyle';
import markerImage from '../images/marker1.png';
import GlobalStatesContext from '../context/GlobalStatesContext';
import { useNavigate } from 'react-router-dom';

// React MUI
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';

function LendSpot() {
  const [marker, setMarker] = useState(null);
  const [address, setAddress] = useState('');
  const [showDialogRedirect, setShowDialogRedirect] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false); // State to control confetti
  const { translate, username } = useContext(GlobalStatesContext);

  const navigate = useNavigate();
  useEffect(() => {
    initMap();
  }, []); // Empty dependency array to ensure it only runs once on component mount

  // Initialize Google Maps
  const initMap = () => {
    const mapInstance = new window.google.maps.Map(
      document.getElementById('map'),
      {
        center: { lat: 44.415573973386864, lng: 26.102983712003493 }, // Initial center (Bucharest)
        zoom: 11,
        styles: mapStyles,
        fullscreenControl: false,
      }
    );

    // Add click event listener to the map
    mapInstance.addListener('click', (event) => {
      placeMarker(event.latLng, mapInstance);
    });

    // Initialize Places Autocomplete
    const input = document.getElementById('searchInput');
    const autocomplete = new window.google.maps.places.Autocomplete(input);
    autocomplete.bindTo('bounds', mapInstance);

    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      if (!place.geometry) {
        window.alert("No details available for input: '" + place.name + "'");
        return;
      }

      if (place.geometry.viewport) {
        mapInstance.fitBounds(place.geometry.viewport);
      } else {
        mapInstance.setCenter(place.geometry.location);
        mapInstance.setZoom(17); // Zoom in to an appropriate level when searching by place name
      }

      reverseGeocode(place.geometry.location);
    });
  };

  const placeMarker = (location, map) => {
    const newMarker = new window.google.maps.Marker({
      position: location,
      map: map,
      draggable: true,
      icon: {
        url: markerImage, // Set marker icon
        scaledSize: new window.google.maps.Size(70, 70), // Resize marker icon
      },
      animation: window.google.maps.Animation.DROP,
    });

    // Set new marker
    setMarker(newMarker);

    // Reverse geocode to get address
    reverseGeocode(location);
    setShowDialogRedirect(true);
  };

  // Function to reverse geocode and get address
  const reverseGeocode = (location) => {
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ location: location }, (results, status) => {
      if (status === 'OK' && results[0]) {
        setAddress(results[0].formatted_address);
      } else {
        setAddress('');
      }
    });
  };

  // Function to handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (marker && address) {
      const parkingSpotData = {
        latitude: marker.getPosition().lat(),
        longitude: marker.getPosition().lng(),
        address: address,
      };
      try {
        let latitude = parkingSpotData.latitude;
        let longitude = parkingSpotData.longitude;
        let address = parkingSpotData.address;
        const response = await axios.post('http://localhost:5000/Lend-A-Spot', {
          latitude,
          longitude,
          address,
          username,
        });
      } catch (error) {
        console.log(error);
      }

      console.log(parkingSpotData);

      // Show confetti
      setShowConfetti(true);
      // Reset marker after form submission
      setShowDialogRedirect(false);

      // Hide confetti after 3 seconds
      setTimeout(() => {
        setShowConfetti(false);
        handleRedirect();
      }, 4000);
    }
  };

  const handleCloseDialogRedirect = () => {
    setShowDialogRedirect(false);
    marker.setMap(null); // Remove the marker from the map
    setMarker(null); // Reset marker state
  };

  const handleRedirect = () => {
    navigate('/');
  };

  return (
    <div>
      <Dialog open={showDialogRedirect} onClose={handleCloseDialogRedirect}>
        <DialogTitle>{translate('Please_verify_the_address')}</DialogTitle>
        <DialogContent>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <label
              multiline
              rows={3}
              type="text"
              InputProps={{
                readOnly: true,
              }}
            >
              {translate('pleaseVerify')}
            </label>
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-around',
              }}
            >
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

              <Button onClick={handleSubmit} disabled={!marker}>
                Save Parking Spot
              </Button>
            </div>
          </div>
        </DialogContent>
        <DialogActions
          style={{
            display: 'flex',
            justifyContent: 'space-around',
          }}
        >
          <Button onClick={handleCloseDialogRedirect}>Repick</Button>
        </DialogActions>
      </Dialog>
      <div style={{ position: 'relative' }}>
        <input
          id="searchInput"
          type="text"
          placeholder="Search..."
          style={{
            position: 'absolute',
            top: '10%',
            left: '25%',
            zIndex: '1',
            width: '378px',
            height: '40px',
            paddingRight: '25px',
            fontSize: '20px',
          }}
        />
        <FaSearch
          style={{
            position: 'absolute',
            top: '20px', // Adjust position to vertically center the icon
            right: '48%', // Adjust to position the icon to the right
            transform: 'translateY(-50%)', // Center the icon vertically
            color: '#555', // Adjust icon color if needed
            zIndex: '2', // Ensure the icon is above the input field
          }}
        />
      </div>
      <div id="map" style={{ height: '100vh', width: '100vw' }}></div>
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
      {/* Render confetti if showConfetti is true */}
    </div>
  );
}

export default LendSpot;
