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

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isRegisterNormalPressed, setIsRegisterNormalPressed] = useState(null);
  const [showDialog, setShowDialog] = useState(false);
  const [showDialogRedirect, setShowDialogRedirect] = useState(false);
  const [dialogText, setDialogText] = useState('');
  const { isDarkMode, translate } = useContext(GlobalStatesContext);
  const navigate = useNavigate();
  const handleRegister = async () => {
    let role;
    isRegisterNormalPressed ? (role = 'customer') : (role = 'partner');

    try {
      if (password.length < 7 || !/[!@#$%^&*]/.test(password)) {
        setDialogText(translate('passwordVerify'));
        setShowDialog(true);
        return;
      }
      if (username.length < 5) {
        setDialogText(translate('userLength'));
        setShowDialog(true);
        return;
      }

      // Make a POST request to your server for user registration
      const response = await axios.post('http://localhost:5000/register', {
        username,
        password,
        role,
      });
      //SUCCESSFUL REGISTRATION
      setDialogText(translate('registrationSuccessful'));
      setShowDialogRedirect(true);
    } catch (error) {
      console.error('Registration failed:', error.response.data.message);
      setDialogText(translate('userAlreadyExists'));
      setShowDialog(true); // Open dialog on registration failure
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
  const customerClick = () => {
    setIsRegisterNormalPressed(true);
  };
  const partnerClick = () => {
    setIsRegisterNormalPressed(false);
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
              <h2 className=" headerLogin">{translate('welcome')}</h2>
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
              <div
                style={{ color: 'pink', fontSize: '30px', fontWeight: '1000' }}
              >
                PARTNER LOGIN
              </div>
              <h2 className=" headerLogin">{translate('welcome')}</h2>
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
{
  /* <div
              id="customerLogin"
              className="containerForm textGlow "
              style={{
                borderRadius: '0% 0% 0% 0%',
                width: '50%',
              }}
            >
              {isRegisterNormalPressed ? (
                <div className="formNormalAlign">
                  <div style={{ color: 'pink' }}>PARTNER LOGIN </div>
                  <h2 className=" headerLogin">{translate('welcome')}</h2>
                  <p className="textLogin">Username</p>
                  <input
                    className="inputLogin"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                  <p className="textLogin">Password</p>
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
                    {translate('login')}
                  </button>
                </div>
              ) : (
                <div className="formNormalAlign">
                  <h2 className=" headerLogin">{translate('welcome')}</h2>
                  <p className="textLogin">Username</p>
                  <input
                    className="inputLogin"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                  <p className="textLogin">Password</p>
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
                    {translate('login')}
                  </button>
                </div>
              )}
            </div> */
}
