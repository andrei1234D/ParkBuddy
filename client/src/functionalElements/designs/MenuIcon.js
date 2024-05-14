import React, { useState, useEffect, useRef } from 'react';
import '../../style/MenuIcon.css';
import MenuItems from './MenuItems';

export default function MenuIcon() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const containerRef = useRef(null);

  const handleClickOutside = (event) => {
    if (
      menuRef.current &&
      !menuRef.current.contains(event.target) &&
      containerRef.current &&
      !containerRef.current.contains(event.target)
    ) {
      setIsMenuOpen(false);
    }
  };

  useEffect(() => {
    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div>
      <div className={`navMenu ${isMenuOpen ? 'open' : ''}`} ref={menuRef}>
        <MenuItems />
      </div>
      <div className="menuContainer" onClick={toggleMenu} ref={containerRef}>
        {isMenuOpen ? 'Close' : 'Menu'}
        <div className={`menuIcon ${isMenuOpen ? 'open' : ''}`}>
          <div className="line-horizontal"></div>
          <div className="line-horizontal"></div>
        </div>
      </div>
    </div>
  );
}
