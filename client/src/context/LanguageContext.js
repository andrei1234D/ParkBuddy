import React, { createContext, useState, useEffect } from 'react';
import translations from '../translation/Translation';
const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const languages = Object.keys(translations);
  const storedLanguage = localStorage.getItem('language');
  const initialLanguage =
    storedLanguage && languages.includes(storedLanguage)
      ? storedLanguage
      : 'en';

  const [language, setLanguage] = useState(initialLanguage);

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

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, translate }}>
      {children}
    </LanguageContext.Provider>
  );
};

export default LanguageContext;
