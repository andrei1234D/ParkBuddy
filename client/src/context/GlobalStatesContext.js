import React, { createContext, useState, useEffect } from 'react';
import translations from '../translation/Translation';

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
  const [firstName, setFirstName] = useState(null);

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

  const toggleLogin = (decodedToken, firstName) => {
    const { userName, userRole } = decodedToken;
    setUsername(userName);
    setRole(userRole);
    setFirstName(firstName);
    setIsLoggedIn(true);
  };
  const toggleLogout = () => {
    setFirstName(null);
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
        firstName,
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
