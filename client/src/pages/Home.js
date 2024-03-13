import React from 'react';
import { Link } from 'react-router-dom';

//language translate imports
import { useContext } from 'react';
import LanguageContext from '../context/GlobalStatesContext';

import '../style/Home.css';

function Home() {
  const { language, translate } = useContext(LanguageContext);

  return (
    <div>
      <div className="title">Park Buddy</div>

      <div className="options-container">
        <Link to="/login" className="link">
          <div className="option-box btn-gradient-border">
            {translate('login')}
          </div>
        </Link>
        <div className="option-box btn-gradient-border">
          {translate('rentASpot')}
        </div>
      </div>
    </div>
  );
}

export default Home;
