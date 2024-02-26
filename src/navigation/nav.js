import React from 'react';

import '../style/Nav.css';

import parkBuddy from '../images/parkBuddy.png';

export default function Nav() {
  return (
    <div>
      <div className="parkBuddy">
        <img
          src={parkBuddy}
          alt="nothing"
          style={{ width: '100%', height: '100%' }}
        ></img>
      </div>
    </div>
  );
}
