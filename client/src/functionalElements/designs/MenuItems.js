import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SettingsIcon from '../SettingsIcon';
import AccountIcon from '../AccountIcon';

import getTheApp from '../../images/linksImages/getTheApp.jpg';
import home from '../../images/linksImages/home.jpg';
import rentASpot from '../../images/linksImages/rentASpot.jpg';
import lendASpot from '../../images/linksImages/lendASpot.jpg';
import yourSpots from '../../images/linksImages/yourSpots.jpg';
import reviews from '../../images/linksImages/reviews.jpg';

import GlobalStatesContext from '../../context/GlobalStatesContext';
import '../../style/MenuItems.css';

const itemsPerPage = 1;
const menuItems = [
  { label: 'Home', link: '#home', urlImg: home },
  { label: 'Reviews', link: '#reviews', urlImg: reviews },
  { label: 'Get the app', link: '#getTheApp', urlImg: getTheApp },
  { label: 'Rent A Spot', link: '/Rent-a-spot', urlImg: rentASpot },
  { label: 'Lend A Spot', link: '/Lend-A-Spot', urlImg: lendASpot },
  { label: 'Your Spots', link: '/Your-Parking-Spots', urlImg: yourSpots },
];

export default function MenuItems() {
  const [currentPage, setCurrentPage] = useState(0);
  const navigate = useNavigate();

  const totalPages = Math.ceil(menuItems.length / itemsPerPage);

  const handlePrevious = () => {
    setCurrentPage((prev) => (prev > 0 ? prev - 1 : totalPages - 1));
  };

  const handleNext = () => {
    setCurrentPage((prev) => (prev < totalPages - 1 ? prev + 1 : 0));
  };

  const handlePageClick = (pageIndex) => {
    setCurrentPage(pageIndex);
  };

  const { toggleMenu } = useContext(GlobalStatesContext);

  const startIndex = currentPage * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const itemsToDisplay = menuItems.slice(startIndex, endIndex);

  const handleNavigation = (link) => {
    toggleMenu();
    if (link.startsWith('#')) {
      // If the link is a hash, navigate to the home route and scroll to the section
      navigate('/');
      setTimeout(() => {
        const element = document.querySelector(link);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      navigate(link);
    }
  };

  return (
    <div>
      <div className="menuItemsContainer">
        {itemsToDisplay.map((item) => (
          <div
            style={{
              backgroundImage: `url(${item.urlImg})`,
              width: '100%',
              height: 'auto',
              backgroundSize: 'cover',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center',
              transition: '0s',
            }}
            id="12"
            key={item.label}
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
                      <div
                        className="menuItemLink"
                        onClick={() => handleNavigation(item.link)}
                      >
                        <div className="underlineAnimation">{item.label}</div>
                      </div>
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
