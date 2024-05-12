import React from 'react';
import { Link } from 'react-router-dom';

//language translate imports
import { useContext } from 'react';
import GlobalStatesContext from '../context/GlobalStatesContext';
import bannerHome from '../images/bannerBackground.png';
import AppStore from '../functionalElements/designs/AppStore';
import Reviews from '../functionalElements/designs/Reviews';
import FooterHome from '../functionalElements/designs/FooterHome';
import '../style/Home.css';

function Home() {
  const { translate } = useContext(GlobalStatesContext);

  return (
    <div>
      <div className="container">
        <img src={bannerHome} alt="Banner Home" className="banner-img" />
        <div className="content-box">
          <p className="catchy1">{translate('catchy1')}</p>
          <p className="catchy2">{translate('catchy2')}</p>
          <div className="options-container">
            <Link to="/login" className="link">
              <div
                className="option-box btn-gradient-border loginBtn"
                style={{
                  backgroundColor: 'transparent',
                  fontSize: '3rem',
                  boxShadow: 'none',
                  fontWeight: 'bold',
                }}
              >
                {translate('login')}
              </div>
            </Link>
            <hr className="vertical-hr"></hr>
            <Link to="/Rent-A-Spot" className="link">
              <div
                className="option-box btn-gradient-border rentASpot"
                style={{
                  backgroundColor: 'transparent',
                  fontSize: '3rem',
                  fontWeight: 'bold',
                  boxShadow: 'none',
                }}
              >
                {translate('rentASpot')}
              </div>
            </Link>
          </div>
        </div>
      </div>
      <div className="emptySpace"></div>
      <Reviews />
      <div className="emptySpace"></div>
      <AppStore />
      <div className="emptySpace"></div>
      <FooterHome />
    </div>
  );
}

export default Home;
