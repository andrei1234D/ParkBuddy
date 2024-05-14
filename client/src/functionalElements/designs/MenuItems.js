import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import Settings from '../../functionalElements/Settings';
import Account from '../../functionalElements/Account';
import RomanianFlag from '../../images/flags/RomanianFlag.png';
import EnglishFlag from '../../images/flags/UsaFlag.png';
import PolishFlag from '../../images/flags/PolishFlag.png';

import GlobalStatesContext from '../../context/GlobalStatesContext';
import '../../style/MenuItems.css';

export default function MenuItems() {
  const { toggleLanguage, translate } = useContext(GlobalStatesContext);

  const languageOptions = [
    { value: 'en', label: 'English', flag: EnglishFlag },
    { value: 'ro', label: 'Română', flag: RomanianFlag },
    { value: 'pl', label: 'Polski', flag: PolishFlag },
  ];

  const menuItems = [
    { label: 'Get the app', link: '/get-the-app' },
    { label: 'Rent A Spot', link: '/rent-a-spot' },
    { label: 'Lend A Spot', link: '/lend-a-spot' },
    { label: 'Login', link: '/login' },
    { label: 'Your Spots', link: '/your-spots' },
  ];

  return (
    <div>
      <div className="menuItemsContainer">
        <div className="menuSettingsText">Settings</div>
        <div className="menuSettings">
          <Settings />
          <Account />
        </div>
        <hr className="hrMenuSettings" />
        <div className="languages">
          {languageOptions.map((option) => (
            <div
              key={option.value}
              className="flagContainer"
              onClick={() => toggleLanguage(option.value)}
              title={option.label}
            >
              <img src={option.flag} alt={option.label} className="flagImage" />
            </div>
          ))}
        </div>
        <hr className="hrMenuSettings" />
        <div className="additionalMenuItems">
          {menuItems.map((item) => (
            <Link key={item.label} to={item.link} className="menuItemLink">
              <div className="underlineAnimation">{item.label}</div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
