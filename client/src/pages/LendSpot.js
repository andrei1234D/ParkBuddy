import React, { useState, useEffect } from 'react';

function LendSpot() {
  const [marker, setMarker] = useState(null);
  const [address, setAddress] = useState('');

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
        styles: [
          { elementType: 'geometry', stylers: [{ color: '#242f3e' }] },
          {
            elementType: 'labels.text.stroke',
            stylers: [{ color: '#242f3e' }],
          },
          { elementType: 'labels.text.fill', stylers: [{ color: '#746855' }] },
          {
            featureType: 'administrative.locality',
            elementType: 'labels.text.fill',
            stylers: [{ color: '#d59563' }],
          },
          {
            featureType: 'poi',
            elementType: 'labels.text.fill',
            stylers: [{ color: '#d59563' }],
          },
          {
            featureType: 'poi.park',
            elementType: 'geometry',
            stylers: [{ color: '#263c3f' }],
          },
          {
            featureType: 'poi.park',
            elementType: 'labels.text.fill',
            stylers: [{ color: '#6b9a76' }],
          },
          {
            featureType: 'road',
            elementType: 'geometry',
            stylers: [{ color: '#38414e' }],
          },
          {
            featureType: 'road',
            elementType: 'geometry.stroke',
            stylers: [{ color: '#212a37' }],
          },
          {
            featureType: 'road',
            elementType: 'labels.text.fill',
            stylers: [{ color: '#9ca5b3' }],
          },
          {
            featureType: 'road.highway',
            elementType: 'geometry',
            stylers: [{ color: '#746855' }],
          },
          {
            featureType: 'road.highway',
            elementType: 'geometry.stroke',
            stylers: [{ color: '#1f2835' }],
          },
          {
            featureType: 'road.highway',
            elementType: 'labels.text.fill',
            stylers: [{ color: '#f3d19c' }],
          },
          {
            featureType: 'transit',
            elementType: 'geometry',
            stylers: [{ color: '#2f3948' }],
          },
          {
            featureType: 'transit.station',
            elementType: 'labels.text.fill',
            stylers: [{ color: '#d59563' }],
          },
          {
            featureType: 'water',
            elementType: 'geometry',
            stylers: [{ color: '#17263c' }],
          },
          {
            featureType: 'water',
            elementType: 'labels.text.fill',
            stylers: [{ color: '#515c6d' }],
          },
          {
            featureType: 'water',
            elementType: 'labels.text.stroke',
            stylers: [{ color: '#17263c' }],
          },
        ],
      }
    );

    // Add click event listener to the map
    mapInstance.addListener('click', (event) => {
      placeMarker(event.latLng, mapInstance);
    });
  };

  // Function to place marker on the map
  // Function to place marker on the map
  const placeMarker = (location, map) => {
    if (marker) {
      marker.setPosition(location);
    } else {
      const newMarker = new window.google.maps.Marker({
        position: location,
        map: map,
        draggable: true,
      });
      setMarker(newMarker);
    }
    // Reverse geocode to get address
    reverseGeocode(location);
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
  const handleSubmit = (event) => {
    event.preventDefault();
    if (marker && address) {
      const parkingSpotData = {
        latitude: marker.getPosition().lat(),
        longitude: marker.getPosition().lng(),
        address: address,
      };
      // Send parking spot data to backend
      // You can use fetch or axios to make a POST request to your backend API
      console.log(parkingSpotData);
    }
  };

  return (
    <div>
      <h1>Find a Free Parking Spot</h1>
      <div id="map" style={{ height: '100vh', width: '100vw' }}></div>
      <form onSubmit={handleSubmit}>
        <label htmlFor="address">Enter Address:</label>
        <input type="text" id="address" value={address} readOnly />
        <button type="submit" disabled={!marker}>
          Save Parking Spot
        </button>
      </form>
    </div>
  );
}

export default LendSpot;
