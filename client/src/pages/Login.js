import React, { useState, useContext } from 'react';

import axios from 'axios';
import '../style/Login.css';
import carImg from '../images/parkImage.png';
import carImgDarkMode from '../images/parkImageDarkMode.png';
import customer from '../images/customerLight.png';
import customerDark from '../images/customerDark.png';
import partner from '../images/vipDark.png';
import partnerDark from '../images/vipLight.png';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

//language translate imports
import GlobalStatesContext from '../context/GlobalStatesContext';

//REACT MUI
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';

const Login = () => {
  const { translate, toggleLogin } = useContext(GlobalStatesContext);
  const { isDarkMode } = useContext(GlobalStatesContext);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [dialogText, setDialogText] = useState('');
  const [showDialog, setShowDialog] = useState(false);
  const [isRegisterNormalPressed, setIsRegisterNormalPressed] = useState(null);
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

  const navigate = useNavigate();

  const handleLogin = async () => {
    let role;
    isRegisterNormalPressed ? (role = 'customer') : (role = 'partner');
    try {
      // Make a POST request to your server for user login
      const response = await axios.post('http://localhost:5000/login', {
        username,
        password,
        role,
      });
      const token = response.data.token;
      const firstName = response.data.firstName;
      const email = response.data.email;

      const decodedToken = jwtDecode(token);
      toggleLogin(decodedToken, firstName, email);
      navigate('/');
    } catch (error) {
      if (error.response.data.message === 'User not found') {
        setDialogText(translate('userNotFound'));
        setShowDialog(true);
      } else {
        setDialogText(translate('incorrectUserPass'));
        setShowDialog(true);
      }
    }
  };
  const handleCloseDialog = () => {
    setShowDialog(false);
  };
  const navigateToRegister = () => {
    navigate('/register');
  };

  return (
    <div className="biggestDiv">
      <Dialog open={showDialog} onClose={handleCloseDialog}>
        <DialogTitle
          style={{ backgroundColor: 'var(--UIColor)', color: 'var(--UIText)' }}
        >
          Wrong Credentials
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

      {isRegisterNormalPressed === null ? (
        <div className="containerLogin">
          <div className="customerDiv" onClick={customerClick}>
            <div className="imgDiv">
              <img
                className="imgScaler"
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
                className="imgScaler"
                src={isDarkMode ? partner : partnerDark}
                alt="partnerImg"
              />
              <div className="bottomTextPartner">
                {translate('partner').toUpperCase()}
              </div>
            </div>
          </div>
        </div>
      ) : isRegisterNormalPressed ? (
        // Customer Login
        <div className="formDiv">
          <p
            style={{
              color: '#097b5a',
              fontSize: '3em',
              textAlign: 'center',
              textTransform: 'uppercase',
              letterSpacing: '2px',
            }}
          >
            CUSTOMER LOGIN
          </p>
          <div id="bigContainer" style={{ width: '100%' }}>
            <div className="welcomeContainer">
              <div className="containerLogin">
                <div className="containerForm textGlow highlight-on-hover">
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
                    onClick={handleLogin}
                    className="buttonLogin btn-gradient-border textGlow"
                  >
                    {translate('login')}
                  </button>
                  <div className="registerFooter">
                    <div>{translate('registerText')}</div>
                    <div className="registerNow" onClick={navigateToRegister}>
                      {translate('registerNow')}
                    </div>
                  </div>
                </div>
                <div className="rightDiv">
                  <div className="imgDiv">
                    <img
                      src={isDarkMode ? carImg : carImgDarkMode}
                      alt="carImg"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="partnerIcon">
            <img
              onClick={partnerClick}
              src={isDarkMode ? partnerDark : partner}
              style={{ width: '100%', height: '100%' }}
              alt="partnerImg"
            />
          </div>
        </div>
      ) : (
        // Partner Login
        <div className="formDiv">
          <p
            style={{
              color: '#097b5a',
              fontSize: '3em',
              textAlign: 'center',
              textTransform: 'uppercase',
              letterSpacing: '2px',
            }}
          >
            PARTNER LOGIN
          </p>
          <div id="bigContainer" style={{ width: '100%' }}>
            <div className="welcomeContainer">
              <div className="containerLogin">
                <div className="containerForm textGlow highlight-on-hover">
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
                    onClick={handleLogin}
                    className="buttonLogin btn-gradient-border textGlow"
                  >
                    {translate('login')}
                  </button>
                  <div className="registerFooter">
                    <div>{translate('registerText')}</div>
                    <div className="registerNow" onClick={navigateToRegister}>
                      {translate('registerNow')}
                    </div>
                  </div>
                </div>
                <div className="rightDiv">
                  <div className="imgDiv">
                    <img
                      src={isDarkMode ? carImg : carImgDarkMode}
                      alt="carImg"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
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
  );
};

export default Login;
