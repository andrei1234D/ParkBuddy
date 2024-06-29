import React, { useState, useContext } from 'react';
import '../style/Register.css';

import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import customer from '../images/customerLight.png';
import customerDark from '../images/customerDark.png';
import partner from '../images/vipDark.png';
import partnerDark from '../images/vipLight.png';

import GlobalStatesContext from '../context/GlobalStatesContext';

//REACT MUI
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';

import { IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

import api from '../api.js';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [carPlate, setCarPlate] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');

  const [error, setError] = useState('');

  const [isRegisterNormalPressed, setIsRegisterNormalPressed] = useState(null);
  const [showDialog, setShowDialog] = useState(false);
  const [showDialogRedirect, setShowDialogRedirect] = useState(false);
  const [dialogText, setDialogText] = useState('');
  const { isDarkMode, translate } = useContext(GlobalStatesContext);
  const navigate = useNavigate();

  const regexCarPlate = /^[A-Z]{2}-\d{2}-[A-Z]{3}$/;
  const regexPassword = /[!@#$%^&*]/;
  const regexEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  const handleRegister = async () => {
    let role;

    isRegisterNormalPressed ? (role = 'customer') : (role = 'partner');

    try {
      if (password && username && carPlate && firstName && lastName && email) {
        if (password.length < 7 || !regexPassword.test(password)) {
          setDialogText(translate('passwordVerify'));
          setShowDialog(true);
          return;
        }
        if (username.length < 5) {
          setDialogText(translate('userLength'));
          setShowDialog(true);
          return;
        }
        if (!regexCarPlate.test(carPlate)) {
          setDialogText(translate('carPlateError'));
          setShowDialog(true);
          return;
        }
        if (!regexEmail.test(email)) {
          setDialogText(translate('emailError'));
          setShowDialog(true);
          return;
        }

        // Make a POST request to your server for user registration
        const response = await api.post('/register', {
          firstName,
          lastName,
          carPlate,
          email,
          username,
          password,
          role,
        });

        // Successful registration
        setDialogText(
          translate('registrationSuccessful') + '\n' + translate('emailSent')
        );
        setShowDialogRedirect(true);
      } else {
        setError(translate('fillAllError'));
      }
    } catch (error) {
      console.error('Registration failed:', error.response.data.message);
      setDialogText(translate('userAlreadyExists'));
      setShowDialog(true);
    }
  };

  const handleCloseDialog = () => {
    setShowDialog(false);
  };
  const handleCloseDialogRedirect = () => {
    setShowDialogRedirect(false);
  };
  const handleRedirect = () => {
    navigate('/login');
  };
  const partnerClick = () => {
    setIsRegisterNormalPressed(false);
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };
  const customerClick = () => {
    setIsRegisterNormalPressed(true);
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const handleCarPlateChange = (e) => {
    let input = e.target.value.toUpperCase().replace(/-/g, '');

    if (input.length > 2) {
      input = input.slice(0, 2) + '-' + input.slice(2);
    }
    if (input.length > 5) {
      input = input.slice(0, 5) + '-' + input.slice(5);
    }

    setCarPlate(input);
  };
  const handleErrorClose = () => {
    setError('');
  };

  return (
    <div className="biggestDiv">
      <Dialog open={showDialog} onClose={handleCloseDialog}>
        <DialogTitle
          style={{ backgroundColor: 'var(--UIColor)', color: 'var(--UIText)' }}
        >
          Error
        </DialogTitle>
        <DialogContent
          style={{ backgroundColor: 'var(--UIColor)', color: 'var(--UIText)' }}
        >
          <p>{dialogText}</p>
        </DialogContent>
        <DialogActions
          style={{ backgroundColor: 'var(--UIColor)', color: 'var(--UIText)' }}
        >
          <Button onClick={handleCloseDialog}>Close</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={showDialogRedirect} onClose={handleCloseDialogRedirect}>
        <DialogTitle
          style={{ backgroundColor: 'var(--UIColor)', color: 'var(--UIText)' }}
        >
          Congratulations your account is ready
        </DialogTitle>
        <DialogContent
          style={{
            backgroundColor: 'var(--UIColor)',
            color: 'var(--UIText)',
          }}
        >
          <p>{dialogText}</p>
        </DialogContent>
        <DialogActions
          style={{
            backgroundColor: 'var(--UIColor)',
            color: 'var(--UIText)',
            display: 'flex',
            justifyContent: 'space-around',
          }}
        >
          <Button onClick={handleCloseDialogRedirect}>Close</Button>
          <Button onClick={handleRedirect}>TO LOGIN</Button>
        </DialogActions>
      </Dialog>
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
            style={{ width: '25px', paddingLeft: '10px' }}
          >
            <CloseIcon />
          </IconButton>
        </div>
      )}
      <div id="bigContainer" style={{ borderRadius: '15%' }}>
        <div className="welcomeContainer">
          {isRegisterNormalPressed === null ? (
            <div className="containerLogin">
              <div className="customerDiv" onClick={customerClick}>
                <div className="imgDiv">
                  <img
                    src={isDarkMode ? customerDark : customer}
                    alt="customerImg"
                  />
                  <div className="bottomTextCustomer">
                    {translate('customer').toUpperCase()}
                  </div>
                </div>
              </div>
              <div className="partnerDiv" onClick={partnerClick}>
                <div className="imgDiv">
                  <img
                    src={isDarkMode ? partner : partnerDark}
                    alt="partnerImg"
                  />
                  <div className="bottomTextPartner ">
                    {translate('partner').toUpperCase()}
                  </div>
                </div>
              </div>
            </div>
          ) : isRegisterNormalPressed ? (
            //IF IT S TRUE

            <div className="formNormalAlign">
              <p
                style={{
                  color: '#097b5a',
                  fontSize: '3em',
                  textAlign: 'center',
                  textTransform: 'uppercase',
                  letterSpacing: '2px',
                }}
              >
                CUSTOMER REGISTER
              </p>
              <p className="textLogin">{translate('firstName')}</p>
              <input
                className="inputLogin"
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
              <p className="textLogin">{translate('lastName')}</p>
              <input
                className="inputLogin"
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
              <p className="textLogin">{translate('carPlate')}</p>
              <input
                className="inputLogin"
                type="text"
                value={carPlate}
                onChange={(e) => handleCarPlateChange(e)}
                placeholder="e.g., AB12CDE"
              />
              <p className="textLogin">{translate('email')}</p>
              <input
                className="inputLogin"
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <p className="textLogin">{translate('username')}</p>
              <input
                className="inputLogin"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <p className="textLogin">{translate('password')}</p>
              <input
                className="inputLogin"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <button
                type="button"
                style={{ fontWeight: '1000', fontSize: '25px' }}
                onClick={handleRegister}
                className="buttonLogin btn-gradient-border textGlow"
              >
                {translate('register')}
              </button>
              <div className="partnerIcon">
                <img
                  onClick={partnerClick}
                  src={isDarkMode ? partnerDark : partner}
                  style={{ width: '100%', height: '100%' }}
                  alt="customerImg"
                />
              </div>
            </div>
          ) : (
            //IF IT S FALSE
            <div className="formNormalAlign">
              <p
                style={{
                  color: '#097b5a',
                  fontSize: '3em',
                  textAlign: 'center',
                  textTransform: 'uppercase',
                  letterSpacing: '2px',
                }}
              >
                PARTNER REGISTER
              </p>
              <p className="textLogin">{translate('firstName')}</p>
              <input
                className="inputLogin"
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
              <p className="textLogin">{translate('lastName')}</p>
              <input
                className="inputLogin"
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
              <p className="textLogin">{translate('carPlate')}</p>
              <input
                className="inputLogin"
                type="text"
                value={carPlate}
                onChange={(e) => handleCarPlateChange(e)}
                placeholder="e.g., AB12CDE"
              />
              <p className="textLogin">{translate('email')}</p>
              <input
                className="inputLogin"
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <p className="textLogin">{translate('username')}</p>
              <input
                className="inputLogin"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <p className="textLogin">{translate('password')}</p>
              <input
                className="inputLogin"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <button
                type="button"
                style={{ fontWeight: '1000', fontSize: '25px' }}
                onClick={handleRegister}
                className="buttonLogin btn-gradient-border textGlow"
              >
                {translate('register')}
              </button>
              <div className="customerIcon">
                <img
                  onClick={customerClick}
                  src={isDarkMode ? customerDark : customer}
                  style={{ width: '100%', height: '100%' }}
                  alt="customerImg"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Register;
