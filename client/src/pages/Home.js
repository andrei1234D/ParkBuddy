import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

//language translate imports
import { useContext } from 'react';
import GlobalStatesContext from '../context/GlobalStatesContext';
import carImg from '../images/bannerBackground.png';
import AppStore from '../functionalElements/designs/AppStore';
import Reviews from '../functionalElements/designs/Reviews';
import FooterHome from '../functionalElements/designs/FooterHome';
import '../style/Home.css';

function Home() {
  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const element = document.querySelector(hash);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, []);
  const { translate } = useContext(GlobalStatesContext);

  return (
    <section id="home">
      <div>
        <div className="container">
          <img src={carImg} alt="Banner Home" className="banner-img" />
          <Link to="/Rent-A-Spot" className="linkHome">
            <div className="option-box rentASpot rentHomeButton">
              {translate('rentASpot')}
            </div>
          </Link>
        </div>
        <div className="emptySpace"></div>
        <section id="reviews">
          <Reviews />
        </section>
        <div className="emptySpace"></div>
        <AppStore />
        <div className="emptySpace"></div>
        <FooterHome />
      </div>
    </section>
  );
}

export default Home;
