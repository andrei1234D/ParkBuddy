import React, { useState, useContext } from 'react';
import '../style/Register.css';

import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import carImg from '../images/parkImage.png';
import carImgDarkMode from '../images/parkImageDarkMode.png';

import customer from '../images/customerLight.png';
import customerDark from '../images/customerDark.png';
import partner from '../images/vipDark.png';
import partnerDark from '../images/vipLight.png';

import GlobalStatesContext from '../context/GlobalStatesContext';
import translations from '../translation/Translation';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isRegisterNormalPressed, setIsRegisterNormalPressed] = useState(null);
  const { isDarkMode } = useContext(GlobalStatesContext);
  const { language, translate } = useContext(GlobalStatesContext);

  const handleRegister = async () => {
    let role;
    isRegisterNormalPressed ? (role = 'customer') : (role = 'partner');
    try {
      // Make a POST request to your server for user registration
      const response = await axios.post('http://localhost:5000/register', {
        username,
        password,
        role,
      });

      console.log('User registered successfully:', response.data);

      // Redirect or perform actions after successful registration
    } catch (error) {
      console.error('Registration failed:', error.response.data.message);

      // Handle registration failure
      // For example, show an error message to the user
      alert('Registration failed. Please try again.');
    }
  };
  const customerClick = () => {
    setIsRegisterNormalPressed(true);
  };
  const partnerClick = () => {
    setIsRegisterNormalPressed(false);
  };
  return (
    <div className="biggestDiv">
      <div id="bigContaineer" style={{ borderRadius: '15%' }}>
        <div className="welcomeContainer">
          {isRegisterNormalPressed === null ? (
            <div className="containerLogin">
              <div className="customerDiv" onClick={customerClick}>
                <div className="imgDiv">
                  <img
                    src={isDarkMode ? customer : customerDark}
                    alt="customerImg"
                  />
                  <div className="bottomText bottomTextCustomer">CUSTOMER</div>
                </div>
              </div>
              <div className="partnerDiv" onClick={partnerClick}>
                <div className="imgDiv">
                  <img
                    src={isDarkMode ? partnerDark : partner}
                    alt="partnerImg"
                  />
                  <div className="bottomText ">PARTNER</div>
                </div>
              </div>
            </div>
          ) : isRegisterNormalPressed ? (
            //IF IT S TRUE

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
                {' '}
                PARTNER LOGIN
              </div>
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
