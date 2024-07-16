import React from 'react';
import '../../style/Banner.css';
export default function Banner() {
  return (
    <div className="banner">
      <div className="slider" style={{ '--quantity': 5 }}>
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="item" style={{ '--position': index + 1 }}>
            <img
              src={require(`../../images/bannerImages/sliderImage_${
                index + 1
              }.png`)}
              alt={`Slider Image ${index + 1}`}
            />
          </div>
        ))}
      </div>
      <div className="content">
        <h1 data-content="Park Buddy">Park Buddy</h1>
        <div className="author"></div>
        <div className="model"></div>
      </div>
    </div>
  );
}
