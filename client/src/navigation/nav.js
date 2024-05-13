import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Settings from '../functionalElements/Settings';
import Account from '../functionalElements/Account';

import '../style/Nav.css';

import parkBuddy from '../images/parkBuddy.png';

export default function Nav() {
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

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
        <div className="menuContainer" onClick={toggleMenu}>
          {isMenuOpen ? 'Close' : 'Menu'}
          <div className={`menuIcon ${isMenuOpen ? 'open' : ''}`}>
            <div className="line-horizontal"></div>
            <div className="line-horizontal"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
