import React from 'react';
import { CgSandClock } from 'react-icons/cg';
import { PiCurrencyDollarFill } from 'react-icons/pi';
import { LiaGrinWink } from 'react-icons/lia';
import appGallery from '../../images/app_gallery-transformed.png';

import { useContext } from 'react';
import GlobalStatesContext from '../../context/GlobalStatesContext';
import '../../style/Home.css';

function AppStore() {
  const { translate } = useContext(GlobalStatesContext);
  return (
    <div>
      <div className="informationContainer">
        <div className="titleDiv fadeAppear">BENEFITS</div>
        <div className="cardContainer">
          <div className="card">
            <div className="topHalf">
              <div className="imgContainer fadeAppear">
                <CgSandClock className="clockIcon" />
              </div>
            </div>
            <div className="middle fadeAppear">TIME</div>
            <div className="bottomHalf fadeAppear">
              Find or list spots in seconds. Fast, convenient, and easy-to-use
              app. Hassle-free parking is just a tap away! What are you waiting
              for?"
            </div>
          </div>
          <div className="card">
            <div className="topHalf">
              <div className="imgContainer fadeAppear">
                <PiCurrencyDollarFill className="clockIcon" />
              </div>
            </div>
            <div className="middle fadeAppear">MONEY</div>
            <div className="bottomHalf fadeAppear">
              Affordable parking, effortless booking, and more! Experience
              convenience at its best with our user-friendly parking app.
            </div>
          </div>
          <div className="card">
            <div className="topHalf">
              <div className="imgContainer fadeAppear">
                <LiaGrinWink
                  className="clockIcon"
                  style={{ marginTop: '5px' }}
                />
              </div>
            </div>
            <div className="middle fadeAppear">CONVENIENCE</div>
            <div className="bottomHalf fadeAppear">
              Customer convenience is our priority. Streamlined design, no
              clutter. Just what you need, when you need it.
            </div>
          </div>
        </div>

        <div className="footerBenefits">
          <div className="downloadRatingContainer fadeAppear">
            <div className="downloadRating">
              <div
                style={{
                  display: 'flex',
                  fontSize: '1.5rem',
                  justifyContent: 'center',
                  alignItems: 'center',
                  fontWeight: 'bold',
                }}
              >
                4,7
                <div className="stars star" style={{ display: 'flex' }}>
                  &#9733;
                </div>
              </div>
              <div style={{ fontSize: '0.7rem' }}>150 K reviews</div>
            </div>
            <div className="downloads">
              <div
                style={{
                  display: 'flex',
                  fontSize: '1.5rem',
                  justifyContent: 'center',
                  alignItems: 'center',
                  fontWeight: 'bold',
                }}
              >
                10 mil. +
              </div>
              <div style={{ fontSize: '0.7rem' }}>Downloads</div>
            </div>
          </div>
          <div className="fadeAppear">Download for free</div>

          <div className="stores fadeAppear">
            <a href="https://play.google.com/store/apps/details?id=your.package.name">
              <img
                src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png"
                alt="Get it on Google Play"
                width="200"
              />
            </a>
            <a href="https://apps.apple.com/app/your-app-name/id123456789">
              <img
                src="https://developer.apple.com/app-store/marketing/guidelines/images/badge-download-on-the-app-store.svg"
                alt="Download on the App Store"
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
    </div>
  );
}
export default AppStore;
