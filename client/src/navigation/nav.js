import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import RomanianFlag from '../images/flags/RomanianFlag.png';
import EnglishFlag from '../images/flags/UsaFlag.png';
import PolishFlag from '../images/flags/PolishFlag.png';

import MenuIcon from '../functionalElements/designs/MenuIcon';
import NavAnimation from '../functionalElements/designs/NavTextAnimation';
import '../style/Nav.css';

import parkBuddy from '../images/parkBuddy.png';
import GlobalStatesContext from '../context/GlobalStatesContext';

export default function Nav() {
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);

  const { toggleLanguage, translate, toggleMenu } =
    useContext(GlobalStatesContext);

  const languageOptions = [
    { value: 'en', label: 'English', flag: EnglishFlag },
    { value: 'ro', label: 'Română', flag: RomanianFlag },
    { value: 'pl', label: 'Polski', flag: PolishFlag },
  ];
  useEffect(() => {
    let lastScrollTop = 0;

    function handleScroll() {
      const currentScroll =
        window.pageYOffset || document.documentElement.scrollTop;

      if (currentScroll > lastScrollTop) {
        // Scroll down
        setIsHeaderVisible(false);
      } else {
        // Scroll up
        setIsHeaderVisible(true);
      }

      lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
    }

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []); // Empty dependency array ensures that this effect runs only once, like componentDidMount

  return (
    <div>
      <div
        className={isHeaderVisible ? 'emptyHeader' : 'emptyHeader hidden'}
      ></div>
      <div className={`header ${isHeaderVisible ? 'show' : 'hide'}`}>
        <Link to="/" className="link">
          <div className="parkBuddy">
            <img
              src={parkBuddy}
              alt="nothing"
              style={{ width: '100%', height: '100%' }}
            ></img>
          </div>
        </Link>
        <NavAnimation />
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <Link to="/login" className="linkHome">
            <div className="option-box loginBtn loginHomeButton">
              {translate('login')}
            </div>
          </Link>
          <div className="menuLanguageContainer">
            <div className="languages">
              {languageOptions.map((option) => (
                <div
                  key={option.value}
                  className="flagContainer"
                  onClick={() => toggleLanguage(option.value)}
                  title={option.label}
                >
                  <img
                    src={option.flag}
                    alt={option.label}
                    className="flagImage"
                  />
                </div>
              ))}
            </div>
          </div>
          <MenuIcon />
        </div>
      </div>
    </div>
  );
}
