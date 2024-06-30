import React, { useEffect, useRef, useContext } from 'react';
import '../../style/MenuIcon.css';
import MenuItems from './MenuItems';
import GlobalStatesContext from '../../context/GlobalStatesContext';
export default function MenuIcon() {
  const menuRef = useRef(null);
  const containerRef = useRef(null);
  const { translate, isMenuOpen, toggleMenu } = useContext(GlobalStatesContext);

  const handleClickOutside = (event) => {
    if (
      menuRef.current &&
      !menuRef.current.contains(event.target) &&
      containerRef.current &&
      !containerRef.current.contains(event.target)
    ) {
      toggleMenu();
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
