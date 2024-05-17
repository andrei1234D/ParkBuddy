import React, { createContext, useState, useEffect } from 'react';
import translations from '../translation/Translation';
import { jwtDecode } from 'jwt-decode';

const GlobalStatesContext = createContext();

export const GlobalStatesContextProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [moveParticles, setMoveParticles] = useState(true);

  const languages = Object.keys(translations);
  const storedLanguage = localStorage.getItem('language');

  const initialLanguage =
    storedLanguage && languages.includes(storedLanguage)
      ? storedLanguage
      : 'en';

  const [language, setLanguage] = useState(initialLanguage);
  const [role, setRole] = useState(null);
  const [username, setUsername] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const toggleLanguage = (newLanguage) => {
    setLanguage(newLanguage);
  };

  const translate = (key) => {
    return translations[language] && translations[language][key]
      ? translations[language][key]
      : `Translation not available for key: ${key}`;
  };

  const toggleDarkMode = () => {
    setIsDarkMode((prevMode) => !prevMode);
  };

  const toggleParticles = () => {
    setMoveParticles(!moveParticles);
  };

  const toggleLogin = () => {
    let token = localStorage.getItem('token');
    const decodedToken = jwtDecode(token);
    const { userName, userRole } = decodedToken;
    setUsername(userName);
    setRole(userRole);
    setIsLoggedIn(true);
  };
  const toggleLogout = () => {
    setUsername(null);
    setRole(null);
    setIsLoggedIn(false);
  };

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  return (
    <GlobalStatesContext.Provider
      value={{
        language,
        toggleLanguage,
        translate,
        isDarkMode,
        toggleDarkMode,
        moveParticles,
        toggleParticles,
        role,
        username,
        toggleLogin,
        isLoggedIn,
        toggleLogout,
        isMenuOpen,
        toggleMenu,
      }}
    >
      {children}
    </GlobalStatesContext.Provider>
  );
};

export default GlobalStatesContext;
