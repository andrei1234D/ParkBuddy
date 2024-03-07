import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../style/Login.css';
import carImg from '../images/parkImage.png';
import carImgDarkMode from '../images/parkImageDarkMode.png';

//language translate imports
import { useContext } from 'react';
import LanguageContext from '../context/LanguageContext';
import translations from '../translation/Translation';

const Login = () => {
  const { language, translate } = useContext(LanguageContext);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [theme, setTheme] = useState('dark');
  console.log(theme);
  useEffect(() => {
    const storedTheme = localStorage.getItem('selectedTheme');
    setTheme(storedTheme || 'dark');
  }, []);

  // Add this useEffect to listen for changes in selectedTheme
  useEffect(() => {
    const handleThemeChange = () => {
      const storedTheme = localStorage.getItem('selectedTheme');
      setTheme(storedTheme || 'dark');
    };

    // Listen for changes to the selectedTheme in localStorage
    window.addEventListener('storage', handleThemeChange);

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener('storage', handleThemeChange);
    };
  }, []);

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

      // Redirect or perform actions after successful login
    } catch (error) {
      console.error('Login failed:', error.response.data.message);
      // Handle login failure
    }
  };

  return (
    <div>
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
          </div>
          <div className="rightDiv">
            <img
              src={theme === 'dark' ? carImg : carImgDarkMode}
              alt="carImg"
              style={{
                maxWidth: '100%',
                height: 'auto',
                position: 'relative',
                zIndex: '10',
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
