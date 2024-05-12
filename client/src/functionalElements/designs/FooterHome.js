import React from 'react';
import { useContext } from 'react';
import GlobalStatesContext from '../../context/GlobalStatesContext';
import '../../style/Home.css';

//svg imports
import AdidasLogo from '../../images/sponsorImage/adidas.svg';
import AudiLogo from '../../images/sponsorImage/audi.svg';
import BmwLogo from '../../images/sponsorImage/bmw.svg';
import BoeingLogo from '../../images/sponsorImage/boeing.svg';
import BugattiLogo from '../../images/sponsorImage/bugatti.svg';
import CocaColaLogo from '../../images/sponsorImage/cocacola.svg';
import FerrariLogo from '../../images/sponsorImage/ferrari.svg';
import MastercardLogo from '../../images/sponsorImage/mastercard.svg';
import MetaLogo from '../../images/sponsorImage/meta.svg';
import PayPalLogo from '../../images/sponsorImage/paypal.svg';
import PumaLogo from '../../images/sponsorImage/puma.svg';
import TeslaLogo from '../../images/sponsorImage/tesla.svg';
import VisaLogo from '../../images/sponsorImage/visa.svg';
import WalmartLogo from '../../images/sponsorImage/walmart.svg';

function FooterHome() {
  const { translate } = useContext(GlobalStatesContext);

  const sponsors = [
    { name: 'adidas', logoUrl: AdidasLogo },
    { name: 'audi', logoUrl: AudiLogo },
    { name: 'bmw', logoUrl: BmwLogo },
    { name: 'boeing', logoUrl: BoeingLogo },
    { name: 'bugatti', logoUrl: BugattiLogo },
    { name: 'cocacola', logoUrl: CocaColaLogo },
    { name: 'mastercard', logoUrl: MastercardLogo },
    { name: 'ferrari', logoUrl: FerrariLogo },
    { name: 'meta', logoUrl: MetaLogo },
    { name: 'paypal', logoUrl: PayPalLogo },
    { name: 'puma', logoUrl: PumaLogo },
    { name: 'tesla', logoUrl: TeslaLogo },
    { name: 'visa', logoUrl: VisaLogo },
    { name: 'walmart', logoUrl: WalmartLogo },
  ];
  const renderSponsors = () => {
    return sponsors.map((sponsor, index) => (
      <img
        className="fadeAppear"
        key={index}
        src={sponsor.logoUrl}
        alt={sponsor.name}
        width={'60px'}
        height={'60px'}
        style={{ padding: '25px' }}
      />
    ));
  };
  return (
    <div className="footer">
      <div className="sponsors-section">{renderSponsors()}</div>
      <div className="additional-fields">
        <h3>{translate('Frequently_asked_questions')}</h3>
        <h3>{translate('Delete_account')}</h3>
        <h3>{translate('Privacy_policy')}</h3>
        <h3>{translate('Cookie_policy')}</h3>
        <h3>{translate('Terms_and_Conditions')}</h3>
        <h3>{translate('Rent_A_Spot')}</h3>
      </div>
    </div>
  );
}

export default FooterHome;
