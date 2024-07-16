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
        <div className="titleDiv fadeAppearTitle">{translate('benefits')}</div>
        <div className="cardContainer">
          <div className="card">
            <div className="topHalf">
              <div className="imgContainer fadeAppear">
                <LiaGrinWink
                  className="clockIcon"
                  style={{ marginTop: '5px' }}
                />
              </div>
            </div>
            <div className="middle fadeAppear">{translate('convenience')}</div>
            <div className="bottomHalf fadeAppear">
              {translate('customerConvenience')}
            </div>
          </div>
          <div className="card">
            <div className="topHalf">
              <div className="imgContainer fadeAppear">
                <PiCurrencyDollarFill className="clockIcon" />
              </div>
            </div>
            <div className="middle fadeAppear">{translate('money')}</div>
            <div className="bottomHalf fadeAppear">
              {translate('affordableParking')}
            </div>
          </div>
          <div className="card">
            <div className="topHalf">
              <div className="imgContainer fadeAppear">
                <CgSandClock className="clockIcon" />
              </div>
            </div>
            <div className="middle fadeAppear">{translate('time')}</div>
            <div className="bottomHalf fadeAppear">
              {translate('findOrListSpots')}
            </div>
          </div>
        </div>

        <div className="footerBenefits">
          <section id="getTheApp">
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
                <div style={{ fontSize: '0.7rem' }}>{translate('reviews')}</div>
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
                <div style={{ fontSize: '0.7rem' }}>
                  {translate('downloads')}
                </div>
              </div>
            </div>
          </section>
          <div className="fadeAppear">{translate('downloadForFree')}</div>

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
