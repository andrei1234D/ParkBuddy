import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import MenuIcon from '../functionalElements/designs/MenuIcon';
import '../style/Nav.css';

import parkBuddy from '../images/parkBuddy.png';

export default function Nav() {
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
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
        <MenuIcon />
      </div>
    </div>
  );
}
