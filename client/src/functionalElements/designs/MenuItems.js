import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import SettingsIcon from '../SettingsIcon';
import AccountIcon from '../AccountIcon';
import RomanianFlag from '../../images/flags/RomanianFlag.png';
import EnglishFlag from '../../images/flags/UsaFlag.png';
import PolishFlag from '../../images/flags/PolishFlag.png';

import getTheApp from '../../images/linksImages/getTheApp.jpg';
import home from '../../images/linksImages/home.jpg';
import rentASpot from '../../images/linksImages/rentASpot.jpg';
import lendASpot from '../../images/linksImages/lendASpot.jpg';
import yourSpots from '../../images/linksImages/yourSpots.jpg';
import reviews from '../../images/linksImages/reviews.jpg';

import { RiScrollToBottomLine } from 'react-icons/ri';

import GlobalStatesContext from '../../context/GlobalStatesContext';
import '../../style/MenuItems.css';
const itemsPerPage = 1;
const menuItems = [
  { label: 'Home', link: '/', url: home },
  { label: 'Reviews', link: '/', url: reviews },
  { label: 'Get the app', link: '/get-the-app', url: getTheApp },
  { label: 'Rent A Spot', link: '/rent-a-spot', url: rentASpot },
  { label: 'Lend A Spot', link: '/lend-a-spot', url: lendASpot },
  { label: 'Your Spots', link: '/your-spots', url: yourSpots },
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

  const startIndex = currentPage * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const itemsToDisplay = menuItems.slice(startIndex, endIndex);
  return (
    <div>
      <div className="menuItemsContainer">
        {itemsToDisplay.map((item) => (
          <div
            style={{
              backgroundImage: `url(${item.url})`,
              width: '100%',
              height: 'auto',
              backgroundSize: 'cover', // Makes the background image cover the entire div
              backgroundRepeat: 'no-repeat', // Prevents the background image from repeating
              backgroundPosition: 'center', // Centers the background image
              transition: '0s',
            }}
            id="12"
          >
            <div
              style={{ display: 'flex', flexDirection: 'column', width: '97%' }}
            >
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <div className="quickLinks">
                  <div
                    style={{
                      width: '97%',
                      display: 'flex',
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <button onClick={handlePrevious} className="arrowButton">
                      &lt;
                    </button>
                    <div className="additionalMenuItems">
                      <Link
                        key={item.label}
                        to={item.link}
                        className="menuItemLink"
                        onClick={toggleMenu}
                      >
                        <div className="underlineAnimation">{item.label}</div>
                      </Link>
                    </div>
                    <button onClick={handleNext} className="arrowButton">
                      &gt;
                    </button>
                  </div>
                </div>
              </div>
              <div></div>
            </div>
          </div>
        ))}
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
        <div className="bottomMenu">
          <div className="menuSettingsContainer">
            <div className="menuSettingsText">Settings</div>
            <div className="menuSettings">
              <SettingsIcon />
              <AccountIcon />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
