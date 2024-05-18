import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import SettingsIcon from '../SettingsIcon';
import AccountIcon from '../AccountIcon';
import RomanianFlag from '../../images/flags/RomanianFlag.png';
import EnglishFlag from '../../images/flags/UsaFlag.png';
import PolishFlag from '../../images/flags/PolishFlag.png';
import { RiScrollToBottomLine } from 'react-icons/ri';

import GlobalStatesContext from '../../context/GlobalStatesContext';
import '../../style/MenuItems.css';
const itemsPerPage = 1;
const menuItems = [
  { label: 'Home', link: '/your-spots' },
  { label: 'Get the app', link: '/get-the-app' },
  { label: 'Rent A Spot', link: '/rent-a-spot' },
  { label: 'Lend A Spot', link: '/lend-a-spot' },
  { label: 'Login', link: '/login' },
  { label: 'Your Spots', link: '/your-spots' },
  { label: 'Your Spots', link: '/your-spots' },
];
export default function MenuItems() {
  const [currentPage, setCurrentPage] = useState(0);

  const totalPages = Math.ceil(menuItems.length / itemsPerPage);
  console.log(totalPages);
  const handlePrevious = () => {
    setCurrentPage((prev) => (prev > 0 ? prev - 1 : totalPages - 1));
  };

  const handleNext = () => {
    setCurrentPage((prev) => (prev < totalPages - 1 ? prev + 1 : 0));
  };

  const handlePageClick = (pageIndex) => {
    setCurrentPage(pageIndex);
  };

  const { toggleLanguage, translate, toggleMenu } =
    useContext(GlobalStatesContext);

  const languageOptions = [
    { value: 'en', label: 'English', flag: EnglishFlag },
    { value: 'ro', label: 'Română', flag: RomanianFlag },
    { value: 'pl', label: 'Polski', flag: PolishFlag },
  ];

  const startIndex = currentPage * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const itemsToDisplay = menuItems.slice(startIndex, endIndex);
  return (
    <div>
      <div className="menuItemsContainer">
        <div style={{ display: 'flex', flexDirection: 'column', width: '97%' }}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <div className="quickLinks">
              <div className="additionalMenuItems">
                {itemsToDisplay.map((item) => (
                  <Link
                    key={item.label}
                    to={item.link}
                    className="menuItemLink"
                    onClick={toggleMenu}
                    style={{
                      fontSize: '5rem',
                      borderStyle: 'solid',
                      backgroundColor: '#12be8c',
                    }}
                  >
                    <div className="underlineAnimation">{item.label}</div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
          <div>
            <div className="pagination">
              {Array.from({ length: totalPages }).map((_, index) => (
                <button
                  key={index}
                  className={index === currentPage ? 'active' : ''}
                  onClick={() => handlePageClick(index)}
                >
                  {menuItems[index * itemsPerPage].label}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="bottomMenu">
          <div className="menuSettingsContainer">
            <div className="menuSettingsText">Settings</div>
            <div className="menuSettings">
              <SettingsIcon />
              <AccountIcon />
            </div>
          </div>
          <div className="menuLanguageContainer">
            <div className="menuSettingsText">Language</div>
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
        </div>
      </div>
    </div>
  );
}
