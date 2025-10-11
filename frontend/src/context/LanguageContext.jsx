import React, { createContext, useContext, useState, useEffect } from 'react';
import i18n, { languageMap } from '../i18n/config';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  // Get saved language or default to English (US)
  const savedLanguage = localStorage.getItem('preferredLanguage') || 'English (US)';
  const [currentLanguage, setCurrentLanguage] = useState(savedLanguage);

  useEffect(() => {
    // Convert display name to language code
    const languageCode = languageMap[currentLanguage] || 'en';
    
    // Change i18n language
    if (i18n.isInitialized) {
      i18n.changeLanguage(languageCode);
    }
    
    // Save to localStorage
    localStorage.setItem('preferredLanguage', currentLanguage);
  }, [currentLanguage]);

  const changeLanguage = (language) => {
    setCurrentLanguage(language);
  };

  return (
    <LanguageContext.Provider value={{ currentLanguage, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};