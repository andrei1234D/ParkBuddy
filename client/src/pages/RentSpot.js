import React, { useState, useEffect, useContext, useRef } from 'react';
import '../style/RentASpot.css';
import LoadingSpinner from '../spinner/LoadingSpinner.js';
import { FaSearch } from 'react-icons/fa';
import axios from 'axios';

import mapStyles from '../styleForMap/mapStyle';
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
import { CircularProgress, Stack } from '@mui/material';

function RentSpot() {
  const [address, setAddress] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [openDialogOptions, setOpenDialogOptions] = useState(true);
  const [selectedSpot, setSelectedSpot] = useState(null);
  const [selectedStartDate, setSelectedStartDate] = useState(null);
  const [startTime, setStartTime] = useState(null); // State for selected start time
  const [endTime, setEndTime] = useState(null); // State for selected end time
  const [loading, setLoading] = useState(true);
  const { translate, username } = useContext(GlobalStatesContext);
  const autoCompleteRef = useRef();
  const autoCompleteDialogRef = useRef();
  const inputRef = useRef();
  const inputDialogRef = useRef(null);
  const mapRef = useRef(null);
  const navigate = useNavigate(null);
  const [mapInstance, setMap] = useState(null)

  useEffect(() => {
      initMap();
      fetchAvailableParkingSpots();
  }, []);

  const initMap = async () => {
    console.log("Here")
    const mapInstanceCurrent = new window.google.maps.Map(
      mapRef.current,
      {
        center: { lat: 44.415573973386864, lng: 26.102983712003493 },
        zoom: 11,
        styles: mapStyles,
        fullscreenControl: false,
      }
    );

    setMap(mapInstanceCurrent)

    console.log({mapInstance})

    autoCompleteDialogRef.current = new window.google.maps.places.Autocomplete(
      inputDialogRef.current
    );
    autoCompleteRef.current = new window.google.maps.places.Autocomplete(
      inputRef.current
    );
    //
    

    const inputDialog = document.getElementById('searchInputDialog');
    const autocompleteDialog = new window.google.maps.places.Autocomplete(
      inputDialog
    );

    autocompleteDialog.addListener('place_changed', () => {
      const place = autocompleteDialog.getPlace();

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

      if (!place.geometry) {
        window.alert("No details available for input: '" + place.name + "'");
        return;
      }

      if (place.geometry.viewport) {
        mapInstance.fitBounds(place.geometry.viewport);
      } else {
        mapInstance.setCenter(place.geometry.location);
        mapInstance.setZoom(17);
      }

      reverseGeocode(place.geometry.location);
    });
    const input = document.getElementById('searchInput');
    const autocomplete = new window.google.maps.places.Autocomplete(input);

    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();

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

      if (!place.geometry) {
        window.alert("No details available for input: '" + place.name + "'");
        return;
      }

      if (place.geometry.viewport) {
        mapInstance.fitBounds(place.geometry.viewport);
      } else {
        mapInstance.setCenter(place.geometry.location);
        mapInstance.setZoom(17);
      }

      reverseGeocode(place.geometry.location);
    });
  };

  console.log(mapInstance)

  const fetchAvailableParkingSpots = async () => {
    try {
      const response = await axios.get('http://localhost:3000/Get-Spots');
      const parkingSpots = response.data;
      parkingSpots.forEach((spot) => {
        const location = { lat: spot.latitude, lng: spot.longitude };
        const marker = new window.google.maps.Marker({
          position: location,
          map: mapInstance,
          draggable: true,
          icon: {
            url: markerImage,
            scaledSize: new window.google.maps.Size(70, 70),
          },
          animation: window.google.maps.Animation.DROP,
          title: spot.address,
        });
        //on Marker Click (for the redirect to google directions)
        marker.addListener('click', () => {
          handleOpenDialog(spot);
          console.log(spot);
        });
      });
      setLoading(false);
    } catch (error) {
      console.error('Error fetching parking spots:', error);
    }
  };
  const fetchAvailableParkingSpotsOptions = async () => {
    let startRentTime = startTime;
    let endRentTime = endTime;
    let selectedDate = selectedStartDate;
    try {
      const response = await axios.post('http://localhost:5000/Rent-A-Spot', {
        startRentTime,
        endRentTime,
        selectedDate,
        username,
      });
      const parkingSpots = response.data;

      parkingSpots.forEach((spot) => {
        const location = { lat: spot.latitude, lng: spot.longitude };
        const marker = new window.google.maps.Marker({
          position: location,
          map: mapInstance,
          draggable: true,
          icon: {
            url: markerImage,
            scaledSize: new window.google.maps.Size(70, 70),
          },
          animation: window.google.maps.Animation.DROP,
          title: spot.address,
        });
        marker.addListener('click', () => {
          handleOpenDialog(spot);
          console.log(spot);
        });
      });
    } catch (error) {
      console.error('Error fetching parking spots:', error);
    }
  };

  const handleRedirect = () => {
    navigate('/');
  };

  const handleOpenDialog = (spot) => {
    setSelectedSpot(spot);
    setOpenDialog(true);
  };
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };
  const handleCloseDialogOptions = () => {
    setOpenDialogOptions(false);
  };

  //On marker click
  const handleRentSpot = async () => {
    if (selectedSpot) {
      try {
        handleCloseDialog(); // Close the dialog
        const { latitude, longitude } = selectedSpot;
        const url = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
        window.location.href = url;
      } catch (error) {
        console.error('Error renting spot:', error);
        // Handle any errors, such as displaying an error message to the user
      }
    }
  };
  const handleSortParkings = async () => {
    setOpenDialogOptions(false);
    fetchAvailableParkingSpotsOptions();
  };

 
    return (
      <div>
        {/* Dialog for page entry */}
        <Dialog
          open={openDialogOptions}
          onClose={handleCloseDialogOptions}
          style={{ zIndex: '99' }}
        >
          <DialogTitle style={{ alignSelf: 'center' }}>
            Please fill the requirements
          </DialogTitle>
          <DialogContent>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <p>Please select the place you want your parking to be at !</p>
              <input
                id="searchInputDialog"
                type="text"
                placeholder="Search..."
                style={{
                  position: 'relative',
                  top: '10%',
                  zIndex: '99',
                  width: '98%',
                  height: '40px',
                  paddingRight: '25px',
                  fontSize: '20px',
                }}
                ref={inputDialogRef}
              />
              <p>Please select when you want your spot to be available at !</p>
              <div style={{ alignSelf: 'center' }}>
                <DatePicker
                  selected={selectedStartDate}
                  onChange={(date) => setSelectedStartDate(date)}
                  placeholderText="Date"
                />
              </div>
              <Stack
                direction="row"
                spacing={2}
                alignItems="center"
                justifyContent="center"
                style={{ marginTop: '5%' }}
              >
                <p>From</p>
                <TextField
                  id="startTime"
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
                <p>Until</p>
                <TextField
                  id="endTime"
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Stack>
            </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialogOptions} color="primary">
              Close
            </Button>
            <Button onClick={handleSortParkings} color="primary">
              Confirm
            </Button>
          </DialogActions>
        </Dialog>

        {/* Dialog for confirmation renting*/}
        <Dialog open={openDialog} onClose={handleCloseDialog}>
          <DialogTitle>Rent this spot?</DialogTitle>
          <DialogContent>
            {selectedSpot && (
              <div>
                <p>{selectedSpot.address}</p>
                {/* Add any other details of the selected spot */}
              </div>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} color="primary">
              No
            </Button>
            <Button onClick={handleRentSpot} color="primary">
              Yes
            </Button>
          </DialogActions>
        </Dialog>
        <div style={{ position: 'relative' }}>
          <input
            id="searchInput"
            type="text"
            placeholder="Search..."
            style={{
              position: 'relative',
              top: '10%',
              zIndex: '1',
              width: '98%',
              height: '40px',
              paddingRight: '25px',
              fontSize: '20px',
            }}
            ref={inputRef}
          />
          <FaSearch
            style={{
              position: 'absolute',
              top: '20px',
              right: '1%',
              transform: 'translateY(-50%)',
              color: '#555',
              zIndex: '2',
            }}
          />
        </div>
        <div style={{ height: '100vh', width: '100vw' }} ref={mapRef}></div>
      </div>
    );
}

export default RentSpot;
