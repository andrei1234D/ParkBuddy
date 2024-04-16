import React, { useState, useEffect, useContext } from 'react';
import '../style/LendASpot.css';
import { FaSearch } from 'react-icons/fa'; // Import the FaSearch icon
import axios from 'axios';

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

function RentSpot() {
  const [marker, setMarker] = useState(null);
  const [address, setAddress] = useState(''); // Define setAddress state

  const { translate, username } = useContext(GlobalStatesContext);

  const navigate = useNavigate();
  useEffect(() => {
    initMap();
  }, []); // Empty dependency array to ensure it only runs once on component mount

  // Initialize Google Maps
  const initMap = async () => {
    const mapInstance = new window.google.maps.Map(
      document.getElementById('map'),
      {
        center: { lat: 44.415573973386864, lng: 26.102983712003493 }, // Initial center (Bucharest)
        zoom: 11,
        styles: mapStyles,
        fullscreenControl: false,
      }
    );

    // Fetch data from backend
    try {
      const response = await axios.get('http://localhost:5000/Rent-A-Spot');
      const parkingSpots = response.data;

      // Iterate over parking spots and place markers
      parkingSpots.forEach((spot) => {
        const location = { lat: spot.latitude, lng: spot.longitude };
        const marker = new window.google.maps.Marker({
          position: location,
          map: mapInstance,
          draggable: true,
          icon: {
            url: markerImage, // Set marker icon
            scaledSize: new window.google.maps.Size(70, 70), // Resize marker icon
          },
          animation: window.google.maps.Animation.DROP, // Add animation
          title: spot.address,
        });
        marker.addListener('click', () => {
          // Redirect user to Google Maps directions for this location
          window.location.href = `https://www.google.com/maps/dir/?api=1&destination=${location.lat},${location.lng}`;
        });
      });
    } catch (error) {
      console.error('Error fetching parking spots:', error);
    }

    // Initialize Places Autocomplete
    const input = document.getElementById('searchInput');
    const autocomplete = new window.google.maps.places.Autocomplete(input);
    autocomplete.bindTo('bounds', mapInstance);

    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();

      const reverseGeocode = (location) => {
        const geocoder = new window.google.maps.Geocoder();
        geocoder.geocode({ location: location }, (results, status) => {
          if (status === 'OK' && results[0]) {
            setAddress(results[0].formatted_address); // Update address
          } else {
            setAddress(''); // Reset address
          }
        });
      };

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

  const handleRedirect = () => {
    navigate('/');
  };

  return (
    <div>
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
    </div>
  );
}

export default RentSpot;
