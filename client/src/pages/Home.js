import React from 'react';
import { Link } from 'react-router-dom';

//language translate imports
import { useContext } from 'react';
import GlobalStatesContext from '../context/GlobalStatesContext';
import bannerHome from '../images/bannerBackground.png';
import { CgSandClock } from 'react-icons/cg';
import { PiCurrencyDollarFill } from 'react-icons/pi';
import { LiaGrinWink } from 'react-icons/lia';
import appGallery from '../images/app_gallery-transformed.png';
import '../style/Home.css';

function Home() {
  const { translate } = useContext(GlobalStatesContext);

  return (
    <div>
      <div className="container">
        <img src={bannerHome} alt="Banner Home" className="banner-img" />
        <div className="content-box">
          <p>{translate('catchy1')}</p>
          <p style={{ color: 'rgb(15, 130, 42)' }}>{translate('catchy2')}</p>
          <div className="options-container">
            <Link to="/login" className="link">
              <div className="option-box btn-gradient-border">
                {translate('login')}
              </div>
            </Link>
            <Link to="/Rent-A-Spot" className="link">
              <div className="option-box btn-gradient-border">
                {translate('rentASpot')}
              </div>
            </Link>
          </div>
        </div>
      </div>
      <div className="emptySpace"></div>
      <div className="titleDiv">BENEFITS</div>
      <div className="appStore">
        <div className="info-section">
          <div className="cardContainer">
            <div className="card">
              <div className="topHalf">
                <div className="imgContainer">
                  <CgSandClock className="clockIcon" />
                </div>
              </div>
              <div className="middle">TIME</div>
              <div className="bottomHalf">
                Find or list spots in seconds. Fast, convenient, and easy-to-use
                app. Hassle-free parking is just a tap away! What are you
                waiting for?"
              </div>
            </div>
            <div className="card">
              <div className="topHalf">
                <div className="imgContainer">
                  <PiCurrencyDollarFill className="clockIcon" />
                </div>
              </div>
              <div className="middle">MONEY</div>
              <div className="bottomHalf">
                Affordable parking, effortless booking, and more! Experience
                convenience at its best with our user-friendly parking app.
              </div>
            </div>
            <div className="card">
              <div className="topHalf">
                <div className="imgContainer">
                  <LiaGrinWink
                    className="clockIcon"
                    style={{ marginTop: '5px' }}
                  />
                </div>
              </div>
              <div className="middle">CONVENIENCE</div>
              <div className="bottomHalf">
                Customer convenience is our priority. Streamlined design, no
                clutter. Just what you need, when you need it.
              </div>
            </div>
          </div>
        </div>
        <div className="footer">
          <div>Download for free</div>

          <div className="stores">
            <a href="https://apps.apple.com/app/your-app-name/id123456789">
              <img
                src="https://developer.apple.com/app-store/marketing/guidelines/images/badge-download-on-the-app-store.svg"
                alt="Download on the App Store"
                width="200"
              />
            </a>
            <a href="https://play.google.com/store/apps/details?id=your.package.name">
              <img
                src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png"
                alt="Get it on Google Play"
                width="200"
              />
            </a>
            <a href="https://appgallery.huawei.com/#/app/C123456789">
              <img
                src={appGallery}
                alt="Available on Huawei AppGallery"
                width="200"
              />
            </a>
          </div>
        </div>
      </div>
      <div className="emptySpace"></div>
    </div>
  );
}

export default Home;
