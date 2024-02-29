import React from 'react';
import { Link } from 'react-router-dom';
import Settings from '../pages/Settings';
import '../style/Nav.css';

import parkBuddy from '../images/parkBuddy.png';

export default function Nav() {
  return (
    <div>
      <div className="header">
        <Link to="/" className="link">
          <div className="parkBuddy">
            <img
              src={parkBuddy}
              alt="nothing"
              style={{ width: '100%', height: '100%' }}
            ></img>
          </div>
        </Link>
        <Settings />
      </div>
    </div>
  );
}
