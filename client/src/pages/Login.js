import React, { useState, useContext } from 'react';
import axios from 'axios';
import '../style/Login.css';
import carImg from '../images/parkImage.png';
import carImgDarkMode from '../images/parkImageDarkMode.png';
import { useNavigate } from 'react-router-dom';

//language translate imports
import GlobalStatesContext from '../context/GlobalStatesContext';
import translations from '../translation/Translation';

const Login = () => {
  const { language, translate } = useContext(GlobalStatesContext);
  const { isDarkMode } = useContext(GlobalStatesContext);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      // Make a POST request to your server for user login
      const response = await axios.post('http://localhost:5000/login', {
        username,
        password,
      });

      // Store the token in localStorage or a state management solution of your choice
      const token = response.data.token;
      console.log('Token:', token);
      navigate('/');
      // Redirect or perform actions after successful login
    } catch (error) {
      console.error('Login failed:', error.response.data.message);
    }
  };
  const navigateToRegister = () => {
    navigate('/register'); // Use the push method to navigate to '/register'
  };
  return (
    <div id="bigContaineer">
      <div className="welcomeContainer">
        <div className="containerLogin">
          <div className="containerForm textGlow">
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
              <img src={isDarkMode ? carImg : carImgDarkMode} alt="carImg" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
