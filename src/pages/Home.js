import React from 'react';
import { Link } from 'react-router-dom';
import { useContext } from 'react';
import LanguageContext from '../context/LanguageContext';

import translations from '../translation/Translation';
import '../style/Home.css';

function Home() {
  const { language, translate } = useContext(LanguageContext);
  return (
    <div>
      <div className="title">Park Buddy</div>

      <div className="options-container">
        <div className="option-box">{translate('login')}</div>
        <Link></Link>
        <div className="option-box">{translate('rentASpot')}</div>
      </div>
    </div>
  );
}

export default Home;
